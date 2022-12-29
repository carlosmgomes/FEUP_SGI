import { CGFobject } from '../../lib/CGF.js';
import { MySceneGraph } from '../MySceneGraph.js';
import { MyGameBoard } from './MyGameBoard.js';
import { MyAnimator } from './MyAnimator.js';
import { MyGameSequence } from './MyGameSequence.js';
import { MyTile } from './MyTile.js';
import { MyGameMove } from './MyGameMove.js';

export class MyGameOrchestrator extends CGFobject {
    constructor(scene) {
        super(scene);
        this.gameSequence = new MyGameSequence(scene);
        this.animator = new MyAnimator(scene, this);
        this.gameBoard = new MyGameBoard(scene);
        this.theme = new MySceneGraph("demo.xml", scene);
        //test
        this.testMove = new MyGameMove(this.gameBoard.board[2][4], this.gameBoard.board[3][5],this.gameBoard);
        this.selected = null;
    }

    update(time) {
        this.animator.update(time);
    }

    display() {
        this.theme.displayScene();
        this.gameBoard.display();
    }

    getTile(id) {
        var row = parseInt(id.charAt(0));
        var col = parseInt(id.charAt(1));
        return this.gameBoard.board[row][col];
    }

    managePick(pickMode, pickResults) {
        if (pickMode == false) {
            if (pickResults != null && pickResults.length > 0) {
                for (var i = 0; i < pickResults.length; i++) {
                    var obj = pickResults[i][0];
                    if (obj) {
                        var customId = pickResults[i][1];
                        this.OnObjectSelected(obj, customId);
                    }
                }
                pickResults.splice(0, pickResults.length);
            }
        }
    }

    OnObjectSelected(obj, id) {
        //TODO
        if (obj instanceof MyTile) {
            if (obj.piece != null) {
                console.log("Piece selected");
                console.log(obj.id);
                
                //test
                this.testMove.animate();

            }
            else {
                console.log("Tile selected");
                console.log(obj.id);
            }
        }
    }

}
