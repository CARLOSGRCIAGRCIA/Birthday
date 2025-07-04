import { db } from '../db.js';

class PhrasesComponent {
    constructor() {
        this.container = document.getElementById('phrases-container');
        this.currentPhrase = 0;
        this.render();
        this.setupEventListeners();
    }

    render() {
        const phrases = db.getPhrasesData();
        this.container.innerHTML = `
            <h2 class="section-title">Frases de Amor</h2>
            <div class="phrases-container">
                <div class="phrase-card">
                    <p id="phrase-text">${phrases[this.currentPhrase]}</p>
                </div>
                
                <div class="phrase-nav">
                    <button id="prevPhrase"><i class="fas fa-arrow-left"></i> Anterior</button>
                    <button id="nextPhrase">Siguiente <i class="fas fa-arrow-right"></i></button>
                </div>
            </div>
        `;
    }

    showPhrase(index) {
        const phrases = db.getPhrasesData();
        if (index >= 0 && index < phrases.length) {
            this.currentPhrase = index;
            document.getElementById('phrase-text').textContent = phrases[this.currentPhrase];
        }
    }

    setupEventListeners() {
        document.getElementById('prevPhrase').addEventListener('click', () => {
            let newIndex = this.currentPhrase - 1;
            if (newIndex < 0) newIndex = db.getPhrasesData().length - 1;
            this.showPhrase(newIndex);
        });
        
        document.getElementById('nextPhrase').addEventListener('click', () => {
            let newIndex = this.currentPhrase + 1;
            if (newIndex >= db.getPhrasesData().length) newIndex = 0;
            this.showPhrase(newIndex);
        });
    }
}

export default PhrasesComponent;