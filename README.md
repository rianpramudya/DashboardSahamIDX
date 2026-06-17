# IDX Stock Dashboard

&gt; Dashboard visualisasi data saham Indonesia yang menampilkan pergerakan harga, volume, dan distribusi sektor dari 15 saham blue chip IDX menggunakan data real-time dari Yahoo Finance.

🌐 Demo: https://dashboard-saham-idx.vercel.app

## Isi Dashboard

- Chart 1: IHSG Trend — Tren pergerakan Indeks Harga Saham Gabungan (IHSG) dalam 3-6 bulan terakhir (Line Chart)
- Chart 2: Top Movers — Perbandingan top 5 saham dengan kenaikan dan penurunan harga terbesar hari ini (Bar Chart)
- Chart 3: Distribusi Sektor — Proporsi market cap per sektor (Banking, Consumer, Mining, dll) (Doughnut Chart)
- Chart 4: Volume Leaders — Perbandingan volume transaksi terbesar antar saham (Bar Chart)
- Chart 5: Scatter Volume vs Change — Hubungan antara volume transaksi dan perubahan harga (Scatter Plot)
- Chart 6: Stock Price History — Pergerakan harga historis untuk 1 saham pilihan (Line Chart)
- Fitur interaktif: Tooltip saat hover, Filter dropdown time range (1D/1W/1M/3M/6M/1Y), Toggle dataset pada legend, Search autocomplete saham
- Animasi: Chart.js entrance animation, Count-up number pada KPI cards, CSS fade-in & scroll reveal, Particle background, Stagger animation

## Sumber Data

- Nama dataset: Yahoo Finance Stock Data (Indonesia Exchange)
- URL sumber: https://finance.yahoo.com

## Cara Jalankan di Lokal

# Jalur A (static):
Buka index.html langsung di browser (atau pakai Live Server di VS Code)

# Jalur B (server):
npm install
npm run dev
# Buka http://localhost:3000

## Teknologi

- Chart.js (visualisasi)
- HTML + CSS + JavaScript
- Vercel (deployment)

## Anggota

- Rian Pramudya Amanda (1301220303)
- Muh. Agung Gustiansyah (1301223123)
- Mega Bunawi (1301220366)
- M. Jibran Aflah (1301223022)