import {CGFobject, CGFappearance} from '../../lib/CGF.js';
import {MyRectangle} from "../primitives/MyRectangle.js";

export class MyTile extends CGFobject {
    constructor(id,scene, texture, selectable = true) {
        super(scene);

        this.id = id;
        this.material = new CGFappearance(scene);

        this.material.setEmission(0.0, 0.0, 0.0, 1.0);
        this.material.setAmbient(0.1, 0.1, 0.1, 1.0);
        this.material.setDiffuse(0.4, 0.4, 0.4, 1.0);
        this.material.setSpecular(0.4, 0.4, 0.4, 1.0);
        this.material.setShininess(10.0);

        this.material.setTexture(texture);
        
        this.rectangle = new MyRectangle(scene, 0, 1, 0, 1);
        this.selectable = selectable;
        this.selected = false;
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

        /* if (this.selectable)
            this.scene.registerForPick(this.uniqueId, this);
        // Now call all the game objects/components/primitives display
        // method that should be selectable and recognized
        // with this uniqueId
        // clear the currently registered id and associated object
        if (this.selectable)
            this.scene.clearPickRegistration();
         */
        this.scene.pushMatrix();
        this.material.apply();
        this.rectangle.display();
        if (this.piece != null)
            this.piece.display();
        this.scene.popMatrix();
    }
}