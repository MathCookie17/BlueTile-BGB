class GameGlobalVariables {
    constructor(layoutInfo) {
        this.layoutInfo = layoutInfo;
        this.container = new GameElementContainer({ ...layoutInfo });

        this.displayedVars = layoutInfo.displayVariables;
        this.displayBox = document.createElement('div');
        this.displayBox.style.padding = '10px';
        this.displayBox.style.fontFamily = 'monospace';
        this.displayBox.style.fontSize = '14px';
        this.displayBox.style.color = '#000';

        this.container.addContent(this.displayBox);
        this.refresh();
    }

    refresh() {
        this.displayBox.innerHTML = '';

        // Add built-in core fields from activeGameState
        const coreVars = [
            { name: 'playerAmount', value: activeGameState.playerAmount },
            { name: 'turnNumber', value: activeGameState.turnNumber },
            { name: 'playerTurn', value: activeGameState.playerTurn },
            { name: 'turnPhase', value: activeGameState.turnPhase }
        ];

        coreVars.forEach(v => {
            const row = document.createElement('div');
            if (v.name === "playerAmount") {
                row.textContent = `There are ${v.value} players.`;
            }
            else if (v.name === "turnNumber") {
                if (v.value === Infinity) row.textContent = `The game is over.`;
                else row.textContent = `${v.value - 1} turn cycles have elapsed.`;
            }
            else if (v.name === "playerTurn") {
                if (activeGameState.turnNumber === Infinity) {
                    if (v.value === 0) row.textContent = `It's a draw!`;
                    else if (v.value === Infinity) row.textContent = `Everyone wins!`;
                    else if (v.value < 0) row.textContent = `Player ${Math.abs(v.value)} loses!`
                    else row.textContent = `Player ${v.value} wins!`
                }
                else row.textContent = `It is Player ${v.value}'s turn.`;
            }
            else if (v.name === "turnPhase") {
                if (activeGameState.turnNumber === Infinity) {
                    row.textContent = "";
                }
                else if (activeGameState.turnPhase === Infinity) {
                    row.textContent = "The current turn is ending. (If you're seeing this text for more than a split-second, either this game is laggy or there's a bug with BlueTile)";
                }
                else {
                    row.textContent = `Turn Phase: ${v.value}`;
                }
            }
            else row.textContent = `${v.name}: ${v.value}`;
            this.displayBox.appendChild(row);
        });

        // Add user-defined variables (if any)
        this.displayedVars.forEach(name => {
            if (coreVars.some(v => v.name === name)) return; // Skip if already shown

            const match = activeGameState.globalVariables.find(v => v.name === name);
            if (match) {
                const row = document.createElement('div');
                row.textContent = `${match.name}: ${match.value}`;
                this.displayBox.appendChild(row);
            }
        });
    }

    update() {
        this.refresh();
    }

    getElement() {
        return this.container.getElement();
    }

    saveCode() {
        return {
            layoutInfo: this.layoutInfo
        }
    }

    clone() {
        return GameGlobalVariables.loadCode(this.saveCode());
    }

    static loadCode(code) {
        const viewer = new GameGlobalVariables();
        viewer.layoutInfo = code.layoutInfo ?? {containerWidth: -1, containerHeight: -1, containerTop: -1, containerLeft:-1, borderColor:'rgba(0, 0, 0, 0.9)', borderWidth:'2px', backgroundColor:'rgba(255, 255, 255, 0.9)', displayVariables:[]};
        return viewer;
    }
}
