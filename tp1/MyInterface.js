import { CGFinterface, CGFapplication, dat } from '../lib/CGF.js';

/**
* MyInterface class, creating a GUI interface.
*/

export class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        // add a group of controls (and open/expand by defult)

        this.initKeys();

        return true;
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui = this;
        this.processKeyboard = function () { };
        this.activeKeys = {};
    }

    processKeyDown(event) {
        this.activeKeys[event.code] = true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code] = false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }

    startInterface(){
        this.gui = new dat.GUI();
        this.gui.add(this.scene, 'displayAxis').name('Display Axis');
        this.gui.add(this.scene,'scaleFactor',0.5,3).name('Scale Factor');



        //add a folder for lights in the interface
        this.lightsFolder = this.gui.addFolder("Lights");
        for (let i = 0; i < this.scene.lights.length; i++) {
            console.log(this.scene.lights[i]);
            this.lightsFolder.add(this.scene.lights[i], 'enabled').name("Light " + this.scene.lightsIds[i]).onChange(val => { this.scene.lightVisibility(i, val); });
        }

        this.camerasFolder = this.gui.addFolder("Cameras");
        this.camerasFolder.add(this.scene, 'selectedCamera', this.scene.viewsIds).name('Selected Camera').onChange(this.scene.updateCamera.bind(this.scene));
        


    }
}