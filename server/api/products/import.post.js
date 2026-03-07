import prisma from '../../utils/prisma'
import { logger } from '../../utils/logger'

/**
 * Parser harga format Indonesia:
 * - `75000`       → 75000
 * - `Rp 75.000`   → 75000 (titik = pemisah ribuan)
 * - `75 ribu`     → 75000
 * - `1,5 juta`    → 1500000
 * - `2.5 jt`      → 2500000
 * Tolak input yang tidak mengandung angka (mis. "seventy five").
 */
function parseIndonesianPrice(val) {
  if (val === null || val === undefined) return NaN
  let s = String(val).trim().toLowerCase()

  // Harus mengandung minimal satu digit
  if (!/\d/.test(s)) return NaN

  // Hapus prefix Rp dan spasi
  s = s.replace(/^rp\.?\s*/i, '').trim()

  // Handle suffix 'juta' atau 'jt' (= × 1.000.000)
  if (/juta|jt/.test(s)) {
    const num = parseFloat(
      s.replace(/juta|jt/g, '')
       .replace(/\./g, ',')
       .replace(/,/g, '.')
       .replace(/\s/g, '')
    )
    return isNaN(num) ? NaN : Math.round(num * 1_000_000)
  }

  // Handle suffix 'ribu' atau 'rb' (= × 1.000)
  if (/ribu|rb/.test(s)) {
    const num = parseFloat(
      s.replace(/ribu|rb/g, '')
       .replace(/\./g, ',')
       .replace(/,/g, '.')
       .replace(/\s/g, '')
    )
    return isNaN(num) ? NaN : Math.round(num * 1_000)
  }

  // Format titik sebagai pemisah ribuan Indonesia: 75.000 → 75000
  // Aturan: jika ada titik diikuti tepat 3 digit, anggap ribuan
  if (/\.\d{3}(\.|$)/.test(s) || /\.\d{3}$/.test(s)) {
    s = s.replace(/\./g, '') // buang titik ribuan
  } else {
    // Titik sebagai desimal (75.5 ribu dll), ganti koma ke titik
    s = s.replace(/,/g, '.')
  }

  // Buang karakter non-numerik kecuali titik desimal
  s = s.replace(/[^\d.]/g, '')
  return parseFloat(s)
}

// Mapping variasi nama kolom (case-insensitive, hapus spasi/tanda baca khusus)
const COLUMN_ALIASES = {
  name: [
    'name', 'nama', 'nama produk', 'namaproduk', 'nama barang', 'namabarang',
    'nama item', 'namaitem', 'product name', 'item name', 'produk', 'barang',
    'nama_produk', 'nama_barang'
  ],
  price: [
    'price', 'harga', 'harga produk', 'hargaproduk', 'harga jual', 'hargajual',
    'harga barang', 'harga item', 'sell price', 'selling price', 'harga_jual',
    'harga_produk', 'cost', 'harga satuan'
  ],
  minPrice: [
    'minprice', 'min price', 'min_price', 'harga min', 'harga minimum',
    'hargamin', 'minimum price', 'harga bawah', 'harga terendah',
    'harga_min', 'batas bawah', 'batas harga'
  ],
  stock: [
    'stock', 'stok', 'qty', 'quantity', 'jumlah', 'stok barang',
    'stok (pcs)', 'stok(pcs)', 'stok_barang', 'jumlah stok', 'jumlahstok',
    'stok tersedia', 'available stock', 'sisa stok', 'inventory'
  ],
  description: [
    'description', 'desc', 'deskripsi', 'keterangan', 'detail',
    'deskripsi produk', 'info', 'informasi', 'penjelasan', 'ket'
  ],
  category: [
    'category', 'kategori', 'jenis', 'tipe', 'type', 'golongan',
    'kelompok', 'divisi', 'group', 'kategori produk', 'jenis produk'
  ],
  imageUrl: [
    'imageurl', 'image url', 'image', 'gambar', 'foto', 'url gambar',
    'url foto', 'image_url', 'link gambar', 'link foto', 'photo'
  ]
}

/** Normalisasi header: lowercase, hapus tanda kurung & isinya, lalu bersihkan */
function normalizeHeader(h) {
  return String(h).toLowerCase().trim()
    .replace(/\s*\([^)]*\)/g, '') // hapus (IDR), (pcs), (Rp), dll beserta isinya
    .replace(/\s*\[[^\]]*\]/g, '') // hapus [...] beserta isinya
    .replace(/[_\-]/g, ' ')       // underscore dan dash → spasi
    .replace(/\s+/g, ' ').trim()
}

// Keywords prefix untuk fallback matching
// Jika header yang dinormalisasi mengandung salah satu kata ini di awal, anggap cocok
const KEYWORD_PREFIXES = {
  name:        ['nama', 'produk', 'barang', 'item', 'name', 'product'],
  price:       ['harga', 'price', 'cost', 'tarif', 'nilai'],
  minPrice:    ['min', 'batas', 'minimum'],
  stock:       ['stok', 'stock', 'qty', 'quantity', 'jumlah', 'sisa', 'invent'],
  description: ['deskripsi', 'description', 'desc', 'keter', 'detail', 'info', 'penjelasan'],
  category:    ['kateg', 'jenis', 'tipe', 'type', 'golongan', 'category'],
  imageUrl:    ['image', 'gambar', 'foto', 'photo', 'url']
}

/** Cari field internal dari nama kolom Excel/CSV yang diberikan — 3 level: exact → starts-with → contains */
function resolveHeader(rawHeader) {
  const normalized = normalizeHeader(rawHeader)
  if (!normalized) return null

  // Level 1: Exact match dengan alias
  for (const [field, aliases] of Object.entries(COLUMN_ALIASES)) {
    if (aliases.some(alias => normalizeHeader(alias) === normalized)) return field
  }

  // Level 2: Header yang dinormalisasi DIAWALI kata kunci
  for (const [field, prefixes] of Object.entries(KEYWORD_PREFIXES)) {
    if (prefixes.some(kw => normalized.startsWith(kw))) return field
  }

  // Level 3: Header yang dinormalisasi MENGANDUNG kata kunci (yang lebih panjang dari 3 huruf)
  for (const [field, prefixes] of Object.entries(KEYWORD_PREFIXES)) {
    if (prefixes.filter(kw => kw.length > 3).some(kw => normalized.includes(kw))) return field
  }

  return null // tidak dikenali, kolom diabaikan
}

/** Ubah object dengan header asli → header terstandarisasi */
function normalizeRow(rawRow) {
  const normalized = {}
  for (const [key, val] of Object.entries(rawRow)) {
    const field = resolveHeader(key)
    if (field && !(field in normalized)) normalized[field] = val
  }
  return normalized
}


export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session?.user || session.user.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Hanya admin yang bisa import produk' })
  }


  try {
    const formData = await readMultipartFormData(event)
    if (!formData || formData.length === 0) {
      throw createError({ statusCode: 400, message: 'Tidak ada file yang diunggah' })
    }

    const file = formData.find(f => f.name === 'file')
    if (!file) {
      throw createError({ statusCode: 400, message: 'File tidak ditemukan dalam form data' })
    }

    const filename = file.filename || ''
    const isCsv = filename.toLowerCase().endsWith('.csv')
    const isExcel = filename.toLowerCase().endsWith('.xlsx') || filename.toLowerCase().endsWith('.xls')

    if (!isCsv && !isExcel) {
      throw createError({ statusCode: 400, message: 'Hanya file .xlsx, .xls, atau .csv yang diizinkan' })
    }

    let rows = []

    if (isCsv) {
      // Parse CSV langsung — tidak butuh library eksternal
      const text = file.data.toString('utf-8')
      const lines = text.split(/\r?\n/).filter(l => l.trim() !== '')
      if (lines.length < 2) throw createError({ statusCode: 400, message: 'File CSV kosong atau tidak ada data' })

      const rawHeaders = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
      const rawRows = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
        const obj = {}
        rawHeaders.forEach((h, i) => { obj[h] = values[i] ?? null })
        return obj
      })
      rows = rawRows.map(normalizeRow)
    } else {
      // Parse Excel dengan ExcelJS
      const ExcelJS = await import('exceljs').then(m => m.default ?? m)
      const workbook = new ExcelJS.Workbook()
      await workbook.xlsx.load(file.data)
      const worksheet = workbook.worksheets[0]

      if (!worksheet) throw createError({ statusCode: 400, message: 'Sheet pertama tidak ditemukan' })

      /** Ekstrak teks dari berbagai tipe nilai ExcelJS */
      function excelCellText(cellValue) {
        if (cellValue === null || cellValue === undefined) return null
        // RichText: { richText: [{text: '...'}] }
        if (typeof cellValue === 'object' && cellValue.richText) {
          return cellValue.richText.map(r => r.text ?? '').join('').trim()
        }
        // Formula: { formula: '...', result: value }
        if (typeof cellValue === 'object' && 'result' in cellValue) {
          return excelCellText(cellValue.result)
        }
        // Date object
        if (cellValue instanceof Date) {
          return cellValue.toISOString()
        }
        // Number, string, boolean → langsung toString
        return String(cellValue).trim()
      }

      const rawHeaders = []
      worksheet.getRow(1).eachCell({ includeEmpty: false }, (cell, colNum) => {
        const text = excelCellText(cell.value)
        if (text) rawHeaders[colNum] = text
      })

      const rawRows = []
      worksheet.eachRow({ includeEmpty: false }, (row, rowNum) => {
        if (rowNum === 1) return // skip header
        const obj = {}
        row.eachCell({ includeEmpty: false }, (cell, colNum) => {
          const header = rawHeaders[colNum]
          if (header) {
            const text = excelCellText(cell.value)
            obj[header] = text
          }
        })
        if (Object.keys(obj).length > 0) rawRows.push(obj)
      })
      rows = rawRows.map(normalizeRow)
    }


    if (rows.length === 0) {
      throw createError({ statusCode: 400, message: 'Tidak ada data di dalam file' })
    }


    let successCount = 0
    let failedCount = 0
    const errors = []
    const categoriesCache = new Map()

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      const rowNumber = i + 2

      if (!row.name || row.price === null || row.price === undefined || row.stock === null || row.stock === undefined) {
        failedCount++
        errors.push(`Baris ${rowNumber}: Kolom name, price, dan stock wajib diisi.`)
        continue
      }

      const price = parseIndonesianPrice(row.price)
      const stock = parseInt(String(row.stock).replace(/[^\d]/g, '')) // buang karakter non-angka

      if (isNaN(price)) { failedCount++; errors.push(`Baris ${rowNumber}: Harga tidak valid — format yang diterima: 75000, Rp 75.000, 75 ribu, 1.5jt.`); continue }
      if (isNaN(stock)) { failedCount++; errors.push(`Baris ${rowNumber}: Stok tidak valid.`); continue }

      const minPrice = isNaN(parseIndonesianPrice(row.minPrice)) ? price * 0.8 : parseIndonesianPrice(row.minPrice)

      let categoryId = null
      if (row.category && row.category.trim() !== '') {
        const catName = row.category.trim()
        const key = catName.toLowerCase()

        if (categoriesCache.has(key)) {
          categoryId = categoriesCache.get(key)
        } else {
          let cat = await prisma.category.findFirst({ where: { name: { equals: catName } } })
          if (!cat) cat = await prisma.category.create({ data: { name: catName } })
          categoryId = cat.id
          categoriesCache.set(key, categoryId)
        }
      }

      try {
        await prisma.product.create({
          data: {
            name: String(row.name).trim(),
            description: row.description ? String(row.description).trim() : null,
            price,
            minPrice,
            stock,
            categoryId,
            imageUrl: row.imageUrl ? String(row.imageUrl).trim() : null
          }
        })
        successCount++
      } catch (e) {
        failedCount++
        errors.push(`Baris ${rowNumber}: Gagal simpan — ${e.message}`)
      }
    }

    logger.success('PRODUCT_IMPORT', `Import selesai: ${successCount} sukses, ${failedCount} gagal.`)
    return { success: true, summary: { total: rows.length, successCount, failedCount, errors } }

  } catch (error) {
    logger.error('PRODUCT_IMPORT', 'Gagal memproses file', error)
    throw createError({ statusCode: error.statusCode || 500, message: error.message || 'Gagal memproses file' })
  }
})
