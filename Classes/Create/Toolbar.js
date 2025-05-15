class Toolbar {
    constructor(containerElement, targetElement) {
        this.container = document.createElement('div');
        this.container.classList.add('toolbar');
        containerElement.appendChild(this.container);

        this.tools = [];
        this.activeTool = 'select';
        this.target = targetElement;

        this.target.addEventListener('mouseenter', () => {
            if (this.activeTool) {
                this.setCursor(this.activeTool);
                console.log(this.activeTool);
            }
        });
        this.target.addEventListener('mouseleave', () => {
            this.target.style.cursor = 'default';
        });
    }

    addTool(mainTool, subTools = []) {
        const toolButton = new ToolButton(mainTool, subTools, (toolID) => {
            this.setActiveTool(toolButton);
        });

        this.container.appendChild(toolButton.element);
        this.tools.push(toolButton);

        if (!this.activeTool) {
            this.setActiveTool(toolButton);
        }
    }

    setActiveTool(toolButton) {
        this.tools.forEach(t => t.setSelected(false));
        toolButton.setSelected(true);
        this.activeTool = toolButton.getTool();
        this.setCursor(this.activeTool);
    }

    setCursor(toolID) {
        this.target.style.cursor = `url(images/${toolID}_cursor.png) 16 16, auto`;
        console.log(this.target.style.cursor)
    }

    getActiveTool() {
        return this.activeTool;
    }
}
