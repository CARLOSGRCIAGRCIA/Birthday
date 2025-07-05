import { db } from '../db.js';

class GalleryComponent {
    constructor() {
        this.container = document.getElementById('gallery-container');
        this.render();
        this.setupLightbox();
    }

    render() {
        const galleryData = db.getGalleryData();
        
        this.container.innerHTML = `
            <h2 class="section-title">Nuestros Recuerdos</h2>
            <div class="gallery-grid">
                ${galleryData.map(item => this.renderMediaItem(item)).join('')}
            </div>
            <div class="lightbox" id="lightbox">
                <div class="lightbox-content">
                    <span class="close-btn">&times;</span>
                    <div class="media-container" id="media-container"></div>
                    <div class="lightbox-caption" id="lightbox-caption"></div>
                </div>
            </div>
        `;
    }

    renderMediaItem(item) {
        if (item.type === 'video') {
            return `
                <div class="gallery-item" data-type="video" data-src="${item.url}" data-title="${item.title}">
                    <video muted loop playsinline>
                        <source src="${item.url}" type="video/mp4">
                    </video>
                    <div class="play-icon"></div>
                    <div class="gallery-caption">${item.title}</div>
                </div>
            `;
        } else {
            return `
                <div class="gallery-item" data-type="image" data-src="${item.url}" data-title="${item.title}">
                    <img src="${item.url}" alt="${item.title}" loading="lazy">
                    <div class="gallery-caption">${item.title}</div>
                </div>
            `;
        }
    }

    setupLightbox() {
        const lightbox = document.getElementById('lightbox');
        const mediaContainer = document.getElementById('media-container');
        const caption = document.getElementById('lightbox-caption');
        const closeBtn = document.querySelector('.close-btn');
        const items = document.querySelectorAll('.gallery-item');

        items.forEach(item => {
            item.addEventListener('click', () => {
                const type = item.dataset.type;
                const src = item.dataset.src;
                const title = item.dataset.title;

                mediaContainer.innerHTML = '';
                if (type === 'video') {
                    mediaContainer.innerHTML = `
                        <video controls autoplay>
                            <source src="${src}" type="video/mp4">
                        </video>
                    `;
                } else {
                    mediaContainer.innerHTML = `<img src="${src}" alt="${title}">`;
                }

                caption.textContent = title;
                lightbox.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            });
        });

        closeBtn.addEventListener('click', () => {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
            
            const videos = mediaContainer.querySelectorAll('video');
            videos.forEach(video => video.pause());
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
}

export default GalleryComponent;