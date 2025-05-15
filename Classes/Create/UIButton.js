class UIButton {
    constructor(button) {
        this.button = button;
        console.log(button)
        this.container = this.createContainer();
        this.editorWindow = null;

        // Sync existing scripts from logic
        this.clickRules = button.clickScripts.map(script =>
            new UIScriptingRule(new ScriptingRuleForm(script, true, "Button"), rule => this.removeClickRule(rule))
        );

        this.visibleRules = button.visibleRules.map(script =>
            new UIScriptingRule(new ScriptingRuleForm(script, true, "Button"), rule => this.removeVisibleRule(rule))
        );
    }

    createContainer() {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.justifyContent = 'space-between';
        row.style.padding = '6px 0';
        row.style.cursor = 'pointer';

        // Preview
        const preview = document.createElement('button');

        preview.textContent = this.button.sprite.text;
        preview.style.backgroundColor = this.button.sprite.fillColor;
        preview.style.color = this.button.sprite.textColor;
        preview.style.border = `2px solid ${this.button.sprite.borderColor}`;
        preview.style.borderRadius = this.button.sprite.borderRadius || '5px';
        preview.style.padding = '4px 8px';
        preview.disabled = !this.button.enabled;
        preview.style.pointerEvents = 'none';
        row.appendChild(preview);

        const nameSpan = document.createElement('span');
        nameSpan.textContent = this.button.name || '[Unnamed Button]';
        nameSpan.style.flexGrow = 1;
        nameSpan.style.padding = '0 10px';
        row.appendChild(nameSpan);

        // Controls
        const controls = document.createElement('div');
        controls.style.display = 'flex';
        controls.style.gap = '6px';

        const upBtn = document.createElement('button');
        upBtn.textContent = '↑';
        upBtn.onclick = e => {
            e.stopPropagation();
            buttonEditor.moveButtonUp(this);
        };

        const downBtn = document.createElement('button');
        downBtn.textContent = '↓';
        downBtn.onclick = e => {
            e.stopPropagation();
            buttonEditor.moveButtonDown(this);
        };

        const duplicateBtn = document.createElement('button');
        duplicateBtn.textContent = '⧉';
        duplicateBtn.onclick = e => {
            e.stopPropagation();
            buttonEditor.duplicateButton(this);
        };

        const removeBtn = document.createElement('button');
        removeBtn.textContent = '✕';
        removeBtn.onclick = e => {
            e.stopPropagation();
            this.container.remove();
            buttonEditor.removeButton(this);
        };

        controls.append(upBtn, downBtn, duplicateBtn, removeBtn);
        row.appendChild(controls);

        row.addEventListener('click', () => this.openEditorWindow());

        this._nameSpan = nameSpan;
        this._preview = preview;

        return row;
    }

    updateDisplay() {
        this._nameSpan.textContent = this.button.name;
        const s = this.button.sprite;
        this._preview.textContent = s.text;
        this._preview.style.backgroundColor = s.fillColor;
        this._preview.style.color = s.textColor;
        this._preview.style.borderColor = s.borderColor;
        this._preview.style.borderRadius = s.borderRadius || '5px';
        this._preview.disabled = !this.button.enabled;
    }

    openEditorWindow() {
        if (this.editorWindow && document.body.contains(this.editorWindow.container)) {
            this.editorWindow.container.style.zIndex = ++__windowZIndex;
            return;
        }

        const win = new WindowContainer(`Button: ${this.button.name}`, true, {
            width: 400,
            height: 520,
            offsetTop: 100,
            offsetLeft: 500
        });
        this.editorWindow = win;

        const content = document.createElement('div');
        content.style.display = 'flex';
        content.style.flexDirection = 'column';
        content.style.gap = '8px';

        // Name + Style
        const nameInput = document.createElement('input');
        nameInput.placeholder = 'Button Name';
        nameInput.value = this.button.name || '';
        nameInput.addEventListener('input', () => {
            const name = nameInput.value.trim();
            const dup = buttonEditor.buttons.find(b => b !== this && b.button.name === name);
            if (!name || dup) {
                nameInput.style.borderColor = 'red';
                return;
            }
            nameInput.style.borderColor = '';
            this.button.name = name;
            this.updateDisplay();
            win.header.querySelector('span').textContent = `Button: ${name}`;
        });

        const fillInput = document.createElement('input');
        fillInput.type = 'color';
        fillInput.value = this.button.sprite.fillColor;
        fillInput.oninput = () => {
            this.button.sprite.fillColor = fillInput.value;
            this.updateDisplay();
        };

        const textInput = document.createElement('input');
        textInput.value = this.button.sprite.text;
        textInput.oninput = () => {
            this.button.sprite.text = textInput.value;
            this.updateDisplay();
        };

        const textColorInput = document.createElement('input');
        textColorInput.type = 'color';
        textColorInput.value = this.button.sprite.textColor;
        textColorInput.oninput = () => {
            this.button.sprite.textColor = textColorInput.value;
            this.updateDisplay();
        };

        const borderColorInput = document.createElement('input');
        borderColorInput.type = 'color';
        borderColorInput.value = this.button.sprite.borderColor;
        borderColorInput.oninput = () => {
            this.button.sprite.borderColor = borderColorInput.value;
            this.updateDisplay();
        };

        const radiusInput = document.createElement('input');
        radiusInput.type = 'range';
        radiusInput.min = 0;
        radiusInput.max = 20;
        radiusInput.value = parseInt(this.button.sprite.borderRadius);
        radiusInput.oninput = () => {
            this.button.sprite.borderRadius = `${radiusInput.value}px`;
            this.updateDisplay();
        };

        // ---- Click Scripts ----
        const clickHeader = document.createElement('div');
        clickHeader.innerHTML = '<strong>Click Scripts</strong>';
        const clickList = document.createElement('div');
        const addClick = document.createElement('button');
        addClick.textContent = '+ Add Click Script';
        addClick.onclick = () => {
            const rule = new UIScriptingRule(
                new ScriptingRuleForm(new ScriptingRule("Button Clicked", "Value", 0), true, "Button"),
                r => this.removeClickRule(r)
            );
            this.clickRules.push(rule);
            this.button.clickScripts.push(rule.form.rule);
            clickList.appendChild(rule.container);
        };

        this.clickRules.forEach(rule => clickList.appendChild(rule.container));

        // ---- Visibility Rules ----
        const visHeader = document.createElement('div');
        visHeader.innerHTML = '<strong>Visible Rules</strong>';
        const visList = document.createElement('div');
        const addVis = document.createElement('button');
        addVis.textContent = '+ Add Visible Rule';
        addVis.onclick = () => {
            const rule = new UIScriptingRule(
                new ScriptingRuleForm(new ScriptingRule("Always", "Condition"), true, "Button"),
                r => this.removeVisibleRule(r)
            );
            this.visibleRules.push(rule);
            this.button.visibleRules.push(rule.form.rule);
            visList.appendChild(rule.container);
        };

        this.visibleRules.forEach(rule => visList.appendChild(rule.container));

        // Layout
        content.append(
            nameInput,
            this._labeledRow("Fill Color", fillInput),
            this._labeledRow("Text", textInput),
            this._labeledRow("Text Color", textColorInput),
            this._labeledRow("Border Color", borderColorInput),
            this._labeledRow("Border Radius", radiusInput),
            clickHeader,
            clickList,
            addClick,
            visHeader,
            visList,
            addVis
        );

        win.appendContent(content);
    }

    removeClickRule(rule) {
        const i = this.clickRules.indexOf(rule);
        if (i !== -1) this.clickRules.splice(i, 1);

        const j = this.button.clickScripts.indexOf(rule.form.rule);
        if (j !== -1) this.button.clickScripts.splice(j, 1);

        if (rule.container?.parentElement) rule.container.remove();
    }

    removeVisibleRule(rule) {
        const i = this.visibleRules.indexOf(rule);
        if (i !== -1) this.visibleRules.splice(i, 1);

        const j = this.button.visibleRules.indexOf(rule.form.rule);
        if (j !== -1) this.button.visibleRules.splice(j, 1);

        if (rule.container?.parentElement) rule.container.remove();
    }

    _labeledRow(label, input) {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';
        row.style.alignItems = 'center';
        const span = document.createElement('span');
        span.textContent = label;
        row.appendChild(span);
        row.appendChild(input);
        return row;
    }
}
