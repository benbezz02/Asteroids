function Asteroid(game, points, speed, angularVel) {
    this.points = points;
    this.speed = speed;
    this.angularVel = angularVel;

    this.asteroidNode = this.createAsteroid(game);
    this.asteroidNode.speed = speed;
};

Asteroid.prototype.createAsteroid = function (game) {

    var sphere = makeSphere([0, 0, 0], 0.5, 50, 50, [0, 0, 0]);

    var model = new Model();
    model.name = "sphere";
    model.index = sphere.index;
    model.vertex = sphere.vertex;
    model.compile(game.scene);

    var material = new Material();

    const asteroidImage = new Image();
    asteroidImage.src = '/Asteroids/assets/black-stone-texture.jpg';
    NewAsset();

    asteroidImage.onload = () => {
        material.setAlbedo(game.gl, asteroidImage);
        console.log("Rock Loaded");
        AssetsLoaded();
    };

    material.setDiffuse([1, 1, 1]);
    material.setShininess(8.0);
    material.setSpecular([1, 1, 1]);
    material.setAmbient([0.2, 0.2, 0.2]);
    material.bind(game.gl, scene.shaderProgram);

    model.material = material;
    var asteroidNode = scene.addNode(game.lightNode, model, "asteroidNode", Node.NODE_TYPE.MODEL)
    return asteroidNode;
}

function SmallAsteroid(game) {
    Asteroid.call(this, game, 100, 0.1, 0.2);
};

function MediumAsteroid(game) {
    Asteroid.call(this, game, 50, 0.5, 0.1);
};

function LargeAsteroid(game) {
    Asteroid.call(this, game, 20, 0.01, 0.01);
};

AsteroidSpawner = function (game) {
    var Mat4x4 = matrixHelper.matrix4;

    for (var i = 0; i < (game.wave + 4); i++) {
        var ang = 0

        if (i % 4 === 0) {
            var asteroid = new LargeAsteroid(game)
        }
        else if (i % 3 === 0) {
            var asteroid = new MediumAsteroid(game)
        }
        else {
            var asteroid = new SmallAsteroid(game)
        }

        game.asteroidsArray.push(asteroid)
        Mat4x4.makeTranslation(game.asteroidsArray[i].asteroidNode.transform, [i, 0, 0]);
    }

    var ang = 0

    for (var j = 0; j < game.asteroidsArray.length; j++) {
        game.asteroidsArray[j].asteroidNode.animationCallback = function (deltaTime) {
            ang += deltaTime / 1000;
            this.transform[13] += this.speed;
        }
    }
}

SmallAsteroid.prototype = Object.create(Asteroid.prototype);
MediumAsteroid.prototype = Object.create(Asteroid.prototype);
LargeAsteroid.prototype = Object.create(Asteroid.prototype);

SmallAsteroid.prototype.constructor = SmallAsteroid;
MediumAsteroid.prototype.constructor = MediumAsteroid;
LargeAsteroid.prototype.constructor = LargeAsteroid;
