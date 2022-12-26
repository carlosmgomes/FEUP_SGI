import { CGFobject, CGFtexture, CGFappearance } from '../../lib/CGF.js';
import { MyRectangle } from "./MyRectangle.js";
import { MyPiece } from "./MyPiece.js";
import { MyGameBoardSquare } from "./MyGameBoardSquare.js";

export class MyGameBoard extends CGFobject {
    constructor(scene) {
        super(scene);
        this.board = [];
        this.boardPieces = [];
        this.piecesTexture1 = new CGFtexture(this.scene, "/tp3/scenes/images/red_wood.png");
        this.piecesTexture2 = new CGFtexture(this.scene, "/tp3/scenes/images/blue_wood.png");
        this.squareTexture1 = new CGFtexture(this.scene, "/tp3/scenes/images/steel.jpg");
        this.squareTexture2 = new CGFtexture(this.scene, "/tp3/scenes/images/wood.jpg");

        //add pieces to board (checkers game)
        for (var i = 0; i < 8; i++) {
            this.board[i] = [];
            this.boardPieces[i] = [];
            for (var j = 0; j < 8; j++) {
                if (i % 2 == 0) {
                    if (j % 2 == 0) {
                        this.board[i][j] = new MyGameBoardSquare(scene, this.squareTexture2);
                        this.boardPieces[i][j] = new MyPiece(scene, this.piecesTexture2);
                    } else {
                        this.board[i][j] = new MyGameBoardSquare(scene, this.squareTexture1);
                        this.boardPieces[i][j] = new MyPiece(scene, this.piecesTexture1);
                    }
                } else {
                    if (j % 2 == 0) {
                        this.board[i][j] = new MyGameBoardSquare(scene, this.squareTexture1);
                        this.boardPieces[i][j] = new MyPiece(scene, this.piecesTexture1);
                    } else {
                        this.board[i][j] = new MyGameBoardSquare(scene, this.squareTexture2);
                        this.boardPieces[i][j] = new MyPiece(scene, this.piecesTexture2);
                    }
                }
            }
        }
    }

    display() {

        //display squares
        this.scene.pushMatrix();
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                this.scene.pushMatrix();
                this.scene.translate(i, 1, j);
                this.scene.rotate(-Math.PI / 2, 1, 0, 0);
                console.log(this.board[i][j])
                this.board[i][j].display();
                this.scene.popMatrix();
            }
        }
        this.scene.popMatrix();
        /*
        //display pieces
        this.scene.pushMatrix();
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                if (this.board[i][j] != null){
                    this.scene.pushMatrix();
                    this.scene.translate(i, 0, j);
                    this.boardPieces[i][j].display();
                    this.scene.popMatrix();
                }
            }
        }
        this.scene.popMatrix(); 
        */
    }
}