/**
 * grid.js
 * Generator Matriks 2D untuk Lingkungan Medieval PAA (25x25)
 * * Modul ini bertanggung jawab untuk menciptakan array 2D yang merepresentasikan
 * peta simulasi. Angka di dalam array menentukan jenis petak.
 */

// Ukuran peta: 25 baris x 25 kolom
export const GRID_SIZE = 25;

// Kamus Lingkungan (sesuai proposal)
export const TILE_SAFE = 0;    // Jalan aman (Rumput)
export const TILE_WALL = 1;    // Tembok / Rintangan fisik (Tidak bisa dilewati)
export const TILE_DANGER = -1; // Danger Zone / Lava (Mematikan/Penalti)

// Titik Start selalu di pojok kiri atas, Finish di pojok kanan bawah
export const START_NODE = { row: 0, col: 0 };
export const FINISH_NODE = { row: GRID_SIZE - 1, col: GRID_SIZE - 1 };

/**
 * Membuat matriks 2D baru dengan rintangan acak.
 * * @param {number} wallProb Probabilitas munculnya tembok (0.0 - 1.0)
 * @param {number} dangerProb Probabilitas munculnya danger zone (0.0 - 1.0)
 * @returns {number[][]} Array 2D berukuran GRID_SIZE x GRID_SIZE
 */
export function generateRandomGrid(wallProb = 0.25, dangerProb = 0.10) {
    const grid = [];

    for (let row = 0; row < GRID_SIZE; row++) {
        const currentRow = [];
        for (let col = 0; col < GRID_SIZE; col++) {
            
            // Aturan Mutlak: Titik Start dan Finish harus selalu berupa jalan aman (0)
            if ((row === START_NODE.row && col === START_NODE.col) ||
                (row === FINISH_NODE.row && col === FINISH_NODE.col)) {
                currentRow.push(TILE_SAFE);
                continue;
            }

            // Distribusi probabilitas untuk mengisi petak secara acak
            const rand = Math.random();
            if (rand < wallProb) {
                currentRow.push(TILE_WALL);     // 25% kemungkinan jadi Tembok
            } else if (rand < wallProb + dangerProb) {
                currentRow.push(TILE_DANGER);   // 10% kemungkinan jadi Lava
            } else {
                currentRow.push(TILE_SAFE);     // Sisanya (65%) jadi Jalan Aman
            }
        }
        grid.push(currentRow);
    }

    return grid;
}