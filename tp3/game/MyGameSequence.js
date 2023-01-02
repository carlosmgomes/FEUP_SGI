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
        if (lastMove.player == 1) {
            auxBoard = this.orchestrator.gameBoard.auxBoard2;
        } else {
            auxBoard = this.orchestrator.gameBoard.auxBoard1;
        }

        let movedPiece = lastMove.piece;
        if (lastMove.becameKing) {
            movedPiece.setType("piece");
        }
        lastMove.originTile.setPiece(movedPiece);
        lastMove.destinationTile.unsetPiece();
        movedPiece.setTile(lastMove.originTile);
        for (let i = lastMove.jumpedTiles.length - 1; i >= 0; i--) {
            lastMove.jumpedTiles[i].setPiece(auxBoard.getLastPiece());
            auxBoard.removePiece();
        }
        this.orchestrator.currentPlayer = lastMove.player;

    }

    undoAllMoves() {
        while (this.moves.length > 0) {
            this.undo();
        }
    }

    makeAllMoves(moves) {
        while (moves.length > 0) {
            let move = moves[0];
            moves.shift();
            this.orchestrator.gameBoard.movePiece(move.piece, move.originTile, move.destinationTile);
            this.addMove(move);
        }
    }

    movie(){
        var movesCopy = this.moves.slice();
        var currentPlayer = this.orchestrator.currentPlayer;
        this.undoAllMoves();
        this.makeAllMoves(movesCopy);
        this.orchestrator.currentPlayer = currentPlayer;
    }
}