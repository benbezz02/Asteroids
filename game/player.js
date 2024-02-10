function Player(game) {
    this.lives = 3
    this.name = "Joe"
    this.score = 0
    this.lasersArray = new Array()
    this.laserCounter = 0

    this.shipNode = this.createShip(game);
    this.shipNode.speed = 0.0005;
    this.shipNode.angle = 0;
}

Player.prototype.createShip = function (game) {

    var quad = makeQuad(
        [[-0.5, -0.5, 0], [0.5, -0.5, 0], [0.5, 0.5, 0], [-0.5, 0.5, 0]],
        [[0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1]],
        [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
        [[0, 0], [1, 0], [1, 1], [0, 1]]);

    var model = new Model();
    model.name = "ship";
    model.index = quad.index;
    model.vertex = quad.vertex;
    model.compile(game.scene);

    var material = new Material();

    const shipImage = new Image();
    shipImage.src = '/Asteroids/assets/Pack2/Spaceship1.png';
    NewAsset();

    shipImage.onload = () => {
        material.setAlbedo(game.gl, shipImage);
        console.log("Ship Loaded");
        AssetsLoaded();
    };

    material.setDiffuse([1, 1, 1]);
    material.setShininess(8.0);
    material.setSpecular([1, 1, 1]);
    material.setAmbient([0.2, 0.2, 0.2]);
    material.bind(game.gl, game.scene.shaderProgram);

    model.material = material;
    return game.scene.addNode(game.lightNode, model, "shipNode", Node.NODE_TYPE.MODEL);
}

Player.prototype.checkForMovement = function (event, game, spacebarCounter) {
    switch (event.keyCode) {
        // Space Bar
        case 32: {
            if (spacebarCounter === 1) {
                this.fireProjectile(game);
            }
            break;
        }
        // Up Arrow or W
        case 38:
        case 87: {
            this.moveForward();
            break;
        }
        // Left Arrow or A
        case 37:
        case 65: {
            this.rotateLeft();
            break;
        }
        // Right Arrow or D
        case 39:
        case 68: {
            this.rotateRight();
            break;
        }
        default: {
            break;
        }
    }
}

Player.prototype.moveForward = function () {
    x = this.shipNode.transform[12] + (this.shipNode.speed * Math.cos(this.shipNode.angle))
    y = this.shipNode.transform[13] + (this.shipNode.speed * Math.sin(this.shipNode.angle))

    this.shipNode.transform[12] = x;
    this.shipNode.transform[13] = y;
}

Player.prototype.rotateLeft = function () {
    var Mat4x4 = matrixHelper.matrix4;

    var zTransform = Mat4x4.create();
    Mat4x4.makeRotationZ(zTransform, 0.0005);

    var copy = Mat4x4.clone(this.shipNode.transform);

    Mat4x4.multiply(this.shipNode.transform, copy, zTransform);

    this.shipNode.angle += 0.0005
}

Player.prototype.rotateRight = function () {
    var Mat4x4 = matrixHelper.matrix4;

    var zTransform = Mat4x4.create();
    Mat4x4.makeRotationZ(zTransform, -0.0005);

    var copy = Mat4x4.clone(this.shipNode.transform);
    Mat4x4.multiply(this.shipNode.transform, copy, zTransform);

    this.shipNode.angle -= 0.0005
}

Player.prototype.fireProjectile = function (game) {
    var laser = new Projectile(game, this.shipNode.angle)
    laser.laserNode.transform[12] = this.shipNode.transform[12]
    laser.laserNode.transform[13] = this.shipNode.transform[13]

    var Mat4x4 = matrixHelper.matrix4;

    var zTransform = Mat4x4.create();
    Mat4x4.makeRotationZ(zTransform, this.shipNode.angle);

    var copy = Mat4x4.clone(laser.laserNode.transform);
    Mat4x4.multiply(laser.laserNode.transform, copy, zTransform);

    laser.laserNode.animationCallback = function () {
        x = this.transform[12] + (this.speed * Math.cos(this.angle))
        y = this.transform[13] + (this.speed * Math.sin(this.angle))

        this.transform[12] = x;
        this.transform[13] = y;
    };

    this.lasersArray.push(laser)
}

Player.prototype.checkAdditionalLife = function () {
    if ((this.score % 10000) == 0) {
        this.lives += 1;
    }
}