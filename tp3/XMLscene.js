import { CGFscene } from '../lib/CGF.js';
import { CGFaxis, CGFcamera, CGFshader } from '../lib/CGF.js';
import { MyGameOrchestrator } from './game/MyGameOrchestrator.js';


var RATE = 1000;


/**
 * XMLscene class, representing the scene that is to be rendered.
 */
export class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;
        this.selectedCamera = 0;
        this.selectedTheme = "demo.xml";
        this.initInterfaceObjects();
        this.initCameras();

        this.enableTextures(true);
        this.shader = new CGFshader(this.gl, "shaders/shaders.vert", "shaders/shaders.frag");
        this.shader.setUniformsValues({ uSampler2: 1 });
        this.shader.setUniformsValues({ timeFactor: 0 });

        // instatiate text shader (used to simplify access via row/column coordinates)
        // check the two files to see how it is done
        this.textShader = new CGFshader(this.gl, "shaders/font.vert", "shaders/font.frag");
        // set number of rows and columns in font texture
        this.textShader.setUniformsValues({ 'dims': [16, 16] });
        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(100);

        this.M_counter = 0;

        this.setPickEnabled(true);
        this.gameOrchestrator = new MyGameOrchestrator(this, this.selectedTheme);
        this.themes = ["demo.xml", "dungeon.xml"];
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        if (this.sceneInited == true) {
            this.camera = this.graph.views[this.graph.defaultId];
            this.interface.setActiveCamera(this.camera);
        }
        else {
            this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(20, 20, 20), vec3.fromValues(0, 0, 0));
            this.interface.setActiveCamera(this.camera);
        }
    }

    updateCamera() {
        this.camera = this.graph.views[this.selectedCamera];
        this.interface.setActiveCamera(this.camera);
    }

    updatePlayerCamera(player){
        console.log(player);
        if (player == 1){
            this.camera = this.graph.views["Player 1"];
            this.interface.setActiveCamera(this.camera);
        }
        else if (player == 2){
            this.camera = this.graph.views["Player 2"];
            this.interface.setActiveCamera(this.camera);
        }
    }

    updateTheme() {
        this.theme = this.selectedTheme;
        this.gameOrchestrator.setTheme(this.theme);

    }
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                this.lights[i].setPosition(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setAmbient(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setDiffuse(light[4][0], light[4][1], light[4][2], light[4][3]);
                this.lights[i].setSpecular(light[5][0], light[5][1], light[5][2], light[5][3]);

                if (light[1] == "spot") {
                    this.lights[i].setSpotCutOff(light[6]);
                    this.lights[i].setSpotExponent(light[7]);
                    this.lights[i].setSpotDirection(light[8][0], light[8][1], light[8][2]);
                }
                if (light[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                this.lightsIds[i] = key;

                i++;
            }
        }
        while (this.lights.length > this.graph.numLights) {
            this.lights.pop();
        }
    }

    /**
     * Turn on/off the light
     * @param {string id} lightID 
     * @param {boolean} visibility 
     */
    lightVisibility(lightID, visibility) {
        if (visibility) {
            this.lights[lightID].enable();
        }
        else {
            this.lights[lightID].disable();
        }
        this.lights[lightID].update();
    }

    shaderVisibility(nodeID, visibility) {
        this.highlights[nodeID].isHighlighted = visibility;
    }

    initInterfaceObjects() {
        this.displayAxis = false;
        this.scaleFactor = 1;
    }

    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }
    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

        this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);

        this.initLights();

        this.sceneInited = true;

        this.initCameras();

        this.interface.startInterface();

    }

    /**
     * Check if key was pressed
     */
    checkKeys() {
        if (this.gui.isKeyPressed("KeyM")) {
            this.M_counter++;
        }
        if (this.gui.isKeyPressed("KeyU")) {
            this.gameOrchestrator.undo();
        }
    }

    /**
     * Periodecally checks if keys were pressed, and update timeFactor value from shaders
     * @param {time} t 
     */
    update(t) {
        this.checkKeys();
        this.shader.setUniformsValues({ timeFactor: (t / 100 % 100) });
        if (this.initialTime == 0) {
            this.initialTime = t / RATE;
        }

        if (this.sceneInited) {
            for (var i in this.graph.animations) {
                this.graph.animations[i].update(t);
            }
        }

        this.gameOrchestrator.update(t);
    }


    /**
     * Displays the scene.
     */
    display() {
        this.gameOrchestrator.managePick(this.pickMode, this.pickResults);
        this.clearPickRegistration();


        // ---- BEGIN Background, camera and axis setup
        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();


        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();
        this.scale(this.scaleFactor, this.scaleFactor, this.scaleFactor);
        if (this.displayAxis)
            this.axis.display();

        for (var i = 0; i < this.lights.length; i++) {
            // this.lights[i].setVisible(true);
            this.lights[i].update();
        }

        if (this.sceneInited) {
            // Draw axis
            this.setDefaultAppearance();

            // Displays the scene (MySceneGraph function).
            this.gameOrchestrator.display();
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
}