#!/bin/sh

# Menghindari error jika DB belum siap 100% (opsional karena depends_on + healthcheck sudah ada)
echo "🚀 Memulai Setup Database..."

# Sync schema ke database
npx prisma db push --accept-data-loss

# Jalankan seeder
npx prisma db seed

echo "✅ Database siap! Memulai aplikasi..."

# Jalankan aplikasi Nuxt
node .output/server/index.mjs
