import { CGFobject } from '../../lib/CGF.js';

export class MyPatch extends CGFobject {
    /**
     * 
     * @param {CFGScene} scene - reference to MyScene object
     * @param {integer} nrpointsU - number of points in U
     * @param {integer} nrpointsV - nr of control points in V
     * @param {integer} partsU - number of subdivisions/vertices along the surface in the U direction
     * @param {integer} partsV - number of subdivisions/vertices along the surface in the V direction
     * @param {integer} controlvertexes - array of control points
     */
    constructor(scene, degreeU, degreeV, partsU, partsV, controlvertexes){
        super(scene);
        this.degreeU = degreeU;
        this.degreeV = degreeV;
        this.partsU = partsU;
        this.partsV = partsV;
        this.controlvertexes = controlvertexes;
        this.initBuffers();
    }

    initBuffers() {
        var nurbsSurface = new CGFnurbsSurface(this.degreeU , this.degreeV, this.controlvertexes);
        this.obj = new CGFnurbsObject(this.scene, this.partsU, this.partsV, nurbsSurface);
    }
}