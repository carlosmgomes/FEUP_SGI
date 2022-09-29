import {CGFobject} from '../../lib/CGF.js';

export class MyCylinder extends CGFobject {
  /**
   * @method constructor
   * /**
   * 
   * @param  {CGFscene} scene - MyScene object
   * @param base_radius - radius of the base 
   * @param top_radius - radius of the top
   * @param height - size in the direction of the positive Z axis
   * @param slices - number of divs around the circunference
   * @param stacks - number of divs along the z direction
   */
  constructor(scene, base_radius,top_radius, height, slices, stacks) {
    super(scene);
    this.base_radius = base_radius;
    this.top_radius = top_radius;
    this.height = height;
    this.slices = slices;
    this.stacks = stacks;
    this.initBuffers();
  }

  /**
   * @method initBuffers
   * Initializes the sphere buffers
   * TODO: DEFINE TEXTURE COORDINATES
   */
  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    var theta = 0;
    var theta_inc = (2 * Math.PI) / this.slices;
    var height_inc = this.height / this.stacks;
    var rad_inc = (this.top_radius-this.base_radius) / this.stacks;
    var current_rad = this.base_radius;
    var current_height = 0;

    
    for (let stack=0; stack <= this.stacks; stack++) {
      theta = 0;
      for (let slice = 0; slice <= this.slices; slice++) {
        //--- Vertices coordinates
        var x = current_rad*Math.sin(theta);
        var y = current_rad*Math.cos(theta);
        var z = current_height;
        this.vertices.push(x, y, z);
        
        //--- Indices
        if (stack < this.stacks && slice < this.slices) {
          var current = stack * (this.slices+1) + slice;
          var next = current + (this.slices+1);
          
          this.indices.push(current + 1, current, next);
          this.indices.push(current + 1, next, next +1);
          this.indices.push(current + 1, next, current);
          this.indices.push(current + 1, next+1, next);

        }
        this.texCoords.push(slice/this.slices, stack*(this.height));
        this.normals.push(x/current_rad, y/current_rad, 0);
        theta += theta_inc;
      }
      current_height+=height_inc;
      current_rad+=rad_inc;
    }

   
    // TODO
    /**
     * top and buttom parts of cylinder
     * see cylinder from the outside
     */
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
  /**
     * Called when user interacts with GUI to change object's complexity.
     * @param {integer} complexity - changes number of slices
     */
   updateBuffers(complexity){
    this.slices = Math.round(complexity); //complexity varies 3-16, so slices varies 3-16

    // reinitialize buffers
    this.initBuffers();
    this.initNormalVizBuffers();
}
}
