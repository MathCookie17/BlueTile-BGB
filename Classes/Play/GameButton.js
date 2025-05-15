class GameButton {
    constructor(logicalButton) {
        this.logical = logicalButton;

        this.container = new GameElementContainer({
            containerWidth: logicalButton.containerWidth === -1 ? 10 : logicalButton.containerWidth,
            containerHeight: logicalButton.containerHeight === -1 ? 6 : logicalButton.containerHeight,
            containerTop: logicalButton.containerTop === -1 ? 5 : logicalButton.containerTop,
            containerLeft: logicalButton.containerLeft === -1 ? 5 : logicalButton.containerLeft,
            borderColor: logicalButton.borderColor,
            borderWidth: logicalButton.borderWidth,
            backgroundColor: logicalButton.backgroundColor,
            enableScrollBars: false,
            enableZoom: false
        });

        this.button = document.createElement('button');
        this.button.style.width = '100%';
        this.button.style.height = '100%';
        this.button.style.fontFamily = 'inherit';
        this.button.style.fontWeight = 'bold';
        this.button.style.fontSize = '14px';
        this.button.style.cursor = 'pointer';
        this.button.style.boxSizing = 'border-box';
        this.button.style.userSelect = 'none';

        this.button.addEventListener('click', () => {
            console.log('click button: ', this.logical.name)
            if (this.logical.buttonVisible()) {
                this.logical.clickButton(true);
            }
        });

        this.container.addContent(this.button);
        document.body.appendChild(this.container.getElement());

        this.refresh();
    }

    refresh() {
        const visible = this.logical.buttonVisible();
        const s = this.logical.sprite;

        // Option A: Full hide (uncomment to hide instead of disable)
        this.container.getElement().style.display = visible ? 'block' : 'none';

        // Option B: Just disable and grey it out
        this.button.disabled = !visible;
        this.button.style.opacity = visible ? '1' : '0.5';
        this.button.style.pointerEvents = visible ? 'auto' : 'none';

        this.button.style.backgroundColor = s.fillColor;
        this.button.style.color = s.textColor;
        this.button.style.border = `2px solid ${s.borderColor}`;
        this.button.style.borderRadius = s.borderRadius;
        this.button.textContent = s.text;
    }

    update(){
        this.refresh();
    }
    getElement() {
        return this.container.getElement();
    }
}
