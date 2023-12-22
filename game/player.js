function Player(gl, scene) {
    this.lives = 3;
    this.name = null;
    this.points = 0;

    this.model = this.createShip(gl, scene);
}

Player.prototype.createShip = function (gl, scene) {

    var quad = makeQuad(
        [[-0.5, -0.5, 0], [0.5, -0.5, 0], [0.5, 0.5, 0], [-0.5, 0.5, 0]],
        [[0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1]],
        [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
        [[0, 0], [1, 0], [1, 1], [0, 1]]);

    var model = new Model();
    model.name = "quad";
    model.index = quad.index;
    model.vertex = quad.vertex;
    model.compile(scene);

    var material = new Material();

    const shipImage = new Image();
    shipImage.src = '/Asteroids/assets/ship_2.png';
    NewAsset();

    shipImage.onload = () => {
        material.setAlbedo(gl, shipImage);
        console.log("Ship Loaded");
        AssetsLoaded();
    };

    material.setDiffuse([1, 1, 1]);
    material.setShininess(8.0);
    material.setSpecular([1, 1, 1]);
    material.setAmbient([0.2, 0.2, 0.2]);
    material.bind(gl, scene.shaderProgram);

    model.material = material;
    return model;
}

Player.prototype.checkForMovement = function (event, ship_node) {
    switch (event.keyCode) {
        // Space Bar
        case 32: {
            break;
        }
        // Up Arrow or W
        case 38:
        case 87: {
            this.moveForward(ship_node);
            break;
        }
        // Left Arrow or A
        case 37:
        case 65: {
            this.rotateLeft(ship_node);
            break;
        }
        // Right Arrow or D
        case 39:
        case 68: {
            this.rotateRight(ship_node);
            break;
        }
        default: {
            break;
        }
    }
}

Player.prototype.moveForward = function (ship_node) {
    var Mat4x4 = matrixHelper.matrix4;

    var transform = Mat4x4.create()


    ship_node.transform[13] += 0.0003
}

Player.prototype.rotateLeft = function (ship_node) {
    var Mat4x4 = matrixHelper.matrix4;

    var zTransform = Mat4x4.create();
    Mat4x4.makeRotationZ(zTransform, 0.0005);

    var copy = Mat4x4.clone(ship_node.transform);

    Mat4x4.multiply(ship_node.transform, copy, zTransform);
}

Player.prototype.rotateRight = function (ship_node) {
    var Mat4x4 = matrixHelper.matrix4;

    var zTransform = Mat4x4.create();
    Mat4x4.makeRotationZ(zTransform, -0.0005);

    var copy = Mat4x4.clone(ship_node.transform);

    Mat4x4.multiply(ship_node.transform, copy, zTransform);
}

Player.prototype.checkAdditionalLife = function () {
    if ((this.score % 10000) == 0) {
        this.lives += 1;
    }
}