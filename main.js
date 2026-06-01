/**
 * main.js
 * Pusat Kendali Simulasi PAA Medieval + Interactive Map Editor
 */

import { generateRandomGrid, START_NODE, FINISH_NODE } from './grid.js';
import { greedySearch, backtrackingSearch, branchAndBoundSearch } from './algoritma.js';
import { drawGrid, drawPath, animatePath, updateScoreboard } from './renderer2d.js';

const canvasGreedy = document.getElementById('canvas-greedy');
const ctxGreedy = canvasGreedy.getContext('2d');

const canvasBacktrack = document.getElementById('canvas-backtrack');
const ctxBacktrack = canvasBacktrack.getContext('2d');

const canvasBnB = document.getElementById('canvas-bnb');
const ctxBnB = canvasBnB.getContext('2d');

const btnMulai = document.getElementById('btn-mulai');
const btnAcak = document.getElementById('btn-acak');

// State global untuk menyimpan peta saat ini
let currentGrid = null;
let isAnimating = false; // Kunci pengaman saat balapan berlangsung

// Fungsi inisialisasi / Acak Peta
function initSimulation() {
    if (isAnimating) return; // Cegah diacak saat sedang balapan

    // JALAN TENGAH LABIRIN: Tembok 20%, Bahaya 10% (Total 30% Rintangan)
    currentGrid = generateRandomGrid(0.20, 0.10);

    // Gambar peta yang sama persis di ketiga kanvas
    drawGrid(canvasGreedy, ctxGreedy, currentGrid);
    drawGrid(canvasBacktrack, ctxBacktrack, currentGrid);
    drawGrid(canvasBnB, ctxBnB, currentGrid);

    // Reset papan skor
    updateScoreboard('score-greedy', 'Siaga (Menunggu)', 0, 0);
    updateScoreboard('score-backtrack', 'Siaga (Menunggu)', 0, 0);
    updateScoreboard('score-bnb', 'Siaga (Menunggu)', 0, 0);
}

// Fungsi eksekusi utama saat tombol "Mulai" ditekan
function runSimulation() {
    if (!currentGrid || isAnimating) return;
    
    isAnimating = true;
    
    // Kunci tombol UI
    btnMulai.disabled = true;
    btnAcak.disabled = true;
    btnMulai.innerText = "Balapan Berlangsung...";

    // ==========================================
    // 1. MESIN BERHITUNG SECARA INSTAN DI BELAKANG
    // ==========================================
    const t0_g = performance.now();
    const resultGreedy = greedySearch(currentGrid, START_NODE, FINISH_NODE);
    const t1_g = performance.now();
    const timeGreedy = t1_g - t0_g;

    const t0_b = performance.now();
    const resultBacktrack = backtrackingSearch(currentGrid, START_NODE, FINISH_NODE);
    const t1_b = performance.now();
    const timeBacktrack = t1_b - t0_b;

    const t0_bnb = performance.now();
    const resultBnB = branchAndBoundSearch(currentGrid, START_NODE, FINISH_NODE);
    const t1_bnb = performance.now();
    const timeBnB = t1_bnb - t0_bnb;

    // ==========================================
    // 2. PERSIAPAN PANGGUNG BALAPAN
    // ==========================================
    drawGrid(canvasGreedy, ctxGreedy, currentGrid);
    drawGrid(canvasBacktrack, ctxBacktrack, currentGrid);
    drawGrid(canvasBnB, ctxBnB, currentGrid);

    updateScoreboard('score-greedy', 'Menyusuri rute...', 0, 0);
    updateScoreboard('score-backtrack', 'Menyusuri rute...', 0, 0);
    updateScoreboard('score-bnb', 'Menyusuri rute...', 0, 0);

    // ==========================================
    // 3. MULAI ANIMASI BALAPAN!
    // ==========================================
    let animationsFinished = 0;

    // Fungsi untuk membuka kunci tombol setelah ketiga algoritma selesai merayap
    function checkAllFinished() {
        animationsFinished++;
        if (animationsFinished === 3) {
            isAnimating = false;
            btnMulai.disabled = false;
            btnAcak.disabled = false;
            btnMulai.innerText = "Mulai Simulasi";
        }
    }

    // Algoritma 1: Greedy (Cyan)
    animatePath(canvasGreedy, ctxGreedy, resultGreedy.path, '#00ffff', () => {
        updateScoreboard('score-greedy', resultGreedy.pesan, timeGreedy, resultGreedy.nodesExplored);
        checkAllFinished();
    });

    // Algoritma 2: Backtracking (Merah)
    animatePath(canvasBacktrack, ctxBacktrack, resultBacktrack.path, '#ff4c4c', () => {
        updateScoreboard('score-backtrack', resultBacktrack.pesan, timeBacktrack, resultBacktrack.nodesExplored);
        checkAllFinished();
    });

    // Algoritma 3: Branch & Bound (Emas)
    animatePath(canvasBnB, ctxBnB, resultBnB.path, '#d4af37', () => {
        updateScoreboard('score-bnb', resultBnB.pesan, timeBnB, resultBnB.nodesExplored);
        checkAllFinished();
    });
}

// ==========================================
// 4. FITUR RAHASIA: INTERACTIVE MAP EDITOR
// ==========================================
function handleCanvasClick(event) {
    if (isAnimating || !currentGrid) return; 
    
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const cellSize = event.target.width / currentGrid.length; 
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    
    if ((row === START_NODE.row && col === START_NODE.col) || 
        (row === FINISH_NODE.row && col === FINISH_NODE.col)) return;
    
    // Siklus Perubahan Petak: Rumput (0) -> Tembok (1) -> Lava/Naga (-1) -> Rumput (0)
    if (currentGrid[row][col] === 0) {
        currentGrid[row][col] = 1;      
    } else if (currentGrid[row][col] === 1) {
        currentGrid[row][col] = -1;     
    } else {
        currentGrid[row][col] = 0;      
    }
    
    drawGrid(canvasGreedy, ctxGreedy, currentGrid);
    drawGrid(canvasBacktrack, ctxBacktrack, currentGrid);
    drawGrid(canvasBnB, ctxBnB, currentGrid);
}

// ==========================================
// 5. EVENT LISTENERS
// ==========================================
document.getElementById('btn-acak').addEventListener('click', initSimulation);
document.getElementById('btn-mulai').addEventListener('click', runSimulation);

initSimulation();