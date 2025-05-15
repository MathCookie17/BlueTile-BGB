class UILayoutEditor {
    constructor() {
        this.container = this.createOverlayContainer();
        this.layoutBoxes = [];
        this.globalBox = null;
        this.isOpen = false;
    }

    createOverlayContainer() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100vw';
        container.style.height = '100vh';
        container.style.backgroundColor = 'rgba(255, 255, 255, 1.0)';
        container.style.zIndex = '-1';
        container.style.display = 'none';
        document.body.appendChild(container);
        return container;
    }

    initLayoutBoxes() {
        this.layoutBoxes = [];

        // Rebuild layout boxes live every time
        this.layoutBoxes.push(new UILayoutBox(boardEditor.board, 'Board'));
        // this.layoutBoxes.push(new UILayoutBox(playerInventories, 'Inventory'));

        buttonEditor.buttons.forEach(b => {
            this.layoutBoxes.push(new UILayoutBox(b.button, `Button: ${b.button.name}`));
        });

        this.globalBox = new UILayoutBox(globals, 'Global Variables');
        this.addGlobalVariablesForm(this.globalBox);
        this.layoutBoxes.push(this.globalBox);

        this.layoutBoxes.push(new UILayoutBox(titledesc, 'Title and Description'));

        this.container.innerHTML = '';
        this.layoutBoxes.forEach(box => this.container.appendChild(box.container));
    }

    addGlobalVariablesForm(globalBox) {
        globalBox.container.querySelector('.global-vars-form')?.remove();
    
        const form = document.createElement('form');
        form.classList.add('global-vars-form');
        form.style.display = 'flex';
        form.style.flexDirection = 'column';
        form.style.gap = '10px';
        form.style.overflowY = 'auto';
        form.style.maxHeight = '80%';
    
        const availableTitle = document.createElement('h3');
        availableTitle.textContent = 'Available Variables';
        form.appendChild(availableTitle);
    
        const availableList = document.createElement('ul');
        availableList.style.paddingLeft = '10px';
    
        // Available vars NOT already displayed
        globalEditor.globalVariables.forEach(v => {
            if (!globals.displayVariables.includes(v.name)) {
                const li = document.createElement('li');
                li.textContent = v.name;
                const addBtn = document.createElement('button');
                addBtn.textContent = '+';
                addBtn.type = 'button';
                addBtn.addEventListener('click', () => {
                    globals.displayVariables.push(v.name);
                    this.addGlobalVariablesForm(globalBox);
                });
                li.appendChild(addBtn);
                availableList.appendChild(li);
            }
        });
    
        form.appendChild(availableList);
    
        const displayTitle = document.createElement('h3');
        displayTitle.textContent = 'Displayed Variables';
        form.appendChild(displayTitle);
    
        const displayList = document.createElement('ul');
        displayList.style.paddingLeft = '10px';
    
        globals.displayVariables.forEach((name, index) => {
            const li = document.createElement('li');
            li.textContent = name;
    
            const upBtn = document.createElement('button');
            upBtn.textContent = '↑';
            upBtn.type = 'button';
            upBtn.disabled = index === 0;
            upBtn.addEventListener('click', () => {
                [globals.displayVariables[index - 1], globals.displayVariables[index]] = 
                [globals.displayVariables[index], globals.displayVariables[index - 1]];
                this.addGlobalVariablesForm(globalBox);
            });
    
            const downBtn = document.createElement('button');
            downBtn.textContent = '↓';
            downBtn.type = 'button';
            downBtn.disabled = index === globals.displayVariables.length - 1;
            downBtn.addEventListener('click', () => {
                [globals.displayVariables[index + 1], globals.displayVariables[index]] = 
                [globals.displayVariables[index], globals.displayVariables[index + 1]];
                this.addGlobalVariablesForm(globalBox);
            });
    
            const removeBtn = document.createElement('button');
            removeBtn.textContent = '✕';
            removeBtn.type = 'button';
            removeBtn.addEventListener('click', () => {
                globals.displayVariables.splice(index, 1);
                this.addGlobalVariablesForm(globalBox);
            });
    
            li.appendChild(upBtn);
            li.appendChild(downBtn);
            li.appendChild(removeBtn);
            displayList.appendChild(li);
        });
    
        form.appendChild(displayList);
        globalBox.setContent(form);

    }
    
    open() {
        this.initLayoutBoxes();
        this.isOpen = true;
        this.container.style.display = 'block';
        this.container.style.zIndex = ++__windowZIndex;
    
        // Auto hide boxes with -1 -1 -1 -1
        this.layoutBoxes.forEach(box => {
            const l = box.logic;
            if (l.containerWidth === -1 && l.containerHeight === -1 && l.containerTop === -1 && l.containerLeft === -1) {
                box.container.style.display = 'none';
            }
        });
    }
    
    showBox(label) {
        const box = this.layoutBoxes.find(b => b.name === label);
        if (box) {
            const l = box.logic;
            l.containerWidth = 1;
            l.containerHeight = 1;
            l.containerTop = 1;
            l.containerLeft = 1;
            box.updatePosition();
            box.updateSize();
            box.container.style.display = 'block';
        }
    }
    
    hideBox(label) {
        const box = this.layoutBoxes.find(b => b.name === label);
        if (box) {
            const l = box.logic;
            l.containerWidth = -1;
            l.containerHeight = -1;
            l.containerTop = -1;
            l.containerLeft = -1;
            box.container.style.display = 'none';
        }
    }
    

    close() {
        this.isOpen = false;
        this.container.style.display = 'none';
    }
}
