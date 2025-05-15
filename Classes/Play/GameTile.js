class GameTile {
    constructor(logicalTile, boardShape, tileSize) {
        this.logical = logicalTile;
        this.boardShape = boardShape;
        this.pieceWrapper = null;

        this.borderContainer = document.createElement('div');
        this.borderContainer.classList.add('game-tile');
        this.borderContainer.style.position = 'absolute';
        this.borderContainer.style.width = `${tileSize}px`;
        this.borderContainer.style.height = `${tileSize}px`;
        this.borderContainer.style.boxSizing = 'border-box';
        this.borderContainer.style.cursor = 'pointer';
        this.borderContainer.style.overflow = 'hidden';
        this.borderContainer.style.backgroundColor = "#000";
        if (boardShape === "Square") {
            this.borderContainer.style.left = `${this.logical.xCoordinate * tileSize}px`;
            this.borderContainer.style.top = `${this.logical.yCoordinate * tileSize}px`
        }
        if (boardShape === "Hex") {
            this.borderContainer.classList.add('hexagon-clip');
            this.borderContainer.style.left = `${(this.logical.xCoordinate + this.logical.yCoordinate / 2) * tileSize * Math.sqrt(3)/2}px`;
            this.borderContainer.style.top = `${this.logical.yCoordinate * tileSize * 3/4}px`
        }
        else if (boardShape === "Triangle") {
            if (this.logical.xCoordinate % 2 === 0) this.borderContainer.classList.add('triangle-down-clip');
            else this.borderContainer.classList.add('triangle-up-clip');
            this.borderContainer.style.left = `${(this.logical.xCoordinate + this.logical.yCoordinate) * tileSize * Math.sqrt(3)/4}px`;
            this.borderContainer.style.top = `${this.logical.yCoordinate * tileSize * 3/4}px`
        }

        this.borderContainer2 = document.createElement('div');
        this.borderContainer2.classList.add('game-tile');
        this.borderContainer2.style.position = 'absolute';
        this.borderContainer2.style.width = "100%";
        this.borderContainer2.style.height = "100%";
        this.borderContainer2.style.left = "0";
        this.borderContainer2.style.top = "0";
        this.borderContainer2.style.backgroundColor = this.logical.sprite.fillColor || '#ccc';
        this.borderContainer2.style.opacity = "0.8";
        if (boardShape === "Hex") {
            this.borderContainer2.classList.add('hexagon-clip');
        }
        else if (boardShape === "Triangle") {
            if (this.logical.xCoordinate % 2 === 0) this.borderContainer2.classList.add('triangle-down-clip');
            else this.borderContainer2.classList.add('triangle-up-clip');
        }
        this.borderContainer.appendChild(this.borderContainer2);

        this.container = document.createElement('div');
        this.container.classList.add('game-tile');
        this.container.style.position = 'absolute';
        this.container.style.width = "98%";
        this.container.style.height = "98%";
        this.container.style.left = "1%";
        this.container.style.top = "1%";
        this.container.style.backgroundColor = this.logical.sprite.fillColor || '#ccc';
        if (boardShape === "Hex") {
            this.container.classList.add('hexagon-clip');
        }
        else if (boardShape === "Triangle") {
            if (this.logical.xCoordinate % 2 === 0) this.container.classList.add('triangle-down-clip');
            else this.container.classList.add('triangle-up-clip');
        }
        this.borderContainer.appendChild(this.container);

        this.container.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('click tile: x-', this.logical.xCoordinate, ' y-', this.logical.yCoordinate);
            this.logical.clickObject(true);
        });

        this.refresh();
    }

    refresh() {
        const el = this.container;
        el.innerHTML = '';
        el.style.backgroundColor = this.logical.sprite.fillColor || '#ccc';
        this.borderContainer.style.opacity = this.logical.enabled === false ? '0.4' : '1';

        // SVG overlay
        if (this.logical.sprite.imageName && SPRITE_LIBRARY[this.logical.sprite.imageName]) {
            const wrapper = document.createElement('div');
            wrapper.style.position = 'absolute';
            wrapper.style.top = '0';
            wrapper.style.left = '0';
            wrapper.style.width = '100%';
            wrapper.style.height = '100%';
            wrapper.style.pointerEvents = 'none';
            wrapper.style.zIndex = 1;

            if (this.boardShape === "Square") {
                wrapper.style.top = '0';
                wrapper.style.left = '0';
                wrapper.style.width = '100%';
                wrapper.style.height = '100%';
            }
            else if (this.boardShape === "Hex") {
                wrapper.style.top = '17.5%';
                wrapper.style.left = '17.5%';
                wrapper.style.width = '65%';
                wrapper.style.height = '65%';
            }
            else if (this.boardShape === "Triangle") {
                wrapper.style.left = '30%';
                if (this.logical.xCoordinate % 2 === 0) wrapper.style.top = '12.5%';
                else wrapper.style.top = '37.5%';
                wrapper.style.width = '40%';
                wrapper.style.height = '40%';
            }

            const temp = document.createElement('div');
            temp.innerHTML = SPRITE_LIBRARY[this.logical.sprite.imageName];
            const svg = temp.querySelector('svg');

            if (svg) {
                svg.setAttribute('width', '100%');
                svg.setAttribute('height', '100%');
                svg.style.display = 'block';

                svg.querySelectorAll('[fill]').forEach(el => {
                    el.setAttribute('fill', this.logical.sprite.imageColor || '#000');
                });

                wrapper.appendChild(svg);
                el.appendChild(wrapper);
            }
        }

        // Text overlay
        if (this.logical.sprite.text) {
            const text = document.createElement('div');
            text.innerText = this.logical.sprite.text;
            text.style.position = 'absolute';
            text.style.top = '50%';
            text.style.left = '50%';
            text.style.transform = 'translate(-50%, -50%)';
            text.style.color = this.logical.sprite.textColor || '#000';
            text.style.fontSize = '10px';
            text.style.fontWeight = 'bold';
            text.style.zIndex = 2;
            text.style.pointerEvents = 'none';
            el.appendChild(text);
        }

        // Recreate pieceWrapper after refresh
        this.pieceWrapper = document.createElement('div');
        this.pieceWrapper.classList.add('piece-tile-wrapper');
        this.pieceWrapper.style.position = 'absolute';
        this.pieceWrapper.style.display = 'grid';
        this.pieceWrapper.style.zIndex = '5';

        if (this.boardShape === "Square") {
            this.pieceWrapper.style.top = '0';
            this.pieceWrapper.style.left = '0';
            this.pieceWrapper.style.width = '100%';
            this.pieceWrapper.style.height = '100%';
        }
        else if (this.boardShape === "Hex") {
            this.pieceWrapper.style.top = '17.5%';
            this.pieceWrapper.style.left = '17.5%';
            this.pieceWrapper.style.width = '65%';
            this.pieceWrapper.style.height = '65%';
        }
        else if (this.boardShape === "Triangle") {
            this.pieceWrapper.style.left = '30%';
            if (this.logical.xCoordinate % 2 === 0) this.pieceWrapper.style.top = '12.5%';
            else this.pieceWrapper.style.top = '37.5%';
            this.pieceWrapper.style.width = '40%';
            this.pieceWrapper.style.height = '40%';
        }

        el.appendChild(this.pieceWrapper);
    }

    update() {
        const newLogical = activeGameState.board.getTile(this.logical.xCoordinate, this.logical.yCoordinate);
        if (!newLogical) return;
        this.logical = newLogical;
        this.refresh();
    }

    addPiece(logicalPiece) {
        const piece = new GamePiece(logicalPiece);
        const el = piece.getElement();

        const currentCount = this.pieceWrapper.children.length + 1;
        const gridSize = Math.ceil(Math.sqrt(currentCount));
        this.pieceWrapper.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        this.pieceWrapper.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

        el.style.width = '100%';
        el.style.height = '100%';

        this.pieceWrapper.appendChild(el);
    }
}
