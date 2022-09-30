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
        this.children_primitives=[];
        this.children_components=[];
        this.transfMatrix = mat4.create();
        mat4.identity(this.transfMatrix);
    }

    addMaterial(material) {
        this.materials.push(material);
    }

    addTexture(texture) {
        this.texture.push(texture);
    }
    addPrimitive(primitive) {
        this.children_primitives.push(primitive);
    }
    addComponent(component) {
        this.children_components.push(component);
    }
}