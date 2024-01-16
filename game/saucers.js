function Saucer(game, points, speed) {
    this.points = points;

    this.saucerNode = this.createSaucer(game);
    this.saucerNode.speed = speed;
    this.saucerNode.angle = Math.random() * 360;
};

Saucer.prototype.createSaucer = function (game) {

    var quad = makeQuad(
        [[-0.5, -0.5, 0], [0.5, -0.5, 0], [0.5, 0.5, 0], [-0.5, 0.5, 0]],
        [[0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1]],
        [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
        [[0, 0], [1, 0], [1, 1], [0, 1]]);

    var model = new Model();
    model.name = "quad";
    model.index = quad.index;
    model.vertex = quad.vertex;
    model.compile(game.scene);

    var material = new Material();

    const saucerImage = new Image();
    saucerImage.src = '/Asteroids/assets/Aliens1.png';
    NewAsset();

    saucerImage.onload = () => {
        material.setAlbedo(game.gl, saucerImage);
        console.log("Saucer Loaded");
        AssetsLoaded();
    };

    material.setDiffuse([1, 1, 1]);
    material.setShininess(8.0);
    material.setSpecular([1, 1, 1]);
    material.setAmbient([0.2, 0.2, 0.2]);
    material.bind(game.gl, scene.shaderProgram);

    model.material = material;

    return scene.addNode(game.lightNode, model, "saucerNode", Node.NODE_TYPE.MODEL);
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

SaucerSpawner = function () {
    var randomNum = Math.random();

    if (randomNum > 0.75) {
        return true
    }
    else {
        return false
    }
}

SmallSaucer.prototype = Object.create(Saucer.prototype);
LargeSaucer.prototype = Object.create(Saucer.prototype);

SmallSaucer.prototype.constructor = SmallSaucer;
LargeSaucer.prototype.constructor = LargeSaucer;