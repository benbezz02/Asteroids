function Saucer(game, points, speed) {
    this.points = points;

    this.lasersArray = new Array()

    this.saucerNode = this.createSaucer(game);
    this.saucerNode.speed = speed;
    this.saucerNode.angle = 0.1 + Math.random() * 0.8;

    this.shootTimer = this.ShootCheck(game)
};

Saucer.prototype.createSaucer = function (game) {

    var size = 0

    if (this instanceof LargeSaucer) {
        size = 0.4 + Math.random() * 0.2
    } else if (this instanceof SmallSaucer) {
        size = 0.2 + Math.random() * 0.2
    }

    var quad = makeQuad(
        [[-size, -size, 0], [size, -size, 0], [size, size, 0], [-size, size, 0]],
        [[0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1]],
        [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
        [[0, 0], [1, 0], [1, 1], [0, 1]]);

    var model = new Model();
    model.name = "saucer";
    model.index = quad.index;
    model.vertex = quad.vertex;
    model.compile(game.scene);

    var material = new Material();

    const saucerImage = new Image();
    if (this instanceof LargeSaucer) {
        saucerImage.src = '/assets/Pack2/UFOs/Beholder/Beholder.png';
    } else if (this instanceof SmallSaucer) {
        saucerImage.src = '/assets/Pack2/UFOs/Emissary/Emissary.png';
    }
    NewAsset()

    saucerImage.onload = () => {
        material.setAlbedo(game.gl, saucerImage);
        AssetsLoaded();
    };

    material.setDiffuse([1, 1, 1]);
    material.setShininess(5.0);
    material.setSpecular([1, 1, 1]);
    material.setAmbient([0.2, 0.2, 0.2]);
    material.bind(game.gl, game.scene.shaderProgram);

    model.material = material;
    return game.scene.addNode(game.lightNode, model, "saucerNode", Node.NODE_TYPE.MODEL);
}

Saucer.prototype.ShootCheck = function (game) {
    // creation of interval
    var timerInterval = setInterval(() => {
        if (BernoulliTrial()) {
            // Random for Large at player for Small
            if (this instanceof SmallSaucer) {
                var deltaY = game.player.shipNode.transform[13] - this.saucerNode.transform[13];
                var deltaX = game.player.shipNode.transform[12] - this.saucerNode.transform[12];

                var angle = Math.atan2(deltaY, deltaX)
                var laser = new Projectile(game, angle)
            }
            if (this instanceof LargeSaucer) {
                var angle = Math.random() * 360
                var laser = new Projectile(game, angle)
            }

            laser.laserNode.transform[12] = this.saucerNode.transform[12]
            laser.laserNode.transform[13] = this.saucerNode.transform[13]

            var Mat4x4 = matrixHelper.matrix4;

            var zTransform = Mat4x4.create();
            Mat4x4.makeRotationZ(zTransform, angle);

            var copy = Mat4x4.clone(laser.laserNode.transform);
            Mat4x4.multiply(laser.laserNode.transform, copy, zTransform);

            laser.laserNode.animationCallback = function () {
                x = this.transform[12] + (this.speed * Math.cos(angle))
                y = this.transform[13] + (this.speed * Math.sin(angle))

                this.transform[12] = x;
                this.transform[13] = y;
            };

            this.lasersArray.push(laser)
        }
    }, 2000);

    return timerInterval
}

SaucerSpawner = function (game) {
    var randomNum = Math.random();

    if (randomNum <= 0.75) {
        return
    }

    if (game.player.score <= 10000) {
        var saucer = new LargeSaucer(game)
    } else {
        var saucer = new SmallSaucer(game)
    }

    saucer.saucerNode.transform[12] = (Math.random() * 26.8 - 13.4).toFixed(1);
    saucer.saucerNode.transform[13] = 6.9;

    saucer.saucerNode.animationCallback = function () {
        if (this.transform[12] >= 13 || this.transform[12] <= -13) {
            this.angle = Math.PI - this.angle;
        }

        x = this.transform[12] + (this.speed * Math.cos(this.angle))
        y = this.transform[13] + (this.speed * Math.sin(this.angle))

        this.transform[12] = x;
        this.transform[13] = y;
    }
    game.saucersArray.push(saucer)
}

SaucerDestroyer = function (game, saucer) {
    game.player.score += saucer.points

    clearInterval(saucer.shootTimer)

    game.scene.removeNode(saucer.saucerNode);
}

function SmallSaucer(game) {
    Saucer.call(this, game, 1000, 0.04);
};

function LargeSaucer(game) {
    Saucer.call(this, game, 200, 0.01);
};

SmallSaucer.prototype = Object.create(Saucer.prototype);
LargeSaucer.prototype = Object.create(Saucer.prototype);

SmallSaucer.prototype.constructor = SmallSaucer;
LargeSaucer.prototype.constructor = LargeSaucer;