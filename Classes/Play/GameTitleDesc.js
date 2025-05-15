class GameTitleDesc {
    constructor(layoutInfo, title = "", descriptionParagraphs = []) {
        this.layoutInfo = layoutInfo;
        this.container = new GameElementContainer({ ...layoutInfo });

        this.displayBox = document.createElement('div');
        this.displayBox.style.padding = '10px';
        this.displayBox.style.fontFamily = 'monospace';
        this.displayBox.style.fontSize = '14px';
        this.displayBox.style.color = '#000';

        const titleText = document.createElement('h2');
        titleText.textContent = title;
        titleText.style.setProperty("text-align", "center");
        this.displayBox.appendChild(titleText);

        for (let dp of descriptionParagraphs) {
            const descText = document.createElement('p');
            descText.textContent = dp;
            descText.style.setProperty("text-align", "center");
            this.displayBox.appendChild(descText);
        }

        this.container.addContent(this.displayBox);

        // No need for a refresh function, this won't change throughout the game
    }

    getElement() {
        return this.container.getElement();
    }

    saveCode() {
        return {
            layoutInfo: this.layoutInfo,
            title: this.title,
            descriptionParagraphs: this.descriptionParagraphs
        }
    }

    clone() {
        return GameGlobalVariables.loadCode(this.saveCode());
    }

    static loadCode(code) {
        const viewer = new GameGlobalVariables();
        viewer.layoutInfo = code.layoutInfo ?? {containerWidth: -1, containerHeight: -1, containerTop: -1, containerLeft:-1, borderColor:'rgba(0, 0, 0, 0.9)', borderWidth:'2px', backgroundColor:'rgba(255, 255, 255, 0.9)'};
        viewer.title = code.title;
        viewer.descriptionParagraphs = this.descriptionParagraphs;
        return viewer;
    }
}
