export class MyGameSequence {
    constructor(orchestrator) {
        this.orchestrator = orchestrator;
        this.moves = [];
    }
    addMove(move) {
        this.moves.push(move);
    }
    undo() {
        let lastMove = this.moves[this.moves.length - 1];
        this.moves.pop();
        var auxBoard;
        console.log(this.orchestrator)
        if (lastMove.player == 1) {
            auxBoard = this.orchestrator.gameBoard.auxBoard2;
        } else {
            auxBoard = this.orchestrator.gameBoard.auxBoard1;
        }

        let movedPiece = lastMove.piece;
        lastMove.originTile.setPiece(movedPiece);
        lastMove.destinationTile.unsetPiece();
        movedPiece.setTile(lastMove.originTile);
        for (let i = lastMove.jumpedTiles.length - 1; i >= 0; i--) {
            lastMove.jumpedTiles[i].setPiece(auxBoard.getLastPiece());
            auxBoard.removePiece();
        }


        this.orchestrator.currentPlayer = lastMove.player;

    }
    replay() {
        //TODO
    }
}