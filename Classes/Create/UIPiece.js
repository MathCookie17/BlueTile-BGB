class UIPiece {
    constructor(piece, editor) {
        this.piece = piece;
        this.editor = editor;
        this.container = null;
        this.boardContainer = null;
        this.editorWindow = null;
        this.refreshEditorWindowContent = null;

        this.createPiece();
    }

    createPiece() {
        const create = () => {
            const wrapper = document.createElement('div');
            wrapper.classList.add('piece-ui');
            wrapper.setAttribute('data-id', this.piece.objectID);
            wrapper.style.width = '40px';
            wrapper.style.height = '40px';
            wrapper.style.position = 'relative';
            wrapper.style.display = 'flex';
            wrapper.style.flexDirection = 'column';
            wrapper.style.alignItems = 'center';
            wrapper.style.justifyContent = 'center';        
            wrapper.style.cursor = 'pointer';       

            const icon = document.createElement('div');
            icon.style.width = '40px';
            icon.style.height = '40px';
            wrapper.appendChild(icon);

            wrapper._icon = icon;
            return wrapper;
        };

        this.container = create();
        this.boardContainer = document.createElement('div');
        this.boardContainer.classList.add('board-piece');
        this.boardContainer.style.width = '40px';
        this.boardContainer.style.height = '40px';
        this.boardContainer.style.position = 'relative';
        this.boardContainer.style.display = 'flex';
        this.boardContainer.style.alignItems = 'center';
        this.boardContainer.style.justifyContent = 'center';
        this.boardContainer.style.cursor = 'pointer';

        this.updateSprite();

        this.container.addEventListener('click', (e) => {
            if (!e.isTrusted) return;
            e.stopPropagation();
            this.openEditorWindow();
        });
    }

    updateSprite(sprite = this.piece.sprite) {
        const renderTo = (el) => {
            const target = el._icon || el;
            target.innerHTML = '';
    
            const s = sprite;
            const wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            wrapper.style.width = '100%';
            wrapper.style.height = '100%';
    
            // Create SVG element from library
            const temp = document.createElement('div');
            temp.innerHTML = SPRITE_LIBRARY[s.imageName] || '';
            const svg = temp.querySelector('svg');
    
            if (svg) {
                svg.setAttribute('width', '100%');
                svg.setAttribute('height', '100%');
                svg.style.display = 'block';
    
                svg.querySelectorAll('[fill]').forEach(el => {
                    el.setAttribute('fill', s.fillColor || '#000');
                });
    
                wrapper.appendChild(svg);
            }
    
            // Text overlay
            if (s.text) {
                const textOverlay = document.createElement('div');
                textOverlay.textContent = s.text;
                textOverlay.style.position = 'absolute';
                textOverlay.style.top = '50%';
                textOverlay.style.left = '50%';
                textOverlay.style.transform = 'translate(-50%, -50%)';
                textOverlay.style.color = s.textColor || '#000';
                textOverlay.style.fontSize = '12px';
                textOverlay.style.fontWeight = 'bold';
                textOverlay.style.pointerEvents = 'none';
                wrapper.appendChild(textOverlay);
            }
    
            target.appendChild(wrapper);
        };
    
        renderTo(this.container);
        renderTo(this.boardContainer);
    }
    
    
    

    openEditorWindow() {
        if (this.editorWindow && document.body.contains(this.editorWindow.container)) {
            this.editorWindow.container.style.zIndex = ++__windowZIndex;
            this.refreshEditorWindowContent?.();
            return;
        }

        const win = new WindowContainer(`Piece: ${this.piece.name}`, true, {
            width: 320,
            height: 440,
            offsetTop: 100,
            offsetLeft: 400
        });
        this.editorWindow = win;

        const content = document.createElement('div');
        content.style.display = 'flex';
        content.style.flexDirection = 'column';
        content.style.gap = '6px';

        content.innerHTML = `
            <label>Name: <input type="text" id="piece-name" /></label>
            <div id="sprite-picker" style="display: flex; align-items: center; gap: 8px;">
                <button type="button" id="sprite-left">◀</button>
                <div id="sprite-preview" style="width: 40px; height: 40px;"></div>
                <button type="button" id="sprite-right">▶</button>
            </div>
            <label>Fill Color: <input type="color" id="fill-color"></label>
            <label>Text: <input type="text" id="piece-text"></label>
            <label>Text Color: <input type="color" id="text-color"></label>
            <hr>
            <div><strong>Piece Types</strong> <button id="add-type">+ Add Type</button></div>
            <div id="type-list"></div>
            <hr>
            <div id="location-controls"></div>





        `;

        const typeList = content.querySelector('#type-list');
        const addTypeBtn = content.querySelector('#add-type');
        const locationControls = content.querySelector('#location-controls');

        const renderTypes = () => {
            typeList.innerHTML = '';
            this.piece.types.forEach((typeID, i) => {
                const row = document.createElement('div');
                row.style.display = 'flex';
                row.style.justifyContent = 'space-between';
                var nameToShow = "";
                const span = document.createElement('span');


                console.log("Looking for typeID:", typeID);
                console.log("FULL pieceTypes list:", typeEditor.pieceTypes);
                
                typeEditor.pieceTypes.forEach(pt => {
                    console.log("Inspecting pt:", pt);
                    console.log("pt.typeID:", pt?.typeID);
                    console.log("pt.type?.typeID:", pt?.type?.typeID);
                });
                
                let actualType = typeEditor.pieceTypes.find(pt => Number(pt.type.typeID) === Number(typeID));

                console.log(actualType)
                
                if(actualType)
                {
                    nameToShow = actualType.type.typeName
                    console.log("BLEASRHHASERH")

                }
                    
                span.textContent = nameToShow;

                const remove = document.createElement('button');
                remove.textContent = '✕';
                remove.onclick = () => {
                    this.piece.types.splice(i, 1);
                    renderTypes();
                };

                row.appendChild(span);
                row.appendChild(remove);
                typeList.appendChild(row);
            });
        };

        addTypeBtn.onclick = () => {
            const select = document.createElement('select');

            // Normalize piece.types to numbers just once
            const existingTypeIDs = this.piece.types.map(id => Number(id));
        
            typeEditor.pieceTypes.forEach(typeUI => {
                const type = typeUI.type;
                const typeID = Number(type.typeID); // normalize this too
        
                // ONLY include if it's NOT already in piece.types
                if (!existingTypeIDs.includes(typeID)) {
                    const opt = document.createElement('option');
                    opt.value = typeID;
                    opt.textContent = type.typeName;
                    select.appendChild(opt);
                }
            });

            if (select.children.length === 0) {
                return;
            }

            const confirm = document.createElement('button');
            confirm.textContent = '✔';
            confirm.onclick = () => {
                if (!this.piece.types.includes(select.value))
                    this.piece.types.push(select.value);
                renderTypes();
                select.remove();
                confirm.remove();
            };

            content.insertBefore(select, typeList);
            content.insertBefore(confirm, typeList);
        };

        const updateLocationDisplay = () => {
            locationControls.innerHTML = '';
            const { xCoordinate: x, yCoordinate: y } = this.piece;

            if (x >= 0 && y >= 0) {
                const label = document.createElement('div');
                label.textContent = `On board at (${x}, ${y})`;
                locationControls.appendChild(label);

                const removeBtn = document.createElement('button');
                removeBtn.textContent = 'Remove from Board';
                removeBtn.onclick = () => {
                    this.piece.xCoordinate = -1;
                    this.piece.yCoordinate = -1;
                    boardEditor.tiles[y][x].updatePieceDisplay();
                    updateLocationDisplay();
                };
                locationControls.appendChild(removeBtn);
            } else {
                const label = document.createElement('div');
                label.textContent = 'Not on board.';
                locationControls.appendChild(label);

                const xInput = document.createElement('input');
                xInput.type = 'number';
                xInput.min = 0;
                xInput.max = boardEditor.board.width - 1;
                xInput.placeholder = 'x';

                const yInput = document.createElement('input');
                yInput.type = 'number';
                yInput.min = 0;
                yInput.max = boardEditor.board.height - 1;
                yInput.placeholder = 'y';

                const placeBtn = document.createElement('button');
                placeBtn.textContent = 'Place on Board';
                placeBtn.onclick = () => {
                    const newX = parseInt(xInput.value);
                    const newY = parseInt(yInput.value);

                    if (!isNaN(newX) && !isNaN(newY) &&
                        newX >= 0 && newX < boardEditor.board.width &&
                        newY >= 0 && newY < boardEditor.board.height) {
                        this.piece.xCoordinate = newX;
                        this.piece.yCoordinate = newY;
                        boardEditor.tiles[newY][newX].updatePieceDisplay();
                        updateLocationDisplay();
                    }
                };

                locationControls.append(xInput, yInput, placeBtn);
            }
        };
        const updateOwnerDisplay = () => {
            const ownerControls = document.createElement('div');
            ownerControls.id = 'owner-controls';
            ownerControls.style.marginTop = '10px';
        
            const currentOwner = this.piece.playerOwnerID;
        
            const label = document.createElement('div');
            label.textContent = currentOwner >= 0 
                ? `Owned by Player ${currentOwner}` 
                : 'No player assigned.';
            ownerControls.appendChild(label);
        
            if (currentOwner >= 0) {
                const removeBtn = document.createElement('button');
                removeBtn.textContent = 'Remove Owner';
                removeBtn.onclick = () => {
                    this.piece.playerOwnerID = -1;
                    updateOwnerDisplay();
                };
                ownerControls.appendChild(removeBtn);
            } else {
                const input = document.createElement('input');
                input.type = 'number';
                input.min = 0;
                input.max = maxPlayers - 1;
                input.placeholder = 'Player ID';
                input.style.width = '80px';
        
                const assignBtn = document.createElement('button');
                assignBtn.textContent = 'Assign';
                assignBtn.onclick = () => {
                    const val = parseInt(input.value);
                    if (!isNaN(val) && val >= 0 && val < maxPlayers) {
                        this.piece.playerOwnerID = val;
                        updateOwnerDisplay();
                    }
                };
        
                ownerControls.appendChild(input);
                ownerControls.appendChild(assignBtn);
            }
        
            // Replace old controls
            const existing = content.querySelector('#owner-controls');
            if (existing) existing.replaceWith(ownerControls);
            else content.appendChild(ownerControls);
        };
        
        const wireInputs = () => {
            const nameInput = content.querySelector('#piece-name');
            const fill = content.querySelector('#fill-color');
            const text = content.querySelector('#piece-text');
            const textColor = content.querySelector('#text-color');
            const leftBtn = content.querySelector('#sprite-left');
            const rightBtn = content.querySelector('#sprite-right');
            const spritePreview = content.querySelector('#sprite-preview');
        
            const spriteNames = Object.keys(SPRITE_LIBRARY);
            let currentIndex = Math.max(0, spriteNames.indexOf(this.piece.sprite.imageName));
            if (currentIndex === -1) currentIndex = 0;
        
            const updateSpriteChoice = () => {
                const name = spriteNames[currentIndex];
                this.piece.sprite.imageName = name;
        
                const temp = document.createElement('div');
                temp.innerHTML = SPRITE_LIBRARY[name];
                const svg = temp.querySelector('svg');
        
                svg.setAttribute('width', '100%');
                svg.setAttribute('height', '100%');
                svg.setAttribute('draggable', 'false'); // Prevent native drag
                svg.style.display = 'block';
        
                // Apply fill color to all fillable parts of the SVG
                svg.querySelectorAll('[fill]').forEach(el => {
                    el.setAttribute('fill', this.piece.sprite.fillColor || '#000');
                });
        
                spritePreview.innerHTML = '';
                spritePreview.appendChild(svg);
                this.updateSprite();
            };
        
            leftBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + spriteNames.length) % spriteNames.length;
                updateSpriteChoice();
            });
        
            rightBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % spriteNames.length;
                updateSpriteChoice();
            });
        
            fill.value = this.piece.sprite.fillColor || '#000';
            fill.addEventListener('input', () => {
                this.piece.sprite.fillColor = fill.value;
                updateSpriteChoice(); // Update the preview too
            });
        
            text.value = this.piece.sprite.text || '';
            text.addEventListener('input', () => {
                this.piece.sprite.text = text.value;
                this.updateSprite();
            });
        
            textColor.value = this.piece.sprite.textColor || '#000';
            textColor.addEventListener('input', () => {
                this.piece.sprite.textColor = textColor.value;
                this.updateSprite();
            });
        
            nameInput.value = this.piece.name;
            nameInput.addEventListener('input', (e) => {
                const newName = e.target.value.trim();
                const isDuplicate = pieceEditor.pieces.some(p =>
                    p !== this && p.piece.name === newName
                );
        
                if (!newName || isDuplicate) {
                    nameInput.style.borderColor = 'red';
                    return;
                }
        
                nameInput.style.borderColor = '';
                this.piece.name = newName;
                win.header.querySelector('span').textContent = `Piece: ${newName}`;
            });
        
            updateSpriteChoice(); // Initial preview on open
        };
        

        this.refreshEditorWindowContent = () => {
            wireInputs();
            renderTypes();
            updateLocationDisplay();
            updateOwnerDisplay();
        };

        this.refreshEditorWindowContent();
        win.onMouseDown = () => {
            if (__windowZIndex != win.container.style.zIndex)
                this.refreshEditorWindowContent();
        };
        win.appendContent(content);
    }
}
