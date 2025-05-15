let currentGameState; // The game state after the last valid move
let activeGameState; // The game state currently being edited
let tileTypesList = []; // An array of the created tile types
let pieceTypesList = []; // An array of the created piece types
let buttonsList = []; // An array of the created buttons
let globalScripts = [];

let nextObjectID = 0;
let nextTypeID = 0;
let nextRuleID = 0;
/*
const gameSaver = new GameSaver({
    gameState: currentGameState,
    tileTypes: tileTypesList,
    pieceTypes: pieceTypesList,
    pieces: [],   
    tiles: [],      
    board: {},    
    scriptingRules: globalScripts.map(ui => ui.form),
    buttons: buttonsList
});

gameSaver.attachDownloadButton(".save-button", "game_save.json");
*/

function getObject(id, active = true) {
    let gs = (active) ? activeGameState : currentGameState;
    let boardTiles = gs.board.tileArray;
    for (let y = 0; y < boardTiles.length; y++) {
        for (let x = 0; x < boardTiles[y].length; x++) {
            if (boardTiles[y][x].objectID == id) return boardTiles[y][x];
        }
    }
    for (let p = 0; p < gs.pieceArray.length; p++) {
        if (gs.pieceArray[p].objectID == id) return gs.pieceArray[p]
    }
    return null;
}

// Returns the current available object ID and increments to the next one
function assignObjectID() {
    nextObjectID++;
    return (nextObjectID - 1);
}

// Returns the current available type ID and increments to the next one
function assignTypeID() {
    nextTypeID++;
    return (nextTypeID - 1);
}

// Returns the current available rule ID and increments to the next one
function assignRuleID() {
    nextRuleID++;
    return (nextRuleID - 1);
}

function gameStateValid() {
    currentGameState = activeGameState.clone();
    updateUI();
}

function gameStateRevert() {
    activeGameState = currentGameState.clone();
    updateUI();
}

function updateUI(){
    if (board !== undefined && globalViewer !== undefined) {
        board.update();
        globalViewer.update();
        buttons.forEach(b=>b.update());
    }
}

// A variant of structuredClone that will preserve types like Pieces and Tiles.
// Object-specific clone methods handle most of this but we still need this for arrays
function BGBStructuredClone(argument) {
    if (typeof argument !== "object") return argument; // primitive types are already cloned
    if (Array.isArray(argument)) return argument.map(BGBStructuredClone); // Copy each entry of the array
    if (argument.hasOwnProperty("clone")) return argument.clone();
    return structuredClone(argument); // Sprites are non-instance objects, so we just call the usual structuredClone on them
}

// Checks if two things are equal, including working on types like Pieces and Tiles.
function BGBEquals(leftArg, rightArg) {
    if ((leftArg instanceof Piece || leftArg instanceof Tile) && (rightArg instanceof Piece || rightArg instanceof Tile)) return (leftArg.objectID === rightArg.objectID);
    if ((leftArg instanceof PieceType && rightArg instanceof PieceType) || (leftArg instanceof TileType && rightArg instanceof TileType)) return (leftArg.typeID === rightArg.typeID);
    if (Array.isArray(leftArg) && Array.isArray(rightArg)) {
        if (leftArg.length != rightArg.length) return false;
        for (let i = 0; i < leftArg.length; i++) {
            if (!BGBEquals(leftArg[i], rightArg[i])) return false;
        }
        return true;
    }
    return (leftArg === rightArg);
}

function BGBIndexOf(array, element) {
    for (i = 0; i < array.length; i++) {
        if (BGBEquals(array[i], element)) return i;
    }
    return -1;
}

function gameInProgress() {
    return Number.isFinite(activeGameState.turnNumber);
}

function showEndGameWindow(winner) {
    if (document.getElementById("endGameOverlay")) return;

    // Inject animation styles once
    if (!document.getElementById("endGameAnimationStyles")) {
        const style = document.createElement("style");
        style.id = "endGameAnimationStyles";
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            #endGameOverlay {
                animation: fadeIn 0.4s ease-out;
            }

            .end-game-wrapper {
                animation: slideUp 0.6s ease-out;
            }

            .btn-load:hover {
                background-color: #4ec94e;
                transform: scale(1.05);
                transition: 0.2s ease-in-out;
            }

            .btn-load:active {
                transform: scale(0.95);
                transition: 0.1s;
            }
        `;
        document.head.appendChild(style);
    }

    const overlay = document.createElement("div");
    overlay.id = "endGameOverlay";
    overlay.style.position = "fixed";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.zIndex = 9999;

    const wrapper = document.createElement("div");
    wrapper.classList.add("wrapper", "end-game-wrapper");
    wrapper.style.backgroundColor = "#d0d0ff";
    wrapper.style.border = "4px solid black";
    wrapper.style.boxShadow = "5px 5px black";
    wrapper.style.padding = "40px";
    wrapper.style.textAlign = "center";
    wrapper.style.fontFamily = "'Pixelify Sans', sans-serif";
    wrapper.style.minWidth = "300px";

    const gameOverTitle = document.createElement("h1");
    gameOverTitle.textContent = "Game Over";
    wrapper.appendChild(gameOverTitle);

    const resultText = document.createElement("p");
    resultText.style.fontSize = "28px";
    resultText.style.marginTop = "20px";
    resultText.textContent = winner === 0 ? `DRAW` : (winner < 0 ? `LOSER: Player ${Math.abs(winner)}` : `WINNER: Player ${winner}`);
    wrapper.appendChild(resultText);

    const playAgainBtn = document.createElement("button");
    playAgainBtn.classList.add("btn-load");
    playAgainBtn.textContent = "Play Again";
    playAgainBtn.style.marginTop = "30px";
    playAgainBtn.onclick = () => {
        playAgain(); // <- Your restart logic
        overlay.remove();
    };
    wrapper.appendChild(playAgainBtn);

    overlay.appendChild(wrapper);
    document.body.appendChild(overlay);
}

function startGameScripts() {
    if (!gameInProgress()) return true;
    let scriptsToExecuteStart = [];
    let scriptsToExecuteTurn = [];
    for (let scriptToCheck of globalScripts) {
        if (scriptToCheck.trigger === "Start Game") scriptsToExecuteStart.push([scriptToCheck, undefined]);
        if (scriptToCheck.trigger === "Start Turn") scriptsToExecuteTurn.push([scriptToCheck, undefined]);
    }
    for (let p of activeGameState.pieceArray.concat(activeGameState.board.tileArray.flat(1))) {
        for (let t of p.getTypeObjects()) {
            for (let scriptToCheck of t.scripts) {
                if (scriptToCheck.trigger === "Start Game") scriptsToExecuteStart.push([scriptToCheck, p]);
                if (scriptToCheck.trigger === "Start Turn") scriptsToExecuteTurn.push([scriptToCheck, p]);
            }
        }
    }
    for (let s = 0; s < scriptsToExecuteStart.length; s++) {
        scriptsToExecuteStart[s][0].run(...scriptsToExecuteStart[s].slice(1)); // Ignore the return values here, start game scripts can't fail
    }
    for (let s = 0; s < scriptsToExecuteTurn.length; s++) {
        scriptsToExecuteTurn[s][0].run(...scriptsToExecuteTurn[s].slice(1)); // Ignore the return values here, start game scripts can't fail
    }
    gameStateValid();
    return true;
}

function endGame(winner) {
    if (!gameInProgress()){ 
        showEndGameWindow(winner); return true};
    let scriptsToExecute = [];
    for (let p of activeGameState.pieceArray.concat(activeGameState.board.tileArray.flat(1))) {
        for (let t of p.getTypeObjects()) {
            for (let scriptToCheck of t.scripts) {
                if (scriptToCheck.trigger === "End Game") scriptsToExecute.push([scriptToCheck, p, winner]);
            }
        }
    }
    let scriptResult;
    for (let s = 0; s < scriptsToExecute.length; s++) {
        scriptResult = scriptsToExecute[s][0].run(...scriptsToExecute[s].slice(1));
        console.log(scriptResult);
        if (scriptResult === false) {
            showEndGameWindow(winner);
            return false;
        }
    }
    activeGameState.turnNumber = Infinity;
    activeGameState.playerTurn = winner;
    activeGameState.turnPhase = Infinity;
    showEndGameWindow(winner);
    return true;
}

// This function should be run whenever the game state changes, as it includes things like turn number changes
function globalScriptCheck() {
    if (!gameInProgress()) return true;
    if (!Number.isFinite(activeGameState.turnPhase)) {
        activeGameState.selectedObjects = []; // Selected objects are reset between turns
        let scriptsToExecuteEnd = [];
        let scriptsToExecuteStart = [];
        for (let scriptToCheck of globalScripts) {
            if (scriptToCheck.trigger === "End Turn") scriptsToExecuteEnd.push([scriptToCheck, undefined]);
            if (scriptToCheck.trigger === "Start Turn") scriptsToExecuteStart.push([scriptToCheck, undefined]);
        }
        for (let p of activeGameState.pieceArray.concat(activeGameState.board.tileArray.flat(1))) {
            for (let t of p.getTypeObjects()) {
                for (let scriptToCheck of t.scripts) {
                    if (scriptToCheck.trigger === "End Turn") scriptsToExecuteEnd.push([scriptToCheck, p]);
                    if (scriptToCheck.trigger === "Start Turn") scriptsToExecuteStart.push([scriptToCheck, p]);
                }
            }
        }
        let scriptResult;
        for (let s = 0; s < scriptsToExecuteEnd.length; s++) {
            scriptResult = scriptsToExecuteEnd[s][0].run(...scriptsToExecuteEnd[s].slice(1));
            console.log(scriptResult);
            if (scriptResult === false) {
                return false;
            }
        }
        activeGameState.turnPhase = 0;
        activeGameState.playerTurn += 1;
        if (activeGameState.playerTurn > activeGameState.playerAmount) {
            activeGameState.playerTurn = 1;
            activeGameState.turnNumber += 1;
        }
        for (let s = 0; s < scriptsToExecuteStart.length; s++) {
            scriptResult = scriptsToExecuteStart[s][0].run(...scriptsToExecuteStart[s].slice(1));
            console.log(scriptResult);
            if (scriptResult === false) {
                return false;
            }
        }
    }
    return true;
}
