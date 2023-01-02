import {CGFobject} from '../../lib/CGF.js';

export class MyAnimator extends CGFobject{
    constructor(scene, gameOrchestrator, gameSequence) {
        super(scene);
        this.gameOrchestrator = gameOrchestrator;
        this.gameSequence = gameSequence;
    }


    update(time){

    }

    //TODO
    display() {
        this.scene.pushMatrix();
        //console.log(this.gameBoard.board[0][0].getPosition());
        this.scene.setMatrix(this.gameBoard.board[0][1].getPosition());
        this.scene.translate(0, 0,1);
        this.testPiece.display();
        this.scene.popMatrix();
    }
}