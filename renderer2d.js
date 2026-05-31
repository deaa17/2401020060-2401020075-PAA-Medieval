/**
 * renderer2d.js
 * Visualizer Canvas Papan Catur (Lava + Naga Murni)
 */

import { GRID_SIZE, TILE_SAFE, TILE_WALL, TILE_DANGER, START_NODE, FINISH_NODE } from './grid.js';

export function drawGrid(canvas, ctx, grid) {
    const cellSize = canvas.width / GRID_SIZE;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            const tile = grid[r][c];
            const x = c * cellSize;
            const y = r * cellSize;
            
            // 1. LUKIS TEMBOK
            if (tile === TILE_WALL) {
                ctx.fillStyle = '#5a5a5a'; 
                ctx.fillRect(x, y, cellSize, cellSize);
                ctx.strokeStyle = '#333'; 
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(x, y + cellSize / 3); ctx.lineTo(x + cellSize, y + cellSize / 3);
                ctx.moveTo(x, y + 2 * cellSize / 3); ctx.lineTo(x + cellSize, y + 2 * cellSize / 3);
                ctx.moveTo(x + cellSize / 2, y); ctx.lineTo(x + cellSize / 2, y + cellSize / 3);
                ctx.moveTo(x + cellSize / 4, y + cellSize / 3); ctx.lineTo(x + cellSize / 4, y + 2 * cellSize / 3);
                ctx.moveTo(x + 3 * cellSize / 4, y + cellSize / 3); ctx.lineTo(x + 3 * cellSize / 4, y + 2 * cellSize / 3);
                ctx.moveTo(x + cellSize / 2, y + 2 * cellSize / 3); ctx.lineTo(x + cellSize / 2, y + cellSize);
                ctx.stroke();
            } 
            // 2. LUKIS ZONA BAHAYA (LAVA & NAGA MURNI)
            else if (tile === TILE_DANGER) {
                // Pembagian: Jika baris + kolom genap = Lava, ganjil = Naga
                if ((r + c) % 2 === 0) {
                    // --- LUKIS LAVA ---
                    const gradient = ctx.createRadialGradient(
                        x + cellSize / 2, y + cellSize / 2, 2,
                        x + cellSize / 2, y + cellSize / 2, cellSize / 1.2
                    );
                    gradient.addColorStop(0, '#ffcc00'); 
                    gradient.addColorStop(0.4, '#ff6600'); 
                    gradient.addColorStop(1, '#a32020'); 
                    ctx.fillStyle = gradient;
                    ctx.fillRect(x, y, cellSize, cellSize);
                } else {
                    // --- LUKIS SARANG NAGA ---
                    ctx.fillStyle = '#3a1818'; // Tanah gelap
                    ctx.fillRect(x, y, cellSize, cellSize);
                    
                    const fontSize = Math.floor(cellSize * 0.7);
                    ctx.font = fontSize + "px Arial, sans-serif"; 
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('🐉', x + cellSize / 2, y + cellSize / 2);
                }
            } 
            // 3. LUKIS JALAN AMAN
            else {
                ctx.fillStyle = '#2d4c1e';
                ctx.fillRect(x, y, cellSize, cellSize);
                ctx.strokeStyle = '#243d18';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(x + cellSize * 0.2, y + cellSize * 0.8); ctx.lineTo(x + cellSize * 0.3, y + cellSize * 0.5);
                ctx.moveTo(x + cellSize * 0.7, y + cellSize * 0.7); ctx.lineTo(x + cellSize * 0.8, y + cellSize * 0.4);
                ctx.stroke();
            }

            // 4. LUKIS START & FINISH
            if (r === START_NODE.row && c === START_NODE.col) {
                ctx.fillStyle = '#4287f5';
                ctx.fillRect(x, y, cellSize, cellSize);
                ctx.fillStyle = '#ffffff';
                const fontSize = Math.floor(cellSize * 0.6);
                ctx.font = fontSize + "px 'MedievalSharp', cursive";
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('S', x + cellSize / 2, y + cellSize / 2);
            }
            if (r === FINISH_NODE.row && c === FINISH_NODE.col) {
                ctx.fillStyle = '#d4af37';
                ctx.fillRect(x, y, cellSize, cellSize);
                ctx.fillStyle = '#ffffff'; 
                const fontSize = Math.floor(cellSize * 0.6);
                ctx.font = fontSize + "px 'MedievalSharp', cursive";
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('F', x + cellSize / 2, y + cellSize / 2);
            }

            // Garis pembatas (Grid)
            ctx.strokeStyle = '#111';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, cellSize, cellSize);
        }
    }
}

export function drawPath(canvas, ctx, path, pathColor) {
    if (!path || path.length === 0) return;
    const cellSize = canvas.width / GRID_SIZE;
    const offset = cellSize / 2; 

    ctx.beginPath();
    ctx.strokeStyle = pathColor;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(path[0].c * cellSize + offset, path[0].r * cellSize + offset);
    for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].c * cellSize + offset, path[i].r * cellSize + offset);
    }
    ctx.stroke();
}

export function animatePath(canvas, ctx, path, pathColor, onComplete) {
    if (!path || path.length === 0) {
        if(onComplete) onComplete();
        return;
    }

    const cellSize = canvas.width / GRID_SIZE;
    const offset = cellSize / 2;

    ctx.beginPath();
    ctx.strokeStyle = pathColor;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(path[0].c * cellSize + offset, path[0].r * cellSize + offset);

    let i = 1;
    function drawNextStep() {
        if (i < path.length) {
            ctx.lineTo(path[i].c * cellSize + offset, path[i].r * cellSize + offset);
            ctx.stroke();
            i++;
            setTimeout(() => requestAnimationFrame(drawNextStep), 30);
        } else {
            if (onComplete) onComplete(); 
        }
    }
    drawNextStep();
}

export function updateScoreboard(boardId, status, timeMs, nodes) {
    const board = document.getElementById(boardId);
    if (!board) return;
    board.querySelector('.val-status').innerText = status;
    board.querySelector('.val-time').innerText = timeMs.toFixed(2) + ' ms';
    board.querySelector('.val-nodes').innerText = nodes + ' petak';
}
