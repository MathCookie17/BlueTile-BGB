// --- UIBoard class ---
class UIBoard {
    constructor(board) {
        this.board = board;
        this.tiles = Array.from({ length: this.board.height }, () => []);

        this.container = this.createBoard();
        this.window;
        this.toolbar;
        this.isPainting = false;
        this.selectedSprite = {
            fillColor: '#cccccc',
            text: '',
            textColor: '#000000'
        }; //default sprite for bucket.
        this.createTiles();
        this.createToolbar();
        this.createWindow();


        

        // For dragging
        this.offsetX = 0;
        this.offsetY = 0;
        this.scale = 1;
        this.enableDragging();
    }

    createBoard() {
        const boardContainer = document.createElement('div');
        boardContainer.classList.add('board');
        boardContainer.style.display = 'block';
        // boardContainer.style.gridTemplateColumns = `repeat(${this.board.width}, 40px)`;
        // boardContainer.style.gridTemplateRows = `repeat(${this.board.height}, 40px)`;
        boardContainer.style.gap = '0px';
        boardContainer.style.position = 'absolute';
        boardContainer.style.transformOrigin = 'top left';


        boardContainer.addEventListener('mousedown', (e) => {
            if (this.toolbar.activeTool === 'paint') {
                this.isPainting = true;
            }
        });
        
        boardContainer.addEventListener('mouseup', (e) => {
            this.isPainting = false;
        });

        return boardContainer;
        
    }

    createTiles() {
        for (let y = 0; y < this.board.height; y++) {
            for (let x = 0; x < this.board.width; x++) {
                const tile = this.board.getTile(x, y);
                const uiTile = new UITile(tile, this);
                this.container.appendChild(uiTile.containerBorder);
                this.tiles[y][x] = uiTile;
            }
        }
    }
    

    resize(scaleFactor) {
        this.scale *= scaleFactor;
        this.container.style.transform = `scale(${this.scale}) translate(${this.offsetX}px, ${this.offsetY}px)`;
    }

    reposition(dx, dy) {
        this.offsetX += dx / this.scale;
        this.offsetY += dy / this.scale;
        this.container.style.transform = `scale(${this.scale}) translate(${this.offsetX}px, ${this.offsetY}px)`;
    }

    createWindow(){
        const win = new WindowContainer("Game Board", true);
        this.window = win;
        this.window.appendContent(this.toolbar.container);
        this.window.appendContent(this.toolbar.target);
        this.window.beforeClose = () => this.window = null;

      
    }



    createToolbar(){
              // --- TOGGLE SHOW/HIDE PIECES ---
              const toolbarArea = document.createElement('div');
              toolbarArea.id = 'toolbar-container';
              const targetArea = document.createElement('div'); 
              targetArea.id = 'game-container';
              const toolbar = new Toolbar(toolbarArea, targetArea);
          
              toolbar.addTool("select", ["drag"]);
              toolbar.addTool("zoom_in", ["zoom_out"]);
              toolbar.addTool("paint");
              toolbar.addTool("eyedropper");
              toolbar.addTool("disable");
      
          
              targetArea.appendChild(this.container);
              this.toolbar = toolbar;
              let showPieces = true;
      
              const toggleBtn = document.createElement('div');
              toggleBtn.classList.add('toggle-button');
              toggleBtn.style.backgroundImage = `url(images/showpiece.png)`;
              toggleBtn.title = 'Toggle Piece Visibility';
      
              toggleBtn.addEventListener('click', () => {
                  showPieces = !showPieces;
                  toggleBtn.style.backgroundImage = `url(images/${showPieces ? 'showpiece' : 'hidepiece'}.png)`;
      
                  const allPieces = document.querySelectorAll('.board-piece');
                  allPieces.forEach(p => {
                      p.style.visibility = showPieces ? 'visible' : 'hidden';
                  });
              });
      
              toolbar.container.appendChild(toggleBtn);

              const resizeBtn = document.createElement('div');
              resizeBtn.classList.add('toggle-button');
              resizeBtn.style.backgroundImage = `url(images/board_resize.png)`;
              resizeBtn.title = 'Toggle Piece Visibility';
      
              resizeBtn.addEventListener('click', () => {
                openEditor("boardResize");
              });
      
              toolbar.container.appendChild(resizeBtn);
      
      
              // --- SPRITE PREVIEW BOX ---
              const spritePreview = document.createElement('div');
              spritePreview.classList.add('sprite-preview');
              spritePreview.style.width = '40px';
              spritePreview.style.height = '40px';
              spritePreview.style.marginLeft = 'auto';
              spritePreview.style.border = '1px solid black';
              spritePreview.style.backgroundColor = this.selectedSprite.fillColor;
              spritePreview.style.color = this.selectedSprite.textColor;
              spritePreview.style.display = 'flex';
              spritePreview.style.alignItems = 'center';
              spritePreview.style.justifyContent = 'center';
              spritePreview.style.fontSize = '10px';
      
              toolbar.container.appendChild(spritePreview);
      
              this.spritePreview = spritePreview;
      
              // --- SPRITE EDITOR POPUP ---
      let spriteEditorPopup = null;
      
      spritePreview.addEventListener('click', () => {
        if (spriteEditorPopup) {
            spriteEditorPopup.remove();
            spriteEditorPopup = null;
            return;
        }
    
        spriteEditorPopup = document.createElement('div');
        spriteEditorPopup.style.position = 'absolute';
        spriteEditorPopup.style.top = '45px';
        spriteEditorPopup.style.right = '10px';
        spriteEditorPopup.style.padding = '8px';
        spriteEditorPopup.style.background = '#fff';
        spriteEditorPopup.style.border = '1px solid #aaa';
        spriteEditorPopup.style.boxShadow = '2px 2px 6px rgba(0,0,0,0.2)';
        spriteEditorPopup.style.zIndex = '9999';
        spriteEditorPopup.style.display = 'flex';
        spriteEditorPopup.style.flexDirection = 'column';
        spriteEditorPopup.style.gap = '4px';
    
        // Dynamically build dropdown
        const overlayOptions = Object.keys(TILE_SPRITE_LIBRARY)
            .map(name => `<option value="${name}">${name}</option>`)
            .join('');
    
        spriteEditorPopup.innerHTML = `
            <label style="font-size:12px;">Fill: <input type="color" id="fill-color"></label>
            <label style="font-size:12px;">Text: <input type="text" id="sprite-text" style="width: 100px;"></label>
            <label style="font-size:12px;">Text Color: <input type="color" id="text-color"></label>
            <label style="font-size:12px;">Image Overlay:
                <select id="sprite-image-name">
                    ${overlayOptions}
                </select>
            </label>
            <label style="font-size:12px;">Image Color: <input type="color" id="sprite-image-color"></label>
            <button style="font-size:10px;">Close</button>
        `;
    
        // Get input elements
        const fillInput = spriteEditorPopup.querySelector('#fill-color');
        const textInput = spriteEditorPopup.querySelector('#sprite-text');
        const textColorInput = spriteEditorPopup.querySelector('#text-color');
        const imageNameSelect = spriteEditorPopup.querySelector('#sprite-image-name');
        const imageColorInput = spriteEditorPopup.querySelector('#sprite-image-color');
    
        // Populate current values
        fillInput.value = this.selectedSprite.fillColor;
        textInput.value = this.selectedSprite.text;
        textColorInput.value = this.selectedSprite.textColor;
        imageNameSelect.value = this.selectedSprite.imageName || '';
        imageColorInput.value = this.selectedSprite.imageColor || '#000000';
    
        // Update preview logic
        const update = () => {
            this.selectedSprite.fillColor = fillInput.value;
            this.selectedSprite.text = textInput.value;
            this.selectedSprite.textColor = textColorInput.value;
            this.selectedSprite.imageName = imageNameSelect.value || null;
            this.selectedSprite.imageColor = imageColorInput.value;
    
            spritePreview.style.backgroundColor = this.selectedSprite.fillColor;
            spritePreview.innerHTML = '';
    
            const wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            wrapper.style.width = '100%';
            wrapper.style.height = '100%';
    
            // SVG overlay
            if (this.selectedSprite.imageName && TILE_SPRITE_LIBRARY[this.selectedSprite.imageName]) {
                const temp = document.createElement('div');
                temp.innerHTML = TILE_SPRITE_LIBRARY[this.selectedSprite.imageName];
                const svg = temp.querySelector('svg');
    
                if (svg) {
                    svg.setAttribute('width', '100%');
                    svg.setAttribute('height', '100%');
                    svg.style.display = 'block';
    
                    svg.querySelectorAll('[fill]').forEach(el => {
                        el.setAttribute('fill', this.selectedSprite.imageColor || '#000');
                    });
    
                    wrapper.appendChild(svg);
                }
            }
    
            // Text overlay
            const textEl = document.createElement('div');
            textEl.innerText = this.selectedSprite.text || '';
            textEl.style.position = 'absolute';
            textEl.style.top = '50%';
            textEl.style.left = '50%';
            textEl.style.transform = 'translate(-50%, -50%)';
            textEl.style.color = this.selectedSprite.textColor;
            textEl.style.fontSize = '10px';
            textEl.style.fontWeight = 'bold';
            textEl.style.pointerEvents = 'none';
            textEl.style.zIndex = 1;
    
            wrapper.appendChild(textEl);
            spritePreview.appendChild(wrapper);
        };
    
        fillInput.addEventListener('input', update);
        textInput.addEventListener('input', update);
        textColorInput.addEventListener('input', update);
        imageNameSelect.addEventListener('change', update);
        imageColorInput.addEventListener('input', update);
    
        spriteEditorPopup.querySelector('button').addEventListener('click', () => {
            spriteEditorPopup.remove();
            spriteEditorPopup = null;
        });
    
        toolbar.container.appendChild(spriteEditorPopup);
    });
    
      
      
    }

    enableDragging() {
        let isDragging = false;
        let startX, startY;

        this.container.parentElement.addEventListener('mousedown', (e) => {
            if (this.toolbar.activeTool === 'drag') {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
            }
        });

        window.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                this.reposition(dx, dy);
                startX = e.clientX;
                startY = e.clientY;
            }
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }


    renderSpritePreview() {
        const s = this.selectedSprite;
        const preview = this.spritePreview;
        preview.style.backgroundColor = s.fillColor || '#ccc';
        preview.innerHTML = '';
    
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.width = '100%';
        wrapper.style.height = '100%';
    
        // Add SVG overlay
        if (s.imageName && TILE_SPRITE_LIBRARY[s.imageName]) {
            const temp = document.createElement('div');
            temp.innerHTML = TILE_SPRITE_LIBRARY[s.imageName];
            const svg = temp.querySelector('svg');
    
            if (svg) {
                svg.setAttribute('width', '100%');
                svg.setAttribute('height', '100%');
                svg.style.display = 'block';
    
                svg.querySelectorAll('[fill]').forEach(el => {
                    el.setAttribute('fill', s.imageColor || '#000');
                });
    
                wrapper.appendChild(svg);
            }
        }
    
        // Add text
        if (s.text) {
            const text = document.createElement('div');
            text.innerText = s.text;
            text.style.position = 'absolute';
            text.style.top = '50%';
            text.style.left = '50%';
            text.style.transform = 'translate(-50%, -50%)';
            text.style.color = s.textColor || '#000';
            text.style.fontSize = '10px';
            text.style.fontWeight = 'bold';
            text.style.pointerEvents = 'none';
            text.style.zIndex = 1;
    
            wrapper.appendChild(text);
        }
    
        preview.appendChild(wrapper);
    }
    
}