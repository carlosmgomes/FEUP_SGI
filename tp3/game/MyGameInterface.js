import { CGFobject } from '../../lib/CGF.js';
import { MyRectangle } from "../primitives/MyRectangle.js";
import { MyTriangle } from '../primitives/MyTriangle.js';
export class MyGameInterface extends CGFobject {

    constructor(scene, material) {
        super(scene);
        this.material = material;
        console.log(this.material);
        this.rectangle = new MyRectangle(scene, -0.5, 0.5, -1, 1);
        this.triangle = new MyTriangle(scene, 0, 1, 0, -1, 0, 1, 0, 0, 0);
    }


    displayFront() {
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI * 0.5, 0, 0, 1);
        this.scene.translate(0.5, -1, 0.21);
        this.scene.rotate(Math.PI * 0.12, 0, 1, 0);
        this.scene.scale(1.1, 1, 1);
        this.rectangle.display();
        this.scene.popMatrix();
    }

    displayBack() {
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI * 1.5, 0, 0, 1);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.translate(0.5, 1, 0.2);
        this.scene.rotate(Math.PI * 0.12, 0, 1, 0);
        this.scene.scale(1.1, 1, 1);
        this.rectangle.display();
        this.scene.popMatrix();
    }

    displaySide1() {
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI * 1.5, 1, 0, 0);
        this.scene.rotate(Math.PI * 1.5, 0, 1, 0);
        this.scene.scale(1, 0.4, 1);
        this.scene.scale(1.02, 1.02, 1.02);
        this.triangle.display();
        this.scene.popMatrix();
    }
    displaySide2() {
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI * 0.5, 1, 0, 0);
        this.scene.rotate(Math.PI * 0.5, 0, 1, 0);
        this.scene.translate(0, 0, 2);
        this.scene.scale(1, 0.4, 1);
        this.scene.scale(1.02, 1.02, 1.02);
        this.triangle.display();
        this.scene.popMatrix();
    }


    display() {
        this.scene.pushMatrix();
        this.material.apply();
        if (this.scene.selectedTheme == "demo.xml") {
            this.scene.rotate(Math.PI * 0.5, 0, 1, 0);
            this.scene.translate(-7.5, 3, 5.5);
        }
        if (this.scene.selectedTheme == "dungeon.xml") {
            this.scene.rotate(Math.PI * 0.5, 0, 1, 0);
            this.scene.translate(-8.5, 3, 10.9);
        }
        this.displaySide1();
        this.displaySide2();
        this.displayFront();
        this.displayBack();
        this.scene.popMatrix();
    }
}