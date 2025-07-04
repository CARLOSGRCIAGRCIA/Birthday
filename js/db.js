class Database {
    constructor() {
        this.data = {
            note: {},
            gallery: [],
            music: [],
            phrases: [],
            memories: []
        };
    }

    async loadData() {
        try {
            const responses = await Promise.all([
                fetch('data/config.json'),
                fetch('data/gallery.json'),
                fetch('data/music.json'),
                fetch('data/phrases.json'),
                fetch('data/memories.json')
            ]);

            const [config, gallery, music, phrases, memories] = await Promise.all(
                responses.map(r => r.json())
            );

            this.data = {
                note: config.note,
                gallery,
                music,
                phrases,
                memories
            };

            this.loadLocalStorageData();
            return this.data;
        } catch (error) {
            console.error("Error loading data:", error);
            return this.getDefaultData();
        }
    }

    loadLocalStorageData() {
        const savedNote = localStorage.getItem('personalizedNote');
        if (savedNote) {
            this.data.note.customText = savedNote;
        }
    }

    saveNote(text) {
        this.data.note.customText = text;
        localStorage.setItem('personalizedNote', text);
    }

    getNoteData() {
        return this.data.note;
    }

    getGalleryData() {
        return this.data.gallery;
    }

    getMusicData() {
        return this.data.music;
    }

    getPhrasesData() {
        return this.data.phrases;
    }

    getMemoriesData() {
        return this.data.memories;
    }

    getDefaultData() {
        return {
            note: { defaultText: "¡Feliz Cumpleaños! Mensaje predeterminado..." },
            gallery: [],
            music: [],
            phrases: [],
            memories: []
        };
    }
}

export const db = new Database();