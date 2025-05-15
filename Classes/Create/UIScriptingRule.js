class UIScriptingRule {
    constructor(scriptingRuleForm, onDeleteCallback) {
        this.form = scriptingRuleForm;
        this.updateName = () => {}
        this.container = this.createUI();
        this.onDeleteCallback = onDeleteCallback;
    }

    createUI() {
        const container = document.createElement("div");
        container.classList.add("uiScriptingRuleRow");
        container.style.display = "flex";
        container.style.alignItems = "center";
        container.style.gap = "8px";
        container.style.padding = "4px";
        container.style.cursor = "pointer";
        container.style.border = "1px solid #ccc";
        container.style.borderRadius = "4px";
        container.style.marginBottom = "4px";

        // Name input
        const nameInput = document.createElement("input");
        nameInput.value = this.form.name;
        nameInput.classList.add("uiScriptingRuleNameInput");
        nameInput.style.flexGrow = "1";
        nameInput.addEventListener("change", () => {
            this.form.name = nameInput.value;
            if(this.form.window)
                this.form.window.header.querySelector('span').textContent = `Rule: ${this.form.name}`;
        });
        container.appendChild(nameInput);

        this.updateName = () => {
            nameInput.value = this.form.name;
            console.log("UPDATE NAME TO: ", this.form.name)
        }

        // Open button
        const openBtn = document.createElement("button");
        openBtn.innerHTML = "✏️";
        openBtn.classList.add("uiScriptingRuleOpenBtn");
        openBtn.title = "Edit rule";
        openBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            this.form.openEditorWindow();
        });
        container.appendChild(openBtn);

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "❌";
        deleteBtn.classList.add("uiScriptingRuleDeleteBtn");
        deleteBtn.title = "Delete rule";
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            container.remove();
            if (this.onDeleteCallback) this.onDeleteCallback(this);
        });
        container.appendChild(deleteBtn);

        // Make clicking the row (outside the buttons) open the editor
        container.addEventListener("click", () => {
            this.form.openEditorWindow();
        });

        return container;
    }

    
}
