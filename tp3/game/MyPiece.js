import { CGFobject} from '../../lib/CGF.js';
import { MyPatch } from '../primitives/MyPatch.js';

export class MyPiece extends CGFobject {
    constructor(scene, player, material, shader) {
        super(scene);

        this.type = "king";

        this.player = player;

        this.material = material;

        this.shader = shader;

        this.isHighlighted = false;

        this.controlPointsSemiSide = [[[1.8, 0, 0, 1], [1.8, 0, 0.25, 1], [1.8, 0, 0.5, 1], [1.8, 0, 1, 1]],
        [[1.8, 2.4, 0, 1], [1.8, 2.4, 0.25, 1], [1.8, 2.4, 0.5, 1], [1.8, 2.4, 1, 1]],
        [[-1.8, 2.4, 0, 1], [-1.8, 2.4, 0.25, 1], [-1.8, 2.4, 0.5, 1], [-1.8, 2.4, 1, 1]],
        [[-1.8, 0, 0, 1], [-1.8, 0, 0.25, 1], [-1.8, 0, 0.5, 1], [-1.8, 0, 1, 1]]];

        this.controlPointsSemiCircle = [[[0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 0, 1]],
        [[-1.8, 0, 0, 1], [-1.8, 0, 2.4, 1], [1.8, 0, 2.4, 1], [1.8, 0, 0, 1]]];

        this.semiSidePiece = new MyPatch(scene, 3, 3, 20, 20, this.controlPointsSemiSide);
        this.semiCirclePiece = new MyPatch(scene, 1, 3, 20, 20, this.controlPointsSemiCircle);
    }

    getPlayer() {
        return this.player;
    }

    setTile(tile) {
        this.tile = tile;
    }

    getTile() {
        return this.tile;
    }

    setType(type) {
        this.type = type;
    }

    getType() {
        return this.type;
    }

    highlight() {
        this.isHighlighted = true;
    }

    unhighlight() {
        this.isHighlighted = false;
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
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.semiCirclePiece.display();
        this.scene.popMatrix();

        //semi circle piece 2
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.semiCirclePiece.display();
        this.scene.popMatrix();

        //semi circle piece 3
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.translate(0, 1, 0);
        this.semiCirclePiece.display();
        this.scene.popMatrix();

        //semi circle piece 4
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.scene.translate(0, 1, 0);
        this.semiCirclePiece.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
    }

    display() {

        if (this.isHighlighted) {
            this.scene.shader.setUniformsValues({ normScale: 2.0 });
            this.scene.shader.setUniformsValues({ newColor: [1.0, 0.0, 0.0] });
            this.scene.shader.setUniformsValues({ diffuse: [this.material.diffuse[0], this.material.diffuse[1], this.material.diffuse[2], this.material.diffuse[3]] });
            this.scene.setActiveShader(this.scene.shader);
        }

        if (this.type == "piece") {

            this.scene.pushMatrix();
            this.material.apply();
            this.scene.scale(0.25, 0.25, 0.25);
            this.scene.translate(2, 2, 0);
            this.displayPiece();

            this.scene.popMatrix();
        }
        else {
            this.scene.pushMatrix();
            this.material.apply();
            this.scene.scale(0.25, 0.25, 0.25);
            this.scene.translate(2, 2, 0);
            this.displayPiece();
            this.scene.popMatrix();
            this.scene.pushMatrix();
            this.material.apply();
            this.scene.scale(0.25, 0.25, 0.25);
            this.scene.translate(2, 2, 1.2);
            this.displayPiece();
            this.scene.popMatrix();
        }

        if (this.isHighlighted) {
            this.scene.setActiveShader(this.scene.defaultShader);
        }
    }
}