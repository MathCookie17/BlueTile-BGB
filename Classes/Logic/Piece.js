class Piece {
    types = []; // array of typeIDs only
    xCoordinate = -1;
    yCoordinate = -1;
    objectID = -1;
    playerOwnerID = -1;
    publicVars = [];
    sprite;
    name = '';

    constructor(typeIDs, xStart, yStart, owner, sprite, id = undefined) {
        this.types = typeIDs;
        this.objectID = (id !== undefined) ? id : assignObjectID();
        this.xCoordinate = xStart;
        this.yCoordinate = yStart;
        this.playerOwnerID = owner;
        this.sprite = sprite;
    }

    getTypeObjects() {
        return this.types
            .map(id => pieceTypesList.find(t => Number(t.typeID) === Number(id)))
            .filter(Boolean);
    }

    getTile(active = true) {
        const boardTiles = (active ? activeGameState : currentGameState).board.tileArray;
        return boardTiles?.[this.yCoordinate]?.[this.xCoordinate] ?? null;
    }

    movePiece(xChange, yChange, topCall = true) {
        if (!gameInProgress()) return true;

        const newX = this.xCoordinate + xChange;
        const newY = this.yCoordinate + yChange;
        const tileLanded = activeGameState.board.tileArray?.[newY]?.[newX];

        if (!tileLanded || !tileLanded.enabled) return false;

        this.xCoordinate = newX;
        this.yCoordinate = newY;

        const scriptsToExecute = [];

        for (const type of this.getTypeObjects()) {
            for (const script of type.scripts || []) {
                if (script.trigger === "Piece Moves") scriptsToExecute.push([script, this, true, xChange, yChange]);
                else if (script.trigger === "Piece Lands on Tile") scriptsToExecute.push([script, this, true, tileLanded]);
            }
        }

        for (const t of tileLanded.types || []) {
            const tileType = tileTypesList.find(pt => Number(pt.typeID) === Number(t))?.type;
            for (const script of tileType?.scripts || []) {
                if (script.trigger === "Tile is Landed on") scriptsToExecute.push([script, tileLanded, true, this]);
            }
        }

        for (const [script, ...args] of scriptsToExecute) {
            const result = script.run(...args);
            if (result === false) {
                if (topCall) gameStateRevert();
                return false;
            }
        }

        return topCall ? globalScriptCheck() ? gameStateValid() : gameStateRevert() : true;
    }

    removePiece(topCall = true) {
        if (!gameInProgress()) return true;

        const index = activeGameState.pieceArray.findIndex(p => p.objectID === this.objectID);
        if (index !== -1) activeGameState.pieceArray.splice(index, 1);

        for (const type of this.getTypeObjects()) {
            for (const script of type.scripts || []) {
                if (script.trigger === "Piece is Removed") {
                    const result = script.run(this);
                    if (result === false) {
                        if (topCall) gameStateRevert();
                        return false;
                    }
                }
            }
        }

        return topCall ? globalScriptCheck() ? gameStateValid() : gameStateRevert() : true;
    }

    changeOwner(playerID, topCall = true) {
        this.playerOwnerID = playerID;
        return topCall ? globalScriptCheck() ? gameStateValid() : gameStateRevert() : true;
    }

    clickObject(topCall = true) {
        if (!gameInProgress()) return true;
        for (const type of this.getTypeObjects()) {
            console.log(type)
            for (const script of type.scripts || []) {
                console.log(script)
                if (script.trigger === "Object Clicked") {
                    const result = script.run(this);
                    if (result === false) {
                        if (topCall) gameStateRevert();
                        return false;
                    }
                }
            }
        }

        return topCall ? globalScriptCheck() ? gameStateValid() : gameStateRevert() : true;
    }

    saveCode() {
        return {
            types: this.types,
            objectID: this.objectID,
            xCoordinate: this.xCoordinate,
            yCoordinate: this.yCoordinate,
            playerOwnerID: this.playerOwnerID,
            sprite: this.sprite,
            name: this.name,
        };
    }

    clone() {
        return Piece.loadCode(this.saveCode());
    }

    static loadCode(data) {
        const p = new Piece(data.types ?? [], data.xCoordinate, data.yCoordinate, data.playerOwnerID ?? -1, data.sprite ?? {}, data.objectID);
        p.name = data.name ?? "Unnamed Piece";
        return p;
    }
}
