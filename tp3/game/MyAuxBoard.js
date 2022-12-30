import {CGFobject} from '../../lib/CGF.js';
import {MyRectangle} from "../primitives/MyRectangle.js";
import { MyTile } from "./MyTile.js";

export class MyAuxBoard extends CGFobject {
    constructor(id, scene, material) {
        super(scene);
        this.id = id;
        this.material = material;
        this.rectangle = new MyRectangle(scene, -0.5, 0.5, -1, 1);
        this.tiles = [];
        this.countPieces = 0;
        this.initTiles();
    }

    initTiles() {
        for (let i = 0; i < 12; i++) {
                this.tiles.push(new MyTile((this.id+i.toString()),this.scene, this.material,false));
            }
    }
    
    addPiece(piece) {
        let tile = this.tiles[this.countPieces];
        if (!tile.hasPiece()) {
            tile.setPiece(piece);
            piece.setTile(tile);
            this.countPieces++;
        }
    }
    removePiece() {
        if (this.countPieces == 0) return;
        let tile = this.tiles[this.countPieces-1];
        if (tile.hasPiece()) {
            tile.unsetPiece();
            this.countPieces--;
        }
    }

    getLastPiece() {
        if (this.countPieces == 0) return null;
        let tile = this.tiles[this.countPieces-1];
        if (tile.hasPiece()) {
            return tile.piece;
        }
    }

    displayBase() {
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI*1.5, 1, 0, 0);
        this.scene.rotate(Math.PI*0.5, 0, 0, 1);
        this.scene.translate(3.5, -4, 0);
        this.scene.scale(2.5, 5.1, 1);
        this.rectangle.display();
        this.scene.popMatrix();
    }

    displaySeparation() {
    // right
    this.scene.pushMatrix();
    this.scene.translate(0.1, 0, 0.5);
    this.scene.rotate(Math.PI*0.5, 0, 1, 0);
    this.rectangle.display();
    this.scene.popMatrix();
    //left
    this.scene.pushMatrix();
    this.scene.translate(-0.1, 0, 0.5);
    this.scene.rotate(Math.PI*1.5, 0, 1, 0);
    this.rectangle.display();
    this.scene.popMatrix();
    //front
    this.scene.pushMatrix();
    this.scene.translate(0, 0, 1);
    this.scene.scale(0.2,1,1);
    this.rectangle.display();
    this.scene.popMatrix();
    //top
    this.scene.pushMatrix();
    this.scene.rotate(Math.PI*1.5, 1, 0, 0);
    this.scene.translate(0, -0.5, 1);
    this.scene.scale(0.2, 0.5, 1);
    this.rectangle.display();
    this.scene.popMatrix();
    //bottom
    this.scene.pushMatrix();
    this.scene.rotate(Math.PI, 0, 0, 1);
    this.scene.rotate(Math.PI*0.5, 1, 0, 0);
    this.scene.translate(0, 0.5, -1);
    this.scene.scale(0.2, -0.5, 1);
    this.rectangle.display();
    this.scene.popMatrix();
}
    displaySeparation1() {
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI*1.5, 1, 0, 0);
        this.scene.rotate(Math.PI*0.5, 0, 0, 1);
        this.scene.translate(2.3, -4, 0);
        this.scene.scale(1, 5.15, 0.25);
        this.displaySeparation();
        this.scene.popMatrix();
    }

    displaySeparation2() {
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI*1.5, 1, 0, 0);
        this.scene.rotate(Math.PI*0.5, 0, 0, 1);
        this.scene.translate(4.8, -4, 0);
        this.scene.scale(1, 5.15, 0.25);
        this.displaySeparation();
        this.scene.popMatrix();
    }

    displaySeparation3() {
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI*1.5, 1, 0, 0);
        this.scene.translate(-1.1, 3.55, 0);
        this.scene.scale(1, 1.35, 0.25);
        this.displaySeparation();
        this.scene.popMatrix();
    }

    displaySeparation4() {
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI*1.5, 1, 0, 0);
        this.scene.translate(9.1, 3.55, 0);
        this.scene.scale(1, 1.35, 0.25);
        this.displaySeparation();
        this.scene.popMatrix();
    }
        
    display() {
        this.scene.pushMatrix();
        this.material.apply();
        this.displaySeparation1();
        this.displaySeparation2();
        this.displaySeparation3();
        this.displaySeparation4();
        this.displayBase();
        for (let i = 0; i < 12; i++) {
            this.scene.pushMatrix();
            this.scene.rotate(Math.PI*1.5, 1, 0, 0);
            this.scene.rotate(Math.PI*0.5, 0, 0, 1);
            if (i%2 == 0)
                this.scene.translate(3.6, -0.2-i/1.3, 0);
            else
                this.scene.translate(2.6, -0.2-i/1.3, 0);
            this.tiles[i].display();

            this.scene.popMatrix();
        }
        this.scene.popMatrix();
    }
}
