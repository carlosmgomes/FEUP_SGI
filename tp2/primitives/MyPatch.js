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
    constructor(scene, nrpointsU, nrpointsV, partsU, partsV, controlvertexes){
        super(scene);
        this.nrpointsU = nrpointsU;
        this.nrpointsV = nrpointsV;
        this.partsU = partsU;
        this.partsV = partsV;
        this.controlvertexes = controlvertexes;
        this.initBuffers();
    }

    initBuffers() {
        var degreeU = this.nrpointsU - 1;
        var degreeV = this.nrpointsV - 1;
        var nurbsSurface = new CGFnurbsSurface(degreeU , degreeV, this.controlvertexes);
        this.obj = new CGFnurbsObject(this.scene, this.partsU, this.partsV, nurbsSurface);
    }
}