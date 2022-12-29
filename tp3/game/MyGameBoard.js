import { CGFobject, CGFshader } from '../../lib/CGF.js';
import { MyGameBoardSide } from './MyGameBoardSide.js';
import { MyPiece } from "./MyPiece.js";
import { MyTile } from "./MyTile.js";
import { MyAuxBoard } from "./MyAuxBoard.js";

export class MyGameBoard extends CGFobject {
    constructor(scene, boardMaterial1, boardMaterial2, highlightMaterial, player1Material, player2Material) {
        super(scene);
        this.board = [];
        this.boardPieces = [];

        this.player1Pieces = 12;
        this.player2Pieces = 12;
        this.boardMaterial1 = boardMaterial1;
        this.boardMaterial2 = boardMaterial2;
        this.highlightMaterial = highlightMaterial;
        this.player1Material = player1Material;
        this.player2Material = player2Material;
        this.auxBoard1 = new MyAuxBoard("player1", scene, this.boardMaterial1);
        this.auxBoard2 = new MyAuxBoard("player2", scene, this.boardMaterial1);

        this.shader = new CGFshader(this.scene.gl, "shaders/shaders.vert", "shaders/shaders.frag");
        this.shader.setUniformsValues({ uSampler2: 1 });
        this.shader.setUniformsValues({ timeFactor: 0 });

        //add tiles to board
        for (var i = 0; i < 8; i++) {
            this.board[i] = [];
            for (var j = 0; j < 8; j++) {
                var id = i.toString() + j.toString();
                if (i % 2 == 0) {
                    if (j % 2 == 0) {
                        this.board[i][j] = new MyTile(id, scene, this.boardMaterial2, this.highlightMaterial);

                    } else {
                        this.board[i][j] = new MyTile(id, scene, this.boardMaterial1, this.highlightMaterial);
                    }
                } else {
                    if (j % 2 == 0) {
                        this.board[i][j] = new MyTile(id, scene, this.boardMaterial1, this.highlightMaterial);
                    } else {
                        this.board[i][j] = new MyTile(id, scene, this.boardMaterial2, this.highlightMaterial);
                    }
                }
                this.board[i][j].setBoard(this);
            }
        }

        //add pieces to board
        for (var i = 0; i < 8; i++) {
            this.boardPieces[i] = [];
            for (var j = 0; j < 8; j++) {
                if (i < 3) {
                    if (j % 2 == 0) {
                        if (i % 2 == 0) {
                            this.boardPieces[i][j] = new MyPiece(scene, 1, this.player1Material, this.shader);
                        }
                    } else {
                        if (i % 2 != 0) {
                            this.boardPieces[i][j] = new MyPiece(scene, 1, this.player1Material, this.shader);
                        }
                    }
                } else if (i > 4) {
                    if (j % 2 == 0) {
                        if (i % 2 == 0) {
                            this.boardPieces[i][j] = new MyPiece(scene, 2, this.player2Material, this.shader,);
                        }
                    } else {
                        if (i % 2 != 0) {
                            this.boardPieces[i][j] = new MyPiece(scene, 2, this.player2Material, this.shader);
                        }
                    }
                }
                if (this.boardPieces[i][j] != null){
                    this.board[i][j].setPiece(this.boardPieces[i][j]);
                    this.boardPieces[i][j].setTile(this.board[i][j]);
                }
            }
        }

        //add sides to board
        this.side1 = new MyGameBoardSide(scene, "side1", this.boardMaterial2);
        this.side2 = new MyGameBoardSide(scene, "side2", this.boardMaterial2);
        this.side3 = new MyGameBoardSide(scene, "side3", this.boardMaterial2);
        this.side4 = new MyGameBoardSide(scene, "side4", this.boardMaterial2);
        this.side5 = new MyGameBoardSide(scene, "side5", this.boardMaterial1);
        this.side6 = new MyGameBoardSide(scene, "side6", this.boardMaterial1);
        this.side7 = new MyGameBoardSide(scene, "side7", this.boardMaterial1);
        this.side8 = new MyGameBoardSide(scene, "side8", this.boardMaterial1);
    }

    addPiece(piece, tile) {
        if (!tile.hasPiece()) {
            tile.setPiece(piece);
            piece.setTile(tile);
        }
    }

    removePiece(tile) {
        tile.unsetPiece();
    }

    getPiece(tile) {
        return tile.getPiece();
    }

    getTile(piece) {
        return piece.getTile();
    }

    getTileByCoords(x, y) {
        return this.board[x][y];
    }

    jumpPieces(startTile, endTile) {
        var startId = startTile.getId();
        var endId = endTile.getId();
        var startRow = parseInt(startId[0]);
        var startCol = parseInt(startId[1]);
        var endRow = parseInt(endId[0]);
        var endCol = parseInt(endId[1]);
        var rowDiff = endRow - startRow;
        var colDiff = endCol - startCol;
        var rowInc = rowDiff / Math.abs(rowDiff);
        var colInc = colDiff / Math.abs(colDiff);
        var row = startRow + rowInc;
        var col = startCol + colInc;
        while (row != endRow) {
            var tile = this.board[row][col];
            if (tile.hasPiece()) {
                this.removePiece(tile);
            }
            row += rowInc;
            col += colInc;
        }
    }

    movePiece(piece, startTile, endTile) {
        this.removePiece(startTile);
        this.addPiece(piece, endTile);
        this.jumpPieces(startTile, endTile);
    }

    checkJumps(player, currentTile, adjacentTileLeft, adjacentTileRight){
        var id = currentTile.getId();
        var row = parseInt(id[0]);
        var col = parseInt(id[1]);
        var currentMoves = [];
        if (col > 1){
            //house is occupied by opponent and there is space to jump
            if (adjacentTileLeft.hasPiece() && adjacentTileLeft.getPiece().getPlayer() != player){
                if (player == 1 && row < 6){
                    adjacentTileLeft = this.board[row + 2][col - 2];
                }
                else if (player == 2 && row > 1){
                    adjacentTileLeft = this.board[row - 2][col - 2];
                }
                if (!adjacentTileLeft.hasPiece()){
                    currentMoves.push(adjacentTileLeft);
                    var adjRow = parseInt(adjacentTileLeft.getId()[0]);
                    var adjCol = parseInt(adjacentTileLeft.getId()[1]);
                    var adjacentTileLeftNew = null;
                    var adjacentTileRightNew = null;
                    if (player == 1){
                        if (adjCol > 0 && adjCol < 7 && adjRow < 7){
                            adjacentTileLeftNew = this.board[adjRow + 1][adjCol - 1];
                            adjacentTileRightNew = this.board[adjRow + 1][adjCol + 1];
                        }
                    }
                    else{
                        if (adjCol > 0 && adjCol < 7 && adjRow > 0){
                            adjacentTileLeftNew = this.board[adjRow - 1][adjCol - 1];
                            adjacentTileRightNew = this.board[adjRow - 1][adjCol + 1];
                        }
                    }
                    currentMoves = currentMoves.concat(this.checkJumps(player, adjacentTileLeft, adjacentTileLeftNew, adjacentTileRightNew));
                }
            }
        }
        if (col < 6){
            //house is occupied by opponent and there is space to jump
            if (adjacentTileRight.hasPiece() && adjacentTileRight.getPiece().getPlayer() != player){
                if (player == 1 && row < 6){
                    adjacentTileRight = this.board[row + 2][col + 2];
                }
                else if (player == 2 && row > 1){
                    adjacentTileRight = this.board[row - 2][col + 2];
                }
                if (!adjacentTileRight.hasPiece()){
                    currentMoves.push(adjacentTileRight);
                    var adjRow = parseInt(adjacentTileRight.getId()[0]);
                    var adjCol = parseInt(adjacentTileRight.getId()[1]);
                    var adjacentTileLeftNew = null;
                    var adjacentTileRightNew = null;
                    if (player == 1){
                        if (adjCol > 0 && adjCol < 7 && adjRow < 7){
                            adjacentTileLeftNew = this.board[adjRow + 1][adjCol - 1];
                            adjacentTileRightNew = this.board[adjRow + 1][adjCol + 1];
                        }
                    }
                    else{
                        if (adjCol > 1 && adjCol < 6 && adjRow > 0){
                            adjacentTileLeftNew = this.board[adjRow - 1][adjCol - 1];
                            adjacentTileRightNew = this.board[adjRow - 1][adjCol + 1];
                        }
                    }
                    currentMoves = currentMoves.concat(this.checkJumps(player, adjacentTileRight, adjacentTileLeftNew, adjacentTileRightNew));
                }
            }
        }
        currentMoves 
        return currentMoves;
    }
                 

        

    getCurrentMoves(player, piece) {
        if (piece == null) return 0;
        var tile = piece.getTile();
        var id = tile.getId();
        console.log(id);    
        var row = parseInt(id[0]);
        var col = parseInt(id[1]);
        var adjacentTileLeft = null;
        var adjacentTileRight = null;
        var currentMoves = [];
        if (col > 0){
            if (player == 1 && row < 7)
                adjacentTileLeft = this.board[row + 1][col - 1];
            else if (player == 2 && row > 0)
                adjacentTileLeft = this.board[row - 1][col - 1];
            //house is empty
            if (!adjacentTileLeft.hasPiece()){
                currentMoves.push(adjacentTileLeft);
            }
        }
        if (col < 7){
            if (player == 1 && row < 7)
                adjacentTileRight = this.board[row + 1][col + 1];
            else if (player == 2 && row > 0)
                adjacentTileRight = this.board[row - 1][col + 1];
            //house is empty
            if (!adjacentTileRight.hasPiece()){
                currentMoves.push(adjacentTileRight);
            }
        }
        //concat return with current moves
        currentMoves = currentMoves.concat(this.checkJumps(player, tile, adjacentTileLeft, adjacentTileRight));
    
        return currentMoves;
    }

    highlightPiece(piece) {
        if (piece != null)
            piece.highlight();
    }

    unhighlightPiece(piece) {
        if (piece != null)
            piece.unhighlight();
    }

    highlightTile(tile) {
        if(tile != null)
            tile.highlight();
    }

    unhighlightTile(tile) {
        if(tile != null)
            tile.unhighlight();
    }

    display() {
        this.scene.clearPickRegistration();
        this.scene.pushMatrix();
        this.scene.translate(10, 1, 15);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);

        this.side1.display();
        this.side2.display();
        this.side3.display();
        this.side4.display();
        this.side5.display();
        this.side6.display();
        this.side7.display();
        this.side8.display();
        this.auxBoard1.display();
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 13.1);
        this.auxBoard2.display();
        this.scene.popMatrix();
        
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                var id = (i+1).toString() + (j+1).toString();
                this.scene.pushMatrix();
                this.scene.translate(i, 0, j);
                this.scene.rotate(-Math.PI / 2, 1, 0, 0);

                this.scene.registerForPick(id, this.board[i][j]);
                this.board[i][j].display();
                this.scene.popMatrix();
            }
        }
        this.scene.popMatrix();
    }
}