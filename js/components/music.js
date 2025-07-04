import { db } from '../db.js';

class MusicPlayer {
    constructor() {
        this.container = document.getElementById('music-container');
        this.audioPlayer = document.getElementById('audioPlayer');
        this.currentSongIndex = 0;
        this.isPlaying = false;
        this.render();
        this.setupEventListeners();
    }

    render() {
        const musicData = db.getMusicData();
        this.container.innerHTML = `
            <h2 class="section-title">Música Especial</h2>
            <div class="music-player">
                <div id="songs-list">
                    ${musicData.map((song, index) => `
                        <div class="song ${index === 0 ? 'active' : ''}" data-song="${song.id}">
                            <i class="fas fa-music"></i>
                            <span>${song.title}</span>
                        </div>
                    `).join('')}
                </div>
                
                <div class="controls">
                    <button id="prevBtn"><i class="fas fa-step-backward"></i></button>
                    <button id="playBtn"><i class="fas fa-play"></i></button>
                    <button id="nextBtn"><i class="fas fa-step-forward"></i></button>
                </div>
            </div>
        `;
        
        this.changeSong(0);
    }

    changeSong(index) {
        const songs = document.querySelectorAll('.song');
        songs.forEach(song => song.classList.remove('active'));
        songs[index].classList.add('active');
        
        const musicData = db.getMusicData();
        this.audioPlayer.src = musicData[index].src;
        this.currentSongIndex = index;
        
        if (this.isPlaying) {
            this.play();
        }
    }

    play() {
        this.audioPlayer.play()
            .then(() => {
                this.isPlaying = true;
                document.getElementById('playBtn').innerHTML = '<i class="fas fa-pause"></i>';
            })
            .catch(error => console.error("Error al reproducir:", error));
    }

    pause() {
        this.audioPlayer.pause();
        this.isPlaying = false;
        document.getElementById('playBtn').innerHTML = '<i class="fas fa-play"></i>';
    }

    setupEventListeners() {
        document.getElementById('playBtn').addEventListener('click', () => {
            if (this.isPlaying) {
                this.pause();
            } else {
                this.play();
            }
        });
        
        document.getElementById('prevBtn').addEventListener('click', () => {
            let newIndex = this.currentSongIndex - 1;
            if (newIndex < 0) newIndex = db.getMusicData().length - 1;
            this.changeSong(newIndex);
        });
        
        document.getElementById('nextBtn').addEventListener('click', () => {
            let newIndex = this.currentSongIndex + 1;
            if (newIndex >= db.getMusicData().length) newIndex = 0;
            this.changeSong(newIndex);
        });
        
        document.querySelectorAll('.song').forEach((song, index) => {
            song.addEventListener('click', () => {
                this.changeSong(index);
            });
        });
    }
}

export default MusicPlayer;