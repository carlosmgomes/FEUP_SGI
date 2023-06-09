import { CGFXMLreader, CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFtexture, CGFshader, CGFcameraOrtho } from "../lib/CGF.js";
import { MyRectangle } from './primitives/MyRectangle.js';
import { MyCylinder } from './primitives/MyCylinder.js';
import { MyTriangle } from './primitives/MyTriangle.js';
import { MySphere } from './primitives/MySphere.js';
import { MyTorus } from './primitives/MyTorus.js';
import { MyPatch } from './primitives/MyPatch.js';
import { MyComponent } from './MyComponent.js';
import { MyKeyframe } from './MyKeyframe.js';
import { MyKeyframeAnimation } from './MyKeyframeAnimation.js';

var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var ANIMATIONS_INDEX = 8;
var COMPONENTS_INDEX = 9;

/**
 * MySceneGraph class, representing the scene graph.
 */
export class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null;                    // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "sxs")
            return "root tag <sxs> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order " + index);

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseView(nodes[index])) != null)
                return error;
        }

        // <ambient>
        if ((index = nodeNames.indexOf("ambient")) == -1)
            return "tag <ambient> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <ambient> out of order");

            //Parse ambient block
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");
            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <animations>
        if ((index = nodeNames.indexOf("animations")) == -1)
            return "tag <animations> missing"
        else {
            if (index != ANIMATIONS_INDEX)
                this.onXMLMinorError("tag <animations> out of order");
            //Parse animations block
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");
            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <scene> block. 
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

        // Get root of the scene.
        var root = this.reader.getString(sceneNode, 'root')
        if (root == null)
            return "no root defined for scene";
        this.idRoot = root;

        // Get axis length        
        var axis_length = this.reader.getFloat(sceneNode, 'axis_length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed scene");

        return null;
    }


    getViews() {
        return this.views;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseView(viewsNode) {
        this.views = [];
        this.scene.viewsIds = [];
        var children = viewsNode.children;
        var defaultFound = false;

        this.defaultId = this.reader.getString(viewsNode, 'default');

        if (this.defaultId == null)
            this.onXMLMinorError("default id error");


        for (var i = 0; i < children.length; i++) {
            var camera;
            var id = this.reader.getString(children[i], 'id');
            if (id == null)
                return "no ID defined for camera";

            // Checks for repeated IDs.
            if (this.views[id] != null)
                return "ID must be unique for each camera (conflict: ID = " + id + ")";

            // perpective parser   
            if (children[i].nodeName == "perspective") {
                var near = this.reader.getFloat(children[i], 'near');
                if (isNaN(near)) {
                    this.onXMLMinorError("unable to parse 'near' value ; using default value for near = 0.1");
                    near = 0.1;
                }
                var far = this.reader.getFloat(children[i], 'far');
                if (isNaN(far)) {
                    this.onXMLMinorError("unable to parse 'far' value ; using default value for far = 500");
                    far = 500;
                }
                var angle = this.reader.getFloat(children[i], 'angle');
                if (isNaN(angle)) {
                    this.onXMLMinorError("unable to parse 'angle' value ; using default value for angle = 45");
                    angle = 45;
                }


                // Field of view angle of the camera (in radians).

                angle *= DEGREE_TO_RAD;

                var grandChildren = children[i].children;
                var nodeNames = [];

                for (var j = 0; j < grandChildren.length; j++) {
                    nodeNames.push(grandChildren[j].nodeName);
                }

                var fromID = nodeNames.indexOf('from');
                var fromCoordinates = this.parseCoordinates3D(grandChildren[fromID], ' "from" coordinates from the camera: ' + id);

                var toID = nodeNames.indexOf("to");
                var toCoordinates = this.parseCoordinates3D(grandChildren[toID], ' "to" coordinates from the camera: ' + id);

                camera = new CGFcamera(angle, near, far, fromCoordinates, toCoordinates);

            }
            // ortho parser
            else if (children[i].nodeName == "ortho") {
                var near = this.reader.getFloat(children[i], 'near');
                if (isNaN(far)) {
                    this.onXMLMinorError("unable to parse 'near' value ; using default value for near = -5");
                    far = -5;
                }
                var far = this.reader.getFloat(children[i], 'far');
                if (isNaN(near)) {
                    this.onXMLMinorError("unable to parse 'far' value ; using default value for far = 5");
                    near = 5;
                }
                var left = this.reader.getFloat(children[i], 'left');
                if (isNaN(left)) {
                    this.onXMLMinorError("unable to parse 'left' value ; using default value for left = -5");
                    left = -5;
                }
                var right = this.reader.getFloat(children[i], 'right');
                if (isNaN(right)) {
                    this.onXMLMinorError("unable to parse 'right' value ; using default value for right = 5");
                    right = 5;
                }
                var top = this.reader.getFloat(children[i], 'top');
                if (isNaN(top)) {
                    this.onXMLMinorError("unable to parse 'top' value ; using default value for top = -5");
                    top = -5;
                }
                var bottom = this.reader.getFloat(children[i], 'bottom');
                if (isNaN(bottom)) {
                    this.onXMLMinorError("unable to parse 'bottom' value ; using default value for bottom = 5");
                    bottom = 5;
                }
                var grandChildren = children[i].children;
                var nodeNames = [];

                for (var j = 0; j < grandChildren.length; j++) {
                    nodeNames.push(grandChildren[j].nodeName);
                }

                var fromID = nodeNames.indexOf('from');
                var fromCoordinates = this.parseCoordinates3D(grandChildren[fromID], ' "from" coordinates from the camera: ' + id);

                var toID = nodeNames.indexOf("to");
                var toCoordinates = this.parseCoordinates3D(grandChildren[toID], ' "to" coordinates from the camera: ' + id);

                var upID = nodeNames.indexOf("up");
                var upCoordinates = this.parseCoordinates3D(grandChildren[upID], ' "up" coordinates from the camera: ' + id);

                camera = new CGFcameraOrtho(left, right, bottom, top, near, far, fromCoordinates, toCoordinates, upCoordinates);


            }
            // neither perspective or ortho types found
            else {
                this.onXMLMinorError("Camera type " + children[i].nodeName + " is not valid (use 'perspective' or 'ortho')");
                continue;
            }

            this.views[id] = camera;
            this.scene.viewsIds.push(id);

            // Set the initial camera
            if (id == this.defaultId) {
                defaultFound = true;
            }
        }
        if (!defaultFound)
            return "unable to find a camera ID equal to Default ID";

        this.log("Parsed views");
        return null;
    }


    /**
     * Parses the <ambient> node.
     * @param {ambient block element} ambientsNode
     */
    parseAmbient(ambientsNode) {

        var children = ambientsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed ambient");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        this.scene.lightsIds = [];
        this.numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.Lights
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["location", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";
            this.scene.lightsIds.push(lightId);
            // Light enable/disable
            var enableLight = true;
            var aux = this.reader.getBoolean(children[i], 'enabled');
            if (!(aux != null && !isNaN(aux) && (aux == true || aux == false)))
                this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");

            enableLight = aux;

            //Add enabled boolean and type name to light info
            global.push(enableLight);
            global.push(children[i].nodeName);

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (!Array.isArray(aux))
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }

            // Gets the additional attributes of the spot light
            if (children[i].nodeName == "spot") {
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle of the light for ID = " + lightId;

                var exponent = this.reader.getFloat(children[i], 'exponent');
                if (!(exponent != null && !isNaN(exponent)))
                    return "unable to parse exponent of the light for ID = " + lightId;

                var targetIndex = nodeNames.indexOf("target");

                // Retrieves the light target.
                var targetLight = [];
                if (targetIndex != -1) {
                    var aux = this.parseCoordinates3D(grandChildren[targetIndex], "target light for ID " + lightId);
                    if (!Array.isArray(aux))
                        return aux;

                    targetLight = aux;
                }
                else
                    return "light target undefined for ID = " + lightId;

                global.push(...[angle, exponent, targetLight])
            }

            this.lights[lightId] = global;
            this.numLights++;
        }

        if (this.numLights == 0)
            return "at least one light must be defined";
        else if (this.numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        var children = texturesNode.children;

        this.textures = [];


        // Any number of textures.
        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current texture.
            var textureID = this.reader.getString(children[i], 'id');
            if (textureID == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.textures[textureID] != null)
                return "ID must be unique for each light (conflict: ID = " + textureID + ")";

            let file = this.reader.getString(children[i], 'file');

            if (file == null) {
                this.onXMLMinorError("File not found");
                continue;
            }

            this.textures[textureID] = new CGFtexture(this.scene, file);
        }
        console.log("Parsed Textures");
        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];

        var grandChildren = [];
        var nodeNames = [];

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each light (conflict: ID = " + materialID + ")";

            // Get shininess of the current material.
            var shininess = Number(this.reader.getString(children[i], 'shininess'));

            if (shininess == null || isNaN(shininess))
                return "Material '" + materialID + "' -> Unable to parse 'shininess' value";


            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var emission = this.parseColor(grandChildren[nodeNames.indexOf("emission")], "EmissionColor");
            var ambient = this.parseColor(grandChildren[nodeNames.indexOf("ambient")], "Ambient Color");
            var diffuse = this.parseColor(grandChildren[nodeNames.indexOf("diffuse")], "Diffuse Color");
            var specular = this.parseColor(grandChildren[nodeNames.indexOf("specular")], "Specular Color");


            var appearance = new CGFappearance(this.scene);
            appearance.setShininess(shininess);
            appearance.setSpecular(...specular);
            appearance.setDiffuse(...diffuse);
            appearance.setAmbient(...ambient);
            appearance.setEmission(...emission);
            this.materials[materialID] = appearance;
        }


        this.log("Parsed materials");
        return null;
    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
        var children = transformationsNode.children;

        this.transformations = [];

        var grandChildren = [];

        // Any number of transformations.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current transformation.
            var transformationID = this.reader.getString(children[i], 'id');
            if (transformationID == null)
                return "no ID defined for transformation";

            // Checks for repeated IDs.
            if (this.transformations[transformationID] != null)
                return "ID must be unique for each transformation (conflict: ID = " + transformationID + ")";

            grandChildren = children[i].children;
            // Specifications for the current transformation.

            var transfMatrix = mat4.create();

            for (var j = 0; j < grandChildren.length; j++) {
                switch (grandChildren[j].nodeName) {
                    case 'translate':
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                        break;
                    case 'scale':
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID ", transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;
                        transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);
                        break;
                    case 'rotate':
                        var axis = this.reader.getString(grandChildren[j], 'axis');
                        var angle = this.reader.getFloat(grandChildren[j], 'angle');
                        if (axis == null)
                            return "no axis defined for rotation transformation for ID " + transformationID;
                        if (!(angle != null && !isNaN(angle)))
                            return "unable to parse angle of the rotation transformation for ID " + transformationID;
                        switch (axis) {
                            case 'x':
                                transfMatrix = mat4.rotate(transfMatrix, transfMatrix, angle * DEGREE_TO_RAD, [1, 0, 0]);
                                break;
                            case 'y':
                                transfMatrix = mat4.rotate(transfMatrix, transfMatrix, angle * DEGREE_TO_RAD, [0, 1, 0]);
                                break;
                            case 'z':
                                transfMatrix = mat4.rotate(transfMatrix, transfMatrix, angle * DEGREE_TO_RAD, [0, 0, 1]);
                                break;
                            default:
                                return "unable to parse axis of the rotate transformation for ID = " + componentID;
                        }
                        break;
                    default:
                        this.onXMLMinorError("unknown tag <" + grandChildren[j].nodeName + ">");
                        break;
                }
            }
            this.transformations[transformationID] = transfMatrix;
        }
        this.log("Parsed transformations");
        return null;
    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        var children = primitivesNode.children;

        this.primitives = [];

        var grandChildren = [];

        // Any number of primitives.
        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current primitive.
            var primitiveId = this.reader.getString(children[i], 'id');
            if (primitiveId == null)
                return "no ID defined for primitive";
            // Checks for repeated IDs.
            if (this.primitives[primitiveId] != null) {
                return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";
            }
            grandChildren = children[i].children;

            // Validate the primitive type
            if (grandChildren.length != 1 ||
                (grandChildren[0].nodeName != 'rectangle' && grandChildren[0].nodeName != 'triangle' &&
                    grandChildren[0].nodeName != 'cylinder' && grandChildren[0].nodeName != 'sphere' &&
                    grandChildren[0].nodeName != 'torus' && grandChildren[0].nodeName != 'patch')) {
                return "There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere, torus or patch)";
            }
            // Specifications for the current primitive.
            var primitiveType = grandChildren[0].nodeName;

            // Retrieves the primitive coordinates.
            if (primitiveType == 'rectangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2) && x2 > x1))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2) && y2 > y1))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                var rect = new MyRectangle(this.scene, x1, x2, y1, y2);

                this.primitives[primitiveId] = rect;
            }

            if (primitiveType == 'cylinder') {
                // base
                var radius = this.reader.getFloat(grandChildren[0], 'base');
                if (!(radius != null && !isNaN(radius)))
                    return "unable to parse base of the primitive coordinates for ID = " + primitiveId;

                // top
                var top = this.reader.getFloat(grandChildren[0], 'top');
                if (!(top != null && !isNaN(top)))
                    return "unable to parse top of the primitive coordinates for ID = " + primitiveId;

                // height
                var height = this.reader.getFloat(grandChildren[0], 'height');
                if (!(height != null && !isNaN(height)))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;


                var cyl = new MyCylinder(this.scene, radius, top, height, slices, stacks);
                this.primitives[primitiveId] = cyl;
            }

            if (primitiveType == 'triangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // z1
                var z1 = this.reader.getFloat(grandChildren[0], 'z1');
                if (!(z1 != null && !isNaN(z1)))
                    return "unable to parse z1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2)))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2)))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                // z2
                var z2 = this.reader.getFloat(grandChildren[0], 'z2');
                if (!(z2 != null && !isNaN(z2)))
                    return "unable to parse z2 of the primitive coordinates for ID = " + primitiveId;

                // x3
                var x3 = this.reader.getFloat(grandChildren[0], 'x3');
                if (!(x3 != null && !isNaN(x3)))
                    return "unable to parse x3 of the primitive coordinates for ID = " + primitiveId;

                // y3
                var y3 = this.reader.getFloat(grandChildren[0], 'y3');
                if (!(y3 != null && !isNaN(y3)))
                    return "unable to parse y3 of the primitive coordinates for ID = " + primitiveId;

                // z3
                var z3 = this.reader.getFloat(grandChildren[0], 'z3');
                if (!(z3 != null && !isNaN(z3)))
                    return "unable to parse z3 of the primitive coordinates for ID = " + primitiveId;

                var triangle = new MyTriangle(this.scene, x1, x2, x3, y1, y2, y3, z1, z2, z3);
                this.primitives[primitiveId] = triangle;

            }

            if (primitiveType == 'sphere') {
                // radius
                var radius = this.reader.getFloat(grandChildren[0], 'radius');
                if (!(radius != null && !isNaN(radius)))
                    return "unable to parse radius  of the primitive coordinates for ID = " + primitiveId;

                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;


                var sph = new MySphere(this.scene, radius, slices, stacks);
                this.primitives[primitiveId] = sph;
            }
            if (primitiveType == 'torus') {
                // inner
                var inner = this.reader.getFloat(grandChildren[0], 'inner');
                if (!(inner != null && !isNaN(inner)))
                    return "unable to parse inner  of the primitive coordinates for ID = " + primitiveId;

                // outer
                var outer = this.reader.getFloat(grandChildren[0], 'outer');
                if (!(outer != null && !isNaN(outer)))
                    return "unable to parse outer of the primitive coordinates for ID = " + primitiveId;

                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // loops    
                var loops = this.reader.getFloat(grandChildren[0], 'loops');
                if (!(loops != null && !isNaN(loops)))
                    return "unable to parse loops of the primitive coordinates for ID = " + primitiveId;


                var tor = new MyTorus(this.scene, inner, outer, slices, loops);
                this.primitives[primitiveId] = tor;
            }
            if (primitiveType == 'patch') {
                // degreeU
                var degreeU = this.reader.getFloat(grandChildren[0], 'degree_u');
                if (!(degreeU != null && !isNaN(degreeU)))
                    return "unable to parse degreeU  of the primitive coordinates for ID = " + primitiveId;

                // partsU
                var partsU = this.reader.getFloat(grandChildren[0], 'parts_u');
                if (!(partsU != null && !isNaN(partsU)))
                    return "unable to parse partsU of the primitive coordinates for ID = " + primitiveId;

                // degreeV
                var degreeV = this.reader.getFloat(grandChildren[0], 'degree_v');
                if (!(degreeV != null && !isNaN(degreeV)))
                    return "unable to parse degreeV of the primitive coordinates for ID = " + primitiveId;

                // partsV    
                var partsV = this.reader.getFloat(grandChildren[0], 'parts_v');
                if (!(partsV != null && !isNaN(partsV)))
                    return "unable to parse partsV of the primitive coordinates for ID = " + primitiveId;

                //controlPoints
                var controlPoints = [];
                var controlPointsNode = grandChildren[0].children;
                for (var u = 0; u < degreeU + 1; u++) {
                    var arr = [];
                    for (var v = 0; v < degreeV + 1; v++) {
                        var idx = u * (degreeV + 1) + v;
                        var point = this.parseCoordinates3D(controlPointsNode[idx], "controlPoint " + i + " for ID = " + primitiveId);
                        if (!Array.isArray(point))
                            return point;
                        point.push(1);
                        arr.push(point);
                    }
                    controlPoints.push(arr);
                }

                if (controlPoints.length != degreeU + 1 || controlPoints[0].length != degreeV + 1)
                    return "unable to parse controlPoints of the primitive coordinates for ID = " + primitiveId;
                var patch = new MyPatch(this.scene, degreeU, degreeV, partsU, partsV, controlPoints);
                this.primitives[primitiveId] = patch;
            }

        }

        this.log("Parsed primitives");
        return null;
    }

    /**
     * Parses the <animations> block.
     * @param {components block element} animationsNode 
     */
    parseAnimations(animationsNode) {
        var children = animationsNode.children;

        this.animations = [];

        var grandChildren = [];
        var nodeNames = [];

        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "keyframeanim") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            // Get id of the current animation.
            var animationId = this.reader.getString(children[i], 'id');
            if (animationId == null)
                return "no ID defined for animation";
            // Checks for repeated IDs.
            if (this.animations[animationId] != null) {
                return "ID must be unique for each animation (conflict: ID = " + animationId + ")";
            }
            var animation = new MyKeyframeAnimation(this.scene, animationId);
            grandChildren = children[i].children;
            let instants = [];
            let last_instant = 0;
            for (var j = 0; j < grandChildren.length; j++) {
                if (grandChildren[j].nodeName != "keyframe") {
                    this.onXMLMinorError("unknown tag <" + grandChildren[j].nodeName + ">");
                    continue;
                }
                var keyframe = new MyKeyframe();
                keyframe.instant = this.reader.getString(grandChildren[j], 'instant');
                if (keyframe.instant == null || keyframe.instant < 0 || isNaN(keyframe.instant)) {
                    return "Not a valid insant for animation: " + animationId + " at instant: " + keyframe.instant;
                }
                last_instant = keyframe.instant;
                instants[keyframe.instant] = keyframe.instant;
                var keyframeTransformations = grandChildren[j].children;
                var translation = [];
                var rotation = [];
                var scale = [];
                for (var k = 0; k < keyframeTransformations.length; ++k) {
                    switch (k) {
                        case 0:
                            if (keyframeTransformations[k].nodeName != "translation") {
                                return "Missing translation for animation: " + animationId + " at instant: " + keyframe.instant;
                            }
                            var temp = this.parseCoordinates3D(keyframeTransformations[k], "translation for animation: " + animationId + " at instant: " + keyframe.instant);
                            translation.push(temp[0], temp[1], temp[2]);
                            break;
                        case 1:
                            if ((keyframeTransformations[k].nodeName != "rotation") && (this.reader.getString(keyframeTransformations[k], 'axis') != "z")) {
                                return "Missing z rotation for animation: " + animationId + " at instant: " + keyframe.instant;
                            }
                            var z = this.reader.getFloat(keyframeTransformations[k], 'angle');
                            if (z == null)
                                return "Z-axis rotaion angle not found for animation: " + animationId + " at instant: " + keyframe.instant;
                            rotation.unshift(z);
                            break;
                        case 2:
                            if ((keyframeTransformations[k].nodeName != "rotation") && (this.reader.getString(keyframeTransformations[k], 'axis') != "y")) {
                                return "Missing y rotation for animation: " + animationId + " at instant: " + keyframe.instant;
                            }
                            var y = this.reader.getFloat(keyframeTransformations[k], 'angle');
                            if (y == null)
                                return "Y-axis rotaion angle not found for animation: " + animationId + " at instant: " + keyframe.instant;
                            rotation.unshift(y);
                            break;
                        case 3:
                            if ((keyframeTransformations[k].nodeName != "rotation") && (this.reader.getString(keyframeTransformations[k], 'axis') != "x")) {
                                return "Missing x rotation for animation: " + animationId + " at instant: " + keyframe.instant;
                            }
                            var x = this.reader.getFloat(keyframeTransformations[k], 'angle');
                            if (x == null)
                                return "X-axis rotaion angle not found for animation: " + animationId + " at instant: " + keyframe.instant;
                            rotation.unshift(x);
                            break;
                        case 4:
                            if (keyframeTransformations[k].nodeName != "scale") {
                                return "Missing scale for animation: " + animationId + " at instant: " + keyframe.instant;
                            }
                            var sx = this.reader.getFloat(keyframeTransformations[k], 'sx');
                            var sy = this.reader.getFloat(keyframeTransformations[k], 'sy');
                            var sz = this.reader.getFloat(keyframeTransformations[k], 'sz');
                            if (sx == null)
                                return "Sx scale value not found for animation: " + animationId + " at instant: " + keyframe.instant;
                            if (sy == null)
                                return "Sy scale value not found for animation: " + animationId + " at instant: " + keyframe.instant;
                            if (sz == null)
                                return "Sz scale value not found for animation: " + animationId + " at instant: " + keyframe.instant;
                            scale.push(sx);
                            scale.push(sy);
                            scale.push(sz);
                            break;

                    }
                }
                keyframe.translation=translation;
                keyframe.rotation=rotation;
                keyframe.scale=scale;

                
                animation.addKeyframe(keyframe)
            }
            this.animations[animationId] = animation;

        }
        console.log("Parsed Animations");
        return null;
    }

    /**
    * Parses the <components> block.
    * @param {components block element} componentsNode
    */
    parseComponents(componentsNode) {
        var children = componentsNode.children;
        this.components = [];
        this.scene.highlights = [];
        this.scene.highlightsIds = [];

        var grandChildren = [];
        var grandgrandChildren = [];
        var nodeNames = [];
        // Any number of components.
        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current component.
            var componentID = this.reader.getString(children[i], 'id');
            if (componentID == null)
                return "no ID defined for componentID";

            // Checks for repeated IDs.
            if (this.components[componentID] != null)
                return "ID must be unique for each component (conflict: ID = " + componentID + ")";

            this.nodes[componentID] = new MyComponent(componentID);

            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationIndex = nodeNames.indexOf("transformation");
            var materialsIndex = nodeNames.indexOf("materials");
            var textureIndex = nodeNames.indexOf("texture");
            var childrenIndex = nodeNames.indexOf("children");
            var highlightedIndex = nodeNames.indexOf("highlighted");
            var animationIndex = nodeNames.indexOf("animation");

            // Transformations
            var transformations = grandChildren[transformationIndex].children;
            if (transformationIndex != -1) {
                for (var j = 0; j < transformations.length; j++) {
                    switch (transformations[j].nodeName) {
                        case 'translate':
                            var coordinates = this.parseCoordinates3D(transformations[j], "translate transformation for ID" + componentID);
                            if (!Array.isArray(coordinates))
                                return coordinates;
                            mat4.translate(this.nodes[componentID].transfMatrix, this.nodes[componentID].transfMatrix, coordinates);
                            break;
                        case 'scale':
                            var coordinates = this.parseCoordinates3D(transformations[j], "scale transformation for ID" + componentID);
                            if (!Array.isArray(coordinates))
                                return coordinates;
                            mat4.scale(this.nodes[componentID].transfMatrix, this.nodes[componentID].transfMatrix, coordinates);
                            break;
                        case 'rotate':
                            var axis = this.reader.getString(transformations[j], 'axis');
                            var angle = this.reader.getFloat(transformations[j], 'angle');
                            if (axis == null)
                                return "unable to parse axis of the rotate transformation for ID = " + componentID;
                            if (!(angle != null && !isNaN(angle)))
                                return "unable to parse angle of the rotate transformation for ID = " + componentID;
                            switch (axis) {
                                case 'x':
                                    mat4.rotate(this.nodes[componentID].transfMatrix, this.nodes[componentID].transfMatrix, angle * DEGREE_TO_RAD, [1, 0, 0]);
                                    break;
                                case 'y':
                                    mat4.rotate(this.nodes[componentID].transfMatrix, this.nodes[componentID].transfMatrix, angle * DEGREE_TO_RAD, [0, 1, 0]);
                                    break;
                                case 'z':
                                    mat4.rotate(this.nodes[componentID].transfMatrix, this.nodes[componentID].transfMatrix, angle * DEGREE_TO_RAD, [0, 0, 1]);
                                    break;
                                default:
                                    return "unable to parse axis of the rotate transformation for ID = " + componentID;
                            }
                            break;
                        case 'transformationref':
                            if (j != 0 || transformations.length != 1) {
                                return "transformationref must be the only transformation of the component";
                            }
                            var transfID = this.reader.getString(transformations[j], 'id');
                            if (transfID == null)
                                return "unable to parse id of the transformationref for ID = " + componentID;
                            if (this.transformations[transfID] == null)
                                return "no transformation with ID = " + transfID + " was found";
                            this.nodes[componentID].transfMatrix = this.transformations[transfID];
                            break;
                        default:
                            this.onXMLMinorError("unknown tag <" + transformations[j].nodeName + ">");
                            break;

                    }
                }
            }

            // Materials
            var materials = grandChildren[materialsIndex].children;
            if (materialsIndex != -1) {
                for (var j = 0; j < materials.length; j++) {
                    var materialID = this.reader.getString(materials[j], 'id');
                    if (materialID == null)
                        return "unable to parse material ID of the materials for ID = " + componentID;
                    if (materialID != "inherit" && this.materials[materialID] == null)
                        return "no material with ID = " + materialID + " was found";
                    this.nodes[componentID].addMaterial(materialID);
                }
            }

            // Texture
            var textureID = this.reader.getString(grandChildren[textureIndex], 'id');
            if (textureID == null)
                return "unable to parse texture ID of the texture for ID = " + componentID;
            if (textureID != "none" && textureID != "inherit") {
                if (this.textures[textureID] == null)
                    return "no texture with ID = " + textureID + " was found";
                var textureLengthS = this.reader.getFloat(grandChildren[textureIndex], 'length_s');
                if (textureLengthS == null)
                    textureLengthS = 1;
                if (isNaN(textureLengthS))
                    return "unable to parse texture length_s of the texture for ID = " + componentID;
                var textureLengthT = this.reader.getFloat(grandChildren[textureIndex], 'length_t');
                if (textureLengthT == null)
                    textureLengthT = 1;
                if (isNaN(textureLengthT))
                    return "unable to parse texture length_s of the texture for ID = " + componentID;
                this.nodes[componentID].addTexture(textureID, textureLengthS, textureLengthT);
            }
            else if (textureID != "none") {
                if (textureID != "inherit" && this.textures[textureID] == null)
                    return "no texture with ID = " + textureID + " was found";
                this.nodes[componentID].addTexture(textureID, 1, 1);
            }

            // Children
            if (childrenIndex != -1) {
                var component_children = grandChildren[childrenIndex].children;
                for (var j = 0; j < component_children.length; j++) {
                    switch (component_children[j].nodeName) {
                        case 'componentref':
                            var componentID_children = this.reader.getString(component_children[j], 'id');
                            if (componentID_children == null)
                                return "unable to parse component ID of the componentref for ID = " + componentID_children;
                            if (this.nodes[componentID_children] == null)
                                return "no component with ID = " + componentID_children + " was found";
                            this.nodes[componentID].addComponent(componentID_children);
                            break;
                        case 'primitiveref':
                            var primitiveID_children = this.reader.getString(component_children[j], 'id');
                            if (primitiveID_children == null)
                                return "unable to parse primitive ID of the primitiveref for ID = " + componentID;
                            if (this.primitives[primitiveID_children] == null)
                                return "no primitive with ID = " + primitiveID_children + " was found";
                            this.nodes[componentID].addPrimitive(primitiveID_children);
                            break;
                        default:
                            this.onXMLMinorError("unknown tag <" + component_children[j].nodeName + ">");
                            break;
                    }
                }
            }
            // Animations
            if (animationIndex != -1) {
                var animationId = this.reader.getString(grandChildren[animationIndex], "id");
                if (animationId != null && !this.animations[animationId]) {
                    this.onXMLMinorError("animation not defined for animation ID " + animationId + " in component " + componentID);
                    animationId = null;
                }
                this.nodes[componentID].addAnimation(animationId);
            }
            // Hightlight
            if (highlightedIndex != -1) {
                var r = this.reader.getFloat(grandChildren[highlightedIndex], 'r');
                var g = this.reader.getFloat(grandChildren[highlightedIndex], 'g');
                var b = this.reader.getFloat(grandChildren[highlightedIndex], 'b');
                var scale_h = this.reader.getFloat(grandChildren[highlightedIndex], 'scale_h');
                if (r == null || g == null || b == null || scale_h == null)
                    return "unable to parse highlighted for ID = " + componentID;
                if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(scale_h))
                    return "unable to parse highlighted for ID = " + componentID;

                this.nodes[componentID].addShaderValues([r, g, b, scale_h]);
                this.scene.highlights.push(this.nodes[componentID]);
                this.scene.highlightsIds.push(componentID);
            }

        }

    }


    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Displays the scene
     */
    displayScene() {
        //To do: Create display loop for transversing the scene graph

        //To test the parsing/creation of the primitives, call the display function directly
        this.scene.pushMatrix();
        this.displaySceneRecursive(this.idRoot, this.nodes[this.idRoot].materials, this.nodes[this.idRoot].texture);
        this.scene.popMatrix();

    }
    updateAnimations(t) {
        for (var i in this.animations) {
            this.animations[i].update(t);
        }
    }
    /**
     * Displays the scene, processing each node, starting in the root node.
     * @param {string id} nodeID
     * @param {list containing all father's materials} FatherMaterial 
     * @param {list containing fathers's texture length_s and length_t} FatherTexture 
     */
    displaySceneRecursive(nodeID, FatherMaterial, FatherTexture) {
        var node = this.nodes[nodeID];
        var children_primitives = node.children_primitives;
        var children_components = node.children_components;

        var materials = [];
        var texture;
        for (var i = 0; i < node.materials.length; i++) {
            if (node.materials[i] == "inherit") {
                materials = materials.concat(FatherMaterial);
            }
            else {
                materials.push(node.materials[i]);
            }
        }
        materials = [...new Set(materials)];

        if (node.texture[0] == "inherit")
            texture = FatherTexture;
        else
            texture = node.texture;

        this.scene.multMatrix(node.transfMatrix);
        var materialIndex = materials[this.scene.M_counter % materials.length];
        var currAppearance = this.materials[materialIndex];
        var currTexture = (texture[0] == "none") ? null : this.textures[texture[0]];
        var length_s = texture[1];
        var length_t = texture[2];
        currAppearance.setTexture(currTexture);
        currAppearance.setTextureWrap('REPEAT', 'REPEAT');
        currAppearance.apply();

        if (node.isHighlighted) {
            this.scene.shader.setUniformsValues({ normScale: node.shaderValues[3] });
            this.scene.shader.setUniformsValues({ newColor: [node.shaderValues[0], node.shaderValues[1], node.shaderValues[2]] });
            this.scene.shader.setUniformsValues({ diffuse: [this.materials[materialIndex].diffuse[0], this.materials[materialIndex].diffuse[1], this.materials[materialIndex].diffuse[2], this.materials[materialIndex].diffuse[3]] })
            this.scene.setActiveShader(this.scene.shader);
        }
        //Draw primitives
        for (var i = 0; i < children_primitives.length; i++) {
            this.scene.pushMatrix();
            if (this.primitives[children_primitives[i]] instanceof MyRectangle || this.primitives[children_primitives[i]] instanceof MyTriangle)
                this.primitives[children_primitives[i]].updateTexCoords(length_s, length_t);
            this.primitives[children_primitives[i]].display();
            this.scene.popMatrix();
        }

        if (node.isHighlighted) {
            this.scene.setActiveShader(this.scene.defaultShader);
        }

        if (node.hasAnimation) {
            this.animations[node.animations[0]].apply();
        }
        //Visit components recursively
        for (var i = 0; i < children_components.length; i++) {
            this.scene.pushMatrix();
            this.displaySceneRecursive(children_components[i], materials, texture);
            this.scene.popMatrix();

        }
    }
}