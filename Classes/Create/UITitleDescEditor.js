class UITitleDescEditor {
    constructor(title = "", descriptionParagraphs = []) {
        this.title = title; 
        this.descriptionParagraphs = descriptionParagraphs;   

        this.container = null;
        this.window = null;

        this.createContainer();
        this.createWindow();
    }

    createContainer() {
        const content = document.createElement('div');
        content.classList.add('ui-titledesc-editor');
        content.style.display = 'flex';
        content.style.flexDirection = 'column';
        content.style.gap = '20px';

        // this.variablesSection = this.createVariableSection();
        // this.scriptsSection = this.createScriptSection();

        this.titleBox = this.createTitle();

        this.paragraphAddButton = document.createElement('button');
        this.paragraphAddButton.textContent = "Add Paragraph";
        this.paragraphAddButton.onclick = () => {
            this.descriptionParagraphs.push("");
            this.refreshParagraphSection();
        }
        this.paragraphAddButton.style.setProperty("margin", "10px");
        this.paragraphRemoveButton = document.createElement('button');
        this.paragraphRemoveButton.textContent = "Remove Last Paragraph";
        this.paragraphRemoveButton.onclick = () => {
            this.descriptionParagraphs.pop();
            this.refreshParagraphSection();
        }
        this.paragraphRemoveButton.style.setProperty("margin", "10px");
        this.buttonSection = document.createElement('div');
        this.buttonSection.appendChild(this.paragraphAddButton);
        this.buttonSection.appendChild(this.paragraphRemoveButton);

        this.paragraphSection = this.createParagraphSection();
        this.refreshParagraphSection();

        content.appendChild(this.titleBox);
        content.appendChild(this.paragraphSection);
        content.appendChild(this.buttonSection);

        // content.appendChild(this.variablesSection);
        // content.appendChild(this.scriptsSection);

        this.container = content;
    }

    createTitle() {
        const titletitle = document.createElement('p');
        titletitle.textContent = "Title:";
        const textbox = document.createElement('textarea');
        textbox.classList.add("full-width-input");
        textbox.value = this.title;
        textbox.onchange = () => {
            this.title = textbox.value;
        }
        const titlearea = document.createElement('div');
        titlearea.appendChild(titletitle);
        titlearea.appendChild(textbox);
        return titlearea;
    }

    createParagraphSection() {
        const section = document.createElement('div');
        const textbox = document.createElement('p');
        textbox.textContent = "Paragraphs:";
        section.appendChild(textbox);
        return section;
    }
    
    refreshParagraphSection() {
        while (this.paragraphSection.childElementCount - 1 < this.descriptionParagraphs.length) {
            const newParagraph = document.createElement('textarea');
            newParagraph.classList.add("description-paragraph", "full-width-input");
            let paragraphIndex = this.paragraphSection.childElementCount - 1;
            newParagraph.onchange = () => {
                this.descriptionParagraphs[paragraphIndex] = newParagraph.value;
                this.refreshParagraphSection();
            }
            this.paragraphSection.appendChild(newParagraph);
        }
        while (this.paragraphSection.childElementCount - 1 > this.descriptionParagraphs.length) {
            this.paragraphSection.removeChild(this.paragraphSection.lastElementChild);
        }
        for (let paragraphNum = 0; paragraphNum < this.descriptionParagraphs.length; paragraphNum++) {
            this.paragraphSection.children[paragraphNum + 1].value = this.descriptionParagraphs[paragraphNum];
        }
        if (this.descriptionParagraphs.length == 0) this.paragraphRemoveButton.style.setProperty("display", "none");
        else this.paragraphRemoveButton.style.setProperty("display", "inline-block");
    }

    createWindow() {
        const win = new WindowContainer('Title/Description Editor', true, {
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
