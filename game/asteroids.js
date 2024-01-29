function Asteroid(arrayPosition, game, points, speed, rotationalSpeed, radius) {
    this.arrayPosition = arrayPosition
    this.points = points;

    this.radius = radius
    this.asteroidNode = this.createAsteroid(game);
    this.asteroidNode.speed = speed;
    this.asteroidNode.angle = Math.random() * 360;
    this.asteroidNode.rotationalSpeed = rotationalSpeed;
};

Asteroid.prototype.createAsteroid = function (game) {

    var sphere = makeSphere([0, 0, 0], this.radius, 50, 50, [0, 0, 0]);

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

function SmallAsteroid(arrayPosition, game) {
    Asteroid.call(this, arrayPosition, game, 100, 0.075, 10, 0.4);
};

function MediumAsteroid(arrayPosition, game) {
    Asteroid.call(this, arrayPosition, game, 50, 0.05, 7.5, 0.75);
};

function LargeAsteroid(arrayPosition, game) {
    Asteroid.call(this, arrayPosition, game, 20, 0.01, 5, 1.25);
};

AsteroidSpawner = function (game) {
    var Mat4x4 = matrixHelper.matrix4;

    for (var i = 0; i < (game.wave + 4); i++) {
        var ang = 0

        if (i % 4 === 0) {
            var asteroid = new LargeAsteroid(i, game)
        }
        else if (i % 3 === 0) {
            var asteroid = new MediumAsteroid(i, game)
        }
        else {
            var asteroid = new SmallAsteroid(i, game)
        }

        game.asteroidsArray.push(asteroid)
    }

    var ang = 0

    for (var j = 0; j < game.asteroidsArray.length; j++) {
        game.asteroidsArray[j].asteroidNode.animationCallback = function () {

            x = this.transform[12] + (this.speed * Math.cos(this.angle))
            y = this.transform[13] + (this.speed * Math.sin(this.angle))

            ang += this.rotationalSpeed / 1000;
            Mat4x4.makeRotationY(this.transform, ang);

            this.transform[12] = x;
            this.transform[13] = y;
        }
    }
}

SmallAsteroid.prototype = Object.create(Asteroid.prototype);
MediumAsteroid.prototype = Object.create(Asteroid.prototype);
LargeAsteroid.prototype = Object.create(Asteroid.prototype);

SmallAsteroid.prototype.constructor = SmallAsteroid;
MediumAsteroid.prototype.constructor = MediumAsteroid;
LargeAsteroid.prototype.constructor = LargeAsteroid;
