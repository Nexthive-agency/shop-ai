import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seeding...')

  const hashedPassword = await bcrypt.hash('password', 12)

  const users = [
    { name: 'Admin Toko', email: 'admin@toko.com', role: 'admin' },
    { name: 'User Biasa', email: 'user@toko.com', role: 'user' }
  ]

  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        name: userData.name,
        role: userData.role,
        password: hashedPassword
      },
      create: {
        ...userData,
        password: hashedPassword
      }
    })

    console.log(`Upserted ${user.role}: ${user.email}`)
  }

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
    let categoryId = null

    if (product.category) {
      const category = await prisma.category.upsert({
        where: { name: product.category },
        update: {},
        create: { name: product.category }
      })
      categoryId = category.id
    }

    const existingProduct = await prisma.product.findFirst({
      where: { name: product.name }
    })

    const productData = {
      name: product.name,
      description: product.description,
      price: product.price,
      minPrice: product.minPrice,
      stock: product.stock,
      categoryId
    }

    const savedProduct = existingProduct
      ? await prisma.product.update({
          where: { id: existingProduct.id },
          data: productData
        })
      : await prisma.product.create({
          data: productData
        })

    console.log(`Upserted product: ${savedProduct.name} | Rp${savedProduct.price.toLocaleString('id-ID')}`)
  }

  console.log('Seeding selesai.')
  console.log('admin@toko.com  | password: password | role: admin')
  console.log('user@toko.com   | password: password | role: user')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
