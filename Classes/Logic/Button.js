class Button {
    clickScripts = [];
    visibleRules = [];
    sprite = 
    {
        fillColor:  "#0f0f0f",
        text: "",
        textColor: "FFFFFF",
        borderColor: "#000000",
        borderRadius: "5px",
    }
    
    // This starts out undefined but can be changed to a string
    // Do all the buttons go in one place in the UI, or can they be put in different places? If they can go in
    // different places, we'll need parameters here for that too.
    

    constructor(clickScripts = [], visibleRules = [], color = "#000000", textColor = "#ffffff", text = "", width = 0, height = 0) {
        this.containerWidth = -1;
        this.containerHeight = -1;
        this.containerTop = -1;
        this.containerLeft = -1;
        this.borderColor = 'black';
        this.borderWidth='2px';
        this.backgroundColor ='white';
        this.clickScripts = clickScripts;
        this.visibleRules = visibleRules;
        this.color = color;
        this.textColor = textColor;
        this.text = text;
        this.width = width;
        this.height = height;
        this.name = "";
        
    }

    clickButton(topCall = true) {
        if (this.specialButtonType === "In-Progress Save Code") {
            gameSaveCode();
            return true;
        }
        else {
            let scriptResult;
            for (let s = 0; s < this.clickScripts.length; s++) {
                scriptResult = this.clickScripts[s].run();
                console.log(scriptResult);
                if (scriptResult === false) {
                    if (topCall) gameStateRevert();
                    return false;
                }
            }
            scriptResult = globalScriptCheck();
            if (scriptResult && topCall) gameStateValid();
            else if (topCall) gameStateRevert();
            return scriptResult;
        }
    }

    buttonVisible() {
        if (this.containerWidth < 0 || this.containerHeight < 0) return false;
        for (let s = 0; s < this.visibleRules.length; s++) {
            if (!(this.visibleRules[s].run())) return false;
        }
        return true;
    }

    saveCode() {
        return {
            name: this.name,
            containerWidth:this.containerWidth,
            containerHeight:this.containerHeight,
            containerTop:this.containerTop,
            containerLeft:this.containerLeft,
            borderColor:this.borderColor,
            borderWidth:this.borderWidth,
            backgroundColor : this.backgroundColor,
            clickScripts: this.clickScripts.map(script =>
                script.saveCode()
            ),
            visibleRules: this.visibleRules.map(script =>
                script.saveCode()
            ),
            sprite: this.sprite,
            specialButtonType : this.specialButtonType ?? null
        };
    }
    clone(){
        let saveCode = this.saveCode();
        newButton = Button.loadCode(saveCode)
        return newButton;
    }

    static loadCode(code) {
        const button = new Button();
        button.name = code.name ?? "Unnamed";
        button.containerWidth = code.containerWidth ?? -1;
        button.containerHeight = code.containerHeight ?? -1;
        button.containerTop = code.containerTop ?? -1;
        button.containerLeft = code.containerLeft ?? -1;
        button.borderColor = code.borderColor ?? 'black';
        button.borderWidth = code.borderWidth ?? '2px';
        button.backgroundColor = code.backgroundColor ?? 'white';
        button.sprite = code.sprite ?? {
            fillColor: "#0f0f0f",
            text: "",
            textColor: "FFFFFF",
            borderColor: "#000000",
            borderRadius: "5px",
        };
        button.specialButtonType = code.specialButtonType ?? null;
    
        button.clickScripts = (code.clickScripts || []).map(data => {
            let newScript = ScriptingRule.loadCode(data);
            return newScript;
        });
    
        button.visibleRules = (code.visibleRules || []).map(data => {
            let newScript = ScriptingRule.loadCode(data);
            return newScript;
        });
    
        return button;
    }
    
    
}