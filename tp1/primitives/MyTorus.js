import {CGFobject} from '../../lib/CGF.js';

export class MyTorus extends CGFobject {
  /**
   * @method constructor
   * @param scene - MyScene object
   * @param inner - the "tube" radius
   * @param outer - radius of circular axis
   * @param slices - number of segments in a single outer circle of the torus 
   * @param loops -  number of outer circles around the origin of the torus 
  */
  constructor(scene, inner,outer,slices,loops) {
    super(scene);
    this.inner = inner;
    this.outer = outer;
    this.slices = slices;
    this.loops = loops;

    this.initBuffers();
  }

  /**
   * @method initBuffers
   * Initializes the torus buffers
   */
  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    var phi = 0;
    var theta = 0;
    var phi_inc = (2 * Math.PI) / this.loops;
    var theta_inc = (2 * Math.PI) / this.slices;
    var loop_vertices = this.slices + 1;

    // build an all-around stack at a time, starting on "north pole" and proceeding "south"
    for (let loop = 0; loop <= this.loops; loop++) {

      // in each stack, build all the slices around, starting on longitude 0
      theta = 0;
      for (let slice = 0; slice <= this.slices; slice++) {

        //--- Vertices coordinates
        var x = (this.outer+this.inner*Math.cos(theta))*Math.cos(phi);
        var y = (this.outer+this.inner*Math.cos(theta))*Math.sin(phi);
        var z = this.inner*Math.sin(theta);
        this.vertices.push(x, y, z);

        //--- Normals
        // TODO ????????
        this.normals.push(x,y,z);

        //--- Indices
        if (slice < this.loops && loop < this.slices) {
          var current = slice * loop_vertices + loop;
          var next = current + loop_vertices;
          // pushing two triangles using indices from this round (current, current+1)
          // and the ones directly south (next, next+1)
          // (i.e. one full round of slices ahead)
          
          this.indices.push( current + 1, current, next);
          this.indices.push( current + 1, next, next +1);
        }

        theta += theta_inc;

        //--- Texture Coordinates
        // To be done... 
        // May need some additional code also in the beginning of the function.
        this.texCoords.push(loop/this.slices, slice/this.loops);
      }
      phi += phi_inc;
    }


    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}
