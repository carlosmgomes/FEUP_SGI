import { CGFobject, CGFtexture, CGFappearance, CGFshader } from '../../lib/CGF.js';
import { MyGameBoard } from './MyGameBoard.js';
import { MyGameSequence } from './MyGameSequence.js';
import { MyTile } from './MyTile.js';
import { MyGameMove } from './MyGameMove.js';
import { MyGameInterface } from './MyGameInterface.js';
import { MyInterfaceButton } from './MyInterfaceButton.js';




export class MyGameOrchestrator extends CGFobject {
    constructor(scene, selectedTheme) {
        super(scene);
        this.last = 0;
        this.timeElapsed = 0;
        this.finished = false;
        this.gameOn = false;
        this.wood = new CGFtexture(this.scene, "/tp3/scenes/images/wood.jpg");

        this.blue = new CGFappearance(scene);
        this.blue.setEmission(0.0, 0.0, 0.0, 1.0);
        this.blue.setAmbient(0.0, 0.0, 0.1, 1.0);
        this.blue.setDiffuse(0.0, 0.0, 0.4, 1.0);
        this.blue.setSpecular(0.0, 0.0, 0.4, 1.0);
        this.blue.setShininess(10.0);
        this.blue.setTexture(this.wood);

        this.red = new CGFappearance(scene);
        this.red.setEmission(0.0, 0.0, 0.0, 1.0);
        this.red.setAmbient(0.1, 0.0, 0.0, 1.0);
        this.red.setDiffuse(0.4, 0.0, 0.0, 1.0);
        this.red.setSpecular(0.4, 0.0, 0.0, 1.0);
        this.red.setShininess(10.0);
        this.red.setTexture(this.wood);

        this.green_blue = new CGFappearance(scene);
        this.green_blue.setEmission(0.0, 0.0, 0.0, 1.0);
        this.green_blue.setAmbient(0.0, 0.1, 0.1, 1.0);
        this.green_blue.setDiffuse(0.0, 0.4, 0.4, 1.0);
        this.green_blue.setSpecular(0.0, 0.4, 0.4, 1.0);
        this.green_blue.setShininess(10.0);
        this.green_blue.setTexture(this.wood);

        this.boardMaterial1 = new CGFappearance(scene);
        this.boardMaterial1.setEmission(0.0, 0.0, 0.0, 1.0);
        this.boardMaterial1.setAmbient(0.1, 0.1, 0.1, 1.0);
        this.boardMaterial1.setDiffuse(0.4, 0.4, 0.4, 1.0);
        this.boardMaterial1.setSpecular(0.4, 0.4, 0.4, 1.0);
        this.boardMaterial1.setShininess(10.0);

        this.boardMaterial2 = new CGFappearance(scene);
        this.boardMaterial2.setEmission(0.0, 0.0, 0.0, 1.0);
        this.boardMaterial2.setAmbient(0.1, 0.1, 0.1, 1.0);
        this.boardMaterial2.setDiffuse(0.4, 0.4, 0.4, 1.0);
        this.boardMaterial2.setSpecular(0.4, 0.4, 0.4, 1.0);
        this.boardMaterial2.setShininess(10.0);

        console.log(selectedTheme)

        this.tileTexture1 = new CGFtexture(this.scene, "scenes/images/wood.jpg");
        this.tileTexture2 = new CGFtexture(this.scene, "scenes/images/steel.jpg");

        this.boardMaterial1.setTexture(this.tileTexture1);
        this.boardMaterial2.setTexture(this.tileTexture2);


        this.interfaceMaterial = new CGFappearance(scene);
        this.interfaceMaterial.setEmission(0.0, 0.0, 0.0, 1.0);
        this.interfaceMaterial.setAmbient(0.1, 0.1, 0.1, 1.0);
        this.interfaceMaterial.setDiffuse(0.4, 0.4, 0.4, 1.0);
        this.interfaceMaterial.setSpecular(0.4, 0.4, 0.4, 1.0);
        this.interfaceMaterial.setShininess(10.0);
        this.interfaceMaterialTexture = new CGFtexture(this.scene, "scenes/images/grey.jpg");
        this.interfaceMaterial.setTexture(this.interfaceMaterialTexture);

        this.gameSequence = new MyGameSequence(this);
        this.gameBoard = new MyGameBoard(scene, this.boardMaterial1, this.boardMaterial2, this.red, this.green_blue, this.blue);
        this.currentPlayer = 1;
        this.currentHighlight = null;
        this.state = "gameplay";

        this.cameraAnimation = false;
        this.gameInterface = new MyGameInterface(this.scene, this.interfaceMaterial);
        this.player1_score = 0;
        this.player2_score = 0;
        this.animatorTranslation = [0, 0, 0];
        this.auxBoardAnimatorTranslation = [0, 0, 0];
        this.pieceAnimation = false;
        this.animatedPiece = null;
        this.direction = null;
        this.originAnimationTile = null;
        this.destinationAnimationTile = null;
        this.multipleDirections = [];
        this.animationPath = [];

        this.auxBoard1MaxY = 0;
        this.auxBoard2MaxY = 0;
        this.jumpedPieces = [];
        this.auxBoardAnimation = false;
        this.distance = 0;
    }



    update(time) {
        if (this.gameOn) {
            this.timeElapsed = Math.floor(time / 1000 % 1000 - this.startTime / 1000 % 1000);
            if (this.timeElapsed > this.last && this.gameOn == true) {
                this.last = this.timeElapsed;
            }
        }
        var rate = 1500000000000;
        if (this.cameraAnimation) {
            if (this.currentPlayer == 1) {
                if (this.scene.camera.position[0] > this.camera2.getPositionX()) {

                    this.scene.camera.position[0] -= time / rate;
                }
                if (this.scene.camera.target[0] < this.camera2.getTargetX()) {
                    this.scene.camera.target[0] += time / rate;
                }
                else {
                    this.scene.camera.position[0] = this.camera2.getPositionX();
                    this.scene.camera.target[0] = this.camera2.getTargetX();
                    this.scene.setPickEnabled(true);
                    this.cameraAnimation = false;
                }
            }
            else {
                if (this.scene.camera.position[0] < this.camera1.getPositionX()) {

                    this.scene.camera.position[0] += time / rate;
                }
                if (this.scene.camera.target[0] > this.camera1.getTargetX()) {
                    this.scene.camera.target[0] -= time / rate;
                }
                else {
                    this.scene.camera.position[0] = this.camera1.getPositionX();
                    this.scene.camera.target[0] = this.camera1.getTargetX();
                    this.scene.setPickEnabled(true);
                    this.cameraAnimation = false;
                }
            }
        }

        if (this.pieceAnimation) {
            this.updatePieceAnimation(time);
        }

        if (this.jumpedPieces.length > 0) {
            this.jumpedPieces[0].getTile().unsetPiece();
            this.auxBoardAnimation = true
            this.auxBoard1MaxY = parseInt(this.jumpedPieces[0].getTile().getId()[1]) - 10;
            this.auxBoard2MaxY = parseInt(this.jumpedPieces[0].getTile().getId()[1]) + 3;
            if (this.currentPlayer == 1) {
                this.distance = this.auxBoard2MaxY / 2;
            }
            else {
                this.distance = this.auxBoard1MaxY / 2;
            }
        }
        else {
            this.jumpedPieces = [];
            this.auxBoardAnimation = false;
            this.auxBoardAnimatorTranslation = [0, 0, 0];
        }

        if (this.currentPlayer == 1 && this.auxBoardAnimation == true) {
            if (this.auxBoardAnimatorTranslation[1] < this.auxBoard2MaxY) {
                this.auxBoardAnimatorTranslation[1] += time / 2500000000000;
                if (this.auxBoardAnimatorTranslation[1] > this.distance) {
                    this.auxBoardAnimatorTranslation[2] -= time / 2500000000000;
                }
                else {
                    this.auxBoardAnimatorTranslation[2] += time / 2500000000000;
                }
            }
            else {
                this.gameBoard.auxBoard1.addPiece(this.jumpedPieces[0])
                this.jumpedPieces.shift();
                this.auxBoardAnimatorTranslation = [0, 0, 0];
                if (this.jumpedPieces.length == 0) {
                    this.auxBoardAnimation = false;
                }
            }
        }
        else if (this.currentPlayer == 2 && this.auxBoardAnimation == true) {
            if (this.auxBoardAnimatorTranslation[1] > this.auxBoard1MaxY) {
                this.auxBoardAnimatorTranslation[1] -= time / 2500000000000;
                if (this.auxBoardAnimatorTranslation[1] < this.distance) {
                    this.auxBoardAnimatorTranslation[2] -= time / 2500000000000;
                }
                else {
                    this.auxBoardAnimatorTranslation[2] += time / 2500000000000;
                }
            }
            else {
                this.gameBoard.auxBoard2.addPiece(this.jumpedPieces[0])
                this.jumpedPieces.shift();
                this.auxBoardAnimatorTranslation = [0, 0, 0];
                if (this.jumpedPieces.length == 0) {
                    this.auxBoardAnimation = false;
                }
            }

        }
    }
    updatePieceAnimation(time) {
        var rate = 5000000000000;
        // up right
        if (this.direction[0] == 1 && this.direction[1] == 1) {
            if (this.animatorTranslation[0] < this.direction[0] && this.animatorTranslation[1] < this.direction[1]) {
                this.animatorTranslation[0] += time / rate;
                this.animatorTranslation[1] -= time / rate;
            }
            else {
                this.resetAnimation();
            }
        }
        // up left
        else if (this.direction[0] == 1 && this.direction[1] == -1) {
            if (this.animatorTranslation[0] < this.direction[0] && this.animatorTranslation[1] > this.direction[1]) {
                this.animatorTranslation[0] += time / rate;
                this.animatorTranslation[1] += time / rate;
            } else {
                this.resetAnimation();
            }
        }
        // down right
        else if (this.direction[0] == -1 && this.direction[1] == 1) {
            if (this.animatorTranslation[0] > this.direction[0] && this.animatorTranslation[1] < this.direction[1]) {
                this.animatorTranslation[0] -= time / rate;
                this.animatorTranslation[1] -= time / rate;
            } else {
                this.resetAnimation();
            }
        }
        // down left
        else if (this.direction[0] == -1 && this.direction[1] == -1) {
            if (this.animatorTranslation[0] > this.direction[0] && this.animatorTranslation[1] > this.direction[1]) {
                this.animatorTranslation[0] -= time / rate;
                this.animatorTranslation[1] += time / rate;
            } else {
                this.resetAnimation();
            }
        }
        // up right eat
        else if (this.direction[0] == 2 && this.direction[1] == 2) {
            if (this.animatorTranslation[0] < this.direction[0] && this.animatorTranslation[1] < this.direction[1]) {
                this.animatorTranslation[0] += time / rate;
                this.animatorTranslation[1] -= time / rate;
            } else {
                this.resetAnimation();
            }
        }
        // up left eat
        else if (this.direction[0] == 2 && this.direction[1] == -2) {
            if (this.animatorTranslation[0] < this.direction[0] && this.animatorTranslation[1] > this.direction[1]) {
                this.animatorTranslation[0] += time / rate;
                this.animatorTranslation[1] += time / rate;
            } else {
                this.resetAnimation();
            }
        }
        // down right eat
        else if (this.direction[0] == -2 && this.direction[1] == 2) {
            if (this.animatorTranslation[0] > this.direction[0] && this.animatorTranslation[1] < this.direction[1]) {
                this.animatorTranslation[0] -= time / rate;
                this.animatorTranslation[1] -= time / rate;
            } else {
                this.resetAnimation();
            }
        }
        // down left eat
        else if (this.direction[0] == -2 && this.direction[1] == -2) {
            if (this.animatorTranslation[0] > this.direction[0] && this.animatorTranslation[1] > this.direction[1]) {
                this.animatorTranslation[0] -= time / rate;
                this.animatorTranslation[1] += time / rate;
            }
            else {
                this.resetAnimation();
            }
        }
    }

    resetAnimation() {
        if (this.multipleDirections.length > 0) {
            this.animatorTranslation = [0, 0, 0];

            this.direction = this.multipleDirections[0]
            this.multipleDirections.shift();
            this.originAnimationTile = this.gameBoard.getTileByCoords(this.animationPath[0].id[0], this.animationPath[0].id[1]);
            this.destinationAnimationTile = this.gameBoard.getTileByCoords(this.animationPath[1].id[0], this.animationPath[1].id[1]);
            this.animationPath.shift();
        }
        else {
            this.gameBoard.addPiece(this.animatedPiece, this.destinationAnimationTile);
            this.pieceAnimation = false;
            this.animatedPiece = null;
            this.direction = null;
            this.animatorTranslation = [0, 0, 0];
            this.cameraAnimation = true;
            this.destinationAnimationTile = null;
            this.originAnimationTile = null;
            this.multipleDirections = [];
            this.animationPath = [];
        }
    }

    display() {
        this.gameInterface.display(this.player1_score, this.player2_score, this.timeElapsed);
        this.gameBoard.display();
        if (this.pieceAnimation) {
            this.scene.pushMatrix();
            this.scene.setMatrix(this.originAnimationTile.getPosition());
            this.scene.translate(this.animatorTranslation[0], this.animatorTranslation[1], this.animatorTranslation[2]);
            this.animatedPiece.display();
            this.scene.popMatrix();
        }
        if (this.auxBoardAnimation) {
            this.scene.pushMatrix();
            this.scene.setMatrix(this.jumpedPieces[0].getTile().getPosition());
            this.scene.translate(this.auxBoardAnimatorTranslation[0], this.auxBoardAnimatorTranslation[1], this.auxBoardAnimatorTranslation[2]);
            this.jumpedPieces[0].display();
            this.scene.popMatrix();
        }
    }


    managePick(pickMode, pickResults) {
        if (pickMode == false) {
            if (pickResults != null && pickResults.length > 0) {
                for (var i = 0; i < pickResults.length; i++) {
                    var obj = pickResults[i][0];
                    if (obj) {
                        var customId = pickResults[i][1];
                        this.OnObjectSelected(obj, customId);
                    }
                }
                pickResults.splice(0, pickResults.length);
            }
        }
    }

    OnObjectSelected(obj, id) {
        if (obj instanceof MyTile) {
            if (obj.piece != null) {
                console.log("Piece selected");
                console.log(obj.id);
                this.pieceSelected(obj.piece);
            }
            else {
                console.log("Tile selected");
                console.log(obj.id);
                this.tileSelected(obj);
            }
        }
        if (obj instanceof MyInterfaceButton) {
            if (obj.id == "undo") {
                this.undo();
            }
            if (obj.id == "movie") {
                this.movie();
            }
            if (obj.id == "reset") {
                this.reset();
            }
            if (obj.id == "theme1") {
                this.scene.selectedTheme = this.scene.themes[0]
                this.scene.updateTheme()

            }
            if (obj.id == "theme2") {
                this.scene.selectedTheme = this.scene.themes[1]
                this.scene.updateTheme()
            }
            if (obj.id == "theme3") {
                this.scene.selectedTheme = this.scene.themes[2]
                this.scene.updateTheme()
            }
            if (obj.id == "start") {
                if (this.finished) {
                    this.reset();
                }
                this.finished = false;
                this.gameOn = true;
                this.winner = null;
                this.startTime = Date.now();
                this.last = 0;
            }

        }
    }

    nextPlayer() {
        var temp = [];
        var found = false;
        var hasMoves = false;
        this.currentPlayer = this.currentPlayer == 1 ? 2 : 1;
        for (var i = 0; i < this.gameBoard.board.length; i++) {
            for (var j = 0; j < this.gameBoard.board[i].length; j++) {
                if (this.gameBoard.board[i][j].piece != null) {
                    if (this.gameBoard.board[i][j].piece.player == this.currentPlayer) {
                        found = true;
                        if (this.gameBoard.board[i][j].piece.getType() == "piece")
                            temp.push(this.gameBoard.getCurrentMoves(this.currentPlayer, this.gameBoard.board[i][j].piece));
                        else
                            temp.push(this.gameBoard.getCurrentMovesKing(this.currentPlayer, this.gameBoard.board[i][j].piece));
                    }
                }

            }
        }
        for (var i = 0; i < temp.length; i++) {

            if (temp[i][0].length > 0 || temp[i][1].length > 0) {
                hasMoves = true;
                break;
            }
        }
        if (!found || !hasMoves) {
            this.state = "gameover";
            this.finished = true;
            console.log("Game Over");
            this.winner = this.currentPlayer == 1 ? 2 : 1;
            if (this.winner == 1)
                this.player1_score++;
            else
                this.player2_score++;
            console.log("Player " + this.winner + " wins!");
            this.gameOn = false;
            this.finished = true;
            return;
        }
        this.pieceAnimation = true;
        this.scene.setPickEnabled(false);

    }


    highlightPieceAndTiles(piece) {
        this.gameBoard.highlightPiece(piece);
        if (piece.getType() == "piece") {
            for (var i = 0; i < this.gameBoard.getCurrentMoves(this.currentPlayer, piece)[0].length; i++) {
                this.gameBoard.highlightTile(this.gameBoard.getCurrentMoves(this.currentPlayer, piece)[0][i]);
            }
        }
        else {
            for (var i = 0; i < this.gameBoard.getCurrentMovesKing(this.currentPlayer, piece)[0].length; i++) {
                this.gameBoard.highlightTile(this.gameBoard.getCurrentMovesKing(this.currentPlayer, piece)[0][i]);
            }
        }
    }

    unhighlightPieceAndTiles(piece) {
        if (piece == null) return;
        this.gameBoard.unhighlightPiece(piece);
        if (piece.getType() == "piece") {
            for (var i = 0; i < this.gameBoard.getCurrentMoves(this.currentPlayer, piece)[0].length; i++) {
                this.gameBoard.unhighlightTile(this.gameBoard.getCurrentMoves(this.currentPlayer, piece)[0][i]);
            }
        }
        else {
            for (var i = 0; i < this.gameBoard.getCurrentMovesKing(this.currentPlayer, piece)[0].length; i++) {
                this.gameBoard.unhighlightTile(this.gameBoard.getCurrentMovesKing(this.currentPlayer, piece)[0][i]);
            }
        }
    }

    pieceSelected(piece) {
        if (this.state == "gameplay" || this.state == "pieceSelected") {
            if (piece.getPlayer() == this.currentPlayer && piece.getType() == "piece" && this.gameBoard.getCurrentMoves(this.currentPlayer, piece)[0].length > 0) {
                this.unhighlightPieceAndTiles(this.currentHighlight);
                this.highlightPieceAndTiles(piece);
                this.currentHighlight = piece;
                this.state = "pieceSelected";
            }
            else if (piece.getPlayer() == this.currentPlayer && piece.getType() == "king" && this.gameBoard.getCurrentMovesKing(this.currentPlayer, piece)[0].length > 0) {
                this.unhighlightPieceAndTiles(this.currentHighlight);
                this.highlightPieceAndTiles(piece);
                this.currentHighlight = piece;
                this.state = "pieceSelected";
            }
            else {
                this.unhighlightPieceAndTiles(this.currentHighlight);
                this.state = "gameplay";
                this.currentHighlight = null;
            }
        }
    }

    tileSelected(tile) {
        if (this.state == "pieceSelected") {
            if ((this.currentHighlight.getType() == "piece" && this.gameBoard.getCurrentMoves(this.currentPlayer, this.currentHighlight)[0].includes(tile) ||
                (this.currentHighlight.getType() == "king" && this.gameBoard.getCurrentMovesKing(this.currentPlayer, this.currentHighlight)[0].includes(tile)))) {
                var result;
                var jumpedTiles = [];
                var path = [];
                var becomeKing = null;
                this.unhighlightPieceAndTiles(this.currentHighlight);
                var originTile = this.currentHighlight.getTile();
                path.push(originTile);
                this.originAnimationTile = originTile;
                this.animatedPiece = this.currentHighlight;
                result = this.gameBoard.movePiece(this.currentHighlight, this.currentHighlight.getTile(), tile);
                jumpedTiles = result[0];
                for (var i = 0; i < jumpedTiles.length; i++) {
                    this.jumpedPieces.push(jumpedTiles[i].getPiece());
                }
                for (var i = 0; i < result[1].length; i++) {

                    path.push(result[1][i]);
                }
                becomeKing = result[2];
                this.gameSequence.addMove(new MyGameMove(originTile, tile, jumpedTiles, this.currentPlayer, becomeKing, this.animatedPiece));
                this.destinationAnimationTile = tile
                if (path.length > 1) {
                    for (var i = 0; i < path.length - 1; i++) {
                        this.multipleDirections.push(this.calculateDirection(path[i].id, path[i + 1].id));


                    }
                    this.direction = this.multipleDirections[0];
                    this.multipleDirections.shift();
                    this.animationPath = path;
                    this.originAnimationTile = this.gameBoard.getTileByCoords(this.animationPath[0].id[0], this.animationPath[0].id[1]);
                    this.destinationAnimationTile = this.gameBoard.getTileByCoords(this.animationPath[1].id[0], this.animationPath[1].id[1]);
                    this.animationPath.shift();

                }
                else {
                    this.direction = this.gameSequence.moves[this.gameSequence.moves.length - 1].getDirection();
                }
                this.nextPlayer();
                this.currentHighlight = null;
                this.state = "gameplay";


            }
        }
    }


    calculateDirection(originTile, destinationTile) {
        var originId = Number.parseInt(originTile);
        var destinationId = Number.parseInt(destinationTile);
        var originRow = Math.floor(originId / 10);
        var originColumn = originId % 10;
        var destinationRow = Math.floor(destinationId / 10);
        var destinationColumn = destinationId % 10;
        var direction = [destinationRow - originRow, destinationColumn - originColumn];
        return direction;
    }


    undo() {
        if (this.state == "gameplay" && this.gameSequence.moves.length > 0) {
            this.gameSequence.undo();
            this.display();
            //this.pieceAnimation = true;
            this.cameraAnimation = true;

        }
    }

    movie() {
        this.gameSequence.movie();
    }

    reset() {
        this.currentPlayer = 1;
        this.cameraAnimation = true;
        this.gameBoard = new MyGameBoard(this.scene, this.boardMaterial1, this.boardMaterial2, this.red, this.green_blue, this.blue);
        this.gameSequence.moves = [];
        this.state = "gameplay";
        this.currentHighlight = null;
        this.finished = false;
        this.gameOn = false;
        this.winner = null;
        this.gameInterface = new MyGameInterface(this.scene, this.interfaceMaterial);

    }
}

