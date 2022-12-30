import { CGFobject, CGFtexture, CGFappearance, CGFshader } from '../../lib/CGF.js';
import { MySceneGraph } from '../MySceneGraph.js';
import { MyGameBoard } from './MyGameBoard.js';
import { MyAnimator } from './MyAnimator.js';
import { MyGameSequence } from './MyGameSequence.js';
import { MyTile } from './MyTile.js';
import { MyGameMove } from './MyGameMove.js';

export class MyGameOrchestrator extends CGFobject {
    constructor(scene,selectedTheme) {
        super(scene);
        this.finished = false;
        this.wood = new CGFtexture(this.scene, "/tp3/scenes/images/wood.jpg");

        this.blue = new CGFappearance(scene);
        this.blue.setEmission(0.0, 0.0, 0.0, 1.0);
        this.blue.setAmbient(0.0, 0.0, 0.1, 1.0);
        this.blue.setDiffuse(0.0, 0.0, 0.4, 1.0);
        this.blue.setSpecular(0.0, 0.0, 0.4, 1.0);
        this.blue.setShininess(10.0);
        this.blue.setTexture(this.wood);

        this.red = new CGFappearance(scene);
        this.red.setEmission(0.0, 0.0, 0.0, 1.0);
        this.red.setAmbient(0.1, 0.0, 0.0, 1.0);
        this.red.setDiffuse(0.4, 0.0, 0.0, 1.0);
        this.red.setSpecular(0.4, 0.0, 0.0, 1.0);
        this.red.setShininess(10.0);
        this.red.setTexture(this.wood);

        this.green = new CGFappearance(scene);
        this.green.setEmission(0.0, 0.0, 0.0, 1.0);
        this.green.setAmbient(0.0, 0.1, 0.0, 1.0);
        this.green.setDiffuse(0.0, 0.4, 0.0, 1.0);
        this.green.setSpecular(0.0, 0.4, 0.0, 1.0);
        this.green.setShininess(10.0);
        this.green.setTexture(this.wood);

        this.green_blue = new CGFappearance(scene);
        this.green_blue.setEmission(0.0, 0.0, 0.0, 1.0);
        this.green_blue.setAmbient(0.0, 0.1, 0.1, 1.0);
        this.green_blue.setDiffuse(0.0, 0.4, 0.4, 1.0);
        this.green_blue.setSpecular(0.0, 0.4, 0.4, 1.0);
        this.green_blue.setShininess(10.0);
        this.green_blue.setTexture(this.wood);

        this.boardMaterial1 = new CGFappearance(scene);
        this.boardMaterial1.setEmission(0.0, 0.0, 0.0, 1.0);
        this.boardMaterial1.setAmbient(0.1, 0.1, 0.1, 1.0);
        this.boardMaterial1.setDiffuse(0.4, 0.4, 0.4, 1.0);
        this.boardMaterial1.setSpecular(0.4, 0.4, 0.4, 1.0);
        this.boardMaterial1.setShininess(10.0);

        this.boardMaterial2 = new CGFappearance(scene);
        this.boardMaterial2.setEmission(0.0, 0.0, 0.0, 1.0);
        this.boardMaterial2.setAmbient(0.1, 0.1, 0.1, 1.0);
        this.boardMaterial2.setDiffuse(0.4, 0.4, 0.4, 1.0);
        this.boardMaterial2.setSpecular(0.4, 0.4, 0.4, 1.0);
        this.boardMaterial2.setShininess(10.0);

        this.tileTexture1 = new CGFtexture(this.scene, "scenes/images/white_wood.jpg");
        this.tileTexture2 = new CGFtexture(this.scene, "scenes/images/steel.jpg");

        this.boardMaterial1.setTexture(this.tileTexture1);
        this.boardMaterial2.setTexture(this.tileTexture2);

        this.gameSequence = new MyGameSequence(this);
        this.animator = new MyAnimator(scene, this);
        this.gameBoard = new MyGameBoard(scene, this.boardMaterial1, this.boardMaterial2, this.red, this.green_blue, this.blue);
        this.theme = new MySceneGraph(selectedTheme, scene);
        this.currentPlayer = 1;
        this.currentHighlight = null;
        this.state = "gameplay";
    }

    setTheme(theme) {
        this.theme = new MySceneGraph(theme, this.scene);
    }

    update(time) {
        this.animator.update(time);
    }

    display() {
        this.theme.displayScene();
        this.gameBoard.display();
    }


    managePick(pickMode, pickResults) {
        if (pickMode == false) {
            if (pickResults != null && pickResults.length > 0) {
                for (var i = 0; i < pickResults.length; i++) {
                    var obj = pickResults[i][0];
                    if (obj) {
                        var customId = pickResults[i][1];
                        this.OnObjectSelected(obj, customId);
                    }
                }
                pickResults.splice(0, pickResults.length);
            }
        }
    }

    OnObjectSelected(obj, id) {
        //TODO
        if (obj instanceof MyTile) {
            if (obj.piece != null) {
                console.log("Piece selected");
                console.log(obj.id);
                this.pieceSelected(obj.piece);
            }
            else {
                console.log("Tile selected");
                console.log(obj.id);
                this.tileSelected(obj);
            }
        }
    }

    nextPlayer() {
        // TODO 
        // camera animation
        var temp = [];
        var found = false;
        var hasMoves = false;
        this.currentPlayer = this.currentPlayer == 1 ? 2 : 1;
        for (var i = 0; i < this.gameBoard.board.length; i++) {
            for (var j = 0; j < this.gameBoard.board[i].length; j++) {
                if (this.gameBoard.board[i][j].piece != null) {
                    if (this.gameBoard.board[i][j].piece.player == this.currentPlayer) {
                        found = true;
                        temp.push(this.gameBoard.getCurrentMoves(this.currentPlayer, this.gameBoard.board[i][j].piece));
                    }
                }

            }
        }
        for (var i = 0; i < temp.length; i++) {

            if (temp[i][0].length > 0 || temp[i][1].length > 0) {
                hasMoves = true;
                break;
            }
        }
        if (!found || !hasMoves) {
            this.state = "gameover";
            this.finished = true;
            console.log("Game Over");
            this.winner = this.currentPlayer == 1 ? 2 : 1;
            console.log("Player " + this.winner + " wins!");
            return;
        }
        this.scene.updatePlayerCamera(this.currentPlayer);

    }


    highlightPieceAndTiles(piece) {
        this.gameBoard.highlightPiece(piece);
        if (piece.getType() == "piece") {
            for (var i = 0; i < this.gameBoard.getCurrentMoves(this.currentPlayer, piece)[0].length; i++) {
                this.gameBoard.highlightTile(this.gameBoard.getCurrentMoves(this.currentPlayer, piece)[0][i]);
            }
        }
        else {
            for (var i = 0; i < this.gameBoard.getCurrentMovesKing(this.currentPlayer, piece)[0].length; i++) {
                this.gameBoard.highlightTile(this.gameBoard.getCurrentMovesKing(this.currentPlayer, piece)[0][i]);
            }
        }
    }

    unhighlightPieceAndTiles(piece) {
        if (piece == null) return;
        this.gameBoard.unhighlightPiece(piece);
        if (piece.getType() == "piece") {
            for (var i = 0; i < this.gameBoard.getCurrentMoves(this.currentPlayer, piece)[0].length; i++) {
                this.gameBoard.unhighlightTile(this.gameBoard.getCurrentMoves(this.currentPlayer, piece)[0][i]);
            }
        }
        else {
            for (var i = 0; i < this.gameBoard.getCurrentMovesKing(this.currentPlayer, piece)[0].length; i++) {
                this.gameBoard.unhighlightTile(this.gameBoard.getCurrentMovesKing(this.currentPlayer, piece)[0][i]);
            }
        }
    }

    pieceSelected(piece) {
        if (this.state == "gameplay" || this.state == "pieceSelected") {
            if (piece.getPlayer() == this.currentPlayer && piece.getType() == "piece" && this.gameBoard.getCurrentMoves(this.currentPlayer, piece)[0].length > 0) {
                this.unhighlightPieceAndTiles(this.currentHighlight);
                this.highlightPieceAndTiles(piece);
                this.currentHighlight = piece;
                this.state = "pieceSelected";
            }
            else if (piece.getPlayer() == this.currentPlayer && piece.getType() == "king" && this.gameBoard.getCurrentMovesKing(this.currentPlayer, piece)[0].length > 0) {
                this.unhighlightPieceAndTiles(this.currentHighlight);
                this.highlightPieceAndTiles(piece);
                this.currentHighlight = piece;
                this.state = "pieceSelected";
            }
            else {
                this.unhighlightPieceAndTiles(this.currentHighlight);
                this.state = "gameplay";
                this.currentHighlight = null;
            }
        }
    }

    tileSelected(tile) {
        if (this.state == "pieceSelected") {
            if ((this.currentHighlight.getType() == "piece" && this.gameBoard.getCurrentMoves(this.currentPlayer, this.currentHighlight)[0].includes(tile) ||
                (this.currentHighlight.getType() == "king" && this.gameBoard.getCurrentMovesKing(this.currentPlayer, this.currentHighlight)[0].includes(tile)))) {
                //animation TODO
                var jumpedTiles = [];
                this.unhighlightPieceAndTiles(this.currentHighlight);
                var originTile = this.currentHighlight.getTile();
                jumpedTiles = this.gameBoard.movePiece(this.currentHighlight, this.currentHighlight.getTile(), tile);
                this.gameSequence.addMove(new MyGameMove(originTile, tile, jumpedTiles, this.currentPlayer));
                this.nextPlayer();
                this.currentHighlight = null;
                this.state = "gameplay";
            }
        }
    }

    undo() {
        if (this.state == "gameplay" && this.gameSequence.moves.length > 0) {
            this.gameSequence.undo();
            this.display();
        }
    }
}

