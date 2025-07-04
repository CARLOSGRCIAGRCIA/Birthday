import { db } from '../db.js';

class NoteComponent {
    constructor() {
        this.container = document.getElementById('note-container');
        this.isResizing = false;
        this.resizeTimeout = null;
        this.render();
        this.setupEventListeners();
    }

    render() {
        const noteData = db.getNoteData();
        this.container.innerHTML = `
            <h2 class="section-title">Feliz Cumpleaños</h2>
            <div class="note-canvas-container">
                <canvas id="noteCanvas"></canvas>
            </div>
            <div class="customize-note">
                <h3>Personaliza tu nota</h3>
                <textarea id="noteText">${noteData.customText || noteData.defaultText}</textarea>
                <button id="updateNote">Actualizar Nota</button>
            </div>
        `;
        
        this.canvas = document.getElementById('noteCanvas');
        this.initializeCanvas();
    }
    
    initializeCanvas() {
        this.setupResponsiveCanvas();
        this.drawNote();
    }

    setupResponsiveCanvas() {
        const container = this.canvas.parentElement;
        const dpr = window.devicePixelRatio || 1;
        
        const containerRect = container.getBoundingClientRect();
        const containerWidth = containerRect.width;
        
        let canvasHeight;
        if (containerWidth < 480) {
            canvasHeight = Math.max(containerWidth * 0.75, 250);
        } else if (containerWidth < 768) {
            canvasHeight = Math.max(containerWidth * 0.67, 300);
        } else {
            canvasHeight = Math.min(containerWidth * 0.5, 400);
        }
        
        this.canvas.style.width = `${containerWidth}px`;
        this.canvas.style.height = `${canvasHeight}px`;
        
        this.canvas.width = containerWidth * dpr;
        this.canvas.height = canvasHeight * dpr;
        
        const ctx = this.canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        
        this.canvasWidth = containerWidth;
        this.canvasHeight = canvasHeight;
    }

    drawNote() {
        const ctx = this.canvas.getContext('2d');
        const noteText = document.getElementById('noteText').value;
        
        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        
        this.drawNoteBackground(ctx);
        
        this.drawResponsiveTulipBouquet(ctx);
        
        this.drawResponsiveText(ctx, noteText);
    }

    drawNoteBackground(ctx) {
        ctx.fillStyle = '#fff9c4';
        ctx.strokeStyle = '#ffd54f';
        ctx.lineWidth = 2;
        
        const cornerRadius = Math.min(this.canvasWidth, this.canvasHeight) * 0.05;
        
        ctx.beginPath();
        ctx.roundRect(10, 10, this.canvasWidth - 20, this.canvasHeight - 20, cornerRadius);
        ctx.fill();
        ctx.stroke();
    }

    drawResponsiveTulipBouquet(ctx) {
        const scale = Math.min(this.canvasWidth, this.canvasHeight) / 400;
        const bouquetSize = Math.max(scale, 0.3); 
        
        let bouquetX, bouquetY;
        
        if (this.canvasWidth < 480) {
            bouquetX = this.canvasWidth / 2;
            bouquetY = this.canvasHeight * 0.2;
        } else if (this.canvasWidth < 768) {
            bouquetX = this.canvasWidth - (100 * bouquetSize);
            bouquetY = 60 * bouquetSize;
        } else {
            bouquetX = this.canvasWidth - (120 * bouquetSize);
            bouquetY = 80 * bouquetSize;
        }
        
        this.drawTulipBouquet(ctx, bouquetX, bouquetY, bouquetSize);
    }

    drawResponsiveText(ctx, noteText) {
        const baseFontSize = Math.max(this.canvasWidth * 0.025, 12);
        const fontSize = Math.min(baseFontSize, 20);
        
        ctx.fillStyle = '#333';
        ctx.font = `${fontSize}px 'Arial', sans-serif`;
        ctx.textAlign = 'left';
        
        const padding = this.canvasWidth * 0.05;
        const textAreaWidth = this.canvasWidth - (padding * 2);
        const lineHeight = fontSize * 1.4;
        
        let startY;
        if (this.canvasWidth < 480) {
            startY = this.canvasHeight * 0.5;
        } else {
            startY = this.canvasHeight * 0.3;
        }
        
        let maxTextWidth = textAreaWidth;
        if (this.canvasWidth >= 480) {
            maxTextWidth = textAreaWidth * 0.65; 
        }
        
        this.wrapText(ctx, noteText, padding, startY, maxTextWidth, lineHeight);
    }

    wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        let currentY = y;
        
        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && i > 0) {
                ctx.fillText(line, x, currentY);
                line = words[i] + ' ';
                currentY += lineHeight;
                
                if (currentY > this.canvasHeight - 30) {
                    break;
                }
            } else {
                line = testLine;
            }
        }
        
        if (currentY <= this.canvasHeight - 30) {
            ctx.fillText(line, x, currentY);
        }
    }

    drawTulipBouquet(ctx, x, y, scale = 1) {
        const tulips = [
            { x: 0, y: 0, color: '#ff5252', angle: 0, zIndex: 7 },
            { x: -35 * scale, y: 20 * scale, color: '#ffeb3b', angle: -18, zIndex: 6 },
            { x: 35 * scale, y: 20 * scale, color: '#ff4081', angle: 18, zIndex: 6 },
            { x: -70 * scale, y: 40 * scale, color: '#ba68c8', angle: -30, zIndex: 5 },
            { x: 70 * scale, y: 40 * scale, color: '#4fc3f7', angle: 30, zIndex: 5 }
        ];

        tulips.sort((a, b) => a.zIndex - b.zIndex);

        tulips.forEach(tulip => {
            ctx.save();
            ctx.translate(x + tulip.x, y + tulip.y);
            ctx.rotate(tulip.angle * Math.PI / 180);
            this.drawTulip(ctx, tulip.color, scale);
            ctx.restore();
        });

        ctx.save();
        ctx.translate(x, y + (100 * scale));
        this.drawRibbon(ctx, scale);
        ctx.restore();
    }

    drawTulip(ctx, color, scale = 1) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 120 * scale);
        ctx.strokeStyle = '#7cb342';
        ctx.lineWidth = 8 * scale;
        ctx.stroke();

        ctx.fillStyle = '#aed581';
        this.drawLeaf(ctx, -15 * scale, 30 * scale, 25 * scale, 12 * scale, 45);
        this.drawLeaf(ctx, 15 * scale, 60 * scale, 25 * scale, 12 * scale, -45);

        const gradient = ctx.createLinearGradient(0, -50 * scale, 0, 0);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, this.darkenColor(color, 20));
        
        ctx.save();
        ctx.translate(0, -50 * scale);
        
        this.drawPetal(ctx, 0, 0, 20 * scale, 50 * scale, 0, gradient);
        this.drawPetal(ctx, 0, 0, 20 * scale, 50 * scale, -30, gradient);
        this.drawPetal(ctx, 0, 0, 20 * scale, 50 * scale, 30, gradient);
        
        ctx.save();
        ctx.scale(1, 1.1);
        this.drawPetal(ctx, 0, 0, 20 * scale, 50 * scale, -15, gradient);
        this.drawPetal(ctx, 0, 0, 20 * scale, 50 * scale, 15, gradient);
        ctx.restore();
        
        ctx.restore();
    }

    drawPetal(ctx, x, y, width, height, angle, gradient) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle * Math.PI / 180);
        ctx.beginPath();
        ctx.ellipse(0, 0, width, height, 0, 0, Math.PI);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.restore();
    }

    drawLeaf(ctx, x, y, width, height, angle) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle * Math.PI / 180);
        ctx.beginPath();
        ctx.ellipse(0, 0, width, height, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    drawRibbon(ctx, scale = 1) {
        ctx.fillStyle = '#ff5252';
        
        ctx.beginPath();
        ctx.roundRect(-50 * scale, 0, 100 * scale, 15 * scale, 10 * scale);
        ctx.fill();
        
        ctx.beginPath();
        ctx.ellipse(-60 * scale, 7 * scale, 10 * scale, 5 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.ellipse(60 * scale, 7 * scale, 10 * scale, 5 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(0, 0, 8 * scale, 0, Math.PI * 2);
        ctx.fill();
    }

    darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return `#${(
            0x1000000 +
            (R < 0 ? 0 : R) * 0x10000 +
            (G < 0 ? 0 : G) * 0x100 +
            (B < 0 ? 0 : B)
        ).toString(16).slice(1)}`;
    }

    setupEventListeners() {
        document.getElementById('updateNote').addEventListener('click', () => {
            const noteText = document.getElementById('noteText').value;
            db.saveNote(noteText);
            this.drawNote();
        });
        
        window.addEventListener('resize', () => {
            if (this.resizeTimeout) {
                clearTimeout(this.resizeTimeout);
            }
            
            this.resizeTimeout = setTimeout(() => {
                this.setupResponsiveCanvas();
                this.drawNote();
            }, 100);
        });
        
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.setupResponsiveCanvas();
                this.drawNote();
            }, 300);
        });
    }
}

export default NoteComponent;