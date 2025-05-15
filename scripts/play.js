var game = null;
var startGameState = null;

var board = null;

var buttons = [];

var inventories = [];
var logical_pieces = []
var logical_board;



var globalViewer = null;
var minPlayers = -1;
var maxPlayers = -1;
var playerAmount = -1;


var titleViewer = null;


document.getElementById('jsonInput').addEventListener('change', function (event) {
    const file = event.target.files[0];

    if (!file || file.type !== 'application/json') {
        alert('Please select a valid JSON file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            game = JSON.parse(e.target.result);
            console.log("Game data loaded:", game);
            document.getElementById("start-buttons").remove(); 
            document.body.innerHTML = "";
            if (game.hasOwnProperty("startGameState")) {
                loadInProgressGame(game);
            }
            else {
                getNumPlayers();
            }

            

        } catch (err) {
            alert("Invalid JSON file.");
            console.error("Parse error:", err);
        }
    };
    reader.readAsText(file);
    
});




function getNumPlayers(){
    minPlayers = game.minPlayers;
    maxPlayers = game.maxPlayers;
    
        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'player-count-form';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = 9999;
    
        // Create modal box
        const box = document.createElement('div');
        box.style.background = '#fff';
        box.style.padding = '20px 30px';
        box.style.borderRadius = '10px';
        box.style.boxShadow = '0 0 10px rgba(0,0,0,0.4)';
        box.style.textAlign = 'center';
        box.style.fontFamily = 'sans-serif';
    
        const label = document.createElement('label');
        label.textContent = `Enter number of players (${minPlayers}–${maxPlayers}): `;
        label.style.fontSize = '16px';
        label.style.display = 'block';
        label.style.marginBottom = '10px';
    
        const input = document.createElement('input');
        input.type = 'number';
        input.min = minPlayers;
        input.max = maxPlayers;
        input.value = minPlayers;
        input.style.fontSize = '16px';
        input.style.padding = '5px';
        input.style.marginBottom = '15px';
        input.style.width = '80px';
    
        const button = document.createElement('button');
        button.textContent = 'OK';
        button.style.fontSize = '16px';
        button.style.padding = '5px 15px';
        button.style.cursor = 'pointer';
    
        button.addEventListener('click', () => {
            const val = parseInt(input.value);
            if (!isNaN(val) && val >= minPlayers && val <= maxPlayers) {
                playerAmount = val;
            
                overlay.remove();

                initializeElements();
            } else {
                input.style.border = '2px solid red';
            }

        });
    
        box.appendChild(label);
        box.appendChild(input);
        box.appendChild(button);
        overlay.appendChild(box);
        document.body.appendChild(overlay);
    
}


function initializeElements(atStart = true)
{ 
    board = null;
    buttons = [];
    logical_pieces = []
    logical_board = null;
    globalViewer = null;
    titleViewer = null;

    logical_board = Board.loadCode(game.board)
    board = new GameBoard(logical_board);
    game.pieces.forEach(p => {
        let logical_piece = Piece.loadCode(p)
        if (logical_piece.xCoordinate >= 0 && logical_piece.yCoordinate >= 0) logical_pieces.push(logical_piece)
    })
    currentGameState = new GameState(logical_board, logical_pieces, playerAmount)
    activeGameState = new GameState(Board.loadCode(game.board), game.pieces.map(p => Piece.loadCode(p)).filter(p => (p.xCoordinate >= 0 && p.yCoordinate >= 0)), playerAmount)
    startGameState = activeGameState.clone();
    game.tileTypes.forEach(t => tileTypesList.push(TileType.loadCode(t))) ;
    game.pieceTypes.forEach(t => pieceTypesList.push(PieceType.loadCode(t))) ;
    game.buttons.forEach(b => {
        let logical_button = Button.loadCode(b)    
        buttonsList.push(logical_button)
        buttons.push(new GameButton(logical_button))
    })
    game.globalVariables.forEach(gv => activeGameState.globalVariables.push(gv)) 
    game.globalScripts.forEach(gs => globalScripts.push(ScriptingRule.loadCode(gs)) ) 
    globalViewer = new GameGlobalVariables(game.globalLayout);
    titleViewer = new GameTitleDesc(game.titledescLayout, game.title, game.descriptionParagraphs);
    if (atStart) startGameScripts();
    updateUI();

}

function playAgain(){
    initializeElements();
}

function gameSaveCode() {
    const inprogressGame = {
        activeGameState: activeGameState.saveCode(),
        startGameState: startGameState.saveCode(),
        pieceTypesList: pieceTypesList.map(p => p.saveCode()),
        tileTypesList: tileTypesList.map(t => t.saveCode()),
        globalScripts: globalScripts.map(s => s.saveCode()),
        buttonsList: buttonsList.map(b => b.saveCode()),
        globalViewer: globalViewer.saveCode(),
        titleViewer: titleViewer.saveCode(),
    }

    const json = JSON.stringify(inprogressGame, null, 4);  // Pretty print for humans
    const blob = new Blob([json], { type: 'application/json' });

    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    
    const filename = prompt("Enter a filename for your game:", "myGame.json") || "game.json";
    
    a.download = filename.endsWith('.json') ? filename : filename + ".json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function loadInProgressGame(inProgressGame) {
    try {
        
        // Turn the in-progress game into a create save code so it can be initialized
        game = {
            board: inProgressGame.activeGameState.board,
            pieces: inProgressGame.activeGameState.pieceArray,
            pieceTypes: inProgressGame.pieceTypesList,
            tileTypes: inProgressGame.tileTypesList,
            buttons: inProgressGame.buttonsList,
            globalVariables: inProgressGame.activeGameState.globalVariables,
            globalScripts: inProgressGame.globalScripts,
            title: inProgressGame.titleViewer.title,
            descriptionParagraphs: inProgressGame.titleViewer.descriptionParagraphs,
            globalLayout: inProgressGame.globalViewer.layoutInfo,
            titledescLayout: inProgressGame.titleViewer.layoutInfo
        }

        initializeElements(false);
        activeGameState.playerAmount = inProgressGame.activeGameState.playerAmount;
        activeGameState.turnNumber = inProgressGame.activeGameState.turnNumber;
        activeGameState.playerTurn = inProgressGame.activeGameState.playerTurn;
        activeGameState.turnPhase = inProgressGame.activeGameState.turnPhase;
        gameStateValid();

        // Now turn the game into its starting settings so Play Again works
        game = {
            board: inProgressGame.startGameState.board,
            pieces: inProgressGame.startGameState.pieceArray,
            pieceTypes: inProgressGame.pieceTypesList,
            tileTypes: inProgressGame.tileTypesList,
            buttons: inProgressGame.buttonsList,
            globalVariables: inProgressGame.startGameState.globalVariables,
            globalScripts: inProgressGame.globalScripts,
            title: inProgressGame.titleViewer.title,
            descriptionParagraphs: inProgressGame.titleViewer.descriptionParagraphs,
            globalLayout: inProgressGame.globalViewer.layoutInfo,
            titledescLayout: inProgressGame.titleViewer.layoutInfo
        }

        updateUI();

    } catch (err) {
        alert("Error parsing JSON: " + err.message);
        console.error(err); // ← logs full stack trace
    }
}