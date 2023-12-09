function Player(gl, scene) {
    this.lives = 3;
    this.name = null;
    this.points = 0;

    this.model = this.createShip(gl, scene);
}

Player.prototype.createShip = function (gl, scene) {

    var quad = makeQuad(
        [[-1, -1, 0], [1, -1, 0], [1, 1, 0], [-1, 1, 0]],
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
        material.setAlbedo(gl, shipImage.src);
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

Player.prototype.checkForMovement = function (event) {
    switch (event.keyCode) {
        // Space Bar
        case (32): {

        }
        // Up Arrow or W
        case (38 || 87): {
            this.moveForward();
        }
        // Left Arrow or A
        case (37 || 65): {
            this.rotateLeft();
        }
        // Right Arrow or D
        case (39 || 68): {
            this.rotateRight();
        }
        default: {

        }
    }
}

Player.prototype.moveForward = function () {
    this.node.transform[13] += 0.5
}

Player.prototype.rotateLeft = function () {
    var yTransform = Mat4x4.create();
    Mat4x4.makeRotationY(yTransform, 0.5);
}

Player.prototype.rotateRight = function () {
    var yTransform = Mat4x4.create();
    Mat4x4.makeRotationY(yTransform, -0.5);
}

Player.prototype.checkAdditionalLife = function () {
    if ((this.score % 10000) == 0) {
        this.lives += 1;
    }
}