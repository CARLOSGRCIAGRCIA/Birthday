import { db } from '../db.js';

class MemoriesComponent {
    constructor() {
        this.container = document.getElementById('memories-container');
        this.render();
    }

    render() {
        const memoriesData = db.getMemoriesData();
        
        this.container.innerHTML = `
            <h2 class="section-title">Nuestra Historia</h2>
            <div class="memories-timeline">
                ${memoriesData.map(memory => `
                    <div class="memory-item">
                        <div class="memory-date">${memory.date}</div>
                        <h3 class="memory-title">${memory.title}</h3>
                        ${memory.image ? `<img src="${memory.image}" alt="${memory.title}" class="memory-image">` : ''}
                        <p class="memory-description">${memory.description}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

export default MemoriesComponent;