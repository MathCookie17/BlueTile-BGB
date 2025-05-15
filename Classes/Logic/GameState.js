class GameState {
    board;
    pieceArray;
    playerAmount;
    turnNumber;
    playerTurn;
    turnPhase;
    selectedObjects;
    globalVariables;
    inventories;

    constructor(board, pieces, playerAmount, turnNumber = 1, playerTurn = 1, turnPhase = 0, selectedObjects = [], globalVariables = []) {
        this.board = board;
        this.pieceArray = pieces;
        this.playerAmount = playerAmount;
        this.turnNumber = turnNumber;
        this.playerTurn = playerTurn;
        this.turnPhase = turnPhase;
        this.selectedObjects = selectedObjects;
        this.globalVariables = globalVariables;
        this.inventories = [];
    }
saveCode() {
    return {
        board: this.board.saveCode(),
        pieceArray: this.pieceArray.map(p => p?.saveCode?.() ?? null),
        playerAmount: this.playerAmount,
        turnNumber: this.turnNumber,
        playerTurn: this.playerTurn,
        turnPhase: this.turnPhase,
        selectedObjects: this.selectedObjects.map(o => o?.objectID ?? null),
        globalVariables: BGBStructuredClone(this.globalVariables),
        inventories: this.inventories?.map(inv => inv?.saveCode?.() ?? null) ?? [],
    };
}

clone(){
    return GameState.loadCode(this.saveCode());
}

static loadCode(data) {
    const board = Board.loadCode(data.board);
    const pieces = data.pieceArray.map(p => p ? Piece.loadCode(p) : null);

    const gameState = new GameState(
        board,
        pieces,
        data.playerAmount,
        data.turnNumber,
        data.playerTurn,
        data.turnPhase,
        [], // selectedObjects gets reassigned below
        data.globalVariables ?? []
    );

    // Reconstruct object references from board + pieces
    const allSelectableObjects = [...(board.tileArray ?? []), ...pieces.filter(Boolean)];

    gameState.selectedObjects = (data.selectedObjects ?? [])
        .map(id => allSelectableObjects.find(obj => obj?.objectID === id))
        .filter(Boolean);

    gameState.inventories = (data.inventories ?? [])
        .map(inv => inv ? Inventory.loadCode(inv) : null);

    return gameState;
}

    
}
