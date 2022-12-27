import {CGFobject, CGFappearance} from '../../lib/CGF.js';
import {MyPatch} from '../primitives/MyPatch.js';

export class MyPiece extends CGFobject {
    constructor(scene, texture, tile) {
        super(scene);

        this.type = "piece";

        this.currentTile = tile;

        this.material = new CGFappearance(scene);

        this.material.setEmission(0.0, 0.0, 0.0, 1.0);
        this.material.setAmbient(0.1, 0.1, 0.1, 1.0);
        this.material.setDiffuse(0.4, 0.4, 0.4, 1.0);
        this.material.setSpecular(0.4, 0.4, 0.4, 1.0);
        this.material.setShininess(10.0);

        this.material.setTexture(texture);

        this.controlPointsSemiSide = [[[1.8, 0, 0, 1],[1.8, 0, 0.25, 1], [1.8, 0, 0.5, 1], [1.8, 0, 1, 1]],
                                        [[1.8, 2.4, 0, 1], [1.8, 2.4, 0.25, 1], [1.8, 2.4, 0.5, 1], [1.8, 2.4, 1, 1]],
                                        [[-1.8, 2.4, 0, 1], [-1.8, 2.4, 0.25, 1], [-1.8, 2.4, 0.5, 1], [-1.8, 2.4, 1, 1]],
                                        [[-1.8, 0, 0, 1], [-1.8, 0, 0.25, 1], [-1.8, 0, 0.5, 1], [-1.8, 0, 1, 1]]];

        this.controlPointsSemiCircle = [[[0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 0, 1]],
                                        [[-1.8, 0, 0, 1], [-1.8, 0, 2.4, 1], [1.8, 0, 2.4, 1],[1.8, 0, 0, 1]]];

        this.semiSidePiece = new MyPatch(scene, 3, 3, 20, 20, this.controlPointsSemiSide);
        this.semiCirclePiece = new MyPatch(scene, 1, 3, 20, 20, this.controlPointsSemiCircle);
    }

    setTile(tile) {
        this.currentTile = tile;
    }

    setType(type) {
        this.type = type;
    }

    getType() {
        return this.type;
    }
    
    displayPiece() {
        this.scene.pushMatrix();

        //side piece 1
        this.scene.pushMatrix();
        this.semiSidePiece.display();
        this.scene.popMatrix();

        //side piece 2
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 1);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.semiSidePiece.display();
        this.scene.popMatrix();

        //semi circle piece 1
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.semiCirclePiece.display();
        this.scene.popMatrix();

        //semi circle piece 2
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.semiCirclePiece.display();
        this.scene.popMatrix();

        //semi circle piece 3
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.translate(0, 1, 0);
        this.semiCirclePiece.display();
        this.scene.popMatrix();

        //semi circle piece 4
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.scene.translate(0, 1, 0);
        this.semiCirclePiece.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
    }

    display() {
        this.scene.pushMatrix();
        this.material.apply();
        this.scene.scale(0.25, 0.25, 0.25);
        this.scene.translate(2, 2, 0);
        this.displayPiece();
        this.scene.popMatrix();
    }
}