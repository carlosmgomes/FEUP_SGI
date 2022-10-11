import { CGFobject } from '../../lib/CGF.js';

export class MyTriangle extends CGFobject {
	/**
	 * 
	 * MyTriangle
	 * @constructor
	 * @param scene - Reference to MyScene object
	 * @param {*} x1 - x value of coordinates of the first point of the triangle
	 * @param {*} x2 - x value of coordinates of the second point of the triangle
	 * @param {*} x3 - x value of coordinates of the third point of the triangle
	 * @param {*} y1 - y value of coordinates of the first point of the triangle
	 * @param {*} y2 - y value of coordinates of the second point of the triangle
	 * @param {*} y3 - y value of coordinates of the third point of the triangle
	 * @param {*} z1 - z value of coordinates of the first point of the triangle
	 * @param {*} z2 - z value of coordinates of the second point of the triangle
	 * @param {*} z3 - z value of coordinates of the third point of the triangle
	 */
	constructor(scene, x1, x2, x3, y1, y2, y3, z1, z2, z3) {
		super(scene);
		this.x1 = x1;
		this.x2 = x2;
		this.x3 = x3;
		this.y1 = y1;
		this.y2 = y2;
		this.y3 = y3;
		this.z1 = z1;
		this.z2 = z2;
		this.z3 = z3;

		this.initBuffers();
	}

	initBuffers() {
		this.vertices = [
			this.x1, this.y1, this.z1,	//0
			this.x2, this.y2, this.z2,  //1
			this.x3, this.y3, this.z3,  //2
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,    //front
			0, 2, 1     // back
		];

		//Facing Z positive
		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		];

		// CoordTexturasTriangulos.pdf 
		// slide 3
		var a = Math.sqrt(Math.pow((this.x2 - this.x1), 2) + Math.pow((this.y2 - this.y1), 2) + Math.pow((this.z2 - this.z1), 2));
		var b = Math.sqrt(Math.pow((this.x3 - this.x2), 2) + Math.pow((this.y3 - this.y2), 2) + Math.pow((this.z3 - this.z2), 2))
		var c = Math.sqrt(Math.pow((this.x1 - this.x3), 2) + Math.pow((this.y1 - this.y3), 2) + Math.pow((this.z1 - this.z3), 2));

		// slide 4
		var cos_alpha = (Math.pow(a, 2) - Math.pow(b, 2) + Math.pow(c, 2)) / 2 * a * c;
		// sin^2(alpha) + cos^2(alpha)=1
		var sin_alpha = Math.sqrt(1 - Math.pow(cos_alpha, 2));

		this.texCoords = [
			0, 0,
			a/(c*cos_alpha+a-c*cos_alpha), 0,
			(c*cos_alpha)/(c*cos_alpha+a-c*cos_alpha), (c*sin_alpha)/(Math.sqrt(Math.pow(c*cos_alpha,2)+Math.pow(c*sin_alpha,2)))
		];
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(length_s, length_t) {
		this.texCoords = [
			0, 0,
			this.a / length_s, 0,
			(this.c * Math.cos(this.alpha)) / length_s, (this.c * Math.sin(this.alpha)) / length_t
		];
		this.updateTexCoordsGLBuffers();
	}
}

