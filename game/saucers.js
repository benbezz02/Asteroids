function Saucer(gl, scene, points) {
    this.points = points
    this.speed = 0;
    this.angularVel = 0;

    this.model = this.createSaucer(gl, scene);
};

Saucer.prototype.createSaucer = function (gl, scene) {

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

    const saucerImage = new Image();
    saucerImage.src = '/Asteroids/assets/saucer1.png';
    NewAsset();

    saucerImage.onload = () => {
        material.setAlbedo(gl, saucerImage.src);
        console.log("Saucer Loaded");
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

Saucer.prototype.Spawn = function () {
    var randomNum = Math.random();

    if (randomNum > 0.75) {
        return true
    }
    else {
        return false
    }
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

function SmallSaucer() {
    Saucer.call(this, 1000);
};

function LargeSaucer() {
    Saucer.call(this, 200);
};