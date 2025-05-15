var lastCopiedScriptingRule = null;
var ruleContentContainer;

class ScriptingRuleForm {
    rule;
    top; // true if this is a top-level script, otherwise stores the topmost rule
    zebraDark = false;
    callerType = "None";
    parentType = "None";
    container;
    childrenForms = [];
    window = null;
    validTypesArray = [];


    constructor(rule, top = true, callerType = "None", zebraDark = false, parentType = "None", name = undefined, ruleID = undefined) {
        this.rule = rule;
        this.top = top;
        this.callerType = callerType;
        this.zebraDark = zebraDark;
        this.parentType = parentType;
        this.container;
        this.div;
        if (this.top === true) {
            if (ruleID !== undefined) this.ruleID = ruleID;
            else this.ruleID = assignRuleID();
            if (name === undefined) this.name = "Script #" + this.ruleID;
            else this.name = name;
        } else {
            this.name = "";
            this.ruleID = -1;
        }
        this.div = this.createDIV();
    }

    openEditorWindow() {
        if (this.window && document.body.contains(this.window.container)) {
            this.window.container.style.zIndex = ++__windowZIndex;
            this.modifyDIV();
            return;
        }

        const win = new WindowContainer("Rule: " + this.name || "Rule: " , true, {
            width: 500,
            height: 600,
            offsetTop: 100,
            offsetLeft: 200
        });

        const content = document.createElement("div");
        content.style.display = "flex";
        content.style.flexDirection = "column";
        content.style.gap = "8px";
        content.style.padding = "8px";

        ruleContentContainer = document.createElement("div");
        ruleContentContainer.appendChild(this.div);
        content.appendChild(ruleContentContainer);


        // if(this.top === true){
        //     const actionsRow = document.createElement("div");
        //     actionsRow.style.display = "flex";
        //     actionsRow.style.gap = "8px";

        //     // Copy Button
        //     const copyBtn = document.createElement("button");
        //     copyBtn.textContent = "📋 Copy";
        //     copyBtn.onclick = () => {
        //         lastCopiedScriptingRule = this.rule.clone();

        //         console.log("Copied scripting rule:", lastCopiedScriptingRule);
        //     };

        //     // Paste Button
        //     const pasteBtn = document.createElement("button");
        //     pasteBtn.textContent = "📄 Paste";
        //     pasteBtn.disabled = !lastCopiedScriptingRule;
        //     pasteBtn.onclick = () => {
        //         if (!lastCopiedScriptingRule) return;
        //         this.rule = lastCopiedScriptingRule.clone();
        //         this.childrenForms = [];

        //         this.div = this.createDIV(); // Rebuild the visual form

        //         // Clear out the container and re-add the new one
        //         ruleContentContainer.innerHTML = '';
        //         ruleContentContainer.appendChild(this.div);
        //         console.log("Pasted rule:", this.rule);
        //     };

        //     actionsRow.appendChild(copyBtn);
        //     actionsRow.appendChild(pasteBtn);
        //     content.appendChild(actionsRow);

        // }
        win.appendContent(content);
        this.window = win;
        win.onMouseDown = () => {
            if (__windowZIndex != win.container.style.zIndex) this.modifyDIV();
        };
    }

    createDIV() {
        let srdiv = document.createElement("div");
        srdiv.classList.add("scriptingRuleBox");
        if (this.zebraDark) {
            srdiv.classList.add("scriptingRuleBoxZebraDark");
        } else {
            srdiv.classList.add("scriptingRuleBoxZebraLight");
        }

        this.modifyDIV(srdiv);

        return srdiv;
    }

    modifyDIV(srdiv = this.div) {
        while (srdiv.firstElementChild) srdiv.removeChild(srdiv.lastElementChild);
        let form = this;
        if (this.top === true) {
            let srdname = document.createElement("p");
            srdname.innerHTML = "Rule Name: ";
            let srdnameinput = document.createElement("input");
            srdnameinput.value = this.name;
            var win = this.window;
            srdnameinput.addEventListener("change", function(){
                form.name = this.value;
                win.header.querySelector('span').textContent = `Rule: ${form.name}`;
                form.modifyDIV();
            })
            srdname.appendChild(srdnameinput);
            srdiv.appendChild(srdname);
            let srdtrigger = document.createElement("p");
            srdtrigger.innerHTML = "Trigger:";
            let srdtriggerselect = document.createElement("select");
            let srdtriggeroption;
            if (this.callerType === "Any" || this.callerType === "Piece") {
                srdtriggeroption = document.createElement("option");
                srdtriggeroption.setAttribute("value", "Piece Moves");
                srdtriggeroption.innerHTML = "When this piece moves";
                srdtriggerselect.appendChild(srdtriggeroption);
            }
            if (this.callerType === "Any" || this.callerType === "Piece") {
                srdtriggeroption = document.createElement("option");
                srdtriggeroption.setAttribute("value", "Piece Lands on Tile");
                srdtriggeroption.innerHTML = "When this piece lands on a tile";
                srdtriggerselect.appendChild(srdtriggeroption);
            }
            if (this.callerType === "Any" || this.callerType === "Tile") {
                srdtriggeroption = document.createElement("option");
                srdtriggeroption.setAttribute("value", "Tile is Landed On");
                srdtriggeroption.innerHTML = "When this tile is landed on";
                srdtriggerselect.appendChild(srdtriggeroption);
            }
            if (this.callerType === "Any" || this.callerType === "Piece") {
                srdtriggeroption = document.createElement("option");
                srdtriggeroption.setAttribute("value", "Piece is Removed");
                srdtriggeroption.innerHTML = "When this piece is removed";
                srdtriggerselect.appendChild(srdtriggeroption);
            }
            if (true) {
                srdtriggeroption = document.createElement("option");
                srdtriggeroption.setAttribute("value", "Start Game");
                srdtriggeroption.innerHTML = "When the game starts";
                srdtriggerselect.appendChild(srdtriggeroption);
            }
            if (true) {
                srdtriggeroption = document.createElement("option");
                srdtriggeroption.setAttribute("value", "Start Turn");
                srdtriggeroption.innerHTML = "When a turn starts";
                srdtriggerselect.appendChild(srdtriggeroption);
            }
            if (true) {
                srdtriggeroption = document.createElement("option");
                srdtriggeroption.setAttribute("value", "End Turn");
                srdtriggeroption.innerHTML = "When a turn ends";
                srdtriggerselect.appendChild(srdtriggeroption);
            }
            if (true) {
                srdtriggeroption = document.createElement("option");
                srdtriggeroption.setAttribute("value", "End Game");
                srdtriggeroption.innerHTML = "When the game ends";
                srdtriggerselect.appendChild(srdtriggeroption);
            }
            if (this.callerType === "Any" || this.callerType === "Piece" || this.callerType === "Tile") {
                srdtriggeroption = document.createElement("option");
                srdtriggeroption.setAttribute("value", "Object Clicked");
                srdtriggeroption.innerHTML = "When this object is clicked";
                srdtriggerselect.appendChild(srdtriggeroption);
            }
            // No need for an if here, "no trigger" is always an option
            srdtriggeroption = document.createElement("option");
            srdtriggeroption.setAttribute("value", "None");
            srdtriggeroption.innerHTML = "None";
            srdtriggerselect.appendChild(srdtriggeroption);
            srdtriggerselect.value = form.rule.trigger;
            srdtriggerselect.addEventListener("change", function(){
                form.rule.trigger = this.value;
                form.modifyDIV();
            })
            srdtrigger.appendChild(srdtriggerselect);
            srdiv.appendChild(srdtrigger);
        }
        let srdtype = document.createElement("p");
        srdtype.innerHTML = "Type: ";
        srdtype.appendChild(this.createTypeSelect(this.parentType));
        srdiv.appendChild(srdtype);
        let scriptingRuleChild = function(argToCheck, parentType = "None") {
            if (argToCheck instanceof ScriptingRule) {
                srdiv.appendChild(srdarg);
                let newForm = new ScriptingRuleForm(argToCheck, form.getTop(), form.callerType, !form.zebraDark, parentType);
                form.childrenForms.push(newForm);
                // console.log(newForm);
                srdiv.appendChild(newForm.div);
                return true;
            }
            else return false;
        }
        let srdarg, srdarg2, srdarg3, srdarg4;
        if (this.rule.type === "Value") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Value:";
            if (!scriptingRuleChild(this.rule.value, "Value Types")) {
                if (typeof this.rule.value === "number") {
                    srdarg.innerHTML += " "
                    srdarg2 = document.createElement("input");
                    srdarg2.value = this.rule.value;
                    srdarg2.addEventListener("change", function(){
                        let v = Number(this.value);
                        if (Number.isFinite(v)) form.rule.value = v;
                        form.modifyDIV();
                    });
                    srdarg.appendChild(srdarg2);
                    srdiv.appendChild(srdarg);
                }
                else if (typeof this.rule.value === "boolean") {
                    srdarg.innerHTML += " "
                    srdarg2 = document.createElement("span");
                    srdarg2.classList.add("SRFBooleanBox");
                    srdarg2.innerHTML = this.rule.value;
                    srdarg2.addEventListener("click", function(){
                        form.rule.value = !form.rule.value;
                        form.modifyDIV();
                    })
                    srdarg.appendChild(srdarg2);
                    srdiv.appendChild(srdarg);
                }
                else if (typeof this.rule.value === "string") {
                    srdarg.innerHTML += " "
                    srdarg2 = document.createElement("input");
                    srdarg2.value = this.rule.value;
                    srdarg2.addEventListener("change", function(){
                        form.rule.value = this.value;
                        form.modifyDIV();
                    });
                    srdarg.appendChild(srdarg2);
                    srdiv.appendChild(srdarg);
                }
                else {
                    srdarg.innerHTML += " " + stringifyBGBObject(this.rule.value);
                    srdiv.appendChild(srdarg);
                }
                if (this.parentType !== "Number" && this.parentType !== "Boolean" && this.parentType !== "String") {
                    srdarg = document.createElement("button");
                    srdarg.classList.add("SRFButton");
                    srdarg.innerHTML = "Change Type";
                    srdarg.addEventListener("click", function(){
                        if (typeof form.rule.value === "number") {
                            form.rule.value = true;
                        }
                        else if (typeof form.rule.value === "boolean") {
                            form.rule.value = "";
                        }
                        else {
                            form.rule.value = 0;
                        }
                        form.modifyDIV();
                    })
                    srdiv.appendChild(srdarg);
                }
            }
        }
        else if (this.rule.type === "Argument") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Argument: ";
            srdarg2 = document.createElement("select");
            if (this.getTrigger() === "Piece Moves") {
                srdarg3 = document.createElement("option");
                srdarg3.setAttribute("value", 0);
                srdarg3.innerHTML = "X Movement";
                srdarg2.appendChild(srdarg3);
                srdarg3 = document.createElement("option");
                srdarg3.setAttribute("value", 1);
                srdarg3.innerHTML = "Y Movement";
                srdarg2.appendChild(srdarg3);
            }
            else if (this.getTrigger() === "Piece Lands on Tile") {
                srdarg3 = document.createElement("option");
                srdarg3.setAttribute("value", 0);
                srdarg3.innerHTML = "The tile this piece landed on";
                srdarg2.appendChild(srdarg3);
            }
            else if (this.getTrigger() === "Tile is Landed On") {
                srdarg3 = document.createElement("option");
                srdarg3.setAttribute("value", 0);
                srdarg3.innerHTML = "The piece that landed on this tile";
                srdarg2.appendChild(srdarg3);
            }
            srdarg2.value = this.rule.index;
            srdarg2.addEventListener("change", function(){
                form.rule.index = Number(this.value);
                form.modifyDIV();
            })
            srdarg.appendChild(srdarg2);
            srdiv.appendChild(srdarg);
        }

        // Actions
        else if (this.rule.type === "Move Piece" || this.rule.type === "Move Piece to Coordinates") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = (this.rule.type === "Move Piece to Coordinates") ? "X Coordinate" : "X Movement:";
            if (!scriptingRuleChild(this.rule.moveX, "Number")) {
                srdarg.innerHTML += " "
                srdarg2 = document.createElement("input");
                srdarg2.value = this.rule.moveX;
                srdarg2.addEventListener("change", function(){
                    let v = Number(this.value);
                    if (Number.isFinite(v)) form.rule.moveX = v;
                    form.modifyDIV();
                });
                srdarg.appendChild(srdarg2);
                srdiv.appendChild(srdarg);
            }
            srdarg = document.createElement("p");
            srdarg.innerHTML = (this.rule.type === "Move Piece to Coordinates") ? "Y Coordinate" : "Y Movement:";
            if (!scriptingRuleChild(this.rule.moveY, "Number")) {
                srdarg.innerHTML += " "
                srdarg2 = document.createElement("input");
                srdarg2.value = this.rule.moveY;
                srdarg2.addEventListener("change", function(){
                    let v = Number(this.value);
                    if (Number.isFinite(v)) form.rule.moveY = v;
                    form.modifyDIV();
                });
                srdarg.appendChild(srdarg2);
                srdiv.appendChild(srdarg);
            }
        }
        else if (this.rule.type === "Change Piece Owner" || this.rule.type === "Move Piece to Inventory") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Player Number:";
            if (!scriptingRuleChild(this.rule.playerID, "Number")) {
                srdarg.innerHTML += " "
                srdarg2 = document.createElement("input");
                srdarg2.value = this.rule.playerID;
                srdarg2.addEventListener("change", function(){
                    let v = Number(this.value);
                    if (v > 0 && v <= activeGameState.playerAmount && v % 1 == 0) form.rule.playerID = v;
                    form.modifyDIV();
                });
                srdarg.appendChild(srdarg2);
                srdiv.appendChild(srdarg);
            }
        }
        // Allow both piece types and tile types for now. I'll add "caller" in later.
        else if (this.rule.type === "Add Type" || this.rule.type === "Remove Type") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Type:";
            if (!scriptingRuleChild(this.rule.typeToEdit, "Type")) {
                srdarg.innerHTML += " "
                srdarg2 = document.createElement("select");
                srdarg3 = document.createElement("optgroup");
                srdarg3.setAttribute("label", "Piece Types");
                for (let t = 0; t < typeEditor.pieceTypes.length; t++) {
                    srdarg4 = document.createElement("option");
                    srdarg4.setAttribute("value", "Piece Type " + t);
                    srdarg4.innerHTML = stringifyBGBObject(typeEditor.pieceTypes[t].type);
                    srdarg3.appendChild(srdarg4);
                }
                srdarg2.appendChild(srdarg3);
                srdarg3 = document.createElement("optgroup");
                srdarg3.setAttribute("label", "Tile Types");
                for (let t = 0; t < tileTypesList.length; t++) {
                    srdarg4 = document.createElement("option");
                    srdarg4.setAttribute("value", "Tile Type " + t);
                    srdarg4.innerHTML = stringifyBGBObject(tileTypesList[t]);
                    srdarg3.appendChild(srdarg4);
                }
                srdarg2.appendChild(srdarg3);
                if (this.rule.typeToEdit instanceof PieceType) {
                    let index = 0;
                    for (index = 0; index < typeEditor.pieceTypes.length; index++) {
                        if (typeEditor.pieceTypes[index].type.typeID === this.rule.typeToEdit.typeID) break;
                    }
                    srdarg2.value = "Piece Type " + index;
                    srdarg2.innerHTML = typeEditor.pieceTypes[index].type.typeName
                }
                else if (this.rule.typeToEdit instanceof TileType) {
                    let index = 0;
                    for (index = 0; index < typeEditor.tileTypes.length; index++) {
                        if (typeEditor.tileTypes[index].type.typeID === this.rule.typeToEdit.typeID) break;
                    }
                    srdarg2.value = "Tile Type " + index;
                    srdarg2.innerHTML = typeEditor.tileTypes[index].type.typeName
                }
                srdarg2.addEventListener("change", function(){
                    if (this.value.includes("Piece Type")) form.rule.typeToEdit = typeEditor.pieceTypes.map(p=>p.type)[this.value.slice(11)];
                    else if (this.value.includes("Tile Type")) form.rule.typeToEdit = tileEditor.tileTypes.map(p=>p.type)[this.value.slice(10)];
                    form.modifyDIV();
                });
                srdarg.appendChild(srdarg2);
                srdiv.appendChild(srdarg);
            }
            if (this.rule.type === "Add Type") {
                srdarg = document.createElement("p");
                if (!scriptingRuleChild(this.rule.index, "Number")) {
                    if (this.rule.index === undefined) {
                        srdarg.innerHTML = "Placed at the end of the tile list.";
                        srdiv.appendChild(srdarg);
                        srdarg = document.createElement("button");
                        srdarg.classList.add("SRFButton");
                        srdarg.innerHTML = "Specify Index";
                        srdarg.addEventListener("click", function(){
                            form.rule.index = 0;
                            form.modifyDIV();
                        })
                        srdiv.appendChild(srdarg);
                    }
                    else {
                        srdarg = document.createElement("p");
                        srdarg.innerHTML = "Placed at index ";
                        srdarg2 = document.createElement("input");
                        srdarg2.value = this.rule.index;
                        srdarg2.addEventListener("change", function(){
                            let v = Number(this.value);
                            if (Number.isFinite(v)) form.rule.index = v;
                            form.modifyDIV();
                        });
                        srdarg.appendChild(srdarg2);
                        srdiv.appendChild(srdarg);
                        srdarg = document.createElement("button");
                        srdarg.classList.add("SRFButton");
                        srdarg.innerHTML = "Place at End";
                        srdarg.addEventListener("click", function(){
                            form.rule.index = undefined;
                            form.modifyDIV();
                        })
                        srdiv.appendChild(srdarg);
                    }
                }
            }
        }
        else if (this.rule.type === "Add Piece") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Array of Types:";
            scriptingRuleChild(this.rule.newPieceTypes, "Array");
            srdarg = document.createElement("p");
            srdarg.innerHTML = "X Coordinate:";
            if (!scriptingRuleChild(this.rule.newPieceX, "Number")) {
                srdarg.innerHTML += " "
                srdarg2 = document.createElement("input");
                srdarg2.value = this.rule.newPieceX;
                srdarg2.addEventListener("change", function(){
                    let v = Number(this.value);
                    if (Number.isFinite(v)) form.rule.newPieceX = v;
                    form.modifyDIV();
                });
                srdarg.appendChild(srdarg2);
                srdiv.appendChild(srdarg);
            }
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Y Coordinate:";
            if (!scriptingRuleChild(this.rule.newPieceY, "Number")) {
                srdarg.innerHTML += " "
                srdarg2 = document.createElement("input");
                srdarg2.value = this.rule.newPieceY;
                srdarg2.addEventListener("change", function(){
                    let v = Number(this.value);
                    if (Number.isFinite(v)) form.rule.newPieceY = v;
                    form.modifyDIV();
                });
                srdarg.appendChild(srdarg2);
                srdiv.appendChild(srdarg);
            }
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Player Number of Owner:";
            if (!scriptingRuleChild(this.rule.newPieceOwner, "Number")) {
                srdarg.innerHTML += " "
                srdarg2 = document.createElement("input");
                srdarg2.value = this.rule.newPieceOwner;
                srdarg2.addEventListener("change", function(){
                    let v = Number(this.value);
                    if (v > 0 && v <= activeGameState.playerAmount && v % 1 == 0) form.rule.newPieceOwner = v;
                    form.modifyDIV();
                });
                srdarg.appendChild(srdarg2);
                srdiv.appendChild(srdarg);
            }
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Sprite:";
            scriptingRuleChild(this.rule.newPieceSprite, "PieceSprite")
        }
        else if (this.rule.type === "Change Turn Phase") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Turn Phase:";
            if (this.rule.phase === Infinity) {
                srdarg.innerHTML += " End Turn";
                srdiv.appendChild(srdarg);
                srdarg = document.createElement("button");
                srdarg.classList.add("SRFButton");
                srdarg.innerHTML = "Specify Phase";
                srdarg.addEventListener("click", function(){
                    form.rule.phase = new ScriptingRule("None", "Value", 0);
                    form.modifyDIV();
                })
                srdiv.appendChild(srdarg);
            }
            else {
                if (!scriptingRuleChild(this.rule.phase, "Number")) {
                    srdarg.innerHTML += " "
                    srdarg2 = document.createElement("input");
                    srdarg2.value = this.rule.phase;
                    srdarg2.addEventListener("change", function(){
                        let v = Number(this.value);
                        if (Number.isFinite(v) && v % 1 == 0) form.rule.phase = v;
                        form.modifyDIV();
                    });
                    srdarg.appendChild(srdarg2);
                    srdiv.appendChild(srdarg);
                }
                srdarg = document.createElement("button");
                srdarg.classList.add("SRFButton");
                srdarg.innerHTML = "End Turn";
                srdarg.addEventListener("click", function(){
                    form.rule.phase = Infinity;
                    form.modifyDIV();
                })
                srdiv.appendChild(srdarg);
            }
        }
        else if (this.rule.type === "End Game") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Winner:";
            if (!scriptingRuleChild(this.rule.winner, "Number")) {
                srdarg.innerHTML += " "
                srdarg2 = document.createElement("input");
                srdarg2.value = this.rule.winner;
                srdarg2.addEventListener("change", function(){
                    let v = Number(this.value);
                    if (v >= 0 && v <= activeGameState.playerAmount && v % 1 == 0) form.rule.winner = v;
                    form.modifyDIV();
                });
                srdarg.appendChild(srdarg2);
                srdiv.appendChild(srdarg);
            }
        }
        else if (this.rule.type === "Change Piece Sprite") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "New Piece Sprite:";
            srdiv.appendChild(srdarg);
            scriptingRuleChild(this.rule.newPieceSprite, "PieceSprite");
        }
        else if (this.rule.type === "Change Tile Sprite") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "New Tile Sprite:";
            srdiv.appendChild(srdarg);
            scriptingRuleChild(this.rule.newTileSprite, "TileSprite");
        }

        
        // Reporters
        else if (this.rule.type === "Tile at Coordinates") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "X Coordinate:";
            if (!scriptingRuleChild(this.rule.XCoordinate, "Number")) {
                srdarg.innerHTML += " "
                srdarg2 = document.createElement("input");
                srdarg2.value = this.rule.XCoordinate;
                srdarg2.addEventListener("change", function(){
                    let v = Number(this.value);
                    if (Number.isFinite(v)) form.rule.XCoordinate = v;
                    form.modifyDIV();
                });
                srdarg.appendChild(srdarg2);
                srdiv.appendChild(srdarg);
            }
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Y Coordinate:";
            if (!scriptingRuleChild(this.rule.YCoordinate, "Number")) {
                srdarg.innerHTML += " "
                srdarg2 = document.createElement("input");
                srdarg2.value = this.rule.YCoordinate;
                srdarg2.addEventListener("change", function(){
                    let v = Number(this.value);
                    if (Number.isFinite(v)) form.rule.YCoordinate = v;
                    form.modifyDIV();
                });
                srdarg.appendChild(srdarg2);
                srdiv.appendChild(srdarg);
            }
        }
        else if (this.rule.type === "Pieces on Tile") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Tile:";
            if (!scriptingRuleChild(this.rule.tileToCheck, "Tile")) {
                // This should not happen
                srdarg.innerHTML = stringifyBGBObject(this.rule.tileToCheck);
                srdarg.appendChild(srdarg2);
                srdiv.appendChild(srdarg);
            }
        }
        else if (this.rule.type === "X Coordinate" || this.rule.type === "Y Coordinate" || this.rule.type === "Piece Owner" || this.rule.type === "Object Types" || this.rule.type === "Object ID" || this.rule.type === "Select Object" || this.rule.type === "Deselect Object") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Object:";
            if (!scriptingRuleChild(this.rule.object, "Object")) {
                srdarg.innerHTML += " Caller";
                srdiv.appendChild(srdarg);
            }
            srdarg = document.createElement("button");
            srdarg.classList.add("SRFButton");
            if (this.rule.object instanceof ScriptingRule) {
                srdarg.innerHTML = "Default to Caller";
            }
            else {
                srdarg.innerHTML = "Use Scripting Rule for Object";
            }
            srdarg.addEventListener("click", function(){
                if (form.rule.object instanceof ScriptingRule) {
                    form.rule.object = undefined;
                }
                else {
                    form.rule.object = new ScriptingRule("None", "Caller");
                }
                form.modifyDIV();
            });
            srdiv.appendChild(srdarg);
        }
        else if (this.rule.type === "Create Piece Sprite") {
            // --- Image Name (with SVG preview + arrows) ---
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Sprite:";
            if (!scriptingRuleChild(this.rule.imageName, "String")) {
                const spriteNames = Object.keys(SPRITE_LIBRARY);
                let currentIndex = spriteNames.indexOf(this.rule.imageName);
                if (currentIndex === -1) currentIndex = 0;
        
                const preview = document.createElement("div");
                preview.style.width = "40px";
                preview.style.height = "40px";
                preview.style.display = "inline-block";
                preview.style.verticalAlign = "middle";
                preview.style.margin = "0 8px";
                preview.style.background = "#f0f0f0";
                const renderPreview = (shouldModify = true) => {
                    const name = spriteNames[currentIndex];
                    this.rule.imageName = name;
                    preview.innerHTML = SPRITE_LIBRARY[name] || "";
                    const svg = preview.querySelector("svg");
                    if (svg) {
                        svg.setAttribute("width", "100%");
                        svg.setAttribute("height", "100%");
                        svg.querySelectorAll("[fill]").forEach(el => {
                            el.setAttribute("fill", this.rule.fillColor || "#000");
                        });
                    }
                
                    if (shouldModify) form.modifyDIV(); // Only trigger if called from arrows
                };
                const leftBtn = document.createElement("button");
                leftBtn.textContent = "◀";
                leftBtn.onclick = () => {
                    currentIndex = (currentIndex - 1 + spriteNames.length) % spriteNames.length;
                    renderPreview(true);
                };
                const rightBtn = document.createElement("button");
                rightBtn.textContent = "▶";
                rightBtn.onclick = () => {
                    currentIndex = (currentIndex + 1) % spriteNames.length;
                    renderPreview(true);
                };
                srdarg.appendChild(leftBtn);
                srdarg.appendChild(preview);
                srdarg.appendChild(rightBtn);
                srdiv.appendChild(srdarg);
                renderPreview(false); // prevent modifyDIV on first load
            }
            // --- Fill Color ---
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Fill Color:";
            if (!scriptingRuleChild(this.rule.fillColor, "String")) {
                srdarg2 = document.createElement("input");
                srdarg2.type = "color";
                srdarg2.value = this.rule.fillColor;
                srdarg2.addEventListener("input", function () {
                    form.rule.fillColor = this.value;
                    form.modifyDIV();
                });
                srdarg.appendChild(srdarg2);
                srdiv.appendChild(srdarg);
            }
            // --- Text ---
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Text:";
            if (!scriptingRuleChild(this.rule.text, "String")) {
                srdarg2 = document.createElement("input");
                srdarg2.value = this.rule.text;
                srdarg2.addEventListener("input", function () {
                    form.rule.text = this.value;
                    form.modifyDIV();
                });
                srdarg.appendChild(srdarg2);
                srdiv.appendChild(srdarg);
            }
            // --- Text Color ---
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Text Color:";
            if (!scriptingRuleChild(this.rule.textColor, "String")) {
                srdarg2 = document.createElement("input");
                srdarg2.type = "color";
                srdarg2.value = this.rule.textColor;
                srdarg2.addEventListener("input", function () {
                    form.rule.textColor = this.value;
                    form.modifyDIV();
                });
                srdarg.appendChild(srdarg2);
                srdiv.appendChild(srdarg);
            }
        }         
        else if (this.rule.type === "Create Tile Sprite") {
            // --- Image Name (with SVG preview + arrows) ---
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Sprite:";
            if (!scriptingRuleChild(this.rule.imageName, "String")) {
                const spriteNames = Object.keys(SPRITE_LIBRARY);
                let currentIndex = spriteNames.indexOf(this.rule.imageName);
                if (currentIndex === -1) currentIndex = 0;
                const preview = document.createElement("div");
                preview.style.width = "40px";
                preview.style.height = "40px";
                preview.style.display = "inline-block";
                preview.style.verticalAlign = "middle";
                preview.style.margin = "0 8px";
                preview.style.background = "#f0f0f0";
                this.rule.imageName = spriteNames[currentIndex];
                const renderPreview = (shouldModify = true) => {
                    const name = spriteNames[currentIndex];
                    this.rule.imageName = name;
                    preview.innerHTML = SPRITE_LIBRARY[name] || "";
                    const svg = preview.querySelector("svg");
                    if (svg) {
                        svg.setAttribute("width", "100%");
                        svg.setAttribute("height", "100%");
                        svg.querySelectorAll("[fill]").forEach(el => {
                            el.setAttribute("fill", this.rule.fillColor || "#000");
                        });
                    }
                    if (shouldModify) form.modifyDIV();
                };
                const leftBtn = document.createElement("button");
                leftBtn.textContent = "◀";
                leftBtn.onclick = () => {
                    currentIndex = (currentIndex - 1 + spriteNames.length) % spriteNames.length;
                    renderPreview(true);
                };
                const rightBtn = document.createElement("button");
                rightBtn.textContent = "▶";
                rightBtn.onclick = () => {
                    currentIndex = (currentIndex + 1) % spriteNames.length;
                    renderPreview(true);
                };
                srdarg.appendChild(leftBtn);
                srdarg.appendChild(preview);
                srdarg.appendChild(rightBtn);
                srdiv.appendChild(srdarg);
                renderPreview(false); // Initial render without triggering form refresh
            }
            // --- Fill Color ---
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Fill Color:";
            if (!scriptingRuleChild(this.rule.fillColor, "String")) {
                srdarg2 = document.createElement("input");
                srdarg2.type = "color";
                srdarg2.value = this.rule.fillColor;
                srdarg2.addEventListener("input", function () {
                    form.rule.fillColor = this.value;
                    form.modifyDIV();
                });
                srdarg.appendChild(srdarg2);
                srdiv.appendChild(srdarg);
            }
            // --- Text ---
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Text:";
            if (!scriptingRuleChild(this.rule.text, "String")) {
                srdarg2 = document.createElement("input");
                srdarg2.value = this.rule.text;
                srdarg2.addEventListener("input", function () {
                    form.rule.text = this.value;
                    form.modifyDIV();
                });
                srdarg.appendChild(srdarg2);
                srdiv.appendChild(srdarg);
            }
            // --- Text Color ---
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Text Color:";
            if (!scriptingRuleChild(this.rule.textColor, "String")) {
                srdarg2 = document.createElement("input");
                srdarg2.type = "color";
                srdarg2.value = this.rule.textColor;
                srdarg2.addEventListener("input", function () {
                    form.rule.textColor = this.value;
                    form.modifyDIV();
                });
                srdarg.appendChild(srdarg2);
                srdiv.appendChild(srdarg);
            }
        }
        else if (this.rule.type === "Choose Piece Type" || this.rule.type === "Choose Tile Type") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Type: ";
            srdarg2 = document.createElement("select");
            let listToCheck = (this.rule.type === "Choose Tile Type" ? typeEditor.tileTypes.map(t=>t.type) : typeEditor.pieceTypes.map(p=>p.type))
            for (let t = 0; t < listToCheck.length; t++) {
                srdarg3 = document.createElement("option");
                srdarg3.setAttribute("value", t);
                srdarg3.innerHTML = stringifyBGBObject(listToCheck[t]);
                srdarg2.appendChild(srdarg3);
            }
            srdarg2.value = this.rule.index;
            srdarg2.addEventListener("change", function(){
                form.rule.index = this.value;
                form.modifyDIV();
            });
            srdarg.appendChild(srdarg2);
            srdiv.appendChild(srdarg);
        }

        // Control
        else if (this.rule.type === "Edit Variable of Object" || this.rule.type === "Edit Variable of Rule" || this.rule.type === "Edit Global Variable") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Variable Name:";
            if (!scriptingRuleChild(this.rule.variableName, "String")) { // There's a position bug here for some reason
                srdarg.innerHTML += " "
                srdarg2 = document.createElement("input");
                srdarg2.value = this.rule.variableName;
                srdarg2.addEventListener("change", function(){
                    form.rule.variableName = String(this.value);
                    form.modifyDIV();
                });
                srdarg.appendChild(srdarg2);
                srdiv.appendChild(srdarg);
            }
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Value:";
            if (!scriptingRuleChild(this.rule.variableValue, "None")) {
                if (typeof this.rule.variableValue === "number") {
                    srdarg.innerHTML += " "
                    srdarg2 = document.createElement("input");
                    srdarg2.variableValue = this.rule.variableValue;
                    srdarg2.addEventListener("change", function(){
                        let v = Number(this.value);
                        if (Number.isFinite(v)) form.rule.variableValue = v;
                        form.modifyDIV();
                    });
                    srdarg.appendChild(srdarg2);
                    srdiv.appendChild(srdarg);
                }
                else if (typeof this.rule.variableValue === "boolean") {
                    srdarg.innerHTML += " "
                    srdarg2 = document.createElement("span");
                    srdarg2.classList.add("SRFBooleanBox");
                    srdarg2.innerHTML = this.rule.variableValue;
                    srdarg2.addEventListener("click", function(){
                        form.rule.variableValue = !form.rule.variableValue;
                        form.modifyDIV();
                    })
                    srdarg.appendChild(srdarg2);
                    srdiv.appendChild(srdarg);
                }
                else if (typeof this.rule.variableValue === "string") {
                    srdarg.innerHTML += " "
                    srdarg2 = document.createElement("input");
                    srdarg2.variableValue = this.rule.variableValue;
                    srdarg2.addEventListener("change", function(){
                        form.rule.variableValue = this.value;
                        form.modifyDIV();
                    });
                    srdarg.appendChild(srdarg2);
                    srdiv.appendChild(srdarg);
                }
                else {
                    srdarg.innerHTML += " " + stringifyBGBObject(this.rule.variableValue);
                    srdiv.appendChild(srdarg);
                }
                srdarg = document.createElement("button");
                srdarg.classList.add("SRFButton");
                srdarg.innerHTML = "Change Type";
                srdarg.addEventListener("click", function(){
                    if (typeof form.rule.variableValue === "number") {
                        form.rule.variableValue = true;
                    }
                    else if (typeof form.rule.variableValue === "boolean") {
                        form.rule.variableValue = "";
                    }
                    else {
                        form.rule.variableValue = 0;
                    }
                    form.modifyDIV();
                })
                srdiv.appendChild(srdarg);
            }
            if (this.rule.type === "Edit Variable of Object") {
                srdarg = document.createElement("p");
                srdarg.innerHTML = "Object:";
                if (!scriptingRuleChild(this.rule.object, "Object")) {
                    srdarg.innerHTML += " Caller";
                    srdiv.appendChild(srdarg);
                }
                srdarg = document.createElement("button");
                srdarg.classList.add("SRFButton");
                if (this.rule.object instanceof ScriptingRule) {
                    srdarg.innerHTML = "Default to Caller";
                }
                else {
                    srdarg.innerHTML = "Use Scripting Rule for Object";
                }
                srdarg.addEventListener("click", function(){
                    if (form.rule.object instanceof ScriptingRule) {
                        form.rule.object = undefined;
                    }
                    else {
                        form.rule.object = new ScriptingRule("None", "Caller");
                    }
                    form.modifyDIV();
                });
                srdiv.appendChild(srdarg);
            }
        }
        else if (this.rule.type === "Return Variable of Object" || this.rule.type === "Return Variable of Rule" || this.rule.type === "Return Global Variable") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Variable Name:";
            if (!scriptingRuleChild(this.rule.variableName, "String")) {
                srdarg.innerHTML += " "
                srdarg2 = document.createElement("input");
                srdarg2.value = this.rule.variableName;
                srdarg2.addEventListener("change", function(){
                    form.rule.variableName = String(this.value);
                    form.modifyDIV();
                });
                srdarg.appendChild(srdarg2);
                srdiv.appendChild(srdarg);
            }
            if (this.rule.type === "Return Variable of Object") {
                srdarg = document.createElement("p");
                srdarg.innerHTML = "Object:";
                if (!scriptingRuleChild(this.rule.object, "Object")) {
                    srdarg.innerHTML += " Caller";
                    srdiv.appendChild(srdarg);
                }
                srdarg = document.createElement("button");
                srdarg.classList.add("SRFButton");
                if (this.rule.object instanceof ScriptingRule) {
                    srdarg.innerHTML = "Default to Caller";
                }
                else {
                    srdarg.innerHTML = "Use Scripting Rule for Object";
                }
                srdarg.addEventListener("click", function(){
                    if (form.rule.object instanceof ScriptingRule) {
                        form.rule.object = undefined;
                    }
                    else {
                        form.rule.object = new ScriptingRule("None", "Caller");
                    }
                    form.modifyDIV();
                });
                srdiv.appendChild(srdarg);
            }
        }
        else if (this.rule.type === "if-then-else") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "If:";
            scriptingRuleChild(this.rule.if, "Boolean");
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Then:";
            scriptingRuleChild(this.rule.then, "None");
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Else:";
            scriptingRuleChild(this.rule.else, "None");
        }
        else if (this.rule.type === "Return at End") {
            for (let s = 0; s < this.rule.scriptsToRun.length; s++) {
                srdarg = document.createElement("p");
                srdarg.innerHTML = "Script #" + (s + 1);
                scriptingRuleChild(this.rule.scriptsToRun[s], "None");
            }
            srdarg = document.createElement("button");
            srdarg.classList.add("SRFButton");
            srdarg.innerHTML = "Add New Entry";
            srdarg.addEventListener("click", function(){
                form.rule.scriptsToRun.push(new ScriptingRule("None", "Value", 0));
                form.modifyDIV();
            })
            srdiv.appendChild(srdarg);
            if (this.rule.scriptsToRun.length > 0) {
                srdarg = document.createElement("button");
                srdarg.classList.add("SRFButton");
                srdarg.innerHTML = "Remove Last Entry";
                srdarg.addEventListener("click", function(){
                    form.rule.scriptsToRun.pop();
                    form.modifyDIV();
                })
                srdiv.appendChild(srdarg);
            }
        }
        else if (this.rule.type == "Repeat While") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "While:";
            scriptingRuleChild(this.rule.repeatCheck, "Boolean");
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Repeat:";
            scriptingRuleChild(this.rule.repeatScript, "None");
        }
        else if (twoArgOperators.indexOf(this.rule.type) != -1) {
            let argumentType;
            if (this.rule.type === "==" || this.rule.type === "!=") argumentType = "None";
            else if (["&&", "||", "XOR"].indexOf(this.rule.type) !== -1) argumentType = "Boolean";
            else if (["Concatenate Strings", "Character of Strings"].indexOf(this.rule.type) !== -1) argumentType = "String";
            else argumentType = "Number";
            srdarg = document.createElement("p");
            if (this.rule.type === "Character of String") srdarg.innerHTML = "String:";
            else if (this.rule.type === "Random Integer" || this.rule.type === "Random Decimal") srdarg.innerHTML = "Minimum:";
            else srdarg.innerHTML = "Left Argument:";
            if (!scriptingRuleChild(this.rule.leftArg, argumentType)) {
                if (typeof this.rule.leftArg === "number") {
                    srdarg.innerHTML += " "
                    srdarg2 = document.createElement("input");
                    srdarg2.leftArg = this.rule.leftArg;
                    srdarg2.addEventListener("change", function(){
                        let v = Number(this.value);
                        if (Number.isFinite(v)) form.rule.leftArg = v;
                        form.modifyDIV();
                    });
                    srdarg.appendChild(srdarg2);
                    srdiv.appendChild(srdarg);
                }
                else if (typeof this.rule.leftArg === "boolean") {
                    srdarg.innerHTML += " "
                    srdarg2 = document.createElement("span");
                    srdarg2.classList.add("SRFBooleanBox");
                    srdarg2.innerHTML = this.rule.leftArg;
                    srdarg2.addEventListener("click", function(){
                        form.rule.leftArg = !form.rule.leftArg;
                        form.modifyDIV();
                    })
                    srdarg.appendChild(srdarg2);
                    srdiv.appendChild(srdarg);
                }
                else if (typeof this.rule.leftArg === "string") {
                    srdarg.innerHTML += " "
                    srdarg2 = document.createElement("input");
                    srdarg2.leftArg = this.rule.leftArg;
                    srdarg2.addEventListener("change", function(){
                        form.rule.leftArg = this.value;
                        form.modifyDIV();
                    });
                    srdarg.appendChild(srdarg2);
                    srdiv.appendChild(srdarg);
                }
                else {
                    srdarg.innerHTML += " " + stringifyBGBObject(this.rule.leftArg);
                    srdiv.appendChild(srdarg);
                }
                srdarg = document.createElement("button");
                srdarg.classList.add("SRFButton");
                srdarg.innerHTML = "Change Type";
                srdarg.addEventListener("click", function(){
                    if (typeof form.rule.leftArg === "number") {
                        form.rule.leftArg = true;
                    }
                    else if (typeof form.rule.leftArg === "boolean") {
                        form.rule.leftArg = "";
                    }
                    else {
                        form.rule.leftArg = 0;
                    }
                    form.modifyDIV();
                })
                srdiv.appendChild(srdarg);
            }
            srdarg = document.createElement("p");
            if (this.rule.type === "Character of String") srdarg.innerHTML = "Index:";
            else if (this.rule.type === "Random Integer" || this.rule.type === "Random Decimal") srdarg.innerHTML = "Maximum:";
            else srdarg.innerHTML = "Right Argument:";
            if (!scriptingRuleChild(this.rule.rightArg, argumentType)) {
                if (typeof this.rule.rightArg === "number") {
                    srdarg.innerHTML += " "
                    srdarg2 = document.createElement("input");
                    srdarg2.rightArg = this.rule.rightArg;
                    srdarg2.addEventListener("change", function(){
                        let v = Number(this.value);
                        if (Number.isFinite(v)) form.rule.rightArg = v;
                        form.modifyDIV();
                    });
                    srdarg.appendChild(srdarg2);
                    srdiv.appendChild(srdarg);
                }
                else if (typeof this.rule.rightArg === "boolean") {
                    srdarg.innerHTML += " "
                    srdarg2 = document.createElement("span");
                    srdarg2.classList.add("SRFBooleanBox");
                    srdarg2.innerHTML = this.rule.rightArg;
                    srdarg2.addEventListener("click", function(){
                        form.rule.rightArg = !form.rule.rightArg;
                        form.modifyDIV();
                    })
                    srdarg.appendChild(srdarg2);
                    srdiv.appendChild(srdarg);
                }
                else if (typeof this.rule.rightArg === "string") {
                    srdarg.innerHTML += " "
                    srdarg2 = document.createElement("input");
                    srdarg2.rightArg = this.rule.rightArg;
                    srdarg2.addEventListener("change", function(){
                        form.rule.rightArg = this.value;
                        form.modifyDIV();
                    });
                    srdarg.appendChild(srdarg2);
                    srdiv.appendChild(srdarg);
                }
                else {
                    srdarg.innerHTML += " " + stringifyBGBObject(this.rule.rightArg);
                    srdiv.appendChild(srdarg);
                }
                srdarg = document.createElement("button");
                srdarg.classList.add("SRFButton");
                srdarg.innerHTML = "Change Type";
                srdarg.addEventListener("click", function(){
                    if (typeof form.rule.rightArg === "number") {
                        form.rule.rightArg = true;
                    }
                    else if (typeof form.rule.rightArg === "boolean") {
                        form.rule.rightArg = "";
                    }
                    else {
                        form.rule.rightArg = 0;
                    }
                    form.modifyDIV();
                })
                srdiv.appendChild(srdarg);
            }
        }
        else if (oneArgOperators.indexOf(this.rule.type) != -1) {
            let argumentType;
            if (this.rule.type === "!") argumentType = "Boolean";
            else argumentType = "Number";
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Argument:";
            if (!scriptingRuleChild(this.rule.argument, argumentType)) {
                if (typeof this.rule.argument === "number") {
                    srdarg.innerHTML += " "
                    srdarg2 = document.createElement("input");
                    srdarg2.argument = this.rule.argument;
                    srdarg2.addEventListener("change", function(){
                        let v = Number(this.value);
                        if (Number.isFinite(v)) form.rule.argument = v;
                        form.modifyDIV();
                    });
                    srdarg.appendChild(srdarg2);
                    srdiv.appendChild(srdarg);
                }
                else if (typeof this.rule.argument === "boolean") {
                    srdarg.innerHTML += " "
                    srdarg2 = document.createElement("span");
                    srdarg2.classList.add("SRFBooleanBox");
                    srdarg2.innerHTML = this.rule.argument;
                    srdarg2.addEventListener("click", function(){
                        form.rule.argument = !form.rule.argument;
                        form.modifyDIV();
                    })
                    srdarg.appendChild(srdarg2);
                    srdiv.appendChild(srdarg);
                }
                else if (typeof this.rule.argument === "string") {
                    srdarg.innerHTML += " "
                    srdarg2 = document.createElement("input");
                    srdarg2.argument = this.rule.argument;
                    srdarg2.addEventListener("change", function(){
                        form.rule.argument = this.value;
                        form.modifyDIV();
                    });
                    srdarg.appendChild(srdarg2);
                    srdiv.appendChild(srdarg);
                }
                else {
                    srdarg.innerHTML += " " + stringifyBGBObject(this.rule.argument);
                    srdiv.appendChild(srdarg);
                }
                srdarg = document.createElement("button");
                srdarg.classList.add("SRFButton");
                srdarg.innerHTML = "Change Type";
                srdarg.addEventListener("click", function(){
                    if (typeof form.rule.argument === "number") {
                        form.rule.argument = true;
                    }
                    else if (typeof form.rule.argument === "boolean") {
                        form.rule.argument = "";
                    }
                    else {
                        form.rule.argument = 0;
                    }
                    form.modifyDIV();
                })
                srdiv.appendChild(srdarg);
            }
        }
        else if (this.rule.type == "Slice of String") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "String:";
            if (!scriptingRuleChild(this.rule.outer, "String")) {
                srdarg.innerHTML += " "
                srdarg2 = document.createElement("input");
                srdarg2.value = this.rule.outer;
                srdarg2.addEventListener("change", function(){
                    form.rule.outer = this.value;
                    form.modifyDIV();
                });
                srdarg.appendChild(srdarg2);
                srdiv.appendChild(srdarg);
            }
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Left Index:";
            if (!scriptingRuleChild(this.rule.leftIndex, "Number")) {
                srdarg.innerHTML += " "
                srdarg2 = document.createElement("input");
                srdarg2.value = this.rule.leftIndex;
                srdarg2.addEventListener("change", function(){
                    let v = Number(this.value);
                    if (v >= 0 && v % 1 == 0) form.rule.leftIndex = v;
                    form.modifyDIV();
                });
                srdarg.appendChild(srdarg2);
                srdiv.appendChild(srdarg);
            }
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Right Index:";
            if (!scriptingRuleChild(this.rule.rightIndex, "Number")) {
                srdarg.innerHTML += " "
                srdarg2 = document.createElement("input");
                srdarg2.value = this.rule.rightIndex;
                srdarg2.addEventListener("change", function(){
                    let v = Number(this.value);
                    if (v >= 0 && v % 1 == 0) form.rule.rightIndex = v;
                    form.modifyDIV();
                });
                srdarg.appendChild(srdarg2);
                srdiv.appendChild(srdarg);
            }
        }

        // Arrays
        else if (this.rule.type === "Create an Array") {
            for (let e = 0; e < this.rule.elements.length; e++) {
                srdarg = document.createElement("p");
                srdarg.innerHTML = "Element #" + (e + 1);
                if (!scriptingRuleChild(this.rule.elements[e], "Returns Something")) {
                    if (typeof this.rule.elements[e] === "number") {
                        srdarg.innerHTML += " "
                        srdarg2 = document.createElement("input");
                        srdarg2.value = this.rule.elements[e];
                        srdarg2.addEventListener("change", function(){
                            let v = Number(this.value);
                            if (Number.isFinite(v)) form.rule.elements[e] = v;
                            form.modifyDIV();
                        });
                        srdarg.appendChild(srdarg2);
                        srdiv.appendChild(srdarg);
                    }
                    else if (typeof this.rule.elements[e] === "boolean") {
                        srdarg.innerHTML += " "
                        srdarg2 = document.createElement("span");
                        srdarg2.classList.add("SRFBooleanBox");
                        srdarg2.innerHTML = this.rule.elements[e];
                        srdarg2.addEventListener("click", function(){
                            form.rule.elements[e] = !form.rule.elements[e];
                            form.modifyDIV();
                        })
                        srdarg.appendChild(srdarg2);
                        srdiv.appendChild(srdarg);
                    }
                    else if (typeof this.rule.elements[e] === "string") {
                        srdarg.innerHTML += " "
                        srdarg2 = document.createElement("input");
                        srdarg2.value = this.rule.elements[e];
                        srdarg2.addEventListener("change", function(){
                            form.rule.elements[e] = this.value;
                            form.modifyDIV();
                        });
                        srdarg.appendChild(srdarg2);
                        srdiv.appendChild(srdarg);
                    }
                    else {
                        srdarg.innerHTML += " " + stringifyBGBObject(this.rule.elements[e]);
                        srdiv.appendChild(srdarg);
                    }
                    srdarg = document.createElement("button");
                    srdarg.classList.add("SRFButton");
                    srdarg.innerHTML = "Change Type";
                    srdarg.addEventListener("click", function(){
                        if (typeof form.rule.elements[e] === "number") {
                            form.rule.elements[e] = true;
                        }
                        else if (typeof form.rule.elements[e] === "boolean") {
                            form.rule.elements[e] = "";
                        }
                        else {
                            form.rule.elements[e] = 0;
                        }
                        form.modifyDIV();
                    })
                    srdiv.appendChild(srdarg);
                }
            }
            srdarg = document.createElement("button");
            srdarg.classList.add("SRFButton");
            srdarg.innerHTML = "Add New Entry";
            srdarg.addEventListener("click", function(){
                form.rule.elements.push(new ScriptingRule("None", "Value", 0));
                form.modifyDIV();
            })
            srdiv.appendChild(srdarg);
            if (this.rule.elements.length > 0) {
                srdarg = document.createElement("button");
                srdarg.classList.add("SRFButton");
                srdarg.innerHTML = "Remove Last Entry";
                srdarg.addEventListener("click", function(){
                    form.rule.elements.pop();
                    form.modifyDIV();
                })
                srdiv.appendChild(srdarg);
            }
        }
        else if (this.rule.type == "Array Length" || this.rule.type == "Remove Last Element of Array") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Array:";
            scriptingRuleChild(this.rule.array, "Array");
        }
        else if (this.rule.type == "Array Index of Element" || this.rule.type == "Add to Array") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Array:";
            scriptingRuleChild(this.rule.array, "Array");
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Element:";
            scriptingRuleChild(this.rule.element, "Returns Something");
        }
        else if (this.rule.type == "Array Element at Index") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Array:";
            scriptingRuleChild(this.rule.array, "Array");
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Index:";
            if (!scriptingRuleChild(this.rule.index, "Number")) {
                srdarg.innerHTML += " "
                srdarg2 = document.createElement("input");
                srdarg2.value = this.rule.index;
                srdarg2.addEventListener("change", function(){
                    let v = Number(this.value);
                    if (v >= 0 && v % 1 == 0) form.rule.index = v;
                    form.modifyDIV();
                });
                srdarg.appendChild(srdarg2);
                srdiv.appendChild(srdarg);
            }
        }
        else if (this.rule.type == "Slice of Array") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Array:";
            scriptingRuleChild(this.rule.outer, "Array");
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Left Index:";
            if (!scriptingRuleChild(this.rule.leftIndex, "Number")) {
                srdarg.innerHTML += " "
                srdarg2 = document.createElement("input");
                srdarg2.value = this.rule.leftIndex;
                srdarg2.addEventListener("change", function(){
                    let v = Number(this.value);
                    if (v >= 0 && v % 1 == 0) form.rule.leftIndex = v;
                    form.modifyDIV();
                });
                srdarg.appendChild(srdarg2);
                srdiv.appendChild(srdarg);
            }
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Right Index:";
            if (!scriptingRuleChild(this.rule.rightIndex, "Number")) {
                srdarg.innerHTML += " "
                srdarg2 = document.createElement("input");
                srdarg2.value = this.rule.rightIndex;
                srdarg2.addEventListener("change", function(){
                    let v = Number(this.value);
                    if (v >= 0 && v % 1 == 0) form.rule.rightIndex = v;
                    form.modifyDIV();
                });
                srdarg.appendChild(srdarg2);
                srdiv.appendChild(srdarg);
            }
        }

        else if (this.rule.type == "Other Caller") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Object:";
            scriptingRuleChild(this.rule.otherCaller, "Object");
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Script:";
            scriptingRuleChild(this.rule.otherScript, "None");
        }
        else if (this.rule.type == "Console Log") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Log the Result of";
            scriptingRuleChild(this.rule.toLog, "None");
        }

        const actionsRow = document.createElement("div");
        actionsRow.style.display = "flex";
        actionsRow.style.gap = "8px";

        const copyBtn = document.createElement("button");
        copyBtn.textContent = "📋 Copy";
        copyBtn.onclick = () => {
            lastCopiedScriptingRule = this.rule.clone();
            form.getTop().modifyDIV(); // This needs to be done to update the paste buttons

            console.log("Copied scripting rule:", lastCopiedScriptingRule);
        };

        // Paste Button
        const pasteBtn = document.createElement("button");
        pasteBtn.textContent = "📄 Paste";
        pasteBtn.disabled = (!lastCopiedScriptingRule || this.validTypesArray.indexOf(lastCopiedScriptingRule.type) == -1) ;
        pasteBtn.onclick = () => {
            if (!lastCopiedScriptingRule || form.validTypesArray.indexOf(lastCopiedScriptingRule.type) == -1) return;
            Object.assign(form.rule, lastCopiedScriptingRule.clone());
            form.childrenForms = [];

            form.getTop().modifyDIV(); // Rebuild the visual form

            // // Clear out the container and re-add the new one
            // ruleContentContainer.innerHTML = '';
            // ruleContentContainer.appendChild(form.getTop().div);
            console.log("Pasted rule:", form.rule);
        };

        actionsRow.appendChild(copyBtn);
        actionsRow.appendChild(pasteBtn);
        srdiv.appendChild(actionsRow);
    }

    getTrigger() {
        if (this.top === true) return this.rule.trigger;
        else return this.top.rule.trigger;
    }

    getTop() {
        if (this.top === true) return this;
        else return this.top;
    }

    createTypeSelect() {
        let select = document.createElement("select");
        let type;

        // type = document.createElement("option");
        // type.setAttribute("value", "Value");
        // type.innerHTML = type.getAttribute("value");
        // group.appendChild(type);
        // "Owner of this Rule" for Caller, "New Tile Sprite" for Create Tile Sprite, AND, OR, and NOT, "Run Multiple Scripts", "Have Another Object run a script"
        let groupBasics = document.createElement("optgroup");
        groupBasics.setAttribute("label", "Basics");
        select.appendChild(groupBasics);
        let groupActions = document.createElement("optgroup");
        groupActions.setAttribute("label", "Actions");
        select.appendChild(groupActions);
        let groupReporters = document.createElement("optgroup");
        groupReporters.setAttribute("label", "Reporters");
        select.appendChild(groupReporters);
        let groupOperators = document.createElement("optgroup");
        groupOperators.setAttribute("label", "Operators");
        select.appendChild(groupOperators);
        let groupArrays = document.createElement("optgroup");
        groupArrays.setAttribute("label", "Arrays");
        select.appendChild(groupArrays);
        let groupOther = document.createElement("optgroup");
        groupOther.setAttribute("label", "Other");
        select.appendChild(groupOther);

        let validTypesArray;
        if (this.parentType === "None") validTypesArray = SRF_AllRuleTypes;
        else if (this.parentType === "Returns Something") validTypesArray = SRF_RType_Returns;
        else {
            if (this.parentType === "Number") validTypesArray = SRF_RType_Number;
            if (this.parentType === "Boolean") validTypesArray = SRF_RType_Boolean;
            if (this.parentType === "String") validTypesArray = SRF_RType_String;
            if (this.parentType === "Value Types") validTypesArray = SRF_RType_Number.concat(SRF_RType_Boolean).concat(SRF_RType_String);
            if (this.parentType === "Type") validTypesArray = SRF_RType_Type;
            if (this.parentType === "Piece") validTypesArray = SRF_RType_Piece.concat(SRF_RType_PieceOrTile);
            if (this.parentType === "Tile") validTypesArray = SRF_RType_Tile.concat(SRF_RType_PieceOrTile);
            if (this.parentType === "Object") validTypesArray = SRF_RType_Piece.concat(SRF_RType_Tile).concat(SRF_RType_PieceOrTile);
            if (this.parentType === "Array") validTypesArray = SRF_RType_ArrayAny;
            if (this.parentType === "TileSprite") validTypesArray = SRF_RType_TileSprite;
            if (this.parentType === "PieceSprite") validTypesArray = SRF_RType_PieceSprite;
            if (this.parentType === "Action") validTypesArray = SRF_RType_Action;
            validTypesArray = validTypesArray.concat(SRF_RType_Anywhere);
        }

        for (let t = 0; t < validTypesArray.length; t++) {
            type = document.createElement("option");
            type.setAttribute("value", validTypesArray[t]);
            if (validTypesArray[t] === "Create Tile Sprite") type.innerHTML = "New Tile Sprite";
            else if (validTypesArray[t] === "Create Piece Sprite") type.innerHTML = "New Piece Sprite";
            else if (validTypesArray[t] === "&&") type.innerHTML = "AND";
            else if (validTypesArray[t] === "||") type.innerHTML = "OR";
            else if (validTypesArray[t] === "!") type.innerHTML = "NOT";
            else if (validTypesArray[t] === "Return at End") type.innerHTML = "Run Multiple Scripts";
            else if (validTypesArray[t] === "Other Caller") type.innerHTML = "Have Another Object run a Script";
            else type.innerHTML = validTypesArray[t];
            if (SRF_RGroup_Basics.indexOf(validTypesArray[t]) !== -1) groupBasics.appendChild(type);
            else if (SRF_RGroup_Actions.indexOf(validTypesArray[t]) !== -1) groupActions.appendChild(type);
            else if (SRF_RGroup_Reporters.indexOf(validTypesArray[t]) !== -1) groupReporters.appendChild(type);
            else if (SRF_RGroup_Operators.indexOf(validTypesArray[t]) !== -1) groupOperators.appendChild(type);
            else if (SRF_RGroup_Arrays.indexOf(validTypesArray[t]) !== -1) groupArrays.appendChild(type);
            else groupOther.appendChild(type);
        }
        this.validTypesArray = validTypesArray;
        
        select.value = this.rule.type;
        let form = this;
        select.addEventListener("change", function(){
            form.rule.resetScriptingRule(form.rule.trigger, this.value);
            form.modifyDIV();
        })
        return select;
    }
    /*
    cloneScriptingRule(rule) {
        const clone = new ScriptingRule(rule.trigger, rule.type, null);
    
        for (let key in rule) {
            const value = rule[key];
    
            if (value instanceof ScriptingRule) {
                clone[key] = this.cloneScriptingRule(value); 
            } else if (Array.isArray(value)) {
                clone[key] = value.map(v => v instanceof ScriptingRule ? this.cloneScriptingRule(v) : v);
            } else {
                clone[key] = value;
            }
        }
    
        return clone;
    }*/
        cloneScriptingRule(rule) {
            return rule.clone();
        }
    
    
}

function stringifyBGBObject(obj) {
    if (obj instanceof Piece) return "Piece with ID" + obj.objectID;
    else if (obj instanceof Tile) return "Tile at (" + obj.xCoordinate + ", " + obj.yCoordinate + ")"; 
    else if (obj instanceof PieceType) return "Piece Type \"" + obj.typeName + "\"";
    else if (obj instanceof TileType) return "Tile Type \"" + obj.typeName + "\"";
    else if (obj instanceof TileSprite) return "Tile Sprite with color " + obj.fillColor + ", text color " + obj.textColor + ", and text \"" + obj.text + "\"";
    else if (obj instanceof PieceSprite) return "Piece Sprite with image name " + obj.imageName + ", fill color " + obj.fillColor + ", text color " + obj.textColor + ", and text \"" + obj.text + "\"";
    else if (obj instanceof ScriptingRule) throw new TypeError("stringifyBGBObject should not be called on scripting rules! They become DIV elements with scriptingRuleForm instead."); // explicitly adding an error case for rule since it seems like a mistake someone might make
    else return String(obj);
}

let SRF_AllRuleTypes = [
    "Value", "Argument", "Remove Piece", "Move Piece", "Move Piece to Coordinates", "Change Piece Owner", "Add Type", "Remove Type",
    "Add Piece", "Change Turn Phase", "End Game", "Change Tile Sprite", "Change Piece Sprite", "X Coordinate", "Y Coordinate", "Piece Owner", "Object Types", "Turn Number",
    "Player Turn", "Turn Phase", "Return Variable of Rule", "Return Variable of Object", "Return Global Variable", "Board Width",
    "Board Height", "Tile at Coordinates", "Pieces on Tile", "Tile Here", "All Pieces", "All Tiles", "Object ID", "Caller", "Create Tile Sprite", "Create Piece Sprite", "Choose Piece Type",
    "Choose Tile Type", "Edit Variable of Rule", "Edit Variable of Object", "Edit Global Variable", "if-then-else", "Return at End",
    "Repeat While", "==", ">", "<", ">=", "<=", "!=", "&&", "||", "!", "XOR", "+", "-", "*", "/", "%", "**", "abs", "sign", "Random Integer", "Random Decimal", "Concatenate Strings", "Character of String",
    "Create an Array", "Array Length", "Add to Array", "Remove Last Element of Array", "Array Element at Index", "Array Index of Element",
    "Slice of String", "Slice of Array", "Other Caller", "Select Object", "Deselect Object", "Selected Objects", "Clear Selected Objects"
]

// These can go in for any scripting rule argument since we don't know what type they'll return
let SRF_RType_Anywhere = [
    "Value", "Argument", "Return Variable of Rule", "Return Variable of Object", "Return Global Variable", "if-then-else", "Return at End",
    "Array Element at Index", "Other Caller"
    // Not sure if argument should go here or in some other RType
]
// Scripting rules of these types return numbers.
let SRF_RType_Number = [
    "X Coordinate", "Y Coordinate", "Piece Owner", "Turn Number", "Player Turn", "Turn Phase", "Board Width", "Board Height", "Object ID",
    "+", "-", "*", "/", "%", "**", "abs", "sign", "Random Integer", "Random Decimal", "Array Length", "Array Index of Element"
]
// Scripting rules of these types return booleans.
let SRF_RType_Boolean = [
    "==", ">", "<", ">=", "<=", "!=", "&&", "||", "XOR", "!"
]
// Scripting rules of these types return strings.
let SRF_RType_String = [
    "Concatenate Strings", "Character of String", "Slice of String"
]
// Scripting rules of these types return a PieceType or a TileType.
let SRF_RType_Type = [
    "Choose Piece Type", "Choose Tile Type"
]
// Scripting rules of these types return either a Piece or a Tile depending on circumstance. This is for the "Object" parentType.
let SRF_RType_PieceOrTile = [
    "Caller"
]
// Scripting rules of these types return a Piece.
let SRF_RType_Piece = [
    
]
// Scripting rules of these types return a Tile.
let SRF_RType_Tile = [
    "Tile at Coordinates", "Tile Here"
]
let SRF_RType_TileSprite = [
    "Create Tile Sprite"
]

let SRF_RType_PieceSprite = [
    "Create Piece Sprite"
]
// Scripting rules of these types return an array with unknown entry types.
let SRF_RType_ArrayAny = [
    "Create an Array", "Object Types", "Pieces on Tile", "Selected Objects", "Slice of Array", "All Pieces", "All Tiles"
]
// I'll handle these next three later.
// Scripting rules of these types return an array of PieceTypes or TileTypes.
let SRF_RType_ArrayOfTypes = [
]
// Scripting rules of these types return an array of Pieces.
let SRF_RType_ArrayOfPieces = [
]
// Scripting rules of these types return an array of Tiles.
let SRF_RType_ArrayOfTiles = [
]
// These are actions to perform, not things that return something (they typically return true, though)
let SRF_RType_Action = [
    "Remove Piece", "Move Piece", "Move Piece to Coordinates", "Change Piece Owner", "Add Type", "Remove Type", "Add Piece", "Change Turn Phase",
    "End Game", "Change Tile Sprite", "Change Piece Sprite", "Edit Variable of Rule", "Edit Variable of Object", "Edit Global Variable", "Repeat While",
    "Remove Last Element of Array", "Add to Array", "Select Object", "Deselect Object", "Clear Selected Objects"
]
// Any scripting rule type that does return something, i.e. is not an action
let SRF_RType_Returns = SRF_AllRuleTypes.filter(e => (SRF_RType_Action.indexOf(e) === -1));

let SRF_RGroup_Basics = [
    "Value", "Argument", "if-then-else", "Return at End"
]
let SRF_RGroup_Actions = [
    "Remove Piece", "Move Piece", "Move Piece to Coordinates", "Change Piece Owner", "Add Type", "Remove Type",
    "Add Piece", "Change Turn Phase", "End Game", "Change Tile Sprite", "Change Piece Sprite", "Select Object", "Deselect Object", "Clear Selected Objects"
]
let SRF_RGroup_Reporters = [
    "X Coordinate", "Y Coordinate", "Piece Owner", "Object Types", "Turn Number",
    "Player Turn", "Turn Phase", "Return Variable of Rule", "Return Variable of Object", "Return Global Variable", "Board Width",
    "Board Height", "Tile at Coordinates", "Pieces on Tile", "Tile Here", "All Pieces", "All Tiles", "Object ID", "Caller",
    "Create Tile Sprite", "Create Piece Sprite", "Choose Piece Type", "Choose Tile Type", "Selected Objects"
]
let SRF_RGroup_Operators = [
    "Repeat While", "==", ">", "<", ">=", "<=", "!=", "&&", "||", "XOR", "+", "-", "*", "/", "%", "**", "!", "abs", "sign",
    "Concatenate Strings", "Character of String", "Random Integer", "Random Decimal", "Slice of String",
    "Edit Variable of Rule", "Edit Variable of Object", "Edit Global Variable"
]
let SRF_RGroup_Arrays = [
    "Create an Array", "Array Length", "Remove Last Element of Array", "Array Index of Element", "Add to Array",
    "Array Element at Index", "Slice of Array"
]
let SRF_RGroup_Other = [
    "Repeat While", "Other Caller"
]