function Saucer(game, points, speed) {
    this.points = points;

    this.saucerNode = this.createSaucer(game);
    this.saucerNode.speed = speed;
    this.saucerNode.angle = 0.5;
};

Saucer.prototype.createSaucer = function (game) {

    var quad = makeQuad(
        [[-0.45, -0.45, 0], [0.45, -0.45, 0], [0.45, 0.45, 0], [-0.45, 0.45, 0]],
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
    saucerImage.src = '/Asteroids/assets/Pack2/UFOs/Beholder/Beholder.png';
    NewAsset();

    saucerImage.onload = () => {
        material.setAlbedo(game.gl, saucerImage);
        console.log("Saucer Loaded");
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

Saucer.prototype.Shoot = function () {
    numSuccess = 0
    numFailure = 0

    for (let i = 0; i < 25; i++) {
        var randomNum = Math.random();

        if (randomNum > 0.5) {
            numSuccess++;
        }
        else {
            numFailure++;
        }
    }

    if (numSuccess > numFailure) {
        return true
    }
    else {
        return false
    }
}

function SmallSaucer(game) {
    Saucer.call(this, game, 1000, 0.03);
};

function LargeSaucer(game) {
    Saucer.call(this, game, 200, 0.01);
};

SaucerSpawner = function (game) {
    var randomNum = Math.random();

    if (randomNum <= 0.75) {
        return
    }

    if (game.player.points <= 10000) {
        var saucer = new SmallSaucer(game)
    } else {
        var saucer = new LargeSaucer(game)
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

SmallSaucer.prototype = Object.create(Saucer.prototype);
LargeSaucer.prototype = Object.create(Saucer.prototype);

SmallSaucer.prototype.constructor = SmallSaucer;
LargeSaucer.prototype.constructor = LargeSaucer;