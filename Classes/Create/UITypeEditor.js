class UITypeEditor {
    constructor() {
        this.tileTypes = [];
        this.pieceTypes = [];
        this.container = null;
        this.window = null;

        this.tileListDiv = null;   // Will be set during makeSection
        this.pieceListDiv = null;  // Will be set during makeSection

        this.createContainer();
        this.createWindow();
    }

    createContainer() {
        const content = document.createElement('div');
        content.style.display = 'flex';
        content.style.flexDirection = 'column';
        content.style.gap = '20px';

        const makeSection = (label, list, kind) => {
            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.flexDirection = 'column';
            wrapper.style.border = '1px solid #ccc';
            wrapper.style.padding = '10px';

            const toolbar = document.createElement('div');
            toolbar.style.display = 'flex';
            toolbar.style.justifyContent = 'space-between';
            toolbar.style.alignItems = 'center';
            toolbar.style.marginBottom = '6px';

            const title = document.createElement('strong');
            title.textContent = label;

            const addBtn = document.createElement('button');
            addBtn.textContent = '+ Add';
            addBtn.onclick = () => {
                const newName = this.generateUniqueName("New Type", kind);
                const logicType = kind === 'tile'
                    ? new TileType(newName, [])
                    : new PieceType(newName, []);
                this.addType(logicType);
            };

            toolbar.appendChild(title);
            toolbar.appendChild(addBtn);

            const listDiv = document.createElement('div');
            listDiv.style.maxHeight = '200px';
            listDiv.style.overflowY = 'auto';
            listDiv.style.border = '1px solid #aaa';
            listDiv.style.padding = '6px';
            listDiv.style.display = 'flex';
            listDiv.style.flexDirection = 'column';
            listDiv.style.gap = '5px';

            if (kind === 'tile') this.tileListDiv = listDiv;
            if (kind === 'piece') this.pieceListDiv = listDiv;

            wrapper.appendChild(toolbar);
            wrapper.appendChild(listDiv);
            content.appendChild(wrapper);
        };

        makeSection('Tile Types', this.tileTypes, 'tile');
        makeSection('Piece Types', this.pieceTypes, 'piece');

        this.container = content;
    }

    createWindow() {
        const win = new WindowContainer('Types Editor', true, {
            width: 420,
            height: 500,
            offsetTop: 80,
            offsetLeft: 450
        });

        win.appendContent(this.container);
        this.window = win;
        this.window.beforeClose = () => this.window = null;
    }

    generateUniqueName(base, kind) {
        const list = kind === 'tile' ? this.tileTypes : this.pieceTypes;
        let index = 1;
        let name = base;
        const exists = (n) => list.some(t => t.type.typeName === n);
        while (exists(name)) name = `${base} ${index++}`;
        return name;
    }

    /**
     * Public method: Add a logical type (TileType or PieceType)
     * Automatically detects and adds to the correct list, and refreshes UI
     */
    addType(logicalType) {
        const isTile = logicalType instanceof TileType;
        const kind = isTile ? 'tile' : 'piece';

        const uiType = new UIType(logicalType, kind);

        if (isTile) {
            this.tileTypes.push(uiType);
            this.refreshList(this.tileTypes, this.tileListDiv);
        } else {
            this.pieceTypes.push(uiType);
            this.refreshList(this.pieceTypes, this.pieceListDiv);
        }
    }

    refreshList(list, container) {
        if (!container) return;
        container.innerHTML = '';
        list.forEach(t => container.appendChild(t.container));
    }

    duplicateType(original) {
        const clone = JSON.parse(JSON.stringify(original.type));
        clone.typeID = assignTypeID();
        clone.typeName = this.generateUniqueName(clone.typeName + '_copy', original.kind);
        this.addType(clone);
    }

    removeType(uiType) {
        const list = uiType.kind === 'tile' ? this.tileTypes : this.pieceTypes;
        const div = uiType.kind === 'tile' ? this.tileListDiv : this.pieceListDiv;

        const index = list.indexOf(uiType);
        if (index !== -1) {
            list.splice(index, 1);
            this.refreshList(list, div);
        }
    }
}
