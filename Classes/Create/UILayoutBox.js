class UILayoutBox {
    constructor(logic, name = "Layout Box") {
        this.logic = logic;
        this.name = name;

        this.container = this.createContainer();
        this.setupDragging();
        this.updatePosition();
        this.updateSize();
        this.updateStyles();
    }

    createContainer() {
        const div = document.createElement('div');
        div.classList.add('ui-layout-box');
        div.style.position = 'absolute';
        div.style.boxSizing = 'border-box';
        div.style.display = 'flex';
        div.style.flexDirection = 'column';
        div.style.border = '2px solid black';
        div.style.borderRadius = '4px';
        div.style.backgroundColor = 'rgba(255,255,255,0.85)';
        div.style.boxShadow = '2px 2px 6px rgba(0,0,0,0.3)';
        div.style.overflow = 'hidden';

        // HEADER
        const header = document.createElement('div');
        header.style.backgroundColor = '#ddd';
        header.style.padding = '2px 6px';
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.cursor = 'move';
        header.style.userSelect = 'none';

        const label = document.createElement('span');
        label.style.fontSize = '12px';
        label.style.color = '#000';
        label.style.opacity = '0.8';
        label.textContent = this.name;

        const headerTools = document.createElement('div');
        headerTools.style.display = 'flex';
        headerTools.style.alignItems = 'center';
        headerTools.style.gap = '4px';

        // Color & Border Controls
        const bgColor = document.createElement('input');
        bgColor.type = 'color';
        bgColor.value = this.logic.backgroundColor || '#ffffff';
        bgColor.title = 'Background Color';
        bgColor.addEventListener('input', e => {
            this.logic.backgroundColor = e.target.value;
            this.updateStyles();
        });

        const borderColor = document.createElement('input');
        borderColor.type = 'color';
        borderColor.value = this.logic.borderColor || '#000000';
        borderColor.title = 'Border Color';
        borderColor.addEventListener('input', e => {
            this.logic.borderColor = e.target.value;
            this.updateStyles();
        });

        const borderWidth = document.createElement('input');
        borderWidth.type = 'number';
        borderWidth.value = parseInt(this.logic.borderWidth) || 2;
        borderWidth.title = 'Border Width';
        borderWidth.style.width = '35px';
        borderWidth.style.fontSize = '10px';
        borderWidth.addEventListener('input', e => {
            this.logic.borderWidth = parseInt(e.target.value) || 0;
            this.updateStyles();
        });



        var openAppearanceWindow = () => {
            const win = new WindowContainer(`Appearance: ${this.name}`, true, {
                width: 220,
                height: 180,
                offsetTop: 100,
                offsetLeft: 100
            });
        
            const content = document.createElement('div');
            content.style.display = 'flex';
            content.style.flexDirection = 'column';
            content.style.gap = '8px';
        
            content.innerHTML = `
                <label>Background Color:</label>
                <input type="color" value="${this.logic.backgroundColor || '#ffffff'}">
                <label>Border Color:</label>
                <input type="color" value="${this.logic.borderColor || '#000000'}">
                <label>Border Width:</label>
                <input type="number" value="${parseInt(this.logic.borderWidth) || 2}" min="0" style="width: 50px">
            `;
        
            const [bgInput, borderInput, borderWidthInput] = content.querySelectorAll('input');
        
            bgInput.addEventListener('input', e => {
                this.logic.backgroundColor = e.target.value;
                this.updateStyles();
            });
        
            borderInput.addEventListener('input', e => {
                this.logic.borderColor = e.target.value;
                this.updateStyles();
            });
        
            borderWidthInput.addEventListener('input', e => {
                this.logic.borderWidth = parseInt(e.target.value) || 0;
                this.updateStyles();
            });
        
            win.appendContent(content);
        }
        
        const appearanceBtn = document.createElement('button');
        appearanceBtn.textContent = '⚙️';
        appearanceBtn.style.background = 'none';
        appearanceBtn.style.border = 'none';
        appearanceBtn.style.cursor = 'pointer';
        appearanceBtn.style.opacity = '0.6';
        appearanceBtn.style.fontSize = '12px';
        appearanceBtn.title = 'Appearance Settings';
        
        appearanceBtn.addEventListener('mouseenter', () => appearanceBtn.style.opacity = '1');
        appearanceBtn.addEventListener('mouseleave', () => appearanceBtn.style.opacity = '0.6');
        appearanceBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openAppearanceWindow();
        });
        
        headerTools.appendChild(appearanceBtn);

        header.appendChild(label);
        header.appendChild(headerTools);
        div.appendChild(header);

        // Content
        this.content = document.createElement('div');
        this.content.classList.add('ui-layout-content');
        this.content.style.flex = '1';
        this.content.style.position = 'relative';
        this.content.style.width = '100%';
        this.content.style.height = '100%';

        div.appendChild(this.content);

        // Resize Handle
        const resizeHandle = document.createElement('div');
        resizeHandle.style.width = '10px';
        resizeHandle.style.height = '10px';
        resizeHandle.style.background = '#333';
        resizeHandle.style.position = 'absolute';
        resizeHandle.style.right = '0';
        resizeHandle.style.bottom = '0';
        resizeHandle.style.cursor = 'se-resize';
        resizeHandle.title = 'Resize';

        this.setupResizeEvents(resizeHandle);
        div.appendChild(resizeHandle);

        return div;
    }

    setupDragging() {
        let offsetX, offsetY;
        const header = this.container.firstChild;
        header.addEventListener('mousedown', e => {
            e.preventDefault();
            offsetX = e.clientX;
            offsetY = e.clientY;

            const onMouseMove = (moveEvent) => {
                const dx = moveEvent.clientX - offsetX;
                const dy = moveEvent.clientY - offsetY;

                offsetX = moveEvent.clientX;
                offsetY = moveEvent.clientY;

                const rect = this.container.getBoundingClientRect();
                const parent = this.container.parentElement.getBoundingClientRect();

                const leftPercent = ((rect.left - parent.left + dx) / parent.width) * 100;
                const topPercent = ((rect.top - parent.top + dy) / parent.height) * 100;

                this.logic.containerLeft = Math.max(0, Math.min(leftPercent, 100 - this.logic.containerWidth));
                this.logic.containerTop = Math.max(0, Math.min(topPercent, 100 - this.logic.containerHeight));

                this.updatePosition();
            };

            const onMouseUp = () => {
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
            };

            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        });
    }

    setupResizeEvents(handle) {
        handle.addEventListener('mousedown', e => {
            e.preventDefault();
    
            const parent = this.container.parentElement.getBoundingClientRect();
    
            const onMouseMove = (moveEvent) => {
                const left = this.container.offsetLeft;
                const top = this.container.offsetTop;
    
                const newWidthPx = moveEvent.clientX - parent.left - left;
                const newHeightPx = moveEvent.clientY - parent.top - top;
    
                const widthPercent = (newWidthPx / parent.width) * 100;
                const heightPercent = (newHeightPx / parent.height) * 100;
    
                this.logic.containerWidth = Math.max(5, Math.min(widthPercent, 100 - this.logic.containerLeft));
                this.logic.containerHeight = Math.max(5, Math.min(heightPercent, 100 - this.logic.containerTop));
    
                this.updateSize();
            };
    
            const onMouseUp = () => {
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
            };
    
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        });
    }
    

    updatePosition() {
        this.container.style.left = `${this.logic.containerLeft}%`;
        this.container.style.top = `${this.logic.containerTop}%`;
    }

    updateSize() {
        this.container.style.width = `${this.logic.containerWidth}%`;
        this.container.style.height = `${this.logic.containerHeight}%`;
    }

    updateStyles() {
        this.container.style.backgroundColor = this.logic.backgroundColor || 'transparent';
        this.container.style.borderColor = this.logic.borderColor || 'black';
        this.container.style.borderWidth = `${this.logic.borderWidth || 2}px`;
    }

    setContent(node) {
        this.content.innerHTML = '';
        this.content.appendChild(node);
    }
}
