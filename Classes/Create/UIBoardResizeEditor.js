class UIBoardResizeEditor {
    constructor() {
        this.createContainer();
        this.createWindow();
        this.reload();
    }

    createContainer() {
        const content = document.createElement('div');
        content.classList.add('ui-boardresize-editor');
        content.style.display = 'flex';
        content.style.flexDirection = 'column';
        content.style.gap = '20px';

        // this.variablesSection = this.createVariableSection();
        // this.scriptsSection = this.createScriptSection();

        this.warningP = document.createElement("p");
        this.warningP.textContent = "WARNING: Resizing the board will delete preexisting tiles if they fall outside the new boundaries. Proceed with caution.";
        content.appendChild(this.warningP);

        this.boardShapeP = document.createElement("p");
        this.boardShapeP.textContent = "Board Shape: ";
        this.boardShapeI = document.createElement("select");
        let boardShapeOption = document.createElement("option");
        boardShapeOption.value = "Square";
        boardShapeOption.textContent = "Square";
        this.boardShapeI.appendChild(boardShapeOption);
        boardShapeOption = document.createElement("option");
        boardShapeOption.value = "Hex";
        boardShapeOption.textContent = "Hex";
        this.boardShapeI.appendChild(boardShapeOption);
        boardShapeOption = document.createElement("option");
        boardShapeOption.value = "Triangle";
        boardShapeOption.textContent = "Triangle";
        this.boardShapeI.appendChild(boardShapeOption);
        this.boardShapeI.addEventListener("change", () => {
            this.settings[0] = this.boardShapeI.value;
            this.refresh();
        });
        this.boardShapeP.appendChild(this.boardShapeI);
        content.appendChild(this.boardShapeP);

        this.widthP = document.createElement("p");
        this.widthP.textContent = "Board Width: ";
        this.widthI = document.createElement("input");
        this.widthI.type = "number";
        this.widthI.addEventListener("change", () => {
            this.settings[1] = this.widthI.value;
            this.refresh();
        })
        this.widthP.appendChild(this.widthI);
        content.appendChild(this.widthP);

        this.heightP = document.createElement("p");
        this.heightP.textContent = "Board Height: ";
        this.heightI = document.createElement("input");
        this.heightI.type = "number";
        this.heightI.addEventListener("change", () => {
            this.settings[2] = this.heightI.value;
            this.refresh();
        })
        this.heightP.appendChild(this.heightI);
        content.appendChild(this.heightP);

        this.minPlayersP = document.createElement("p");
        this.minPlayersP.textContent = "Min Players: ";
        this.minPlayersI = document.createElement("input");
        this.minPlayersI.type = "number";
        this.minPlayersI.addEventListener("change", () => {
            this.settings[3] = this.minPlayersI.value;
            this.refresh();
        })
        this.minPlayersP.appendChild(this.minPlayersI);
        content.appendChild(this.minPlayersP);

        this.maxPlayersP = document.createElement("p");
        this.maxPlayersP.textContent = "Min Players: ";
        this.maxPlayersI = document.createElement("input");
        this.maxPlayersI.type = "number";
        this.maxPlayersI.addEventListener("change", () => {
            this.settings[4] = this.maxPlayersI.value;
            this.refresh();
        })
        this.maxPlayersP.appendChild(this.maxPlayersI);
        content.appendChild(this.maxPlayersP);

        this.submitButton = document.createElement("button");
        this.submitButton.textContent = "Resize Board";
        this.submitButton.addEventListener("click", () => {
            resizeBoard(...this.settings);
            this.window.close();
        })
        content.appendChild(this.submitButton);

        // content.appendChild(this.variablesSection);
        // content.appendChild(this.scriptsSection);

        this.container = content;
    }

    reload() {
        this.settings = [boardEditor.board.boardShape, boardEditor.board.width, boardEditor.board.height, minPlayers, maxPlayers];
        this.refresh();
    }

    refresh() {
        this.boardShapeI.value = this.settings[0];
        this.widthI.value = this.settings[1];
        this.heightI.value = this.settings[2];
        this.minPlayersI.value = this.settings[3];
        this.maxPlayersI.value = this.settings[4];
        this.validateInputs();
    }

    validateInputs() {
        const widthValid = this.widthI.checkValidity() && parseInt(this.widthI.value) > 0 && parseInt(this.widthI.value) < 999;
        const heightValid = this.heightI.checkValidity() && parseInt(this.heightI.value) > 0 && parseInt(this.heightI.value) < 999;
    
        const minValid = this.minPlayersI.checkValidity() && this.minPlayersI.value >= 1;
        const maxValid = this.maxPlayersI.checkValidity() && this.maxPlayersI.value >= this.minPlayersI.value;

        this.submitButton.disabled = !(widthValid && heightValid && minValid && maxValid);
    }

    createWindow() {
        const win = new WindowContainer('Resize the Board', true, {
            width: 450,
            height: 550,
            offsetTop: 80,
            offsetLeft: 450
        });

        win.appendContent(this.container);
        this.window = win;
        this.window.beforeClose = () => this.window = null;

        this.reload();
    }
}
