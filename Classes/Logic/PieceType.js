class PieceType {
    scripts = [];
    typeID = -1;
    typeName = "";
    publicVars = [];

    constructor(name, scripts, id = undefined) {
        this.typeID = (id !== undefined) ? id : assignTypeID();
        this.typeName = name;
        this.scripts = scripts;
    }

    saveCode() {
        return {
            typeID: this.typeID,
            typeName: this.typeName,
            publicVars: BGBStructuredClone(this.publicVars),
            scripts: this.scripts.map(s => s.saveCode?.() ?? null)
        }
    }
    clone(){
        let saveCode = this.saveCode();
        let newPieceType = PieceType.loadCode(saveCode)
        return newPieceType
    }
     static loadCode(data) {
    const pieceType = new PieceType(data.typeName, data.scripts.map(ScriptingRule.loadCode), data.typeID);
    pieceType.publicVars = data.publicVars ?? [];
    return pieceType;
}
       
}
