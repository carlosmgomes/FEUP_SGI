import {CGFobject, CGFappearance} from '../../lib/CGF.js';
import {MyRectangle} from "./MyRectangle.js";

export class MyGameBoardSquare extends CGFobject {
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

    display() {
        this.scene.pushMatrix();
        this.material.apply();
        this.rectangle.display();
        this.scene.popMatrix();
    }
}