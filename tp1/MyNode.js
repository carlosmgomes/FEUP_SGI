/**
 * Node class, represents a graph node.
 */
export class MyNode{
   /**
    * @constructor
    */
    constructor( id) {
        this.id = id;
        this.materials = [];
        this.texture = [];
        this.children = [];
        this.transfMatrix = mat4.create();
    }

    addMaterial(material) {
        this.materials.push(material);
    }

    addTexture(texture) {
        this.texture.push(texture);
    }

    addChild(child) {
        this.children.push(child);
    }
}