
export class MyKeyframe {
/**
 * 
 * @param {*} instant - instant of the keyframe
 * @param {*} translation - vector representing translation of the keyframe
 * @param {*} rotation - vector representing rotation of the keyframe
 * @param {*} scale - vector representing scale of the keyframe
 */
    constructor(instant,translation,rotation,scale) {

        this.instant = instant;
        this.translation = translation;
        this.rotation = rotation;
        this.scale = scale;
    }


}