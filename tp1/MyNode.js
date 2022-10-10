/**
 * Node class, represents a graph node.
 */
export class MyNode{
   /**
    * @constructor
    */
    constructor(id) {
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

    addTexture(textureId, length_s, length_t) {
        this.texture.push(textureId);
        this.texture.push(length_s);
        this.texture.push(length_t);
    }

    addPrimitive(primitive) {
        this.children_primitives.push(primitive);
    }
    addComponent(component) {
        this.children_components.push(component);
    }
}