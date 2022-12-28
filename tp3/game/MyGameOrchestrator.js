import { CGFobject } from '../../lib/CGF.js';
import { MySceneGraph } from '../MySceneGraph.js';
import { MyGameBoard } from './MyGameBoard.js';
import { MyAnimator } from './MyAnimator.js';
import { MyGameSequence } from './MyGameSequence.js';
import { MyPiece } from './MyPiece.js';
import { MyTile } from './MyTile.js';

export class MyGameOrchestrator extends CGFobject {
    constructor(scene) {
        super(scene);
        this.gameSequence = new MyGameSequence(scene);
        this.animator = new MyAnimator(scene, this);
        this.gameBoard = new MyGameBoard(scene);
        this.theme = new MySceneGraph("demo.xml", scene);
    }

    update(time) {
        this.animator.update(time);
    }

    display() {
        this.theme.displayScene();
        this.gameBoard.display();
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

            }
            else {
                console.log("Tile selected");
                console.log(obj.id);
            }
        }
    }

}
