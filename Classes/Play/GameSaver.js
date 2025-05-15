class GameSaver {
    constructor({
        gameState,
        startGameState,
        tileTypes,
        pieceTypes,
        globalScripts,
        buttons,
        globalLayout,
        titledescLayout
    }) {
        this.gameState = gameState;
        this.startGameState = startGameState;
        this.tileTypes = tileTypes;
        this.pieceTypes = pieceTypes;
        this.globalScripts = globalScripts;
        this.buttons = buttons;
        this.globalLayout = globalLayout;
        this.titledescLayout = titledescLayout;
    }

    createSaveData() {
        return {
            gameState: this.gameState.saveCode(),
            startGameState : this.startGameState.saveCode(),
            tileTypes: this.tileTypes.map(t => t.saveCode()),
            pieceTypes: this.pieceTypes.map(p => p.saveCode()),
            globalScripts: this.globalScripts.map(s => s.saveCode()),
            buttons: this.buttons.map(b => b.saveCode()),
            globalLayout: this.globalLayout.saveCode(),
            titledescLayout: this.titledescLayout.saveCode(),
            metadata: {
                version: "1.0",
                savedAt: new Date().toISOString()
            }
        };
    }

    saveToFile(filename = "game_save.json") {
        const saveData = this.createSaveData();
        const blob = new Blob([JSON.stringify(saveData, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    attachDownloadButton(buttonSelector = ".save-button", filename = "game_save.json") {
        const button = document.querySelector(buttonSelector);
        if (!button) {
            console.warn(`Download button with selector "${buttonSelector}" not found.`);
            return;
        }

        button.addEventListener("click", () => {
            this.saveToFile(filename);
        });
    }
    
    static loadFromData(data) {
        return {
            gameState: GameState.loadCode(data.gameState),
            tileTypes: data.tileTypes.map(TileType.loadCode),
            pieceTypes: data.pieceTypes.map(PieceType.loadCode),
            pieces: data.pieces.map(Piece.loadCode),
            tiles: data.tiles.map(Tile.loadCode),
            board: Board.loadCode(data.board),
            scriptingRules: data.scriptingRules.map(ScriptingRule.loadCode),
            buttons: data.buttons.map(Button.loadCode)
        };
    }
}
