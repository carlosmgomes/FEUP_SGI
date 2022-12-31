export class MyCameraAnimation {
    constructor(player, scene) {
        this.init(player, scene)
    }

    init(player, scene) {
        if (scene == "demo.xml") {
            if (player == 1) {
                this.position = [0, 8, 9];
                this.target = [10, 0, 9];
            }
            else if (player == 2) {
                this.position = [12, 8, 9];
                this.target = [0, 0, 9];
            }
        }
        if (scene == "dungeon.xml") {
            if (player == 1) {
                this.position = [4, 8, 9.5];
                this.target = [14, 0, 9.5];
            }
            else if (player == 2) {
                this.position = [15, 8, 9.5];
                this.target = [6, 0, 9.5];
            }
        }
    }

    getPositionX() {
        return this.position[0];
    }
    getPositionY() {
        return this.position[1];
    }
    getPositionZ() {
        return this.position[2];
    }
    getTargetX() {
        return this.target[0];
    }
    getTargetY() {
        return this.target[1];
    }
    getTargetZ() {
        return this.target[2];
    }
}