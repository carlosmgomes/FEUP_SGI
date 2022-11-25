/**
 * Component class, represents a graph node.
 */
export class MyComponent{
   /**
    * @constructor
	 * @param {*} id - component identifier
    */
    constructor(id) {
        this.id = id;
        this.materials = [];
        this.shaderValues = [];
        this.texture = [];
        this.children_primitives=[];
        this.children_components=[];
        this.animations=[];
        this.transfMatrix = mat4.create();
        mat4.identity(this.transfMatrix);
    }

    /**
     * Adds a material to the node.
     * @param {string id} material 
     */
    addMaterial(material) {
        this.materials.push(material);
    }

    /**
     * Adds a texture to the node.
     * @param {string id} texture 
     * @param {number} length_s 
     * @param {number} length_t 
     */
    addTexture(texture, length_s, length_t) {
        this.texture.push(texture);
        this.texture.push(length_s);
        this.texture.push(length_t);
    }


    /**
     * Adds a primitive to the node.
     * @param {string id} primitive
    */
    addPrimitive(primitive) {
        this.children_primitives.push(primitive);
    }

    /**
     * Adds a component to the node.
     * @param {string id} component
    */
    addComponent(component) {
        this.children_components.push(component);
    }

    addShaderValues(values) {
        this.shaderValues = values;
        this.isHighlighted = false;
    }
    addAnimation(animation){
        this.hasAnimation = true;
        this.animations.push(animation);
    }

}