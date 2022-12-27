import {CGFobject, CGFappearance} from '../../lib/CGF.js';
import {MyRectangle} from "./MyRectangle.js";

export class MyGameBoardSide extends CGFobject {
    constructor(scene, id, texture) {
        super(scene);
    
        this.id = id;
        this.material = new CGFappearance(scene);
    
        this.material.setEmission(0.0, 0.0, 0.0, 1.0);
        this.material.setAmbient(0.1, 0.1, 0.1, 1.0);
        this.material.setDiffuse(0.4, 0.4, 0.4, 1.0);
        this.material.setSpecular(0.4, 0.4, 0.4, 1.0);
        this.material.setShininess(10.0);
    
        this.material.setTexture(texture);
        this.rectangle = new MyRectangle(scene, -0.5, 0.5, -1, 1);
    }
    
    display1() {
        var z = -1.1;
        if (this.id == "side3")
            z = 7.1;

        this.scene.translate(4, 0, z);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.rotate(Math.PI / 2, 0, 0, 1);    
        this.scene.scale(0.2, 4.2, 1);
        this.rectangle.display();
    }

    display2() {

        var x = -0.1;
        if (this.id == "side4")
            x = 8.1;

        this.scene.translate(x, 0, 3);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);   
        this.scene.scale(0.2, 4.2, 1);
        this.rectangle.display();
    }

    display3() {

        var z = -1.7;
        if (this.id == "side7")
            z = 7.7;

        this.scene.translate(4, 0, z);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.rotate(Math.PI / 2, 0, 0, 1);    
        this.scene.scale(1, 5.2, 1);
        this.rectangle.display();
    }

    display4() {
        var x = -0.7;
        if (this.id == "side8")
            x = 8.7;

        this.scene.translate(x, 0, 3);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);   
        this.scene.scale(1, 5.2, 1);
        this.rectangle.display();
    }

        
    display() {
        this.scene.pushMatrix();
        this.material.apply();
    
        if (this.id == "side1" || this.id == "side3")
            this.display1();
        else if (this.id == "side2" || this.id == "side4")
            this.display2();
        else if (this.id == "side5" || this.id == "side7")
            this.display3();
        else if (this.id == "side6" || this.id == "side8")
            this.display4();
    
        this.scene.popMatrix();
    }
}