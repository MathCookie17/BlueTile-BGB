class ToolButton {
    constructor(mainTool, subTools = [], onSelect) {
        this.mainTool = mainTool;
        this.subTools = subTools;
        this.currentTool = mainTool;
        this.onSelect = onSelect;

        this.element = document.createElement('div');
        this.element.classList.add('tool-button');
        this.element.style.backgroundImage = `url(images/${mainTool}.png)`;
        this.element.dataset.tool = mainTool;

        this.submenu = null;

        this.element.addEventListener('click', (e) => {
            this.selectTool(this.currentTool);
        });

        this.element.addEventListener('contextmenu', (e) => {

            console.log('help')
            e.preventDefault();
            if (this.subTools.length === 0) return;
            this.toggleSubmenu();
        });

        if (subTools.length > 0) {
            this.createSubmenu();
        }


    }

    createSubmenu() {
        this.submenu = document.createElement('div');
        this.submenu.classList.add('subtool-menu');
        console.log("what")
        const allTools = [this.mainTool, ...this.subTools];
        allTools.forEach(tool => {
            const btn = document.createElement('div');
            btn.classList.add('tool-button');
            btn.style.backgroundImage = `url(images/${tool}.png)`;
            btn.dataset.tool = tool;

            btn.addEventListener('click', () => {
                this.selectTool(tool);
                this.hideSubmenu();
            });

            this.submenu.appendChild(btn);
        });

        this.element.appendChild(this.submenu);
    }

    selectTool(tool) {
        this.currentTool = tool;
        this.element.style.backgroundImage = `url(images/${tool}.png)`;
        this.element.dataset.tool = tool;
        this.onSelect(tool);
    }

    toggleSubmenu() {
        if (this.submenu.style.display === 'flex') {
            this.hideSubmenu();
        } else {
            this.showSubmenu();
        }
    }

    showSubmenu() {
        this.submenu.style.display = 'flex';
    }

    hideSubmenu() {
        this.submenu.style.display = 'none';
    }

    setSelected(state) {
        this.element.classList.toggle('selected', state);
    }

    getTool() {
        return this.currentTool;
    }
}

