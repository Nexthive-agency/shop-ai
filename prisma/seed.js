import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seeding...')

  // ─── USERS ────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('password', 12)

  const users = [
    { name: 'Admin Toko',  email: 'admin@toko.com',  role: 'admin' },
    { name: 'User Biasa',  email: 'user@toko.com',   role: 'user'  },
  ]

  for (const u of users) {
    const user = await prisma.user.upsert({
      where:  { email: u.email },
      update: { name: u.name, role: u.role, password: hashedPassword },
      create: { ...u, password: hashedPassword }
    })
    console.log(`👤 Upserted ${user.role}: ${user.email}`)
  }

  // ─── PRODUCTS ─────────────────────────────────────────────
  const products = [
    {
      name: 'MacBook Pro M3',
      description: 'Laptop Apple terbaru dengan chip M3, RAM 16GB, SSD 512GB. Layar Liquid Retina XDR.',
      price: 28999000,
      minPrice: 25000000,
      stock: 5,
      category: 'Laptop'
    },
    {
      name: 'iPhone 15 Pro',
      description: 'Handphone flagship Apple dengan bahan Titanium, chip A17 Pro, kamera 48MP.',
      price: 18499000,
      minPrice: 16000000,
      stock: 12,
      category: 'Smartphone'
    },
    {
      name: 'Sony WH-1000XM5',
      description: 'Headphone Noise Cancelling terbaik dengan baterai tahan lama dan suara jernih.',
      price: 5299000,
      minPrice: 4500000,
      stock: 8,
      category: 'Audio'
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      description: 'Smartphone Samsung tercanggih dengan AI integration, stylus pen, dan kamera 200MP.',
      price: 19999000,
      minPrice: 17500000,
      stock: 10,
      category: 'Smartphone'
    },
    {
      name: 'Logitech MX Master 3S',
      description: 'Mouse ergonomis terbaik untuk produktivitas dengan fitur silent click.',
      price: 1599000,
      minPrice: 1300000,
      stock: 20,
      category: 'Aksesoris'
    },
    {
      name: 'Keychron K2 V2',
      description: 'Mechanical keyboard wireless minimalis dengan RGB backlight dan Gateron switches.',
      price: 1299000,
      minPrice: 1100000,
      stock: 15,
      category: 'Aksesoris'
    }
  ]

  for (const product of products) {
    // Upsert by name supaya aman dijalankan berulang kali
    const p = await prisma.product.upsert({
      where: { 
        // Butuh unique field — gunakan nama sebagai identifier
        // Jika field name belum @unique, pakai firstOrCreate pattern:
        id: (await prisma.product.findFirst({ where: { name: product.name } }))?.id ?? 0
      },
      update: { price: product.price, minPrice: product.minPrice, stock: product.stock },
      create: product
    })
    console.log(`📦 Upserted product: ${p.name} | Rp${p.price.toLocaleString('id-ID')}`)
  }

  console.log('\n✅ Seeding selesai!')
  console.log('─────────────────────────────────')
  console.log('👤 admin@toko.com  | password: password | role: admin')
  console.log('👤 user@toko.com   | password: password | role: user')
  console.log('─────────────────────────────────')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
