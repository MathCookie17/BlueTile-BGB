class GamePiece {
    constructor(logicalPiece) {

        // console.log(logicalPiece)
        this.logical = logicalPiece;
        this.container = document.createElement('div');

        this.container.classList.add('board-piece');
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        this.container.style.position = 'relative';
        this.container.style.pointerEvents = 'auto';
        this.container.style.zIndex = 4;
        this.container.style.display = 'flex';
        this.container.style.alignItems = 'center';
        this.container.style.justifyContent = 'center';
        this.container.style.cursor = 'pointer';

        this.buildContents();
    }

    buildContents() {
        const sprite = this.logical.sprite;
        this.container.innerHTML = '';

        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.width = '100%';
        wrapper.style.height = '100%';

        // SVG overlay
        if (sprite.imageName && SPRITE_LIBRARY[sprite.imageName]) {
            const temp = document.createElement('div');
            temp.innerHTML = SPRITE_LIBRARY[sprite.imageName];
            const svg = temp.querySelector('svg');

            if (svg) {
                svg.setAttribute('width', '100%');
                svg.setAttribute('height', '100%');
                svg.style.display = 'block';
                svg.style.pointerEvents = 'none';

                svg.querySelectorAll('[fill]').forEach(el => {
                    el.setAttribute('fill', sprite.fillColor || '#000');
                });

                wrapper.appendChild(svg);
            }
        }

        // Text overlay
        if (sprite.text) {
            const text = document.createElement('div');
            text.textContent = sprite.text;
            text.style.position = 'absolute';
            text.style.top = '50%';
            text.style.left = '50%';
            text.style.transform = 'translate(-50%, -50%)';
            text.style.color = sprite.textColor || '#000';
            text.style.fontSize = '10px';
            text.style.fontWeight = 'bold';
            text.style.pointerEvents = 'none';
            wrapper.appendChild(text);
        }

        this.container.appendChild(wrapper);
        this.container.addEventListener('click', () => {
                console.log('click piece: ', this.logical.name)
                this.logical.clickObject(true);
        });

    }

    getElement() {
        return this.container;
    }



    delete() {
        if (this.container.parentElement) {
            this.container.remove();
        }
    }
}
