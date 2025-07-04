class DecorationComponent {
    constructor() {
        this.createHearts();
    }

    createHearts() {
        const heartsContainer = document.getElementById('hearts');
        for (let i = 0; i < 20; i++) {
            const heart = document.createElement('div');
            heart.classList.add('heart');
            heart.innerHTML = '❤️';
            heart.style.left = `${Math.random() * 100}%`;
            heart.style.top = `${Math.random() * 100}%`;
            heart.style.fontSize = `${Math.random() * 20 + 10}px`;
            heart.style.animationDuration = `${Math.random() * 4 + 3}s`;
            heartsContainer.appendChild(heart);
        }
    }
}

export default DecorationComponent;