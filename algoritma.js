/**
 * algoritma.js
 * Modul ini berisi implementasi algoritma pencarian rute (Pathfinding)
 * untuk membandingkan kinerja Greedy, Backtracking, dan Branch & Bound.
 */

import { TILE_WALL, TILE_DANGER } from './grid.js';

// Arah pergerakan: Atas, Kanan, Bawah, Kiri
const DIRECTIONS = [
    { r: -1, c: 0 },
    { r: 0, c: 1 },
    { r: 1, c: 0 },
    { r: 0, c: -1 }
];

/**
 * Heuristik Jarak Manhattan (Manhattan Distance)
 * Rumus standar untuk grid 2D yang tidak mengizinkan pergerakan diagonal.
 */
function manhattanDistance(r1, c1, r2, c2) {
    return Math.abs(r1 - r2) + Math.abs(c1 - c2);
}

/**
 * 1. ALGORITMA GREEDY (Nearest Neighbor)
 * Fokus pada langkah terdekat secara cepat, risiko gagal tinggi di jalur buntu.
 */
export function greedySearch(grid, startNode, finishNode) {
    const rows = grid.length;
    const cols = grid[0].length;
    let nodesExplored = 0; 
    const path = [];
    const visited = new Set();
    const posToKey = (r, c) => `${r},${c}`;

    let currentRow = startNode.row;
    let currentCol = startNode.col;

    visited.add(posToKey(currentRow, currentCol));
    path.push({ r: currentRow, c: currentCol });

    while (currentRow !== finishNode.row || currentCol !== finishNode.col) {
        let bestNextStep = null;
        let minHeuristic = Infinity;

        for (const dir of DIRECTIONS) {
            const nextR = currentRow + dir.r;
            const nextC = currentCol + dir.c;
            nodesExplored++; 

            if (nextR < 0 || nextR >= rows || nextC < 0 || nextC >= cols) continue;
            if (grid[nextR][nextC] === TILE_WALL || grid[nextR][nextC] === TILE_DANGER) continue;
            if (visited.has(posToKey(nextR, nextC))) continue;

            const h = manhattanDistance(nextR, nextC, finishNode.row, finishNode.col);

            if (h < minHeuristic) {
                minHeuristic = h;
                bestNextStep = { r: nextR, c: nextC };
            }
        }

        if (!bestNextStep) {
            return { sukses: false, path: path, nodesExplored: nodesExplored, pesan: "Greedy terjebak (Gagal)." };
        }

        currentRow = bestNextStep.r;
        currentCol = bestNextStep.c;
        visited.add(posToKey(currentRow, currentCol));
        path.push({ r: currentRow, c: currentCol });
    }

    return { sukses: true, path: path, nodesExplored: nodesExplored, pesan: "Greedy sukses." };
}

/**
 * 2. ALGORITMA BACKTRACKING (Depth-First Search)
 * Sistematis, bisa putar balik, namun rute berkelok (sub-optimal) dan boros memori eksplorasi.
 */
export function backtrackingSearch(grid, startNode, finishNode) {
    const rows = grid.length;
    const cols = grid[0].length;
    let nodesExplored = 0;
    let bestPath = [];
    let found = false;
    
    const visited = new Set();
    const posToKey = (r, c) => `${r},${c}`;

    // Fungsi rekursif internal
    function dfs(r, c, currentPath) {
        if (found) return; // Jika sudah ada rute sukses yang ditemukan, hentikan sisa rekursi

        nodesExplored++;
        visited.add(posToKey(r, c));
        currentPath.push({ r, c });

        // Jika sampai ke finish
        if (r === finishNode.row && c === finishNode.col) {
            found = true;
            bestPath = [...currentPath];
            return;
        }

        // Eksplorasi 4 arah
        for (const dir of DIRECTIONS) {
            const nextR = r + dir.r;
            const nextC = c + dir.c;

            if (nextR >= 0 && nextR < rows && nextC >= 0 && nextC < cols) {
                if (grid[nextR][nextC] !== TILE_WALL && grid[nextR][nextC] !== TILE_DANGER) {
                    if (!visited.has(posToKey(nextR, nextC))) {
                        dfs(nextR, nextC, currentPath);
                        if (found) return; // Cut-off propagasi jika jalan keluar sudah ketemu
                    }
                }
            }
        }

        // Backtrack: Hapus jejak rute karena ini jalan buntu
        currentPath.pop();
    }

    dfs(startNode.row, startNode.col, []);

    return {
        sukses: found,
        path: bestPath,
        nodesExplored: nodesExplored,
        pesan: found ? "Backtracking sukses (Sub-optimal)" : "Rute terblokir."
    };
}

/**
 * 3. ALGORITMA BRANCH & BOUND (A* Search Heuristic)
 * Menggunakan batas (bound) untuk memotong (pruning) cabang tak efisien demi rute terpendek absolut.
 */
export function branchAndBoundSearch(grid, startNode, finishNode) {
    const rows = grid.length;
    const cols = grid[0].length;
    let nodesExplored = 0;

    // Priority Queue Element: g (jarak saat ini), h (jarak sisa), path (jejak rute)
    let pq = [];
    pq.push({
        r: startNode.row, 
        c: startNode.col, 
        g: 0, 
        h: manhattanDistance(startNode.row, startNode.col, finishNode.row, finishNode.col),
        path: [{ r: startNode.row, c: startNode.col }]
    });

    const bestG = new Map(); // Tabel untuk pruning jarak terburuk
    const posToKey = (r, c) => `${r},${c}`;

    while (pq.length > 0) {
        // Sort antrean (Prioritaskan nilai cost f = g + h terkecil)
        pq.sort((a, b) => (a.g + a.h) - (b.g + b.h));
        const current = pq.shift(); 

        nodesExplored++;

        // Jika mencapai tujuan dari node dengan prioritas f terendah, itu dipastikan optimal absolut
        if (current.r === finishNode.row && current.c === finishNode.col) {
            return {
                sukses: true,
                path: current.path,
                nodesExplored: nodesExplored,
                pesan: "BnB sukses (Optimal)"
            };
        }

        // --- LOGIKA PRUNING ---
        // Jika kita pernah mengevaluasi petak ini dengan biaya langkah (g) yang lebih kecil atau sama, abaikan cabang ini!
        const key = posToKey(current.r, current.c);
        if (bestG.has(key) && bestG.get(key) <= current.g) {
            continue; 
        }
        bestG.set(key, current.g);

        // Ekspansi tetangga
        for (const dir of DIRECTIONS) {
            const nextR = current.r + dir.r;
            const nextC = current.c + dir.c;

            if (nextR >= 0 && nextR < rows && nextC >= 0 && nextC < cols) {
                if (grid[nextR][nextC] !== TILE_WALL && grid[nextR][nextC] !== TILE_DANGER) {
                    const nextG = current.g + 1;
                    const nextH = manhattanDistance(nextR, nextC, finishNode.row, finishNode.col);
                    const nextPath = [...current.path, { r: nextR, c: nextC }];

                    pq.push({ r: nextR, c: nextC, g: nextG, h: nextH, path: nextPath });
                }
            }
        }
    }

    return {
        sukses: false,
        path: [],
        nodesExplored: nodesExplored,
        pesan: "BnB: Rute terblokir total."
    };
}