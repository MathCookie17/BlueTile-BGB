
var boardCreator;
var centerTile;
var leftTile;
var rightTile;
var widthInput;
var heightInput;
var doneButton;
var tileType;
var minPlayersInput;
var maxPlayersInput;
var boardType;
var title;
var descriptionParagraphs;


const boardTypeText = ["Square", "Hex", "Triangle"]
const boardTypeSources = ["images/square.png","images/hexagon.png","images/triangle.png"];
var boardEditor;
var pieceEditor;
var typeEditor;
var buttonEditor;
var globalEditor;
var titledescEditor;
var boardResizeEditor;
var minPlayers;
var maxPlayers;
var playerInventories;
var globals;
var titledesc;
var layoutEditor;


var boardType = 0;


function changeBoardType(direction){
    boardType = (boardType + direction + 3) % 3
    tileType.innerHTML = boardTypeText[boardType];
    centerTile.src = boardTypeSources[boardType];
    rightTile.src = boardTypeSources[(boardType - 1 + boardTypeSources.length) % boardTypeSources.length];
    leftTile.src = boardTypeSources[(boardType + 1) % boardTypeSources.length];
    validateInputs();
}

function submitBoard(){
    playerInventories = {containerWidth: -1, containerHeight: -1, containerTop: -1, containerLeft:-1, borderColor:'rgba(0, 0, 0, 0.9)', borderWidth:'2px', backgroundColor:'rgba(255, 255, 255, 0.9)'}
    globals = {containerWidth: -1, containerHeight: -1, containerTop: -1, containerLeft:-1, borderColor:'rgba(0, 0, 0, 0.9)', borderWidth:'2px', backgroundColor:'rgba(255, 255, 255, 0.9)', displayVariables:[]}
    titledesc = {containerWidth: -1, containerHeight: -1, containerTop: -1, containerLeft:-1, borderColor:'rgba(0, 0, 0, 0.9)', borderWidth:'2px', backgroundColor:'rgba(255, 255, 255, 0.9)'}
    boardEditor = new UIBoard(new Board(boardTypeText[boardType], parseInt(widthInput.value), parseInt(heightInput.value)))
    pieceEditor = new UIPieceEditor();
    typeEditor = new UITypeEditor();
    buttonEditor = new UIButtonEditor();
    let saveCodeButton = new Button();
    saveCodeButton.sprite = {
        fillColor:  "#e7eed6",
        text: "Save Game",
        textColor: "#192203",
        borderColor: "#000000",
        borderRadius: "5px",
    }
    saveCodeButton.name = "Save Game";
    saveCodeButton.specialButtonType = "In-Progress Save Code";
    buttonEditor.addButton(saveCodeButton, true);
    globalEditor = new UIGlobalEditor();
    titledescEditor = new UITitleDescEditor();
    boardResizeEditor = new UIBoardResizeEditor();
    minPlayers = parseInt(minPlayersInput.value);
    maxPlayers = parseInt(maxPlayersInput.value);    
    setUpButtons()
    typeEditor.window.close();
    buttonEditor.window.close();
    titledescEditor.window.close();
    boardResizeEditor.window.close();
    document.getElementById("main-screen").innerHTML = ''; 
}


function validateInputs() {
    minPlayers = parseInt(minPlayersInput.value);
    maxPlayers = parseInt(maxPlayersInput.value);

    const widthValid = widthInput.checkValidity() && parseInt(widthInput.value) > 0 && parseInt(widthInput.value) < 999;
    const heightValid = heightInput.checkValidity() && parseInt(heightInput.value) > 0 && parseInt(heightInput.value) < 999;
    
    const minValid = minPlayersInput.checkValidity() && minPlayers >= 1;
    const maxValid = maxPlayersInput.checkValidity() && maxPlayers >= minPlayers;

    doneButton.disabled = !(widthValid && heightValid && minValid && maxValid);
}




function setUpButtons(){
    const controls = document.createElement('div');
    controls.id = 'control-buttons';
   
    let previewEnabled = true;
    layoutEditor = new UILayoutEditor();
    

    // --- Preview Toggle ---
    const previewBtn = document.createElement('div');
    previewBtn.classList.add('control-btn');
    previewBtn.style.backgroundImage = `url(images/preview_off.png)`;
    previewBtn.title = 'Toggle Layout Editor';


    // --- Download Button ---
    const downloadBtn = document.createElement('div');
    downloadBtn.classList.add('control-btn');
    downloadBtn.style.backgroundImage = `url(images/download.png)`;
    downloadBtn.title = 'Download';
    downloadBtn.onclick = () => saveCode();


    // --- Edit Button ---
    const editBtn = document.createElement('div');
    editBtn.classList.add('control-btn');
    editBtn.style.backgroundImage = `url(images/edit.png)`;
    editBtn.title = 'Open Editors / Toggle Boxes';

    previewBtn.onclick = () => {
        if (layoutEditor.isOpen) {
            layoutEditor.close();
            previewBtn.style.backgroundImage = 'url(images/preview_off.png)';
            setEditBtnToEditors();  // ← Add this!
        } else {
            layoutEditor.open();
            console.log(layoutEditor.layoutBoxes);
            previewBtn.style.backgroundImage = 'url(images/preview_on.png)';
            setEditBtnToLayoutBoxes();
        }
    };    

    function setEditBtnToEditors() {
        editBtn.onclick = () => {
            if (!window.editorLauncherWindow || !document.body.contains(window.editorLauncherWindow.container)) {
                const win = new WindowContainer('Editor Launcher', true, {
                    width: 300,
                    height: 250,
                    offsetTop: 60,
                    offsetLeft: 500
                });
                win.setContent(`
                    <div style="display: flex; flex-direction: column; gap: 6px;">
                        <div><strong>Board Editor</strong> <button onclick="openEditor('board')">Open</button></div>
                        <div><strong>Pieces Editor</strong> <button onclick="openEditor('pieces')">Open</button></div>
                        <div><strong>Buttons Editor</strong> <button onclick="openEditor('buttons')">Open</button></div>
                        <div><strong>Types Editor</strong> <button onclick="openEditor('types')">Open</button></div>
                        <div><strong>Global Data Editor</strong> <button onclick="openEditor('global')">Open</button></div>
                        <div><strong>Title/Description Editor</strong> <button onclick="openEditor('titledesc')">Open</button></div>
                    </div>
                `);
                window.editorLauncherWindow = win;
            } else {
                window.editorLauncherWindow.container.style.zIndex = ++__windowZIndex;
            }
        };
    }

    function setEditBtnToLayoutBoxes() {
        editBtn.onclick = () => {
            if (!window.layoutBoxToggleWindow || !document.body.contains(window.layoutBoxToggleWindow.container)) {
                const win = new WindowContainer('Toggle Layout Boxes', true, {
                    width: 300,
                    height: 300,
                    offsetTop: 60,
                    offsetLeft: 500
                });

                let html = `<div style="display: flex; flex-direction: column; gap: 6px;">`;
                layoutEditor.layoutBoxes.forEach(box => {
                    html += `
                        <div>
                            <label>
                                <input type="checkbox" ${box.container.style.display !== 'none' ? 'checked' : ''} 
                                    onchange="this.checked ? layoutEditor.showBox('${box.name}') : layoutEditor.hideBox('${box.name}')">
                                ${box.name}
                            </label>
                        </div>
                    `;
                });
                html += `</div>`;
                
                win.setContent(html);
                window.layoutBoxToggleWindow = win;
            } else {
                window.layoutBoxToggleWindow.container.style.zIndex = ++__windowZIndex;
            }
        };
    }

    layoutEditor.showBox = (label) => {
        const box = layoutEditor.layoutBoxes.find(b => b.name === label);
        if (box) box.container.style.display = 'block';
    };

    layoutEditor.hideBox = (label) => {
        const box = layoutEditor.layoutBoxes.find(b => b.name === label);
        if (box) box.container.style.display = 'none';
    };

    // Initialize with editor mode by default
    setEditBtnToEditors();

    controls.appendChild(previewBtn);
    controls.appendChild(downloadBtn);
    controls.appendChild(editBtn);
    document.body.appendChild(controls);
}





function openEditor(type) {
    switch (type) {
        case 'board':
            if(!boardEditor.window)
                boardEditor.createWindow();
            else
                boardEditor.window.container.style.zIndex = ++__windowZIndex; //IF THE EDTIOR ALREADY EXISTS.... INCREASE Z INDEX
            break;
        case 'pieces':
            if(!pieceEditor.window)
                pieceEditor.createWindow();
            else 
                pieceEditor.window.container.style.zIndex = ++__windowZIndex;
            break;
        case 'buttons':
            if(!buttonEditor.window )
                buttonEditor.createWindow();
            else 
                buttonEditor.window.container.style.zIndex = ++__windowZIndex;
            console.log(buttonEditor)
            break;
        case 'types':
            if (!typeEditor.window) 
                typeEditor.createWindow();
            else 
                typeEditor.window.container.style.zIndex = ++__windowZIndex;
            break;
        case 'global':
            if (!globalEditor.window)
                globalEditor.createWindow();
            else
                globalEditor.window.container.style.zIndex  = ++__windowZIndex;
            break;
        case 'titledesc':
            if (!titledescEditor.window)
                titledescEditor.createWindow();
            else
                titledescEditor.window.container.style.zIndex  = ++__windowZIndex;
            break;
        case 'boardResize':
            if (!boardResizeEditor.window)
                boardResizeEditor.createWindow();
            else
                boardResizeEditor.window.container.style.zIndex  = ++__windowZIndex;
            break;
    }
}



function saveCode() {
    const game = {
        minPlayers: minPlayers,
        maxPlayers: maxPlayers,
        board: boardEditor.board.saveCode(),
        pieces: pieceEditor.pieces.map(pieceUI =>
            pieceUI.piece.saveCode()
        ),
        pieceTypes: typeEditor.pieceTypes.map(typeUI => typeUI.type.saveCode()),
        tileTypes: typeEditor.tileTypes.map(typeUI => typeUI.type.saveCode()),
        buttons: buttonEditor.buttons.map(buttonUI => buttonUI.button.saveCode()),
        globalVariables: globalEditor.globalVariables,
        globalScripts: globalEditor.globalScripts.map(scriptUI => scriptUI.form.rule.saveCode()),
        title: titledescEditor.title,
        descriptionParagraphs: titledescEditor.descriptionParagraphs,
        inventoryLayout: playerInventories,
        globalLayout: globals,
        titledescLayout: titledesc
    };

    const json = JSON.stringify(game, null, 4);  // Pretty print for humans
    const blob = new Blob([json], { type: 'application/json' });

    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    
    const filename = prompt("Enter a filename for your game:", "myGame.json") || "game.json";
    
    a.download = filename.endsWith('.json') ? filename : filename + ".json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}


function newGame() {
    const container = document.createElement('div');
    container.id = 'board-creator';
    container.className = 'container-main text-center';
    container.innerHTML = `
        <div class="header">SELECT YOUR BOARD</div>
        <div class="creation-form">
            <div class="labels">Choose Board Type</div>
            <div class="tile-images">
                <img id="tile-left" src="images/hexagon.png">
                <img id="tile-center" src="images/square.png">
                <img id="tile-right" src="images/triangle.png">
            </div>
            <div class="tile-selector">
                <div class="arrow-btn left" onclick="changeBoardType(-1)"></div>
                <div id="tile-type" class="tile-type">SQUARE</div>
                <div class="arrow-btn right" onclick="changeBoardType(1)"></div>
            </div>
            <div class="labels">Set Board Size</div>
            <div class="size-selector">
                <div class="labeled-input">
                    <label class="required">* WIDTH</label><br>
                    <input type="number" id="board-width" min="0" max="999" required>
                </div>
                <div class="labeled-input">
                    <label class="required">* HEIGHT</label><br>
                    <input type="number" id="board-height" min="0" max="999" required>
                </div>
            </div>
            <div class="labels">Choose Number of Players</div>
            <div class="player-selector">
                <div class="labeled-input">
                    <label class="required">* MIN PLAYERS</label><br>
                    <input type="number" id="min-players" min="1" max="999" required>
                </div>
                <div class="labeled-input">
                    <label class="required">* MAX PLAYERS</label><br>
                    <input type="number" id="max-players" min="1" max="999" required>
                </div>
            </div>
            <div class="done-selector">
                <button id="done-btn" disabled>Done</button>
            </div>
        </div>
    `;

    const main = document.getElementById('main-screen');
    main.innerHTML = '';
    main.appendChild(container);

    tileType = document.getElementById('tile-type');
    leftTile = document.getElementById('tile-left');
    centerTile = document.getElementById('tile-center');
    rightTile = document.getElementById('tile-right');
    tileType = document.getElementById('tile-type')

    widthInput = document.getElementById('board-width');
    heightInput = document.getElementById('board-height');
    minPlayersInput = document.getElementById('min-players');
    maxPlayersInput = document.getElementById('max-players');
    doneButton = document.getElementById('done-btn');


    widthInput.addEventListener('input', validateInputs);
    heightInput.addEventListener('input', validateInputs);
    minPlayersInput.addEventListener('input', validateInputs);
    maxPlayersInput.addEventListener('input', validateInputs);
    doneButton.addEventListener('click', submitBoard);

    boardType = 0;
    changeBoardType(0); // Reset to default
}





let game = null;

function loadGame() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                game = JSON.parse(e.target.result);
                console.log("Game loaded:", game);
                if (game.hasOwnProperty("startGameState")) {
                    alert("That's an in-progress game, which the editor can't work on!")
                }
                else {
                    alert("Game file loaded successfully!");
                
                    playerInventories = {containerWidth: game.inventoryLayout.containerWidth, containerHeight: game.inventoryLayout.containerHeight, containerTop: game.inventoryLayout.containerTop, containerLeft:game.inventoryLayout.containerLeft, borderColor:game.inventoryLayout.borderColor, borderWidth:game.inventoryLayout.borderWidth, backgroundColor:game.inventoryLayout.backgroundColor}
                    globals = {containerWidth: game.globalLayout.containerWidth, containerHeight:  game.globalLayout.containerHeight, containerTop:  game.globalLayout.containerTop, containerLeft: game.globalLayout.containerLeft, borderColor: game.globalLayout.borderColor, borderWidth: game.globalLayout.borderWidth, backgroundColor: game.globalLayout.backgroundColor, displayVariables: game.globalLayout.displayVariables}
                    if (game.titledescLayout === undefined) titledesc = {containerWidth: -1, containerHeight: -1, containerTop: -1, containerLeft:-1, borderColor:'rgba(0, 0, 0, 0.9)', borderWidth:'2px', backgroundColor:'rgba(255, 255, 255, 0.9)'}
                    else titledesc = {containerWidth: game.titledescLayout.containerWidth, containerHeight:  game.titledescLayout.containerHeight, containerTop:  game.titledescLayout.containerTop, containerLeft: game.titledescLayout.containerLeft, borderColor: game.titledescLayout.borderColor, borderWidth: game.titledescLayout.borderWidth, backgroundColor: game.titledescLayout.backgroundColor}
                    boardEditor = new UIBoard(Board.loadCode(game.board));
                    nextObjectID = game.board.width * game.board.height;
                    pieceEditor = new UIPieceEditor();
                    game.pieces.forEach( p => {
                        let newPiece = Piece.loadCode(p);
                        pieceEditor.addPiece(newPiece)
                        if(newPiece.objectID >= nextObjectID)
                            nextObjectID = newPiece.objectID+1
                    } );
                    minPlayers = game.minPlayers;
                    maxPlayers = game.maxPlayers;    
                    typeEditor = new UITypeEditor();
                    game.tileTypes.forEach(t => {
                        let newType = TileType.loadCode(t);
                        typeEditor.addType(newType)
                        if(newType.typeID >= nextTypeID)
                            nextTypeID = newType.typeID+1
                        newType.scripts.forEach(s => {
                            if(s.ruleID >= nextRuleID)
                                nextRuleID = s.ruleID+1

                        });
                    }) ;
                    game.pieceTypes.forEach(t => {
                        let newType = PieceType.loadCode(t)
                        typeEditor.addType(newType)
                        if(newType.typeID >= nextTypeID)
                            nextTypeID = newType.typeID+1
                        newType.scripts.forEach(s => {
                            if(s.ruleID >= nextRuleID)
                                nextRuleID = s.ruleID+1;
                        });
                    }) ;
                    
                    

                    buttonEditor = new UIButtonEditor();
                    game.buttons.forEach(b =>{
                        let newButton  = Button.loadCode(b)
                        buttonEditor.addButton(newButton)
                        newButton.clickScripts.forEach(s=>{
                            if(s.ruleID >=nextRuleID)
                                nextRuleID = s.ruleID+1;
                        })
                        newButton.visibleRules.forEach(s=>{
                            if(s.ruleID >=nextRuleID)
                                nextRuleID = s.ruleID+1;
                        })
                    });
                    if (buttonEditor.buttons.length === 0 || buttonEditor.buttons[0].button.specialButtonType !== "In-Progress Save Code") {
                        let saveCodeButton = new Button();
                        saveCodeButton.sprite = {
                            fillColor:  "#e7eed6",
                            text: "Save Game",
                            textColor: "#192203",
                            borderColor: "#000000",
                            borderRadius: "5px",
                        }
                        saveCodeButton.name = "Save Game";
                        saveCodeButton.specialButtonType = "In-Progress Save Code";
                        buttonEditor.addButton(saveCodeButton, true);
                    }

                    globalScripts = game.globalScripts.map(script => ScriptingRule.loadCode(script))
                    globalEditor = new UIGlobalEditor(game.globalVariables,globalScripts);


                    globalScripts.forEach(s =>{
                        if(s.ruleID >=nextRuleID)
                            nextRuleID = s.ruleID+1;
                    })

                    title = game.title;
                    descriptionParagraphs = game.descriptionParagraphs;
                    titledescEditor = new UITitleDescEditor(title, descriptionParagraphs);
                    boardResizeEditor = new UIBoardResizeEditor();

                    setUpButtons()
                    typeEditor.window.close();
                    buttonEditor.window.close();
                    titledescEditor.window.close();
                    boardResizeEditor.window.close();
                    document.getElementById("main-screen").innerHTML = ''; 
                }

                
            } catch (err) {
                alert("Error parsing JSON: " + err.message);
                console.error(err); // ← logs full stack trace
            }
        };
        reader.readAsText(file);
    });
    input.click();
}

function resizeBoard(boardShape, width, height, minP, maxP) {
    let newBoard = new Board(boardShape, width, height);
    let oldBoard = boardEditor.board;
    for (let w = 0; w < Math.min(oldBoard.width, newBoard.width); w++) {
        for (let h = 0; h < Math.min(oldBoard.height, newBoard.height); h++) {
            newBoard.tileArray[h][w] = oldBoard.tileArray[h][w];
        }
    }
    for (let w = 0; w < newBoard.width; w++) {
        for (let h = 0; h < newBoard.height; h++) {
            newBoard.tileArray[h][w].objectID = h * newBoard.width + w;
        }
    }
    for (let p = 0; p < pieceEditor.pieces.length; p++) {
        if (pieceEditor.pieces[p].piece.xCoordinate >= newBoard.width || pieceEditor.pieces[p].piece.yCoordinate >= newBoard.height) {
            pieceEditor.pieces[p].piece.xCoordinate = -1; pieceEditor.pieces[p].piece.yCoordinate = -1; 
        }
        pieceEditor.pieces[p].objectID = newBoard.width * newBoard.height + p;
    }
    nextObjectID = newBoard.width * newBoard.height + pieceEditor.pieces.length;
    if (boardEditor.window) boardEditor.window.close();
    newBoard.containerWidth = oldBoard.containerWidth;
    newBoard.containerHeight = oldBoard.containerHeight;
    newBoard.containerLeft = oldBoard.containerLeft;
    newBoard.containerTop = oldBoard.containerTop;
    newBoard.borderColor = oldBoard.borderColor;
    newBoard.borderWidth = oldBoard.borderWidth;
    newBoard.backgroundColor = oldBoard.backgroundColor;
    boardEditor = new UIBoard(newBoard);
    openEditor("board");
    minPlayers = minP; maxPlayers = maxP;
}





window.addEventListener('DOMContentLoaded', () => {
    showStartMenu();
});
function showStartMenu() {
    const main = document.getElementById('main-screen');
    main.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.justifyContent = 'center';
    wrapper.style.alignItems = 'center';
    wrapper.style.gap = '30px';
    wrapper.style.height = '100vh';

    // Shared styling for both buttons
    const pixelButtonStyle = {
        padding: '20px 40px',
        fontSize: '24px',
        border: '4px solid black',
        backgroundColor: '#ffdd57',
        boxShadow: '5px 5px black',
        cursor: 'pointer',
        textTransform: 'uppercase',
        fontFamily: '"Pixelify Sans", sans-serif',
    };

    const newGameBtn = document.createElement('button');
    newGameBtn.textContent = 'New Game';
    Object.assign(newGameBtn.style, pixelButtonStyle);
    newGameBtn.addEventListener('click', () => newGame());

    const loadGameBtn = document.createElement('button');
    loadGameBtn.textContent = 'Load Game';
    Object.assign(loadGameBtn.style, pixelButtonStyle);
    loadGameBtn.style.backgroundColor = '#6aff6a'; // Optional: different color for variety
    loadGameBtn.addEventListener('click', () => loadGame());

    const returnHomeBtn = document.createElement('a');
    returnHomeBtn.href = "index.html";
    returnHomeBtn.textContent = '🏠 Home';
    returnHomeBtn.classList.add('home-top-btn');

    wrapper.appendChild(newGameBtn);
    wrapper.appendChild(loadGameBtn);
    wrapper.appendChild(returnHomeBtn);
    main.appendChild(wrapper);
}
