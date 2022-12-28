import {CGFobject} from '../../lib/CGF.js';
import { MyGameSequence } from './MyGameSequence.js';

export class MyAnimator extends CGFobject{
    constructor(scene, gameOrchestrator, gameSequence) {
        super(scene);
        this.gameOrchestrator = gameOrchestrator;
        this.gameSequence = gameSequence;
    }
    //TODO
    reset() {
    }
    //TODO
    start() {   
    }
    //TODO
    update(time) {
    }   
    //TODO
    display() {
    }
}