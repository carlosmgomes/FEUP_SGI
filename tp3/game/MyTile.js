import {CGFobject, CGFappearance} from '../../lib/CGF.js';
import {MyRectangle} from "../primitives/MyRectangle.js";

export class MyTile extends CGFobject {
    constructor(scene, texture) {
        super(scene);


        this.material = new CGFappearance(scene);

        this.material.setEmission(0.0, 0.0, 0.0, 1.0);
        this.material.setAmbient(0.1, 0.1, 0.1, 1.0);
        this.material.setDiffuse(0.4, 0.4, 0.4, 1.0);
        this.material.setSpecular(0.4, 0.4, 0.4, 1.0);
        this.material.setShininess(10.0);

        this.material.setTexture(texture);
        
        this.rectangle = new MyRectangle(scene, 0, 1, 0, 1);
    }

    setPiece(piece) {
        this.piece = piece;
    }

    unsetPiece() {
        this.piece = null;
    }

    setBoard(gameBoard) {
        this.gameBoard = gameBoard;
    }

    getBoard() {
        return this.gameBoard;
    }

    display() {
        this.scene.pushMatrix();
        this.material.apply();
        this.rectangle.display();
        if (this.piece != null)
            this.piece.display();
        this.scene.popMatrix();
    }
}