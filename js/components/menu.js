class MenuController {
    constructor() {
        this.menuItems = document.querySelectorAll('.menu-item');
        this.sections = document.querySelectorAll('.section');
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.menuItems.forEach(item => {
            item.addEventListener('click', () => this.switchSection(item));
        });
    }

    switchSection(selectedItem) {
        this.menuItems.forEach(item => item.classList.remove('active'));
        selectedItem.classList.add('active');
        this.sections.forEach(section => section.classList.remove('active'));
        const target = selectedItem.getAttribute('data-target');
        document.getElementById(target).classList.add('active');
    }
}

export default MenuController;