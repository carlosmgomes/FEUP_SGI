import { MyAnimation } from "./MyAnimation.js"

var DEGREE_TO_RAD = Math.PI / 180;

export class MyKeyframeAnimation extends MyAnimation {

    constructor(scene, id) {
        super(scene, id);
        this.keyframes = [];
        this.currentT = vec3.fromValues(0.0, 0.0, 0.0);
        this.currentR = vec3.fromValues(0.0, 0.0, 0.0);
        this.currentS = vec3.fromValues(1.0, 1.0, 1.0);
        this.startTime = 0;
        this.timeElapsed = 0;
        this.timeLastUpdate = 0;

        this.keyframeIndex = 0;
    }



    apply() {
        this.scene.translate(this.currentT[0], this.currentT[1], this.currentT[2]);
        this.scene.rotate(this.currentR[0], 1, 0, 0);
        this.scene.rotate(this.currentR[1], 0, 1, 0);
        this.scene.rotate(this.currentR[2], 0, 0, 1);
        this.scene.scale(this.currentS[0], this.currentS[1], this.currentS[2]);
    }

    addKeyframe(keyframe) {
        this.keyframes.push(keyframe);
        this.keyframes.sort(function (a, b) { return a.instant - b.instant });
    }
    update(currentTime) {
        if (this.timeElapsed == 0) {
            this.startTime = currentTime;
            this.timeElapsed = currentTime
        }
        var deltaTime = 0;


        if (this.keyframeIndex < this.keyframes.length && this.keyframeIndex > 0) {
            deltaTime = (currentTime - this.timeLastUpdate) / 1000
        }

        if (this.keyframeIndex < this.keyframes.length) {

            if (this.keyframeIndex == 0 && (currentTime - this.startTime) / 1000 >= this.keyframes[0].instant) {
                this.keyframeIndex++;
            }

            if (this.keyframeIndex < this.keyframes.length) {
                if ((currentTime - this.startTime) / 1000 >= (this.keyframes[this.keyframeIndex].instant)) {
                    this.keyframeIndex++;
                }
            }

            if (this.keyframeIndex > 0 && this.keyframeIndex < this.keyframes.length) {
                var currentKeyframe = this.keyframes[this.keyframeIndex];
                var previouskeyframe = this.keyframes[this.keyframeIndex - 1];

                let timePercentage = deltaTime / (this.keyframes[this.keyframeIndex].instant - this.keyframes[this.keyframeIndex - 1].instant)

                this.currentT[0] += (currentKeyframe.translation[0] - previouskeyframe.translation[0]) * timePercentage;
                this.currentT[1] += (currentKeyframe.translation[1] - previouskeyframe.translation[1]) * timePercentage;
                this.currentT[2] += (currentKeyframe.translation[2] - previouskeyframe.translation[2]) * timePercentage;

                this.currentR[0] += (currentKeyframe.rotation[0] - previouskeyframe.rotation[0]) * DEGREE_TO_RAD * timePercentage;
                this.currentR[1] += (currentKeyframe.rotation[1] - previouskeyframe.rotation[1]) * DEGREE_TO_RAD * timePercentage;
                this.currentR[2] += (currentKeyframe.rotation[2] - previouskeyframe.rotation[2]) * DEGREE_TO_RAD * timePercentage;

                this.currentS[0] += (currentKeyframe.scale[0] - previouskeyframe.scale[0]) * timePercentage;
                this.currentS[1] += (currentKeyframe.scale[1] - previouskeyframe.scale[1]) * timePercentage;
                this.currentS[2] += (currentKeyframe.scale[2] - previouskeyframe.scale[2]) * timePercentage;
            }
        }
        else {
            this.finished = true;
            return null;
        }

        this.timeElapsed += deltaTime;
        this.timeLastUpdate = currentTime;
    }

}