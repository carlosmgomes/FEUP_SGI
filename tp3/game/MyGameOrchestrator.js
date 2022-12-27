import {CGFobject} from '../../lib/CGF.js';
import { MySceneGraph } from '../MySceneGraph.js';
import {MyGameBoard} from './MyGameBoard.js';
import {MyAnimator} from './MyAnimator.js';


export class MyGameOrchestrator extends CGFobject {
    constructor(scene) {
        super(scene);
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


}
        