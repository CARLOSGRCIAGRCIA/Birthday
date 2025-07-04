import { db } from '../db.js';

class GalleryComponent {
    constructor() {
        this.container = document.getElementById('gallery-container');
        this.render();
    }

    render() {
        const galleryData = db.getGalleryData();
        
        this.container.innerHTML = `
            <h2 class="section-title">Nuestros Recuerdos</h2>
            <div class="gallery">
                ${galleryData.map(item => `
                    <div class="gallery-item">
                        <img src="${item.url}" alt="${item.title}" loading="lazy">
                        <div class="gallery-caption">${item.title}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

export default GalleryComponent;