class UIType {
    constructor(type, kind) { // kind = 'tile' | 'piece' | 'button'
        this.type = type;
        this.kind = kind;
        this.container = this.createContainer();
        this.window = null;
        this.refreshEditorWindowContent = null;
        this.rules = this.type.scripts.map(script =>
            new UIScriptingRule(new ScriptingRuleForm(script, true, this.kind[0].toUpperCase() + this.kind.slice(1)), obj => this.removeRule(obj))
        );
    }

    createContainer() {
        const row = document.createElement('div');
        row.style.height = `18px`;
        row.style.paddingTop = '6px';
        row.style.paddingBottom = '6px';
        row.style.fontSize = '18px';
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';
        row.style.alignItems = 'center';
        row.style.cursor = 'pointer';
    
        const nameSpan = document.createElement('span');
        nameSpan.textContent = this.type.typeName;
        row.appendChild(nameSpan);
    
        const controls = document.createElement('div');
        controls.style.display = 'flex';
        controls.style.gap = '4px';
    
        // Move Up
        const upBtn = document.createElement('button');
        upBtn.textContent = '↑';
        upBtn.title = 'Move up';
        upBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const parent = row.parentElement;
            if (row.previousElementSibling) {
                parent.insertBefore(row, row.previousElementSibling);
            }
        });
    
        // Move Down
        const downBtn = document.createElement('button');
        downBtn.textContent = '↓';
        downBtn.title = 'Move down';
        downBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const parent = row.parentElement;
            const next = row.nextElementSibling;
            if (next) {
                parent.insertBefore(next, row);
            }
        });
    
        // Duplicate
        const duplicateBtn = document.createElement('button');
        duplicateBtn.textContent = '⧉';
        duplicateBtn.title = 'Duplicate type';
        duplicateBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            typeEditor.duplicateType(this);
        });
    
        // Remove
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '✕';
        removeBtn.title = 'Remove type';
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            row.remove();
            typeEditor.removeType(this)
        });
    
        controls.appendChild(upBtn);
        controls.appendChild(downBtn);
        controls.appendChild(duplicateBtn);
        controls.appendChild(removeBtn);
        row.appendChild(controls);
    
        row.addEventListener('click', () => this.openEditorWindow());
    
        this._nameSpan = nameSpan;
        return row;
    }
    
    

    openEditorWindow() {

        if (this.window && document.body.contains(this.window.container)) {
            this.window.container.style.zIndex = ++__windowZIndex;
            this.refreshEditorWindowContent?.();
            return;
        }
        

        const win = new WindowContainer(`Type: ${this.type.typeName}`, true, {
            width: 350,
            height: 400,
            offsetTop: 80,
            offsetLeft: 520
        });

        const content = document.createElement('div');
        content.style.display = 'flex';
        content.style.flexDirection = 'column';
        content.style.gap = '8px';

        // Name
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.value = this.type.typeName;
        nameInput.addEventListener('input', e => {
            const newName = e.target.value.trim();
            const list = {
                tile: typeEditor.tileTypes,
                piece: typeEditor.pieceTypes,
            }[this.kind];
        
            const isDuplicate = list.some(t => t !== this && t.type.typeName === newName);
        
            if (isDuplicate) {
                nameInput.style.borderColor = 'red';
                return;
            }
        
            nameInput.style.borderColor = '';
            this.type.typeName = newName;
            this._nameSpan.textContent = newName;
            win.header.querySelector('span').textContent = `Type: ${newName}`;
        });
        

        const nameLabel = document.createElement('label');
        nameLabel.textContent = 'Name:';
        nameLabel.appendChild(nameInput);
        content.appendChild(nameLabel);

        // Scripting Rules
        const rulesHeader = document.createElement('div');
        rulesHeader.innerHTML = '<strong>Scripting Rules</strong>';
        content.appendChild(rulesHeader);

        const rulesList = document.createElement('div');
        rulesList.id = 'rules-list';
        content.appendChild(rulesList);
        this.rules.forEach(rule => rulesList.appendChild(rule.container));


        const addRule = document.createElement('button');
        addRule.textContent = '+ Add Rule';
        addRule.addEventListener('click', () => {
            var newRule = new UIScriptingRule(new ScriptingRuleForm(new ScriptingRule("Piece Moves", "Value", 0), true, String(this.kind).charAt(0).toUpperCase() + String(this.kind).slice(1)), (obj) => this.removeRule(obj) )
            this.rules.push(newRule)
            this.type.scripts.push(newRule.form.rule); // now syncs with logic
            rulesList.appendChild(newRule.container);
        });
        content.appendChild(addRule);

        // Public Vars
        const varsHeader = document.createElement('div');
        varsHeader.innerHTML = '<strong>Public Variables</strong>';
        content.appendChild(varsHeader);

        const varsList = document.createElement('div');
        varsList.id = 'vars-list';
        content.appendChild(varsList);

        const renderVars = () => {
            varsList.innerHTML = '';
            
            this.type.publicVars.forEach((v, index) => {
                const row = document.createElement('div');
                row.style.display = 'flex';
                row.style.gap = '4px';
                row.style.alignItems = 'center';
        
                const name = document.createElement('input');
                name.value = v.name;
                name.placeholder = 'name';
                name.style.width = '75px';
                name.addEventListener('input', e => {
                    v.name = e.target.value.trim();
                });
        
                // Dynamic Value Input based on typeof v.value
                let valueInput;
        
                if (typeof v.value === 'boolean') {
                    valueInput = document.createElement('button');
                    valueInput.textContent = v.value;
                    valueInput.addEventListener('click', () => {
                        v.value = !v.value;
                        valueInput.textContent = v.value;
                    });
                } else if (typeof v.value === 'number') {
                    valueInput = document.createElement('input');
                    valueInput.type = 'number';
                    valueInput.value = v.value;
                    valueInput.style.width = '75px';
                    valueInput.addEventListener('input', e => {
                        const parsed = Number(e.target.value);
                        v.value = isNaN(parsed) ? 0 : parsed;
                    });
                } else {
                    valueInput = document.createElement('input');
                    valueInput.value = v.value;
                    valueInput.style.width = '75px';
                    valueInput.addEventListener('input', e => {
                        v.value = e.target.value;
                    });
                }
        
                const remove = document.createElement('button');
                remove.textContent = '✕';
                remove.addEventListener('click', () => {
                    this.type.publicVars.splice(index, 1);
                    renderVars();
                });
        
                row.appendChild(name);
                row.appendChild(valueInput);
                row.appendChild(remove);
                varsList.appendChild(row);
            });
        };
        
        
        

        const addVar = document.createElement('button');
        addVar.textContent = '+ Add Public Var';
        addVar.addEventListener('click', () => {
            const chooser = document.createElement('div');
            chooser.style.display = 'flex';
            chooser.style.gap = '4px';
        
            const createBtn = (label, value) => {
                const btn = document.createElement('button');
                btn.textContent = label;
                btn.addEventListener('click', () => {
                    this.type.publicVars.push({ name: '', value });
                    renderVars();
                    chooser.remove();
                });
                return btn;
            };
        
            chooser.appendChild(createBtn('String', ''));
            chooser.appendChild(createBtn('Number', 0));
            chooser.appendChild(createBtn('Boolean', false));
        
            varsList.appendChild(chooser);
        });
        content.appendChild(addVar);
        

        renderVars();

        win.appendContent(content);
        this.window = win;

        //UPDATES THE WIDNOW
        this.refreshEditorWindowContent = () => {
            nameInput.value = this.type.typeName;
            nameInput.dispatchEvent(new Event('input')); 
            this.rules.forEach(rule => rule.updateName())
            
            renderVars();
            win.header.querySelector('span').textContent = `Type: ${this.type.typeName}`;
        };
        
        this.refreshEditorWindowContent();
        win.onMouseDown = () => { 
            if(__windowZIndex != win.container.style.zIndex)
                this.refreshEditorWindowContent()}
        
        this.window = win;
        win.appendContent(content);
        //
    }

    removeRule(rule) {
        const index = this.rules.indexOf(rule);
        if (index !== -1) {
            this.rules.splice(index, 1);
            if (rule.container && rule.container.parentElement) {
                rule.container.remove();
            }
        }
    
        const logicIndex = this.type.scripts.indexOf(rule.form.rule);
        if (logicIndex !== -1) {
            this.type.scripts.splice(logicIndex, 1);
        }
    }
    
    
}
