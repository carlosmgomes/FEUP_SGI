import {CGFobject} from '../../lib/CGF.js';
import {MyRectangle} from "../primitives/MyRectangle.js";

export class MyTile extends CGFobject {
    constructor(id, scene, material, materialHighlight, selectable = true) {
        super(scene);

        this.id = id;
        this.material = material;
        this.materialHighlight = materialHighlight;
        
        this.isHighlighted = false;

        this.rectangle = new MyRectangle(scene, 0, 1, 0, 1);
        this.selectable = selectable;
        this.selected = false;
    }

    getId() {
        return this.id;
    }

    getCoordsfromId() {
        return [parseInt(this.id[0]), parseInt(this.id[1])];
    }

    setPiece(piece) {
        this.piece = piece;
    }

    hasPiece() {
        return this.piece != null;
    }

    getPiece() {
        return this.piece;
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

    highlight() {
        this.isHighlighted = true;
    }

    unhighlight() {
        this.isHighlighted = false;
    }

    setPosition(position) {
        this.position = position;
     }
 
     getPosition() {
         return this.position;
     }

    display() {
        this.scene.pushMatrix();
        this.setPosition(this.scene.getMatrix())
        if (!this.isHighlighted)
            this.material.apply();
        else
            this.materialHighlight.apply();
        this.rectangle.display();
        if (this.piece != null)
            this.piece.display();
        this.scene.popMatrix();
    }
}