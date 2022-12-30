export class MyGameMove {
    constructor(originTile, destinationTile,jumpedTiles,player) {
        this.piece = destinationTile.piece;
        this.originTile = originTile;
        this.destinationTile = destinationTile;
        this.jumpedTiles = jumpedTiles;
        this.player = player;
    }


    getDirection(){
        var originId = Number.parseInt(this.originTile.id);
        var destinationId = Number.parseInt(this.destinationTile.id);
        var originRow = Math.floor(originId / 10);
        var originColumn = originId % 10;
        var destinationRow = Math.floor(destinationId / 10);
        var destinationColumn = destinationId % 10;
        var direction = [destinationRow - originRow, destinationColumn - originColumn];
        // [1, 1] -> right up
        // [-1,-1] -> left down
        // [1, -1] -> left up
        // [-1, 1] -> right down
        // [2,2] -> right up eat
        // [-2,-2] -> left down eat
        // [2, -2] -> left up eat
        // [-2, 2] -> right down eat
        return direction;
    }

    animate() {
        this.originTile.piece = null;
        this.destinationTile.piece = this.piece;
    }

}