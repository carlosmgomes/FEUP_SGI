import { CGFobject } from '../../lib/CGF.js';
import { MyRectangle } from "../primitives/MyRectangle.js";
import { MyTriangle } from '../primitives/MyTriangle.js';
import { MyInterfaceButton } from './MyInterfaceButton.js';

export class MyGameInterface extends CGFobject {

    constructor(scene, material) {
        super(scene);
        this.material = material;
        this.rectangle = new MyRectangle(scene, -0.5, 0.5, -1, 1);
        this.triangle = new MyTriangle(scene, 0, 1, 0, -1, 0, 1, 0, 0, 0);
        this.undoButton = new MyInterfaceButton(this.scene, "undo");
        this.resetButton = new MyInterfaceButton(this.scene, "reset");
        this.movieButton = new MyInterfaceButton(this.scene, "movie");
        this.startButton = new MyInterfaceButton(this.scene, "start");
        this.theme1Button = new MyInterfaceButton(this.scene, "theme1");
        this.theme2Button = new MyInterfaceButton(this.scene, "theme2");
        this.theme3Button = new MyInterfaceButton(this.scene, "theme3");
        this.gameStatus = new MyInterfaceButton(this.scene, "game_status");
    }


    displayFront(player1_score, player2_score,timeElapsed) {
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI * 0.5, 0, 0, 1);
        this.scene.translate(0.5, -1, 0.21);
        this.scene.rotate(Math.PI * 0.12, 0, 1, 0);
        this.scene.scale(1.1, 1, 1);
        this.rectangle.display();
        this.scene.rotate(Math.PI * 1.5, 0, 0, 1);
        this.scene.registerForPick(90, this.undoButton);
        this.undoButton.display();
        this.scene.registerForPick(91, this.resetButton);
        this.resetButton.display();
        this.gameStatus.display(player1_score, player2_score,timeElapsed);
        this.scene.registerForPick(92, this.theme1Button);
        this.theme1Button.display();
        this.scene.registerForPick(93, this.theme2Button);
        this.theme2Button.display();
        this.scene.registerForPick(94, this.theme3Button);
        this.theme3Button.display();
        this.scene.registerForPick(95, this.movieButton);
        this.movieButton.display();
        this.scene.registerForPick(96, this.startButton);
        this.startButton.display();
        this.material.apply();
        this.scene.popMatrix();
    }


    displayBack(player1_score, player2_score,timeElapsed) {
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI * 1.5, 0, 0, 1);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.translate(0.5, 1, 0.2);
        this.scene.rotate(Math.PI * 0.12, 0, 1, 0);
        this.scene.scale(1.1, 1, 1);
        this.rectangle.display();
        this.scene.rotate(Math.PI * 1.5, 0, 0, 1);
        this.scene.registerForPick(100, this.undoButton);
        this.undoButton.display();
        this.scene.registerForPick(101, this.resetButton);
        this.resetButton.display();
        this.gameStatus.display(player1_score, player2_score,timeElapsed);
        this.scene.registerForPick(102, this.theme1Button);
        this.theme1Button.display();
        this.scene.registerForPick(103, this.theme2Button);
        this.theme2Button.display();
        this.scene.registerForPick(104, this.theme3Button);
        this.theme3Button.display();
        this.scene.registerForPick(105, this.movieButton);
        this.movieButton.display();
        this.scene.registerForPick(106, this.startButton);
        this.startButton.display();
        this.material.apply();
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


    display(player1_score, player2_score,timeElapsed) {
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
        this.displayFront(player1_score, player2_score,timeElapsed);
        this.displayBack(player1_score, player2_score,timeElapsed);
        this.scene.popMatrix();
    }
}