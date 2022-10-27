import { CGFobject } from '../../lib/CGF.js';

export class MySphere extends CGFobject {
  /**
   * @method constructor
   * @param  {CGFscene} scene - MyScene object
   * @param  {integer} radius - radius at center of sphere
   * @param  {integer} slices - number of slices around Y axis
   * @param  {integer} stacks - number of stacks along Y axis, from the center to the poles (half of sphere)
   */
  constructor(scene, radius, slices, stacks) {
    super(scene);
    this.radius = radius;
    this.lat_divs = stacks * 2;
    this.long_divs = slices;

    this.initBuffers();
  }

  /**
   * @method initBuffers
   * Initializes the sphere buffers
   */
  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    var phi = 0;
    var theta = 0;
    var phi_inc = Math.PI / this.lat_divs;
    var theta_inc = (2 * Math.PI) / this.long_divs;
    var lat_vertices = this.long_divs + 1;

    // build an all-around stack at a time, starting on "north pole" and proceeding "south"
    for (let latitude = 0; latitude <= this.lat_divs; latitude++) {
      var sin_phi = Math.sin(phi);
      var cos_phi = Math.cos(phi);

      // in each stack, build all the slices around, starting on longitude 0
      theta = 0;
      for (let longitude = 0; longitude <= this.long_divs; longitude++) {
        //--- Vertices coordinates
        var x = this.radius*Math.cos(theta) * sin_phi;
        var y = this.radius*cos_phi;
        var z = this.radius*Math.sin(-theta) * sin_phi;
        this.vertices.push(x, y, z);

        //--- Indices
        if (latitude < this.lat_divs && longitude < this.long_divs) {
          var current = latitude * lat_vertices + longitude;
          var next = current + lat_vertices;
          // pushing two triangles using indices from this round (current, current+1)
          // and the ones directly south (next, next+1)
          // (i.e. one full round of slices ahead)
          
          this.indices.push( current + 1, current, next);
          this.indices.push( current + 1, next, next +1);
        }

        //--- Normals
        // at each vertex, the direction of the normal is equal to 
        // the vector from the center of the sphere to the vertex.
        // in a sphere of radius equal to one, the vector length is one.
        // therefore, the value of the normal is equal to the position vectro
        this.normals.push(x, y, z);
        theta += theta_inc;

        //--- Texture Coordinates
        // To be done... 
        // May need some additional code also in the beginning of the function.
        this.texCoords.push(longitude/this.long_divs, latitude/this.lat_divs);
      }
      phi += phi_inc;
    }


    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}
