import { db } from './db.js';
import MenuController from './components/menu.js';
import NoteComponent from './components/note.js';
import GalleryComponent from './components/gallery.js';
import MusicPlayer from './components/music.js';
import PhrasesComponent from './components/phrases.js';
import MemoriesComponent from './components/memories.js';
import DecorationComponent from './components/decoration.js';

document.addEventListener('DOMContentLoaded', async () => {
    document.body.innerHTML += `
        <div id="loader">
            <div class="spinner"></div>
            <p>Cargando tu regalo especial...</p>
        </div>
    `;
    
    try {
        await db.loadData();
        
        new MenuController();
        new NoteComponent();
        new GalleryComponent();
        new MusicPlayer();
        new PhrasesComponent();
        new MemoriesComponent();
        new DecorationComponent();
        
        document.getElementById('loader').style.display = 'none';
    } catch (error) {
        console.error("Error inicializando:", error);
        document.getElementById('loader').innerHTML = `
            <p>Ocurrió un error. Por favor recarga.</p>
            <button onclick="window.location.reload()">Reintentar</button>
        `;
    }
});