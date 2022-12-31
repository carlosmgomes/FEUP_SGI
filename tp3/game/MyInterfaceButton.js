import { CGFobject, CGFappearance, CGFtexture, CGFshader } from "../../lib/CGF.js";
import { MyRectangle } from "../primitives/MyRectangle.js";
import { MyQuad } from "../MyQuad.js";


var NUMBERS_LINE = 3;

export class MyInterfaceButton extends CGFobject {
    constructor(scene, id) {
        super(scene);
        this.id = id;
        this.appearance = new CGFappearance(scene);
        this.fontTexture = new CGFtexture(this.scene, "textures/oolite-font.trans.png");
        this.appearance.setTexture(this.fontTexture);



        this.buttonText = new CGFtexture(this.scene, "/tp3/scenes/images/dark_grey.jpg");

        this.buttonMaterial = new CGFappearance(scene);
        this.buttonMaterial.setEmission(0.0, 0.0, 0.0, 1.0);
        this.buttonMaterial.setAmbient(0.0, 0.0, 0.1, 1.0);
        this.buttonMaterial.setDiffuse(0.0, 0.0, 0.4, 1.0);
        this.buttonMaterial.setSpecular(0.0, 0.0, 0.4, 1.0);
        this.buttonMaterial.setShininess(10.0);
        this.buttonMaterial.setTexture(this.buttonText);
        this.button = new MyRectangle(this.scene, 0, -1, 0.5, 1);
        // plane where texture character will be rendered
        this.quad = new MyQuad(this.scene);

    }


    movie() {
        this.scene.pushMatrix();
        this.scene.scale(0.2, 0.2, 0.2)
        this.scene.activeShader.setUniformsValues({ 'charCoords': [13, 4] });	// M
        this.quad.display();

        this.scene.translate(0.55, 0, 0);
        this.scene.activeShader.setUniformsValues({ 'charCoords': [15, 4] }); // O
        this.quad.display();

        this.scene.translate(0.55, 0, 0);
        this.scene.activeShader.setUniformsValues({ 'charCoords': [6, 5] }); // V
        this.quad.display();

        this.scene.translate(0.55, 0, 0);
        this.scene.activeShader.setUniformsValues({ 'charCoords': [9, 4] }); // I
        this.quad.display();

        this.scene.translate(0.2, 0, 0);
        this.scene.activeShader.setUniformsValues({ 'charCoords': [5, 4] });	// E
        this.quad.display();


        this.scene.popMatrix();
    }

    start() {
        this.scene.pushMatrix();
        this.scene.scale(0.2, 0.2, 0.2)
        this.scene.activeShader.setUniformsValues({ 'charCoords': [3, 5] });	// S
        this.quad.display();

        this.scene.translate(0.5, 0, 0);
        this.scene.activeShader.setUniformsValues({ 'charCoords': [4, 5] });    // T
        this.quad.display();

        this.scene.translate(0.5, 0, 0);
        this.scene.activeShader.setUniformsValues({ 'charCoords': [1, 4] });	// A
        this.quad.display();

        this.scene.translate(0.5, 0, 0);
        this.scene.activeShader.setUniformsValues({ 'charCoords': [2, 5] });	// R
        this.quad.display();

        this.scene.translate(0.5, 0, 0);
        this.scene.activeShader.setUniformsValues({ 'charCoords': [4, 5] });    // T
        this.quad.display();


        this.scene.popMatrix();
    }

    undo() {
        this.scene.pushMatrix();
        this.scene.scale(0.2, 0.2, 0.2)
        this.scene.activeShader.setUniformsValues({ 'charCoords': [5, 5] });	// U
        this.quad.display();

        this.scene.translate(0.5, 0, 0);
        this.scene.activeShader.setUniformsValues({ 'charCoords': [14, 4] });	// N
        this.quad.display();

        this.scene.translate(0.5, 0, 0);
        this.scene.activeShader.setUniformsValues({ 'charCoords': [4, 4] }); // D
        this.quad.display();

        this.scene.translate(0.5, 0, 0);
        this.scene.activeShader.setUniformsValues({ 'charCoords': [15, 4] }); // O


        this.quad.display();

        this.scene.popMatrix();
    }



    reset() {
        this.scene.pushMatrix();

        this.scene.scale(0.18, 0.18, 0.18)
        this.scene.activeShader.setUniformsValues({ 'charCoords': [2, 5] });	// R
        this.quad.display();
        this.scene.translate(0.5, 0, 0);

        this.scene.activeShader.setUniformsValues({ 'charCoords': [5, 4] });	// E
        this.quad.display();

        this.scene.translate(0.5, 0, 0);
        this.scene.activeShader.setUniformsValues({ 'charCoords': [3, 5] });	// S
        this.quad.display();

        this.scene.translate(0.5, 0, 0);
        this.scene.activeShader.setUniformsValues({ 'charCoords': [5, 4] });	// E
        this.quad.display();

        this.scene.translate(0.5, 0, 0);
        this.scene.activeShader.setUniformsValues({ 'charCoords': [4, 5] });    // T
        this.quad.display();

        this.scene.popMatrix();
    }

    score(score, player) {
        this.scene.pushMatrix();
        this.scene.scale(0.13, 0.13, 0.13)

        this.scene.activeShader.setUniformsValues({ 'charCoords': [0, 5] });	// P
        this.quad.display();
        this.scene.translate(0.5, 0, 0);

        this.scene.activeShader.setUniformsValues({ 'charCoords': [12, 4] });	// L
        this.quad.display();
        this.scene.translate(0.5, 0, 0);

        this.scene.activeShader.setUniformsValues({ 'charCoords': [1, 4] });	// A
        this.quad.display();
        this.scene.translate(0.5, 0, 0);

        this.scene.activeShader.setUniformsValues({ 'charCoords': [9, 5] });	// Y
        this.quad.display();
        this.scene.translate(0.5, 0, 0);

        this.scene.activeShader.setUniformsValues({ 'charCoords': [5, 4] });	// E
        this.quad.display();
        this.scene.translate(0.5, 0, 0);

        this.scene.activeShader.setUniformsValues({ 'charCoords': [2, 5] });	// R
        this.quad.display();
        this.scene.translate(0.5, 0, 0);

        this.scene.activeShader.setUniformsValues({ 'charCoords': [player, NUMBERS_LINE] });	// R
        this.quad.display();
        this.scene.translate(0.5, 0, 0);


        this.scene.activeShader.setUniformsValues({ 'charCoords': [10, 3] });	// :
        this.quad.display();
        this.scene.translate(0.5, 0, 0);

        this.scene.activeShader.setUniformsValues({ 'charCoords': [score, NUMBERS_LINE] });	// 1
        this.quad.display();
        this.scene.popMatrix();
    }

    time(timeElapsed) {

        var minutes, seconds;

        minutes = (Math.floor(timeElapsed / 60)).toString( );
        seconds = (Math.floor(timeElapsed % 60)).toString( );
        if(seconds < 10)
            seconds = "0" + seconds;

        if(minutes < 10)
            minutes = "0" + minutes;


        this.scene.pushMatrix();
        this.scene.scale(0.2, 0.2, 0.2)
        this.scene.activeShader.setUniformsValues({ 'charCoords': [minutes[0], NUMBERS_LINE] });	// m
        this.quad.display();
        this.scene.translate(0.5, 0, 0);

        this.scene.activeShader.setUniformsValues({ 'charCoords': [minutes[1], NUMBERS_LINE] });	// m
        this.quad.display();
        this.scene.translate(0.5, 0, 0);
        this.scene.activeShader.setUniformsValues({ 'charCoords': [10, 3] });	// :
        this.quad.display();
        this.scene.translate(0.5, 0, 0);
        this.scene.activeShader.setUniformsValues({ 'charCoords': [seconds[0], NUMBERS_LINE] });	// s
        this.quad.display();
        this.scene.translate(0.5, 0, 0); this.scene.activeShader.setUniformsValues({ 'charCoords': [seconds[1], NUMBERS_LINE] });	// s
        this.quad.display();
        this.scene.popMatrix();
    }

    theme(id) {
        this.scene.pushMatrix();
        this.scene.scale(0.15, 0.15, 0.15)
        this.scene.activeShader.setUniformsValues({ 'charCoords': [4, 5] });    // T
        this.quad.display();
        this.scene.translate(0.5, 0, 0);

        this.scene.activeShader.setUniformsValues({ 'charCoords': [8, 4] });	// H
        this.quad.display();
        this.scene.translate(0.5, 0, 0);
        this.scene.activeShader.setUniformsValues({ 'charCoords': [5, 4] });	// E
        this.quad.display();
        this.scene.translate(0.5, 0, 0);
        this.scene.activeShader.setUniformsValues({ 'charCoords': [13, 4] });	// M
        this.quad.display();
        this.scene.translate(0.6, 0, 0);
        this.scene.activeShader.setUniformsValues({ 'charCoords': [5, 4] });	// E
        this.quad.display();
        this.scene.translate(0.5, 0, 0);
        this.scene.activeShader.setUniformsValues({ 'charCoords': [id, NUMBERS_LINE] });	// id
        this.quad.display();
        this.scene.popMatrix();
    }



    display(player1_score, player2_score, timeElapsed) {

        this.scene.setActiveShaderSimple(this.scene.textShader);



        // activate texture containing the font
        this.appearance.apply();

        if (this.id == "undo") {
            this.scene.pushMatrix();
            this.buttonMaterial.apply();
            this.scene.rotate(Math.PI * 1, 1, 0, 0);
            this.scene.scale(0.49, 0.49, 0.49)
            this.scene.translate(2, -1.5, -0.01);
            this.button.display();
            this.scene.popMatrix();
            this.scene.pushMatrix();
            this.appearance.apply();
            this.scene.translate(0.61, 0.35, 0.01);

            this.undo();
            this.scene.popMatrix();
        }
        else if (this.id == "reset") {
            this.scene.pushMatrix();
            this.buttonMaterial.apply();
            this.scene.rotate(Math.PI * 1, 1, 0, 0);
            this.scene.scale(0.49, 0.49, 0.49)
            this.scene.translate(-1, -1.5, -0.01);
            this.button.display();
            this.scene.popMatrix();
            this.scene.pushMatrix();
            this.appearance.apply();
            this.scene.translate(-0.9, 0.35, 0.01);
            this.reset();
            this.scene.popMatrix();
        }

        else if (this.id == "movie") {
            this.scene.pushMatrix();
            this.buttonMaterial.apply();
            this.scene.rotate(Math.PI * 1, 1, 0, 0);
            this.scene.scale(0.49, 0.49, 0.49)
            this.scene.translate(0.5, -1.5, -0.01);
            this.button.display();
            this.scene.popMatrix();
            this.scene.pushMatrix();
            this.appearance.apply();
            this.scene.translate(-0.17, 0.35, 0.01);
            this.movie();
            this.scene.popMatrix();
        }

        else if (this.id == "start") {
            this.scene.pushMatrix();
            this.buttonMaterial.apply();
            this.scene.rotate(Math.PI * 1, 1, 0, 0);
            this.scene.scale(0.79, 0.49, 0.49)
            this.scene.translate(0.5, 0, -0.01);
            this.button.display();
            this.scene.popMatrix();
            this.scene.pushMatrix();
            this.appearance.apply();
            this.scene.translate(-0.17, -0.35, 0.01);
            this.start();
            this.scene.popMatrix();
        }

        else if (this.id == "game_status") {
            this.scene.pushMatrix();
            this.appearance.apply();
            this.scene.translate(-0.9, 0.12, 0.01);
            this.score(player1_score, 1);
            this.scene.popMatrix();
            this.scene.pushMatrix();
            this.appearance.apply();
            this.scene.translate(0.45, 0.12, 0.01);
            this.score(player2_score, 2);
            this.scene.popMatrix();
            this.scene.pushMatrix();
            this.appearance.apply();
            this.scene.translate(-0.15, 0.12, 0.01);
            this.time(timeElapsed);

            this.scene.popMatrix();
        }


        if (this.id == "theme1") {
            this.scene.pushMatrix();
            this.buttonMaterial.apply();
            this.scene.rotate(Math.PI * 1, 1, 0, 0);
            this.scene.scale(0.49, 0.35, 0.49)
            this.scene.translate(-1, -0.5, -0.01);
            this.button.display();
            this.scene.popMatrix();
            this.scene.pushMatrix();
            this.appearance.apply();
            this.scene.translate(-0.9, -0.08, 0.01);

            this.theme(1);
            this.scene.popMatrix();
        }
        else if (this.id == "theme2") {
            this.scene.pushMatrix();
            this.buttonMaterial.apply();
            this.scene.rotate(Math.PI * 1, 1, 0, 0);
            this.scene.scale(0.49, 0.35, 0.49)
            this.scene.translate(0.5, -0.5, -0.01);
            this.button.display();
            this.scene.popMatrix();
            this.scene.pushMatrix();
            this.appearance.apply();
            this.scene.translate(-0.18, -0.08, 0.01);

            this.theme(2);
            this.scene.popMatrix();
        }
        if (this.id == "theme3") {
            this.scene.pushMatrix();
            this.buttonMaterial.apply();
            this.scene.rotate(Math.PI * 1, 1, 0, 0);
            this.scene.scale(0.49, 0.35, 0.49)
            this.scene.translate(2, -0.5, -0.01);
            this.button.display();
            this.scene.popMatrix();
            this.scene.pushMatrix();
            this.appearance.apply();
            this.scene.translate(0.58, -0.08, 0.01);

            this.theme(3);
            this.scene.popMatrix();
        }



        // reactivate default shader
        this.scene.setActiveShaderSimple(this.scene.defaultShader);
    }
}