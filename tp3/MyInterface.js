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

    /**
     * Adds an interface containing the lights and the views.
     */
    startInterface() {
        this.gui = new dat.GUI();
        this.gui.add(this.scene, 'displayAxis').name('Display Axis');
        this.gui.add(this.scene, 'scaleFactor', 0.5, 10).name('Scale Factor');
        this.lightsFolder = this.gui.addFolder("Lights");
        for (let i = 0; i < this.scene.lights.length; i++) {
            this.lightsFolder.add(this.scene.lights[i], 'enabled').name(this.scene.lightsIds[i]).onChange(val => { this.scene.lightVisibility(i, val); });
        }
        this.camerasFolder = this.gui.addFolder("Cameras");
        this.camerasFolder.add(this.scene, 'selectedCamera', this.scene.viewsIds).name('Selected Camera').onChange(this.scene.updateCamera.bind(this.scene));

        this.highlightsFolder = this.gui.addFolder("Highlights");
        for (let i = 0; i < this.scene.highlights.length; i++) {
            this.highlightsFolder.add(this.scene.highlights[i], 'isHighlighted').name(this.scene.highlightsIds[i]).onChange(val => { this.scene.shaderVisibility(i, val); });
        }
            

        this.gameFolder = this.gui.addFolder("Game");
        this.gameFolder.add({Undo: () => { this.scene.gameOrchestrator.undo() }}, 'Undo');
        
        this.gameFolder.add({Start: () => { console.log("Start") }}, 'Start');
        this.gameFolder.add({Reset: () => { console.log("Reset") }}, 'Reset');
        // Needs fix
        // this.gameFolder.add(this.scene, 'selectedTheme', this.scene.themes).name('Selected Theme').onChange(this.scene.updateTheme.bind(this.scene));
        // Missing: Player modes
    }
}