class UIButtonEditor {
    constructor() {
        this.buttons = [];
        this.window = null;
        this.toolbar = this.createToolbar();
        this.buttonContainer = this.createContainer();
        this.createWindow();
    }

    createToolbar() {
        const toolbar = document.createElement('div');
        toolbar.classList.add('toolbar');
        toolbar.style.display = 'flex';
        toolbar.style.padding = '5px';

        const addBtn = document.createElement('button');
        addBtn.textContent = 'Add Button';
        addBtn.onclick = () => {
            const newName = this.generateUniqueName("New Button");
            const logical = new Button();
            logical.name = newName;
            this.addButton(logical);
        };

        toolbar.appendChild(addBtn);
        return toolbar;
    }

    createContainer() {
        const container = document.createElement('div');
        container.style.width = '100%';
        container.style.height = '250px';
        container.style.border = '1px solid #aaa';
        container.style.overflow = 'auto';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '5px';
        return container;
    }

    createWindow() {
        const win = new WindowContainer("Button Editor", true, {
            width: 400,
            height: 400,
            offsetTop: 60,
            offsetLeft: 300
        });
        this.window = win;
        this.window.beforeClose = () => this.window = null;
        win.appendContent(this.toolbar);
        win.appendContent(this.buttonContainer);
    }

    generateUniqueName(base) {
        let index = 1;
        let name = base;
        const nameExists = (n) => this.buttons.some(b => b.button.name === n);
        while (nameExists(name)) {
            name = `${base} ${index++}`;
        }
        return name;
    }
    
    addButton(logicalButton, frontHide = false) {
        const ui = new UIButton(logicalButton);
        if (frontHide) this.buttons.unshift(ui);
        else this.buttons.push(ui);
        if (!frontHide) this.buttonContainer.appendChild(ui.container);
    }

    duplicateButton(ui) {
        const newBtn = structuredClone(ui.button);
        newBtn.name = this.generateUniqueName(`${ui.button.name} Copy`);
        this.addButton(newBtn);
    }

    removeButton(ui) {
        this.buttons = this.buttons.filter(b => b !== ui);
        if (ui.container?.parentElement) {
            ui.container.remove();
        }
    }

    moveButtonUp(ui) {
        const index = this.buttons.indexOf(ui);
        if (index > 0) {
            this.buttons.splice(index, 1);
            this.buttons.splice(index - 1, 0, ui);
            this.buttonContainer.insertBefore(ui.container, this.buttonContainer.children[index - 1]);
        }
    }

    moveButtonDown(ui) {
        const index = this.buttons.indexOf(ui);
        if (index < this.buttons.length - 1) {
            this.buttons.splice(index, 1);
            this.buttons.splice(index + 1, 0, ui);
            this.buttonContainer.insertBefore(this.buttonContainer.children[index + 1], ui.container);
        }
    }
}
