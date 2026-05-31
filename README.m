2401020060-2401020075-Perancangan-dan-Analisis-Algoritma
Proyek PAA: The Medieval Maze (Pathfinding Algorithms)
Proyek ini merupakan simulasi Case-Based Method yang dibuat untuk memenuhi tugas mata kuliah Perancangan dan Analisis Algoritma (PAA). Di sini, kami memvisualisasikan sekaligus membandingkan performa tiga algoritma pencarian rute (pathfinding) dalam menyelesaikan labirin bertema abad pertengahan yang dipenuhi rintangan (tembok) serta zona bahaya (sarang naga & lava).

----------Tim Pengembang----------
- Dhiya Zarifa Putri Marzuki (NIM: 2401020075) – Frontend, UI/UX, & Canvas Visualizer
- Nisrina Retnosari (NIM: [NIM Nisrina]) – Core Logic, Grid Generation, & Algoritma

----------Algoritma yang Dibandingkan----------
- Greedy Search: Algoritma heuristik yang hanya memilih rute terdekat di setiap langkahnya. Prosesnya sangat cepat, namun rawan terjebak di jalan buntu (hasil sub-optimal atau bahkan gagal).
- Backtracking: Pendekatan pencarian mendalam dengan sistem mundur (runut-balik) saat menemui jalan buntu. Algoritma ini pasti menemukan jalan keluar, namun memakan banyak memori dan rute akhirnya sering kali kurang efisien.
- Branch and Bound: Algoritma yang memangkas cabang pencarian yang dinilai tidak efisien. Menghasilkan rute yang paling optimal secara mutlak dengan manajemen eksplorasi node yang lebih terarah.

----------Fitur Utama----------
- Pembuatan Labirin Otomatis: Peta di-render secara acak dengan rasio rintangan sebesar 30% (20% tembok biasa dan 10% zona bahaya).
- Statistik Real-time: Menampilkan papan skor perbandingan langsung terkait waktu eksekusi (dalam ms) dan jumlah nodes yang dieksplorasi oleh masing-masing algoritma.
- Map Editor Interaktif: Pengguna bisa mengklik petak pada kanvas secara langsung untuk membangun tembok tambahan atau menaruh jebakan baru saat simulasi berjalan.

----------Teknologi yang Digunakan----------
- HTML5 Canvas API
- Vanilla JavaScript (ES6 Modules)
- CSS3
