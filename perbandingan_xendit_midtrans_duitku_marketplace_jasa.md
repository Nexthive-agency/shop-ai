---
title: "Perbandingan Payment Partner: Xendit, Midtrans, dan Duitku"
subtitle: "Untuk Marketplace Jasa Universal"
date: "14 Juni 2026"
version: "1.0"
format: "Markdown"
---

PERBANDINGAN PAYMENT PARTNER
Xendit, Midtrans, dan Duitku

Untuk Marketplace Jasa Universal
Fokus: escrow bisnis, biaya transaksi, wallet penyedia, withdraw, dan dampak untuk owner penyedia layanan

Tanggal penyusunan: 14 Juni 2026
Versi: 1.0

> Catatan: Dokumen ini bukan legal opinion dan bukan konfirmasi kontrak harga final. Biaya payment gateway dapat berubah, dapat berbeda menurut kategori merchant, volume transaksi, hasil negosiasi, jenis badan usaha, serta status onboarding. Angka pada dokumen ini memakai data harga publik dan dokumentasi resmi yang tersedia saat dokumen disusun.

# Daftar Isi

- 1. Ringkasan Eksekutif

- 2. Tujuan dan Konteks Bisnis

- 3. Kriteria Evaluasi Payment Partner

- 4. Data Perbandingan Utama

- 5. Perbandingan Biaya Pembayaran

- 6. Perbandingan Payout dan Withdraw Penyedia

- 7. Fitur Marketplace, Escrow Bisnis, dan Settlement

- 8. Simulasi Biaya Transaksi

- 9. Dampak ke Owner Penyedia Layanan

- 10. Risiko Operasional dan Catatan Implementasi

- 11. Rekomendasi Final

- 12. Sumber Data

# 1. Ringkasan Eksekutif

Untuk model marketplace jasa universal, pilihan payment partner tidak cukup dinilai dari biaya payment gateway saja. Platform akan mengelola banyak penyedia jasa, pembayaran user, status dana aman, wallet internal, refund, dispute, dan pencairan dana ke penyedia. Karena itu, faktor paling penting adalah dukungan marketplace, biaya payout, split payment, rekonsiliasi, dan fleksibilitas operasional.

Kesimpulan utama: Xendit paling kuat untuk fondasi marketplace jangka panjang. Duitku paling menarik untuk efisiensi biaya MVP jika dukungan marketplace dan disbursement sudah disetujui. Midtrans paling aman sebagai payment gateway umum dengan brand kuat, tetapi biaya disbursement bank untuk model payout ke banyak penyedia lebih tinggi dibanding Xendit dan Duitku.

| Peringkat | Partner | Kesimpulan | Alasan Utama |
| --- | --- | --- | --- |
| 1 | Xendit | Terbaik untuk marketplace jasa yang ingin scale | Kuat di XenPlatform, sub-akun, split payment, payout, dan monitoring sub-merchant. Perlu waspada biaya sub-akun aktif jika dipakai sejak awal. |
| 2 | Duitku | Alternatif kuat untuk MVP hemat biaya | Biaya VA umum kompetitif. Disbursement BI-Fast dan e-wallet Rp2.500. Perlu validasi dukungan settlement marketplace dan status badan usaha. |
| 3 | Midtrans | Bagus sebagai backup payment gateway | Brand kuat dan metode pembayaran lengkap. Namun biaya payout/disbursement bank Rp5.000 kurang ideal untuk banyak penyedia kecil. |

> Rekomendasi praktis: pakai Xendit sebagai partner utama, Duitku sebagai backup biaya rendah, dan Midtrans sebagai backup pembayaran umum. Untuk tahun pertama, hindari model sub-account mahal untuk semua penyedia kecil jika volume transaksi belum stabil.

# 2. Tujuan dan Konteks Bisnis

Dokumen ini dibuat untuk membantu memilih payment partner untuk marketplace jasa universal. Platform akan melayani jasa digital, jasa fisik datang ke lokasi, care service, jasa profesional, dan custom project.

Kebutuhan utama platform bukan hanya menerima pembayaran. Platform juga perlu mengatur status dana, komisi platform, wallet penyedia, refund, dispute, dan withdraw. Karena itu, payment partner harus mendukung alur dana yang aman dan mudah direkonsiliasi.

## 2.1 Asumsi Bisnis

- Platform memakai konsep escrow bisnis. Artinya dana user diproses oleh payment partner dan ditahan secara status transaksi sampai order selesai atau dispute selesai.

- Platform memiliki wallet internal sebagai catatan saldo settlement penyedia, bukan sebagai uang elektronik bebas transfer antar-user.

- Penyedia layanan dapat mencairkan saldo setelah transaksi selesai, masa komplain selesai, dan tidak ada flag risiko.

- Platform mengambil komisi dari nilai order. Pada simulasi dasar, komisi platform diasumsikan 10 persen.

- Biaya payment gateway dapat dibebankan ke user sebagai service fee, ke platform, atau sebagian ke penyedia. Simulasi biaya memakai pendekatan konservatif, yaitu biaya payment dan payout mengurangi margin platform.

# 3. Kriteria Evaluasi Payment Partner

| Kriteria | Mengapa Penting untuk Marketplace Jasa | Bobot Rekomendasi |
| --- | --- | --- |
| Dukungan marketplace | Platform akan memiliki banyak owner penyedia layanan. Partner harus bisa mendukung alur multi-penyedia atau minimal payout massal. | Sangat tinggi |
| Biaya transaksi pembayaran | Biaya payment langsung memengaruhi harga akhir user dan margin platform. | Tinggi |
| Biaya payout/withdraw | Penyedia kecil sensitif terhadap biaya pencairan. Biaya tinggi membuat mereka cenderung transaksi di luar platform. | Sangat tinggi |
| Split payment dan fee deduction | Platform perlu mengambil komisi secara rapi dan audit-friendly. | Sangat tinggi |
| Refund dan dispute support | Marketplace jasa akan punya pembatalan, no-show, revisi, dan komplain. | Tinggi |
| Reporting dan rekonsiliasi | Setiap order, fee, refund, dan payout harus bisa dicocokkan dengan ledger internal. | Tinggi |
| Onboarding dan badan usaha | Beberapa fitur payout atau disbursement hanya tersedia untuk badan usaha terverifikasi. | Tinggi |
| Dampak ke penyedia layanan | Penyedia harus merasa potongan jelas, saldo aman, dan pencairan mudah. | Sangat tinggi |

# 4. Data Perbandingan Utama

| Aspek | Xendit | Midtrans | Duitku |
| --- | --- | --- | --- |
| Posisi terbaik | Partner utama untuk marketplace jasa yang ingin scale. | Backup kuat untuk payment acceptance umum. | Alternatif kuat untuk MVP hemat biaya dan payout murah. |
| Kekuatan utama | XenPlatform, sub-akun, split payment, payout Rp2.500, monitoring sub-akun. | Brand kuat, metode pembayaran luas, dokumentasi matang, dashboard stabil. | Biaya VA umum kompetitif, BI-Fast Rp2.500, e-wallet disbursement Rp2.500. |
| Kelemahan utama | XenPlatform dapat menambah biaya Rp25.000 per akun aktif per bulan jika memakai sub-account penuh. | Payout/disbursement bank Rp5.000. Untuk banyak penyedia kecil, biaya ini terasa. | Fitur marketplace dan split settlement perlu dikonfirmasi langsung dengan sales. Disbursement hanya untuk akun badan usaha/yayasan terverifikasi. |
| Cocok untuk | Marketplace jasa universal, multi-owner, settlement kompleks, scale bertahap. | Payment gateway fallback, bisnis yang butuh kanal pembayaran lengkap. | MVP biaya rendah, settlement terpusat, payout BI-Fast/e-wallet murah. |
| Catatan penting | Jangan langsung membuat semua penyedia sebagai sub-account aktif jika volume masih rendah. | Bedakan withdrawal merchant biasa dan layanan payout/disbursement ke banyak penyedia. | Pastikan platform berbadan usaha dan disbursement sudah aktif sebelum launch komersial. |

# 5. Perbandingan Biaya Pembayaran

> Catatan PPN: Xendit mencatat QRIS 0,7 persen sudah termasuk pajak. Midtrans menyatakan seluruh biaya belum termasuk PPN, kecuali QRIS, GoPay, dan ShopeePay. Duitku menampilkan biaya pada halaman harga, tetapi dokumen ini tetap menyarankan konfirmasi PPN saat onboarding resmi.

| Metode Pembayaran | Xendit | Midtrans | Duitku |
| --- | --- | --- | --- |
| Virtual Account | Rp4.000 aggregator. Switcher Rp2.000 + biaya bank. | Rp4.000 per transaksi. | Artha Graha dan Sahabat Sampoerna Rp1.500. Mandiri Rp4.000. BCA Rp5.000. Lainnya Rp3.000. |
| QRIS | 0,7 persen. Tercatat sudah termasuk pajak. | 0,7 persen per transaksi. Kategori tertentu dapat berbeda. | 0,7 persen per transaksi. |
| Kartu kredit | 2,90 persen + Rp2.000. AMEX 3,90 persen + Rp2.000. | 2,90 persen + Rp2.000. | 2,90 persen + Rp2.500. |
| E-wallet | AstraPay 1,50 persen. JeniusPay 2,00 persen. OVO 1,50 sampai 3,18 persen. ShopeePay 2,00 sampai 4,00 persen. LinkAja 1,50 sampai 3,15 persen. DANA 1,50 sampai 3,00 persen. | GoPay 2 persen. ShopeePay 2 persen. DANA 1,5 persen. OVO 1,5 persen. | OVO, DANA, LinkAja 1,67 persen. ShopeePay 2 persen. OVO digital 3,03 persen. ShopeePay digital 4 persen. LinkAja fixed fee Rp3.330. |
| Gerai retail | Alfamart Rp5.000. Indomaret Rp5.500. | Indomaret langsung ke mitra + Rp1.000. Alfamart/Alfamidi/DAN+DAN Rp5.000. | Indomaret MDR + Rp1.000. Alfamart, Pegadaian, POS Indonesia Rp2.500. |
| PayLater | Akulaku 1,70 persen. Atome 5,00 persen. Indodana 2,30 persen. Kredivo 2,30 persen. UangMe 1,80 persen. | Akulaku 1,7 persen. Kredivo 2 persen. | Indodana 2,3 persen. Atome 5,5 persen. |

## 5.1 Analisis Biaya Pembayaran

Untuk jasa kecil seperti cuci AC, desain sederhana, cleaning, atau jasa harian, QRIS lebih sehat dibanding Virtual Account. QRIS memakai persentase sehingga biaya mengikuti nilai transaksi. Virtual Account memiliki biaya tetap. Pada order Rp50.000, VA Rp4.000 sudah setara 8 persen sebelum PPN. Ini berat untuk transaksi kecil.

Duitku unggul di VA umum karena beberapa kanal berada di Rp3.000 atau lebih rendah. Xendit dan Midtrans mirip untuk VA umum Rp4.000. Untuk QRIS, ketiganya berada di sekitar 0,7 persen. Untuk kartu kredit, Xendit dan Midtrans sama di 2,90 persen + Rp2.000, sedangkan Duitku 2,90 persen + Rp2.500.

Untuk e-wallet, Midtrans lebih sederhana dari sisi angka publik. Xendit dan Duitku memiliki variasi biaya menurut jenis e-wallet dan kategori merchant. Untuk marketplace jasa, e-wallet tetap penting, tetapi sebaiknya QRIS menjadi metode default karena lebih universal dan murah.

# 6. Perbandingan Payout dan Withdraw Penyedia

| Jenis Pencairan | Xendit | Midtrans | Duitku |
| --- | --- | --- | --- |
| Payout atau transfer ke rekening bank penyedia | Rp2.500 per transaksi untuk transfer ke rekening bank. | Layanan Payouts atau disbursement bank account Rp5.000 per transaksi. Untuk withdrawal merchant biasa, dokumen Midtrans menyebut tidak ada biaya tambahan, tetapi itu berbeda dari kebutuhan marketplace yang membayar banyak penyedia. | BI-Fast Rp2.500. RTOL Rp5.000. SKN/LLG Rp5.000. RTGS Rp35.000. |
| Payout ke e-wallet | Rp2.500 ke e-wallet yang didukung. | GoPay Rp1.000 pada halaman pricing global. Namun untuk payout ke bank tetap Rp5.000. | E-wallet Rp2.500. Mendukung ShopeePay, OVO, LinkAja, dan DANA sesuai dokumentasi. |
| Minimum dan limit penting | Mengikuti produk payout dan bank/e-wallet tujuan. Perlu konfirmasi saat onboarding. | Auto withdrawal merchant biasanya minimum Rp50.000. Payout dapat mengikuti pengaturan produk. | BI-Fast min Rp10.000 dan max Rp250.000.000. RTOL min Rp10.000 dan max Rp100.000.000. E-wallet min Rp10.000. |
| Catatan legal/onboarding | Perlu onboarding bisnis dan kesesuaian model marketplace. | Perlu membedakan akun merchant biasa, facilitator, aggregator, dan payout service. | Disbursement hanya tersedia untuk akun badan usaha/perusahaan/yayasan yang sudah diverifikasi. |

## 6.1 Analisis untuk Owner Penyedia Layanan

Bagi owner penyedia layanan, biaya withdraw yang paling ramah adalah Rp2.500. Xendit dan Duitku sama-sama kuat pada titik ini. Midtrans masih bagus untuk penerimaan pembayaran, tetapi payout bank Rp5.000 membuat biaya lebih berat jika platform mencairkan dana ke banyak penyedia kecil.

Contoh sederhana: penyedia menerima saldo Rp90.000 dari order Rp100.000 setelah platform fee 10 persen. Jika withdraw ke bank memakai Xendit atau Duitku, estimasi diterima Rp87.500 sebelum faktor PPN atau biaya lain. Jika memakai Midtrans Payout bank, estimasi diterima Rp85.000. Selisih Rp2.500 terlihat kecil, tetapi terasa bagi penyedia kecil yang sering withdraw.

# 7. Fitur Marketplace, Escrow Bisnis, dan Settlement

| Kebutuhan Platform | Xendit | Midtrans | Duitku |
| --- | --- | --- | --- |
| Sub-akun atau multi-merchant | Sangat kuat melalui XenPlatform. Dapat membuat banyak sub-akun dan memantau aktivitas. | Perlu model business tertentu. Lebih sering dipakai sebagai payment gateway umum. Perlu diskusi sales untuk marketplace settlement. | Perlu dikonfirmasi langsung. Dokumentasi publik lebih kuat di payment gateway dan disbursement dibanding split marketplace. |
| Split payment atau fee deduction | Kuat. Dokumentasi Xendit menyebut split payment untuk automatic fee deduction dan pembagian pembayaran antar pihak. | Perlu validasi sesuai model bisnis dan kontrak. | Perlu validasi dengan sales. Dapat dibantu dengan ledger internal dan disbursement terjadwal jika split native belum tersedia. |
| Escrow bisnis | Bisa dibangun sebagai status order di platform dengan dana diproses melalui payment partner. Xendit lebih cocok jika settlement multi-pihak dibutuhkan. | Bisa sebagai payment hold/status bisnis di platform, tetapi perlu desain ledger internal kuat. | Bisa sebagai status bisnis di platform, tetapi perlu ledger internal dan SOP settlement yang tegas. |
| Ledger dan rekonsiliasi | Kuat. Ada reporting transaksi, balance, sub-account monitoring, dan export. | Kuat untuk laporan transaksi, settlement, withdrawal, dan payment channel. | Cukup baik untuk payment gateway dan disbursement. Perlu desain internal untuk marketplace ledger. |
| Biaya khusus marketplace | XenPlatform punya biaya aktivitas akun Rp25.000 per akun aktif per bulan dan biaya transaksi in-house 0,5 persen dengan batas maksimal Rp10.000 per transaksi. | Tidak ada biaya implementasi atau maintenance pada payment service umum. Payout/disbursement bank punya biaya tersendiri. | Harga publik kompetitif. Biaya marketplace khusus perlu dikonfirmasi jika ada kebutuhan split/settlement khusus. |

> Saran arsitektur tahun pertama: gunakan internal wallet ledger di platform dan payment partner untuk payment plus payout. Jangan langsung membuat seluruh penyedia sebagai sub-account aktif jika volume transaksi tiap penyedia masih kecil. Aktifkan sub-account penuh hanya untuk penyedia dengan transaksi stabil atau nilai order tinggi.

# 8. Simulasi Biaya Transaksi

## 8.1 Asumsi Simulasi

- Nilai order diuji pada Rp50.000, Rp100.000, Rp250.000, dan Rp500.000.

- Platform fee diasumsikan 10 persen dari nilai order.

- Metode QRIS memakai tarif dasar 0,7 persen.

- Metode VA memakai tarif dasar: Xendit Rp4.000, Midtrans Rp4.000, Duitku VA umum Rp3.000.

- Payout ke penyedia diasumsikan dilakukan per order untuk melihat tekanan biaya paling berat.

- Payout bank: Xendit Rp2.500, Midtrans Rp5.000, Duitku BI-Fast Rp2.500.

- Simulasi belum memasukkan PPN tambahan jika belum jelas disebutkan pada sumber harga, biaya negosiasi khusus, refund fee, chargeback, atau biaya operasional internal.

## 8.2 Simulasi QRIS

| Nilai Order | Partner | Biaya QRIS | Biaya Payout | Total Biaya | Sisa Margin Platform | Diterima Penyedia |
| --- | --- | --- | --- | --- | --- | --- |
| Rp50.000 | Xendit | Rp350 | Rp2.500 | Rp2.850 | Rp2.150 | Rp42.500 |
| Rp50.000 | Midtrans | Rp350 | Rp5.000 | Rp5.350 | Rp-350 | Rp40.000 |
| Rp50.000 | Duitku | Rp350 | Rp2.500 | Rp2.850 | Rp2.150 | Rp42.500 |
| Rp100.000 | Xendit | Rp700 | Rp2.500 | Rp3.200 | Rp6.800 | Rp87.500 |
| Rp100.000 | Midtrans | Rp700 | Rp5.000 | Rp5.700 | Rp4.300 | Rp85.000 |
| Rp100.000 | Duitku | Rp700 | Rp2.500 | Rp3.200 | Rp6.800 | Rp87.500 |
| Rp250.000 | Xendit | Rp1.750 | Rp2.500 | Rp4.250 | Rp20.750 | Rp222.500 |
| Rp250.000 | Midtrans | Rp1.750 | Rp5.000 | Rp6.750 | Rp18.250 | Rp220.000 |
| Rp250.000 | Duitku | Rp1.750 | Rp2.500 | Rp4.250 | Rp20.750 | Rp222.500 |
| Rp500.000 | Xendit | Rp3.500 | Rp2.500 | Rp6.000 | Rp44.000 | Rp447.500 |
| Rp500.000 | Midtrans | Rp3.500 | Rp5.000 | Rp8.500 | Rp41.500 | Rp445.000 |
| Rp500.000 | Duitku | Rp3.500 | Rp2.500 | Rp6.000 | Rp44.000 | Rp447.500 |

## 8.3 Simulasi Virtual Account

| Nilai Order | Partner | Biaya VA | Biaya Payout | Total Biaya | Sisa Margin Platform | Diterima Penyedia |
| --- | --- | --- | --- | --- | --- | --- |
| Rp50.000 | Xendit | Rp4.000 | Rp2.500 | Rp6.500 | Rp-1.500 | Rp42.500 |
| Rp50.000 | Midtrans | Rp4.000 | Rp5.000 | Rp9.000 | Rp-4.000 | Rp40.000 |
| Rp50.000 | Duitku | Rp3.000 | Rp2.500 | Rp5.500 | Rp-500 | Rp42.500 |
| Rp100.000 | Xendit | Rp4.000 | Rp2.500 | Rp6.500 | Rp3.500 | Rp87.500 |
| Rp100.000 | Midtrans | Rp4.000 | Rp5.000 | Rp9.000 | Rp1.000 | Rp85.000 |
| Rp100.000 | Duitku | Rp3.000 | Rp2.500 | Rp5.500 | Rp4.500 | Rp87.500 |
| Rp250.000 | Xendit | Rp4.000 | Rp2.500 | Rp6.500 | Rp18.500 | Rp222.500 |
| Rp250.000 | Midtrans | Rp4.000 | Rp5.000 | Rp9.000 | Rp16.000 | Rp220.000 |
| Rp250.000 | Duitku | Rp3.000 | Rp2.500 | Rp5.500 | Rp19.500 | Rp222.500 |
| Rp500.000 | Xendit | Rp4.000 | Rp2.500 | Rp6.500 | Rp43.500 | Rp447.500 |
| Rp500.000 | Midtrans | Rp4.000 | Rp5.000 | Rp9.000 | Rp41.000 | Rp445.000 |
| Rp500.000 | Duitku | Rp3.000 | Rp2.500 | Rp5.500 | Rp44.500 | Rp447.500 |

## 8.4 Simulasi Bulanan 1.000 Order

Simulasi ini memakai 1.000 order per bulan dengan nilai rata-rata Rp100.000 per order, platform fee 10 persen, metode QRIS, dan payout bank per order. Ini bukan skenario paling hemat karena payout bisa digabung. Namun skenario ini berguna untuk melihat tekanan biaya jika penyedia sering withdraw.

| Partner | Total Platform Fee | Total QRIS Fee | Total Payout Fee | Total Biaya Langsung | Sisa Margin Platform |
| --- | --- | --- | --- | --- | --- |
| Xendit | Rp10.000.000 | Rp700.000 | Rp2.500.000 | Rp3.200.000 | Rp6.800.000 |
| Midtrans | Rp10.000.000 | Rp700.000 | Rp5.000.000 | Rp5.700.000 | Rp4.300.000 |
| Duitku | Rp10.000.000 | Rp700.000 | Rp2.500.000 | Rp3.200.000 | Rp6.800.000 |

## 8.5 Dampak XenPlatform Jika Semua Penyedia Jadi Sub-account Aktif

Jika memakai Xendit XenPlatform dengan 100 penyedia aktif, biaya aktivitas akun menjadi Rp2.500.000 per bulan. Jika ada 1.000 order Rp100.000 dan platform mengambil fee 10 persen, biaya in-house 0,5 persen dari fee platform menjadi sekitar Rp50.000. Total biaya tambahan XenPlatform sekitar Rp2.550.000 per bulan.

| Komponen | Nilai Simulasi |
| --- | --- |
| Jumlah provider aktif | 100 |
| Biaya aktivitas akun Xendit | 100 x Rp25.000 = Rp2.500.000 |
| Jumlah order bulanan | 1000 |
| Nilai rata-rata order | Rp100.000 |
| Platform fee 10 persen per order | Rp10.000 |
| Biaya in-house 0,5 persen dari fee platform | 1000 x Rp50 = Rp50.000 |
| Total tambahan XenPlatform | Rp2.550.000 |
| Sisa margin platform setelah QRIS, payout, dan XenPlatform | Rp4.250.000 |

> Interpretasi: Xendit tetap paling cocok untuk marketplace yang ingin scale, tetapi penggunaan sub-account penuh perlu strategi. Pada MVP, lebih aman memakai ledger internal dan payout terpusat dulu. Sub-account penuh bisa dipakai untuk penyedia yang aktif, besar, atau butuh settlement terpisah.

# 9. Dampak ke Owner Penyedia Layanan

| Aspek Owner Penyedia | Dampak Jika Pakai Xendit | Dampak Jika Pakai Midtrans | Dampak Jika Pakai Duitku |
| --- | --- | --- | --- |
| Saldo bersih | Relatif lebih baik karena payout bank Rp2.500. | Lebih rendah jika memakai payout bank Rp5.000. | Relatif lebih baik karena BI-Fast Rp2.500. |
| Frekuensi withdraw | Cocok untuk withdraw mingguan atau bulanan. Biaya rendah cukup ramah untuk penyedia kecil. | Lebih baik dibatasi mingguan/bulanan agar biaya Rp5.000 tidak terlalu sering. | Cocok untuk withdraw terjadwal jika disbursement aktif. |
| Transparansi potongan | Bisa kuat karena reporting dan sub-account monitoring. | Dashboard dan laporan matang untuk merchant. Untuk multi penyedia perlu ledger internal. | Butuh ledger internal yang rapi agar owner paham order, fee, dan payout. |
| Kepercayaan penyedia | Bagus jika platform menjelaskan status dana, masa komplain, dan kapan bisa withdraw. | Bagus untuk pembayaran, tetapi penyedia perlu diberi tahu bahwa payout bank lebih mahal. | Bagus untuk biaya, tetapi platform harus meyakinkan dukungan settlement dan disbursement sudah aktif. |
| Risiko transaksi luar platform | Lebih rendah jika biaya withdraw kecil dan dana cair jelas. | Lebih tinggi jika owner merasa potongan dan biaya withdraw terlalu berat. | Lebih rendah jika biaya tetap murah dan proses withdraw mudah. |

## 9.1 Rekomendasi Aturan Withdraw untuk Penyedia

- Minimum withdraw: Rp100.000 untuk menjaga efisiensi biaya transfer.

- Withdraw gratis internal: 1 kali per minggu atau 1 kali per bulan. Jika platform ingin menanggung biaya, gunakan kuota gratis terbatas.

- Withdraw tambahan: biaya payout dibebankan ke penyedia secara transparan.

- Withdraw instan: boleh dikenakan biaya tambahan jika nanti tersedia.

- Holding period: saldo dari order baru bisa withdraw setelah order selesai dan masa komplain berakhir.

- Provider baru: terapkan holding period 3 sampai 7 hari untuk mengurangi risiko transaksi fiktif dan kabur setelah order selesai.

- Withdraw tertahan: hanya jika ada dispute, refund pending, pola fraud, atau data rekening tidak valid. Alasannya harus tampil di dashboard penyedia.

# 10. Risiko Operasional dan Catatan Implementasi

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Biaya tetap VA terlalu besar untuk order kecil | Margin platform turun. User merasa service fee mahal. | Jadikan QRIS sebagai default. VA dipakai untuk nilai order menengah dan besar. |
| Sub-account Xendit terlalu mahal untuk provider pasif | Biaya Rp25.000 per akun aktif per bulan bisa menggerus margin. | Aktifkan sub-account hanya untuk penyedia aktif atau pakai internal ledger pada MVP. |
| Provider sering withdraw nominal kecil | Biaya payout membesar dan mengurangi kepuasan penyedia. | Tetapkan minimum withdraw dan jadwal withdraw. |
| Refund setelah pekerjaan selesai | Bisa menimbulkan sengketa dana. | Gunakan acceptance criteria, bukti pekerjaan, batas revisi, dan masa komplain. |
| Penyedia menghilang atau no-show | User rugi waktu dan kepercayaan platform turun. | Gunakan auto-refund jika belum ada bukti pekerjaan, penalti provider, rating, dan suspend bertahap. |
| Transaksi fiktif untuk tarik dana | Platform bisa menjadi jalur fraud atau gestun. | Gunakan risk scoring, hold saldo provider baru, verifikasi rekening, device/IP monitoring, dan manual review. |
| Disbursement belum aktif saat launch | Penyedia tidak bisa withdraw otomatis. | Pastikan badan usaha, KYC, API payout, dan SOP manual fallback selesai sebelum commercial launch. |
| Biaya berubah setelah kontrak | Margin bisnis berubah. | Review fee per kuartal dan simulasikan ulang pricing platform. |

# 11. Rekomendasi Final

## 11.1 Pilihan Utama

Pilihan utama yang paling kuat adalah Xendit. Alasannya, Xendit punya produk yang lebih eksplisit untuk marketplace dan platform melalui XenPlatform. Xendit juga mendukung split payment, sub-account, monitoring transaksi, dan payout Rp2.500. Ini cocok untuk roadmap marketplace jasa universal yang nanti akan memiliki banyak owner penyedia layanan.

## 11.2 Pilihan Alternatif

Duitku layak menjadi alternatif utama untuk MVP karena biaya VA umum lebih kompetitif dan disbursement BI-Fast Rp2.500. Namun, platform perlu memastikan tiga hal sebelum memilih Duitku sebagai fondasi utama: disbursement sudah aktif untuk badan usaha, skema settlement marketplace bisa diterima, dan flow refund/dispute bisa ditangani tanpa mengganggu ledger internal.

## 11.3 Backup Payment Gateway

Midtrans paling tepat disiapkan sebagai backup payment gateway. Midtrans unggul dari sisi brand, stabilitas, dan metode pembayaran. Namun, untuk marketplace dengan banyak penyedia kecil, biaya payout bank Rp5.000 membuatnya kurang ideal sebagai payout utama.

## 11.4 Strategi Implementasi Tahun Pertama

| Fase | Strategi Payment | Strategi Payout | Catatan |
| --- | --- | --- | --- |
| 0 sampai 3 bulan | Aktifkan QRIS, e-wallet, dan VA. Prioritaskan QRIS. | Withdraw manual atau semi otomatis. Minimum withdraw Rp100.000. | Validasi conversion, dispute, dan perilaku penyedia. |
| 3 sampai 6 bulan | Gunakan Xendit atau Duitku sebagai primary. Siapkan Midtrans sebagai backup. | Aktifkan payout API untuk provider terverifikasi. | Bangun wallet ledger dan laporan mutasi. |
| 6 sampai 12 bulan | Evaluasi apakah perlu sub-account penuh. | Withdraw otomatis terjadwal untuk penyedia aktif. | Jika menggunakan Xendit XenPlatform, aktifkan hanya untuk penyedia aktif atau nilai transaksi tinggi. |
| Setelah 12 bulan | Negosiasi fee berdasarkan volume. | Pisahkan model payout untuk jasa digital, on-site, dan custom project. | Bangun risk engine dan auto-hold untuk transaksi berisiko. |

## 11.5 Keputusan yang Disarankan

| Kondisi Bisnis | Partner yang Disarankan |
| --- | --- |
| Ingin bangun marketplace jasa jangka panjang dengan banyak penyedia dan split komisi | Xendit |
| Ingin MVP cepat dengan biaya relatif efisien dan payout murah | Duitku atau Xendit tanpa sub-account penuh |
| Ingin payment gateway backup yang kuat dan dikenal luas | Midtrans |
| Order rata-rata kecil di bawah Rp100.000 | Prioritaskan QRIS dan payout terjadwal. Hindari VA sebagai metode utama. |
| Banyak penyedia pasif atau hanya transaksi satu kali per bulan | Jangan langsung memakai sub-account berbiaya aktif per penyedia. Gunakan internal ledger dulu. |
| Penyedia aktif, volume tinggi, dan butuh settlement terpisah | Pertimbangkan Xendit XenPlatform sub-account. |

# 12. Sumber Data

Sumber berikut dipakai sebagai rujukan biaya dan fitur. Semua data perlu dikonfirmasi ulang saat onboarding, karena harga dapat berubah dan dapat berbeda menurut kategori merchant, volume transaksi, hasil negosiasi, serta status badan usaha.

| Kode | Sumber | URL |
| --- | --- | --- |
| S1 | Xendit Indonesia Pricing | https://www.xendit.co/id/biaya/ |
| S2 | Xendit Split Payments Documentation | https://docs.xendit.co/docs/split-payments |
| S3 | Xendit XenPlatform Fees Documentation | https://docs.xendit.co/docs/xenplatform-fees |
| S4 | Midtrans Pricing Indonesia | https://midtrans.com/id/biaya |
| S5 | Midtrans Pricing Global | https://midtrans.com/pricing |
| S6 | Midtrans Payment Fee Documentation | https://docs.midtrans.com/docs/how-much-does-midtrans-charge-for-its-payment-service |
| S7 | Midtrans Withdrawal Documentation | https://docs.midtrans.com/docs/how-can-i-have-my-money-in-my-account-payout |
| S8 | Duitku Pricing | https://www.duitku.com/harga/ |
| S9 | Duitku Disbursement Documentation | https://docs.duitku.com/disbursement-feature/overview/ |

# Lampiran A. Template Tampilan Potongan untuk Penyedia

Agar owner penyedia layanan merasa aman, dashboard harus menampilkan rincian dana secara sederhana dan transparan. Contoh format:

| Komponen | Contoh Tampilan |
| --- | --- |
| Nilai order | Rp100.000 |
| Platform fee 10 persen | Rp10.000 |
| Saldo masuk sebelum withdraw | Rp90.000 |
| Biaya withdraw | Rp2.500 jika withdraw tambahan atau di luar kuota gratis |
| Dana diterima penyedia | Rp87.500 |
| Status dana | Menunggu masa komplain selesai |
| Estimasi bisa withdraw | Order selesai + masa komplain berakhir |
| Alasan dana ditahan | Dispute aktif, refund pending, verifikasi rekening gagal, atau risk flag |
