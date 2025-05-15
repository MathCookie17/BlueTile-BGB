class UIPieceEditor {
    constructor() {
        this.pieces = [];
        this.window = null;
        this.toolbar = this.createToolbar();
        this.pieceContainer = this.createContainer();
        this.createWindow();
    }

    createWindow() {
        const win = new WindowContainer("Piece Editor", true, {
            width: 400,
            height: 300,
            offsetTop: 0,
            offsetLeft: 500
        });
        this.window = win;
        this.window.appendContent(this.toolbar);
        this.window.appendContent(this.pieceContainer);
        this.window.beforeClose = () => this.window = null;
    }

    createToolbar() {
        const toolbar = document.createElement('div');
        toolbar.classList.add('toolbar');
        toolbar.style.display = 'flex';
        toolbar.style.padding = '5px';

        const btn = document.createElement('button');
        btn.textContent = 'Add Piece';
        btn.onclick = () => {
            const name = this.generateUniqueName("New Piece");
            const sprite = {
                imageName: 'pawn',
                fillColor: '#FF0000',
                text: '',
                textColor: '#000000'
            };
            const piece = new Piece([], -1, -1, -1, sprite);
            piece.name = name;
            this.addPiece(piece);
        };
        toolbar.appendChild(btn);

        return toolbar;
    }

    createContainer() {
        const container = document.createElement('div');
        container.style.width = '100%';
        container.style.height = '200px';
        container.style.border = '1px solid #aaa';
        container.style.overflow = 'auto';
        container.style.display = 'flex';
        container.style.flexWrap = 'wrap';
        container.style.gap = '5px';
        let draggedEl = null;

        container.addEventListener('dragstart', (e) => {
            draggedEl = e.target;
            e.dataTransfer.effectAllowed = 'move';
        });

        container.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        container.addEventListener('drop', (e) => {
            e.preventDefault();
            const dropTarget = e.target.closest('.piece-ui');
            if (draggedEl && dropTarget && draggedEl !== dropTarget) {
                const ui1 = this.pieces.find(p => p.container === draggedEl);
                const ui2 = this.pieces.find(p => p.container === dropTarget);
                if (ui1 && ui2) {
                    this.swapPieces(ui1, ui2);
                }
            }
        });

        return container;
    }

    generateUniqueName(base) {
        let index = 1;
        let name = base;
        while (this.pieces.some(p => p.piece.name === name)) {
            name = `${base} ${index++}`;
        }
        return name;
    }

    duplicatePiece(uiPiece) {
        const original = uiPiece.piece;
        const clone = structuredClone ? structuredClone(original) : JSON.parse(JSON.stringify(original));
        clone.name = this.generateUniqueName(clone.name + " Copy");
        const newPiece = new Piece([...clone.types], -1, -1, clone.playerOwnerID, clone.sprite);
        newPiece.name = clone.name;
        this.addPiece(newPiece);
    }

    addPiece(piece) {
        const uiPiece = new UIPiece(piece, this);
        uiPiece.container.setAttribute('draggable', true);

        // Right-click menu
        uiPiece.container.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showContextMenu(e.pageX, e.pageY, uiPiece);
        });

        this.pieces.push(uiPiece);
        this.pieceContainer.appendChild(uiPiece.container);
        var left = piece.xCoordinate;
        var top = piece.yCoordinate;
        if(top!=-1 && left!=-1)
            boardEditor.tiles[top][left].updatePieceDisplay();
    }

    showContextMenu(x, y, uiPiece) {
        const oldMenu = document.getElementById('context-menu');
        if (oldMenu) oldMenu.remove();
    
        const menu = document.createElement('div');
        menu.id = 'context-menu';
        menu.style.position = 'absolute';
    
        // Adjust to the window container (not the full page)
        const bounds = this.window.container.getBoundingClientRect();
        menu.style.left = `${x - bounds.left}px`;
        menu.style.top = `${y - bounds.top}px`;
    
        menu.style.background = '#fff';
        menu.style.border = '1px solid #aaa';
        menu.style.padding = '5px';
        menu.style.zIndex = '9999';
    
        const duplicate = document.createElement('div');
        duplicate.textContent = 'Duplicate';
        duplicate.onclick = () => {
            this.duplicatePiece(uiPiece);
            menu.remove();
        };
    
        const del = document.createElement('div');
        del.textContent = 'Delete';
        del.onclick = () => {
            this.deletePiece(uiPiece);
            menu.remove();
        };
    
        menu.append(duplicate, del);
        this.window.container.appendChild(menu); // 💡 Append to window, not body
    
        setTimeout(() => {
            document.addEventListener('click', () => menu.remove(), { once: true });
        }, 0);
    }
    

    deletePiece(uiPiece) {
        this.pieces = this.pieces.filter(p => p !== uiPiece);
        if (uiPiece.container?.parentElement) uiPiece.container.remove();
        if(uiPiece.boardContainer?.parentElement) uiPiece.boardContainer.remove();
    
    
    }


    swapPieces(ui1, ui2) {
        const el1 = ui1.container;
        const el2 = ui2.container;
        const parent = el1.parentElement;
    
        const el1Next = el1.nextElementSibling;
        const el2Next = el2.nextElementSibling;
    
        parent.insertBefore(el2, el1Next);
        parent.insertBefore(el1, el2Next);
    
        // Update internal order
        const index1 = this.pieces.indexOf(ui1);
        const index2 = this.pieces.indexOf(ui2);
        if (index1 > -1 && index2 > -1) {
            [this.pieces[index1], this.pieces[index2]] = [this.pieces[index2], this.pieces[index1]];
        }
    }
    
}
