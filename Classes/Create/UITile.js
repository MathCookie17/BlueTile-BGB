class UITile {
    constructor(tile, board) {
        this.tile = tile;
        this.board = board;
        this.container = null;
        this.containerBorder = null;
        this.editorWindow = null;
        this.xOverlay = null;
        this.refreshEditorWindowContent = null;
        this.createTile();
    }

    createTile() {
        const tileBorder = document.createElement('div');
        tileBorder.classList.add('tile-border');
        tileBorder.style.position = 'absolute';
        if (this.board.board.boardShape === "Square") {
            tileBorder.style.left = `${this.tile.xCoordinate * 40}px`;
            tileBorder.style.top = `${this.tile.yCoordinate * 40}px`
        }
        if (this.board.board.boardShape === "Hex") {
            tileBorder.classList.add('hexagon-clip');
            tileBorder.style.left = `${(this.tile.xCoordinate + this.tile.yCoordinate / 2) * 34.641}px`;
            tileBorder.style.top = `${this.tile.yCoordinate * 30}px`
        }
        else if (this.board.board.boardShape === "Triangle") {
            if (this.tile.xCoordinate % 2 === 0) tileBorder.classList.add('triangle-down-clip');
            else tileBorder.classList.add('triangle-up-clip');
            tileBorder.style.left = `${(this.tile.xCoordinate + this.tile.yCoordinate) * 17.321}px`;
            tileBorder.style.top = `${this.tile.yCoordinate * 30}px`
        }
        this.containerBorder = tileBorder;

        const tile = document.createElement('div');
        tile.classList.add('tile-inner');
        tile.setAttribute('data-id', this.tile.objectID);
        if (this.board.board.boardShape === "Hex") {
            tile.classList.add('hexagon-clip');
        }
        else if (this.board.board.boardShape === "Triangle") {
            if (this.tile.xCoordinate % 2 === 0) tile.classList.add('triangle-down-clip');
            else tile.classList.add('triangle-up-clip');
        }
        this.container = tile;
        this.containerBorder.appendChild(tile);

        const xOverlay = document.createElement('div');
        xOverlay.classList.add('tile-disabled-x');
        xOverlay.innerHTML = `
            <div class="line black"></div>
            <div class="line red"></div>
        `;
        xOverlay.style.display = 'none';
        tile.appendChild(xOverlay);
        this.xOverlay = xOverlay;

        this.updateSprite();

        tile.addEventListener('click', (e) => {
            e.stopPropagation();
            switch (this.board.toolbar.activeTool) {
                case 'select': this.showTileEditor(); break;
                case 'zoom_in': this.board.resize(1.2); break;
                case 'zoom_out': this.board.resize(0.8); break;
                case 'eyedropper':
                    this.board.selectedSprite = { ...this.tile.sprite };
                    const s = this.board.selectedSprite;
                    if (this.board.spritePreview) {
                        this.board.renderSpritePreview();

                    }
                    break;
                case 'paint':
                    this.tile.sprite = { ...this.board.selectedSprite };
                    this.updateSprite();
                    break;
                case 'disable':
                    this.tile.enabled = !this.tile.enabled;
                    this.updateSprite();
                    break;
            }
        });

        tile.addEventListener('mouseenter', (e) => {
            if (e.buttons === 1 && this.board.toolbar.activeTool === 'paint' && this.board.isPainting) {
                this.tile.sprite = { ...this.board.selectedSprite };
                this.updateSprite();
            }
        });
    }

    updateSprite(sprite = this.tile.sprite) {
        const el = this.container;
        el.innerHTML = ''; // Clear current content
        el.style.position = 'absolute';
    
        // 1. Set background color
        el.style.backgroundColor = sprite.fillColor || '#ccc';
    
        // 2. SVG overlay (if present)
        if (sprite.imageName && SPRITE_LIBRARY[sprite.imageName]) {
            const overlayWrapper = document.createElement('div');
            overlayWrapper.classList.add('tile-image');
            overlayWrapper.style.position = 'absolute';
            overlayWrapper.style.pointerEvents = 'none';
            overlayWrapper.style.zIndex = 1;

            if (this.board.board.boardShape === "Square") {
                overlayWrapper.style.top = '0';
                overlayWrapper.style.left = '0';
                overlayWrapper.style.width = '100%';
                overlayWrapper.style.height = '100%';
            }
            else if (this.board.board.boardShape === "Hex") {
                overlayWrapper.style.top = "10%";
                overlayWrapper.style.left = '10%';
                overlayWrapper.style.width = '80%';
                overlayWrapper.style.height = '80%';
            }
            else if (this.board.board.boardShape === "Triangle") {
                overlayWrapper.style.left = '30%';
                if (this.tile.xCoordinate % 2 === 0) overlayWrapper.style.top = '12.5%';
                else overlayWrapper.style.top = '37.5%';
                overlayWrapper.style.width = '40%';
                overlayWrapper.style.height = '40%';
            }
    
            // Inject and tint SVG
            const temp = document.createElement('div');
            temp.innerHTML = SPRITE_LIBRARY[sprite.imageName];
            const svg = temp.querySelector('svg');
    
            if (svg) {
                svg.setAttribute('width', '100%');
                svg.setAttribute('height', '100%');
                svg.style.display = 'block';
    
                svg.querySelectorAll('[fill]').forEach(el => {
                    el.setAttribute('fill', sprite.imageColor || '#000');
                });
    
                overlayWrapper.appendChild(svg);
            }
    
            el.appendChild(overlayWrapper);
        }
    
        // 3. Text overlay
        if (sprite.text) {
            const text = document.createElement('div');
            text.classList.add('tile-text');
            text.innerText = sprite.text;
            text.style.position = 'absolute';
            text.style.top = '50%';
            text.style.left = '50%';
            text.style.transform = 'translate(-50%, -50%)';
            text.style.color = sprite.textColor || '#000';
            text.style.fontSize = '10px';
            text.style.fontWeight = 'bold';
            text.style.zIndex = 2;
            text.style.pointerEvents = 'none';
    
            el.appendChild(text);
        }
    
        // 4. Disabled X overlay
        this.xOverlay.style.display = this.tile.enabled === false ? 'block' : 'none';
        this.xOverlay.style.zIndex = 3;
        el.appendChild(this.xOverlay);
    
        // 5. Render pieces (if any)
        if (pieceEditor) this.updatePieceDisplay();
    }
    
    updatePieceDisplay(overridePositions = {}) {
        const piecesHere = pieceEditor.pieces.filter(p => {
            const override = overridePositions[p.piece.objectID];
            const x = override ? override.x : p.piece.xCoordinate;
            const y = override ? override.y : p.piece.yCoordinate;
            return x === this.tile.xCoordinate && y === this.tile.yCoordinate;
        });

        this.container.querySelectorAll('.piece-tile-wrapper')?.forEach(e => e.remove());
        if (piecesHere.length === 0) return;

        const pieceWrapper = document.createElement('div');
        pieceWrapper.classList.add('piece-tile-wrapper');
        pieceWrapper.style.display = 'grid';
        pieceWrapper.style.position = 'absolute';
        pieceWrapper.style.zIndex = '5';

        if (this.board.board.boardShape === "Square") {
            pieceWrapper.style.top = '0';
            pieceWrapper.style.left = '0';
            pieceWrapper.style.width = '100%';
            pieceWrapper.style.height = '100%';
        }
        else if (this.board.board.boardShape === "Hex") {
            pieceWrapper.style.top = '17.5%';
            pieceWrapper.style.left = '17.5%';
            pieceWrapper.style.width = '65%';
            pieceWrapper.style.height = '65%';
        }
        else if (this.board.board.boardShape === "Triangle") {
            pieceWrapper.style.left = '30%';
            if (this.tile.xCoordinate % 2 === 0) pieceWrapper.style.top = '12.5%';
            else pieceWrapper.style.top = '37.5%';
            pieceWrapper.style.width = '40%';
            pieceWrapper.style.height = '40%';
        }

        const gridSize = Math.ceil(Math.sqrt(piecesHere.length));
        pieceWrapper.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        pieceWrapper.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

        piecesHere.forEach(uiPiece => {
            const el = uiPiece.boardContainer;
            const newEl = el.cloneNode(true);
            el.replaceWith(newEl);
            uiPiece.boardContainer = newEl;

            newEl.addEventListener('click', (e) => {
                if (this.board.toolbar.activeTool === 'select') {
                    e.stopPropagation();
                    uiPiece.openEditorWindow();
                }
            });

            newEl.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                uiPiece.piece.xCoordinate = -1;
                uiPiece.piece.yCoordinate = -1;
                this.updatePieceDisplay();
            });

            newEl.style.width = '100%';
            newEl.style.height = '100%';
            pieceWrapper.appendChild(newEl);
        });

        this.container.appendChild(pieceWrapper);
    }

    showTileEditor() {
        if (this.editorWindow && document.body.contains(this.editorWindow.container)) {
            this.editorWindow.container.style.zIndex = ++__windowZIndex;
            this.refreshEditorWindowContent?.();
            return;
        }

        const win = new WindowContainer(`Tile (${this.tile.xCoordinate}, ${this.tile.yCoordinate})`, true, {
            width: 350,
            height: 400,
            offsetTop: 50,
            offsetLeft: 500
        });
        this.editorWindow = win;

        const content = document.createElement('div');
        content.innerHTML = `
            <label>Background Color: <input type="color" id="tile-color"></label><br>
            <label>Text: <input type="text" id="tile-text"></label><br>
            <label>Text Color: <input type="color" id="tile-text-color"></label><br>
            <hr>
            <label>Overlay Image:
  <select id="tile-overlay">
    ${Object.keys(TILE_SPRITE_LIBRARY).map(name => `<option value="${name}">${name}</option>`).join('')}
  </select>
</label><br>
<label>Overlay Color: <input type="color" id="tile-overlay-color"></label><br>
<hr>
            <div><strong>Tile Types</strong> <button id="add-type">+ Add Type</button></div>
            <div id="type-list"></div>
            <hr>
            <div><strong>Pieces on Tile</strong> <button id="add-piece">+ Add Piece</button></div>
            <div id="piece-list"></div>
        `;

        const colorInput = content.querySelector('#tile-color');
        const textInput = content.querySelector('#tile-text');
        const textColorInput = content.querySelector('#tile-text-color');
        const addTypeBtn = content.querySelector('#add-type');
        const typeList = content.querySelector('#type-list');
        const addBtn = content.querySelector('#add-piece');
        const pieceList = content.querySelector('#piece-list');
        const overlaySelect = content.querySelector('#tile-overlay');
const overlayColor = content.querySelector('#tile-overlay-color');

overlaySelect.value = this.tile.sprite.imageName || Object.keys(SPRITE_LIBRARY)[0];
overlayColor.value = this.tile.sprite.imageColor || '#000000';

overlaySelect.addEventListener('change', () => {
    this.tile.sprite.imageName = overlaySelect.value;
    this.updateSprite();
});
overlayColor.addEventListener('input', () => {
    this.tile.sprite.imageColor = overlayColor.value;
    this.updateSprite();
});


const renderTypes = () => {
    typeList.innerHTML = '';
    this.tile.types.forEach((typeID, i) => {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';

        const span = document.createElement('span');
        const matched = typeEditor.tileTypes.find(t => Number(t.type.typeID) === Number(typeID));
        span.textContent = matched ? matched.type.typeName : '(Unknown Type)';

        const remove = document.createElement('button');
        remove.textContent = '✕';
        remove.onclick = () => {
            this.tile.types.splice(i, 1);
            renderTypes();
        };

        row.appendChild(span);
        row.appendChild(remove);
        typeList.appendChild(row);
    });
};


        const renderAvailablePieces = () => {
            pieceList.innerHTML = '';

            const piecesHere = pieceEditor.pieces.filter(p =>
                p.piece.xCoordinate === this.tile.xCoordinate &&
                p.piece.yCoordinate === this.tile.yCoordinate
            );

            piecesHere.forEach(uiPiece => {
                const row = document.createElement('div');
                row.style.display = 'flex';
                row.style.justifyContent = 'space-between';

                const label = document.createElement('span');
                label.textContent = `${uiPiece.piece.name}`;

                const remove = document.createElement('button');
                remove.textContent = '✕';
                remove.onclick = () => {
                    uiPiece.piece.xCoordinate = -1;
                    uiPiece.piece.yCoordinate = -1;
                    this.updatePieceDisplay();
                    renderAvailablePieces();
                };

                row.appendChild(label);
                row.appendChild(remove);
                pieceList.appendChild(row);
            });
        };

        addTypeBtn.onclick = () => {
            const select = document.createElement('select');
            
            // Normalize existing type IDs for comparison
            const existingTypeIDs = this.tile.types.map(t => Number(t.typeID));
            
            typeEditor.tileTypes.forEach(typeUI => {
                const type = typeUI.type;
                const typeID = Number(type.typeID);
                
                if (!existingTypeIDs.includes(typeID)) {
                    const opt = document.createElement('option');
                    opt.value = typeID;
                    opt.textContent = type.typeName;
                    select.appendChild(opt);
                }
            });
        
            // If no new types to add, do nothing
            if (select.children.length === 0) return;
        
            const confirm = document.createElement('button');
            confirm.textContent = '✔';
            confirm.onclick = () => {
                const chosenID = Number(select.value);
                if (!this.tile.types.includes(chosenID)) {
                    this.tile.types.push(chosenID);
                    renderTypes();
                }
                select.remove();
                confirm.remove();
            };
            
        
            content.insertBefore(select, typeList);
            content.insertBefore(confirm, typeList);
        };
        

        addBtn.onclick = () => {
            const available = pieceEditor.pieces.filter(p =>
                p.piece.xCoordinate === -1 &&
                p.piece.yCoordinate === -1
            );

            if (available.length === 0) return;

            const select = document.createElement('select');
            available.forEach(p => {
                const opt = document.createElement('option');
                opt.value = p.piece.objectID;
                opt.textContent = `Piece ${p.piece.name}`;
                select.appendChild(opt);
            });

            const confirm = document.createElement('button');
            confirm.textContent = '✔';
            confirm.onclick = () => {
                const id = parseInt(select.value);
                const uiPiece = pieceEditor.pieces.find(p => p.piece.objectID === id);
                if (uiPiece) {
                    uiPiece.piece.xCoordinate = this.tile.xCoordinate;
                    uiPiece.piece.yCoordinate = this.tile.yCoordinate;

                    this.updatePieceDisplay();
                    renderAvailablePieces();

                    select.remove();
                    confirm.remove();
                }
            };

            pieceList.appendChild(select);
            pieceList.appendChild(confirm);
        };

        colorInput.addEventListener('input', () => {
            this.tile.sprite.fillColor = colorInput.value;
            this.updateSprite();
        });

        textInput.addEventListener('input', () => {
            this.tile.sprite.text = textInput.value;
            this.updateSprite();
        });

        textColorInput.addEventListener('input', () => {
            this.tile.sprite.textColor = textColorInput.value;
            this.updateSprite();
        });

        // Refresh logic for when window is reopened
        this.refreshEditorWindowContent = () => {
            colorInput.value = this.tile.sprite.fillColor;
            textInput.value = this.tile.sprite.text;
            textColorInput.value = this.tile.sprite.textColor;
            renderTypes();
            renderAvailablePieces();
        };

        this.refreshEditorWindowContent();
        win.onMouseDown = () => { 
            if(__windowZIndex != win.container.style.zIndex)
                this.refreshEditorWindowContent()}
        win.appendContent(content);
    }
}
