export class MyAnimation {

    constructor(scene, animationID) {
        this.scene = scene;
        this.id = animationID;
        this.finished = false;
        this.timeElapsed = 0;
        this.animationMatrix = mat4.create();
    }

    update(currentTime) { }

    apply() { }


}