import { CGFobject, CGFshader } from '../../lib/CGF.js';
import { MyGameBoardSide } from './MyGameBoardSide.js';
import { MyPiece } from "./MyPiece.js";
import { MyTile } from "./MyTile.js";
import { MyAuxBoard } from "./MyAuxBoard.js";

export class MyGameBoard extends CGFobject {
    constructor(scene, boardMaterial1, boardMaterial2, highlightMaterial, player1Material, player2Material) {
        super(scene);
        this.board = [];
        this.boardPieces = [];

        this.player1Pieces = 12;
        this.player2Pieces = 12;
        this.boardMaterial1 = boardMaterial1;
        this.boardMaterial2 = boardMaterial2;
        this.highlightMaterial = highlightMaterial;
        this.player1Material = player1Material;
        this.player2Material = player2Material;
        this.auxBoard1 = new MyAuxBoard("player1", scene, this.boardMaterial1);
        this.auxBoard2 = new MyAuxBoard("player2", scene, this.boardMaterial1);

        this.shader = new CGFshader(this.scene.gl, "shaders/shaders.vert", "shaders/shaders.frag");
        this.shader.setUniformsValues({ uSampler2: 1 });
        this.shader.setUniformsValues({ timeFactor: 0 });

        //add tiles to board
        for (var i = 0; i < 8; i++) {
            this.board[i] = [];
            for (var j = 0; j < 8; j++) {
                var id = i.toString() + j.toString();
                if (i % 2 == 0) {
                    if (j % 2 == 0) {
                        this.board[i][j] = new MyTile(id, scene, this.boardMaterial2, this.highlightMaterial);

                    } else {
                        this.board[i][j] = new MyTile(id, scene, this.boardMaterial1, this.highlightMaterial);
                    }
                } else {
                    if (j % 2 == 0) {
                        this.board[i][j] = new MyTile(id, scene, this.boardMaterial1, this.highlightMaterial);
                    } else {
                        this.board[i][j] = new MyTile(id, scene, this.boardMaterial2, this.highlightMaterial);
                    }
                }
                this.board[i][j].setBoard(this);
            }
        }

        //add pieces to board
        for (var i = 0; i < 8; i++) {
            this.boardPieces[i] = [];
            for (var j = 0; j < 8; j++) {
                if (i < 3) {
                    if (j % 2 == 0) {
                        if (i % 2 == 0) {
                            this.boardPieces[i][j] = new MyPiece(scene, 1, this.player1Material, this.shader);
                        }
                    } else {
                        if (i % 2 != 0) {
                            this.boardPieces[i][j] = new MyPiece(scene, 1, this.player1Material, this.shader);
                        }
                    }
                } else if (i > 4) {
                    if (j % 2 == 0) {
                        if (i % 2 == 0) {
                            this.boardPieces[i][j] = new MyPiece(scene, 2, this.player2Material, this.shader,);
                        }
                    } else {
                        if (i % 2 != 0) {
                            this.boardPieces[i][j] = new MyPiece(scene, 2, this.player2Material, this.shader);
                        }
                    }
                }
                if (this.boardPieces[i][j] != null){
                    this.board[i][j].setPiece(this.boardPieces[i][j]);
                    this.boardPieces[i][j].setTile(this.board[i][j]);
                }
            }
        }

        //add sides to board
        this.side1 = new MyGameBoardSide(scene, "side1", this.boardMaterial2);
        this.side2 = new MyGameBoardSide(scene, "side2", this.boardMaterial2);
        this.side3 = new MyGameBoardSide(scene, "side3", this.boardMaterial2);
        this.side4 = new MyGameBoardSide(scene, "side4", this.boardMaterial2);
        this.side5 = new MyGameBoardSide(scene, "side5", this.boardMaterial1);
        this.side6 = new MyGameBoardSide(scene, "side6", this.boardMaterial1);
        this.side7 = new MyGameBoardSide(scene, "side7", this.boardMaterial1);
        this.side8 = new MyGameBoardSide(scene, "side8", this.boardMaterial1);
    }

    addPiece(piece, tile) {
        if (!tile.hasPiece()) {
            tile.setPiece(piece);
            piece.setTile(tile);
        }
    }

    removePiece(tile) {
        tile.unsetPiece();
    }

    getPiece(tile) {
        return tile.getPiece();
    }

    getTile(piece) {
        return piece.getTile();
    }

    getTileByCoords(x, y) {
        return this.board[x][y];
    }

    movePiece(piece, startTile, endTile) {
        this.removePiece(startTile);
        this.addPiece(piece, endTile);
    }

    getCurrentMoves(player, piece) {
        if (piece == null) return 0;
        var tile = piece.getTile();
        var id = tile.getId();
        console.log(id);    
        var row = parseInt(id[0]);
        var col = parseInt(id[1]);
        var adjacentTileLeft = null;
        var adjacentTileRight = null;
        var currentMoves = [];
        if (col != 0){
            if (player == 1)
                adjacentTileLeft = this.board[row + 1][col - 1];
            else
                adjacentTileLeft = this.board[row - 1][col - 1];
            //house is empty
            if (!adjacentTileLeft.hasPiece()){
                currentMoves.push(adjacentTileLeft);
            }
        }
        if (col != 7){
            if (player == 1)
                adjacentTileRight = this.board[row + 1][col + 1];
            else
                adjacentTileRight = this.board[row - 1][col + 1];
            //house is empty
            if (!adjacentTileRight.hasPiece()){
                currentMoves.push(adjacentTileRight);
            }
        }
        return currentMoves;
    }

    highlightPiece(piece) {
        if (piece != null)
            piece.highlight();
    }

    unhighlightPiece(piece) {
        if (piece != null)
            piece.unhighlight();
    }

    highlightTile(tile) {
        if(tile != null)
            tile.highlight();
    }

    unhighlightTile(tile) {
        if(tile != null)
            tile.unhighlight();
    }

    display() {
        this.scene.clearPickRegistration();
        this.scene.pushMatrix();
        this.scene.translate(10, 1, 15);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);

        this.side1.display();
        this.side2.display();
        this.side3.display();
        this.side4.display();
        this.side5.display();
        this.side6.display();
        this.side7.display();
        this.side8.display();
        this.auxBoard1.display();
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 13.1);
        this.auxBoard2.display();
        this.scene.popMatrix();
        
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                var id = (i+1).toString() + (j+1).toString();
                this.scene.pushMatrix();
                this.scene.translate(i, 0, j);
                this.scene.rotate(-Math.PI / 2, 1, 0, 0);

                this.scene.registerForPick(id, this.board[i][j]);
                this.board[i][j].display();
                this.scene.popMatrix();
            }
        }
        this.scene.popMatrix();
    }
}