import { CGFobject, CGFtexture } from '../../lib/CGF.js';
import { MyGameBoardSide } from './MyGameBoardSide.js';
import { MyPiece } from "./MyPiece.js";
import { MyTile } from "./MyTile.js";
import { MyAuxBoard } from "./MyAuxBoard.js";
import { MyGameMove } from "./MyGameMove.js";

export class MyGameBoard extends CGFobject {
    constructor(scene) {
        super(scene);
        this.board = [];
        this.boardPieces = [];
        this.piecesTexture1 = new CGFtexture(this.scene, "/tp3/scenes/images/red_wood.png");
        this.piecesTexture2 = new CGFtexture(this.scene, "/tp3/scenes/images/blue_wood.png");
        this.tileTexture1 = new CGFtexture(this.scene, "/tp3/scenes/images/steel.jpg");
        this.tileTexture2 = new CGFtexture(this.scene, "/tp3/scenes/images/wood.jpg");
        this.auxBoardBlue = new MyAuxBoard("blue",scene, this.tileTexture2);
        this.auxBoardRed = new MyAuxBoard("red",scene, this.tileTexture2);
        //add tiles to board
        for (var i = 0; i < 8; i++) {
            this.board[i] = [];
            this.boardPieces[i] = [];
            for (var j = 0; j < 8; j++) {
                var id = i.toString()+j.toString();
                if (i % 2 == 0) {
                    if (j % 2 == 0) {
                        this.board[i][j] = new MyTile(id, scene, this.tileTexture1);
                        
                    } else {
                        this.board[i][j] = new MyTile(id,scene, this.tileTexture2);
                    }
                } else {
                    if (j % 2 == 0) {
                        this.board[i][j] = new MyTile(id,scene, this.tileTexture2);
                    } else {
                        this.board[i][j] = new MyTile(id,scene, this.tileTexture1);
                    }
                }
                this.board[i][j].setBoard(this);
            }
        }

        //add pieces to board
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                if (i < 3) {
                    if (j % 2 == 0) {
                        if (i % 2 == 0) {
                            this.boardPieces[i][j] = new MyPiece(scene, this.piecesTexture1);
                            this.board[i][j].setPiece(this.boardPieces[i][j]);
                        }
                    } else {
                        if (i % 2 != 0) {
                            this.boardPieces[i][j] = new MyPiece(scene, this.piecesTexture1);
                            this.board[i][j].setPiece(this.boardPieces[i][j]);
                        }
                    }
                } else if (i > 4) {
                    if (j % 2 == 0) {
                        if (i % 2 == 0) {
                            this.boardPieces[i][j] = new MyPiece(scene, this.piecesTexture2);
                            this.board[i][j].setPiece(this.boardPieces[i][j]);
                        }
                    } else {
                        if (i % 2 != 0) {
                            this.boardPieces[i][j] = new MyPiece(scene, this.piecesTexture2);
                            this.board[i][j].setPiece(this.boardPieces[i][j]);
                        }
                    }
                }
            }
        }

        //add sides to board
        this.side1 = new MyGameBoardSide(scene, "side1", this.tileTexture1);
        this.side2 = new MyGameBoardSide(scene, "side2", this.tileTexture1);
        this.side3 = new MyGameBoardSide(scene, "side3", this.tileTexture1);
        this.side4 = new MyGameBoardSide(scene, "side4", this.tileTexture1);
        this.side5 = new MyGameBoardSide(scene, "side5", this.tileTexture2);
        this.side6 = new MyGameBoardSide(scene, "side6", this.tileTexture2);
        this.side7 = new MyGameBoardSide(scene, "side7", this.tileTexture2);
        this.side8 = new MyGameBoardSide(scene, "side8", this.tileTexture2);
    }

    addPiece(piece, tile) {
        if (tile.piece == null) {
            tile.piece = piece;
        }
    }

    removePiece(tile) {
        tile.piece = null;
    }

    getPiece(tile) {
        return tile.piece;
    }

    getTile(piece){
        return piece.tile;
    }

    getTileByCoords(x, y) {
        return this.board[x][y];
    }

    movePiece(piece, startTile, endTile) {
        this.removePiece(startTile);
        this.addPiece(piece, endTile);
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(10, 1, 15);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                var id = i*8 + j;
                this.scene.pushMatrix();
                this.scene.translate(i, 0, j);
                this.scene.rotate(-Math.PI / 2, 1, 0, 0);
                this.scene.registerForPick(id, this.board[i][j]);
                this.board[i][j].display();
                this.scene.popMatrix();
            }
        }
        this.side1.display();
        this.side2.display();
        this.side3.display();
        this.side4.display();
        this.side5.display();
        this.side6.display();
        this.side7.display();
        this.side8.display();
        this.auxBoardBlue.display();
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 13.1);
        this.auxBoardRed.display();
        this.scene.popMatrix();
        this.scene.popMatrix();
    }
}