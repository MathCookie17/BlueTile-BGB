
class Board {
    boardShape = "Square"; // The shape of the board
    width; height; // The dimensions of the board
    tileArray; // A 2D array of Tiles

    constructor(boardShape, width, height) {
        this.containerWidth = -1;
        this.containerHeight = -1;
        this.containerTop = -1;
        this.containerLeft = -1;
        this.borderColor = 'rgba(0, 0, 0, 0.9)';
        this.borderWidth = '2px';
        this.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        
        this.boardShape = boardShape;

        this.width = width;
        this.height = height;
        let ta = [];
        for (let y = 0; y < height; y++) {
            ta.push([]);
            for (let x = 0; x < width; x++) {
                ta[y].push(new Tile([], x, y));
            }
        }
        this.tileArray = ta;
    }

    getTile(x, y) {
        if (y >= 0 && y < this.tileArray.length && y % 1 == 0) {
            if (x >= 0 && x < this.tileArray[y].length && x % 1 == 0) {
                return this.tileArray[y][x];
            }
        }
        return undefined;
    }

    saveCode() {
        return {
            boardShape: this.boardShape,
            width: this.width,
            height: this.height,
            containerWidth: this.containerWidth,
            containerHeight: this.containerHeight,
            containerTop: this.containerTop,
            containerLeft: this.containerLeft,
            borderColor: this.borderColor,
            borderWidth: this.borderWidth,
            backgroundColor: this.backgroundColor,
            tileArray: this.tileArray.map(row => row.map(tile => tile.saveCode())
            )
        };
    }

    clone(){
        let saveCode = this.saveCode();
        let newBoard = Board.loadCode(saveCode)
        return newBoard
    }

    static loadCode(data) {
        const board = new Board(data.boardShape, data.width, data.height);
        board.tileArray = data.tileArray.map(row => row.map(tileData => Tile.loadCode(tileData))
        );
        board.containerWidth = data.containerWidth ?? -1;
        board.containerHeight = data.containerHeight ?? -1;
        board.containerTop = data.containerTop ?? -1;
        board.containerLeft = data.containerLeft ?? -1;
        board.borderColor = data.borderColor ?? 'rgba(0, 0, 0, 0.9)';
        board.borderWidth = data.borderWidth ?? '2px';
        board.backgroundColor = data.backgroundColor ?? 'rgba(255, 255, 255, 0.9)';
        return board;
    }

}

