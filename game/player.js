function Player(game) {
    this.lifes = 3
    this.numAdditionaLifes = 0
    this.isHittable = true

    this.name = "Joe"
    this.score = 0

    this.lasersArray = new Array()
    this.laserCounter = 0

    this.shipNode = this.createShip(game);
    this.shipNode.speed = 0;
    this.shipNode.angle = 0;
    this.shipNode.currentAngle = 0;
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

Player.prototype.createAnimation = function () {
    var Mat4x4 = matrixHelper.matrix4;

    this.shipNode.animationCallback = function () {
        // Forward
        if (this.speed != 0) {
            x = this.transform[12] + (this.speed * Math.cos(this.currentAngle))
            y = this.transform[13] + (this.speed * Math.sin(this.currentAngle))

            this.transform[12] = x;
            this.transform[13] = y;
        }


        // Rotate
        if (this.angle != 0) {
            var zTransform = Mat4x4.create();
            Mat4x4.makeRotationZ(zTransform, this.angle);

            var copy = Mat4x4.clone(this.transform);

            Mat4x4.multiply(this.transform, copy, zTransform);

            this.currentAngle += this.angle
        }
    }
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
            this.shipNode.speed = 0.05
            break;
        }
        // Left Arrow or A
        case 37:
        case 65: {
            this.shipNode.angle = 0.05
            break;
        }
        // Right Arrow or D
        case 39:
        case 68: {
            this.shipNode.angle = -0.05
            break;
        }
        default: {
            break;
        }
    }
}

Player.prototype.fireProjectile = function (game) {
    var laser = new Projectile(game, this.shipNode.currentAngle)
    laser.laserNode.transform[12] = this.shipNode.transform[12]
    laser.laserNode.transform[13] = this.shipNode.transform[13]

    var Mat4x4 = matrixHelper.matrix4;

    var zTransform = Mat4x4.create();
    Mat4x4.makeRotationZ(zTransform, this.shipNode.currentAngle);

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

Player.prototype.cancelMovement = function (event) {
    switch (event.keyCode) {
        case 38:
        case 87: {
            this.shipNode.speed = 0
            break;
        }
        // Left Arrow or A
        case 37:
        case 65: {
            this.shipNode.angle = 0
            break;
        }
        // Right Arrow or D
        case 39:
        case 68: {
            this.shipNode.angle = 0
            break;
        }
        default: {
            break;
        }
    }
}

Player.prototype.getsHit = function () {
    this.lifes--
    this.isHittable = false;
    setTimeout(() => {
        this.isHittable = true;
    }, 1000);
}

Player.prototype.checkAdditionalLife = function () {

    if ((Math.floor(this.score / 1000)) > this.numAdditionaLifes) {
        this.lifes++
        this.numAdditionaLifes++
    }
}