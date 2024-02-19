function Player(game) {
    this.lives = 3
    this.numAdditionaLives = 0
    this.isHittable = true
    this.hypespacejump = true

    this.name = ""
    this.score = 0

    this.lasersArray = new Array()

    // Preloading for fast animation
    this.shipMaterial = createMaterialShip(game, '/assets/Pack2/Spaceship1(no boost).png')
    this.shipMaterialBoost = createMaterialShip(game, '/assets/Pack2/Spaceship1.png')

    this.shipNode = this.createShip(game);
    this.shipNode.speed = 0;
    this.shipNode.angle = 0;
    this.shipNode.currentAngle = 0;

    this.createAnimation()
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

    model.material = this.shipMaterial;
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
            // Multiple Space Bar presses recogized with 1 press
            // So it is only shot once when it is recognised the first time
            if (spacebarCounter === 1) {
                this.fireProjectile(game);
            }
            break;
        }
        // Up Arrow or W
        case 38:
        case 87: {
            this.shipNode.speed = 0.05
            this.shipNode.nodeObject.material = this.shipMaterialBoost;
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

Player.prototype.cancelMovement = function (event, game) {
    switch (event.keyCode) {
        // Up Arrow or W
        case 38:
        case 87: {
            this.shipNode.speed = 0
            this.shipNode.nodeObject.material = this.shipMaterial;
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
    // Hyperspace Jump feature
    if (this.lives === 1 && this.hypespacejump) {
        this.hyperspaceJump()
        this.hypespacejump = false;
        return
    }

    this.lives--

    // Make player unhittable for 1 sec
    this.isHittable = false;
    setTimeout(() => {
        this.isHittable = true;
    }, 1000);
}

Player.prototype.checkAdditionalLife = function () {

    if ((Math.floor(this.score / 10000)) > this.numAdditionaLives) {
        this.lives++
        this.numAdditionaLives++
    }
}

Player.prototype.hyperspaceJump = function () {
    // Teleport with the boundaries
    this.shipNode.transform[12] = (Math.random() * 28.8 - 14.4).toFixed(1);
    this.shipNode.transform[13] = (Math.random() * 13.8 - 6.9).toFixed(1);
}

var createMaterialShip = function (game, imagePath) {
    var material = new Material();

    const shipImage = new Image();
    shipImage.src = imagePath;
    NewAsset();

    shipImage.onload = () => {
        material.setAlbedo(game.gl, shipImage);
        AssetsLoaded();
    };

    material.setDiffuse([1, 1, 1]);
    material.setShininess(8.0);
    material.setSpecular([1, 1, 1]);
    material.setAmbient([0.2, 0.2, 0.2]);
    material.bind(game.gl, game.scene.shaderProgram);

    return material
}
