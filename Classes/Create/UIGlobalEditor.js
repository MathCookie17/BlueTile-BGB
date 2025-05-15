class UIGlobalEditor {
    constructor(globalVariables = [], globalScripts = []) {
        this.globalVariables = globalVariables; 
        this.globalScripts = globalScripts;   

        this.container = null;
        this.window = null;

        this.createContainer();
        this.createWindow();
    }

    createContainer() {
        const content = document.createElement('div');
        content.classList.add('ui-global-editor');
        content.style.display = 'flex';
        content.style.flexDirection = 'column';
        content.style.gap = '20px';

        this.variablesSection = this.createVariableSection();
        this.scriptsSection = this.createScriptSection();

        content.appendChild(this.variablesSection);
        content.appendChild(this.scriptsSection);

        this.container = content;
    }

    createVariableSection() {
        const wrapper = document.createElement('div');
        wrapper.classList.add('ui-global-variable-section');
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
        title.textContent = 'Global Variables';
    
        const addBtn = document.createElement('button');
        addBtn.textContent = '+ Add Variable';
        addBtn.onclick = () => {
            const chooser = document.createElement('div');
            chooser.style.display = 'flex';
            chooser.style.gap = '4px';
            chooser.classList.add('ui-global-vars-chooser');
    
            const createTypeButton = (label, defaultValue) => {
                const btn = document.createElement('button');
                btn.textContent = label;
                btn.addEventListener('click', () => {
                    this.globalVariables.push({ name: '', value: defaultValue, display:false });
                    this.refreshVariableList();
                    chooser.remove();
                });
                return btn;
            };
    
            chooser.appendChild(createTypeButton('String', ''));
            chooser.appendChild(createTypeButton('Number', 0));
            chooser.appendChild(createTypeButton('Boolean', false));
    
            this.variablesListDiv.appendChild(chooser);
        };
    
        toolbar.appendChild(title);
        toolbar.appendChild(addBtn);
    
        this.variablesListDiv = document.createElement('div');
        this.variablesListDiv.style.display = 'flex';
        this.variablesListDiv.style.flexDirection = 'column';
        this.variablesListDiv.style.gap = '4px';
    
        wrapper.appendChild(toolbar);
        wrapper.appendChild(this.variablesListDiv);
    
        this.refreshVariableList();
    
        return wrapper;
    }
    

refreshVariableList() {
    this.variablesListDiv.innerHTML = '';

    this.globalVariables.forEach((v, i) => {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.gap = '4px';
        row.classList.add('ui-global-vars-row');

        const nameInput = document.createElement('input');
        nameInput.value = v.name;
        nameInput.placeholder = 'name';
        nameInput.style.width = '80px';
        nameInput.classList.add('ui-global-vars-name');

        nameInput.addEventListener('input', e => {
            const newName = e.target.value.trim();
            const isDuplicate = this.globalVariables.some((other, j) => j !== i && other.name === newName);
            if (!newName || isDuplicate) {
                nameInput.style.borderColor = 'red';
                return;
            }
            nameInput.style.borderColor = '';
            v.name = newName;
        });

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
        valueInput.classList.add('ui-global-vars-value');

        const upBtn = document.createElement('button');
        upBtn.textContent = '↑';
        upBtn.addEventListener('click', () => {
            if (i > 0) {
                [this.globalVariables[i - 1], this.globalVariables[i]] = [this.globalVariables[i], this.globalVariables[i - 1]];
                this.refreshVariableList();
            }
        });

        const downBtn = document.createElement('button');
        downBtn.textContent = '↓';
        downBtn.addEventListener('click', () => {
            if (i < this.globalVariables.length - 1) {
                [this.globalVariables[i], this.globalVariables[i + 1]] = [this.globalVariables[i + 1], this.globalVariables[i]];
                this.refreshVariableList();
            }
        });

        const delBtn = document.createElement('button');
        delBtn.textContent = '✕';
        delBtn.addEventListener('click', () => {
            this.globalVariables.splice(i, 1);
            this.refreshVariableList();
        });

        row.appendChild(nameInput);
        row.appendChild(valueInput);
        row.appendChild(upBtn);
        row.appendChild(downBtn);
        row.appendChild(delBtn);

        this.variablesListDiv.appendChild(row);
    });
}


    createScriptSection() {
        const wrapper = document.createElement('div');
        wrapper.classList.add('ui-global-script-section');
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
        title.textContent = 'Global Scripts';

        const addBtn = document.createElement('button');
        addBtn.textContent = '+ Add Script';
        addBtn.onclick = () => {
            const ruleForm = new ScriptingRuleForm(new ScriptingRule("Start Turn", "Value", 0), true, "None");
            const uiRule = new UIScriptingRule(ruleForm, (r) => this.removeRule(r));
            this.globalScripts.push(uiRule);
            this.refreshScriptList();
        };

        toolbar.appendChild(title);
        toolbar.appendChild(addBtn);

        this.scriptsListDiv = document.createElement('div');
        this.scriptsListDiv.style.display = 'flex';
        this.scriptsListDiv.style.flexDirection = 'column';
        this.scriptsListDiv.style.gap = '6px';

        wrapper.appendChild(toolbar);
        wrapper.appendChild(this.scriptsListDiv);

        this.refreshScriptList();

        return wrapper;
    }

    refreshScriptList() {
        this.scriptsListDiv.innerHTML = '';
        this.globalScripts.forEach(rule => this.scriptsListDiv.appendChild(rule.container));
    }

    removeRule(rule) {
        const index = this.globalScripts.indexOf(rule);
        if (index !== -1) {
            this.globalScripts.splice(index, 1);
            this.refreshScriptList();
        }
    }

    createWindow() {
        const win = new WindowContainer('Global Editor', true, {
            width: 450,
            height: 550,
            offsetTop: 80,
            offsetLeft: 450
        });

        win.appendContent(this.container);
        this.window = win;
        this.window.beforeClose = () => this.window = null;
    }
}
