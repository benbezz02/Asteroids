function Asteroid(game, points, speed, rotationalSpeed, radius) {
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
    asteroidImage.src = '/assets/Pack1/black-stone-texture.jpg';
    NewAsset();

    asteroidImage.onload = () => {
        material.setAlbedo(game.gl, asteroidImage);
        AssetsLoaded();
    };

    material.setDiffuse([1, 1, 1]);
    material.setShininess(5.0);
    material.setSpecular([1, 1, 1]);
    material.setAmbient([0.2, 0.2, 0.2]);
    material.bind(game.gl, game.scene.shaderProgram);

    model.material = material;
    return game.scene.addNode(game.lightNode, model, "asteroidNode", Node.NODE_TYPE.MODEL);
}

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
    }


    for (var j = 0; j < game.asteroidsArray.length; j++) {
        let { x, y } = generateRandomCoordinatesOnEdge()
        game.asteroidsArray[j].asteroidNode.transform[12] = x
        game.asteroidsArray[j].asteroidNode.transform[13] = y

        var ang = 0

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

AsteroidDestroyer = function (game, asteroid) {
    var Mat4x4 = matrixHelper.matrix4;

    game.player.score += asteroid.points

    x = asteroid.asteroidNode.transform[12]
    y = asteroid.asteroidNode.transform[13]

    //makeExplosion(game, asteroid.asteroidNode)
    game.scene.removeNode(asteroid.asteroidNode);

    if (asteroid instanceof LargeAsteroid) {
        var asteroid1 = new MediumAsteroid(game)
        var asteroid2 = new MediumAsteroid(game)
    } else if (asteroid instanceof MediumAsteroid) {
        var asteroid1 = new SmallAsteroid(game)
        var asteroid2 = new SmallAsteroid(game)
    } else if (asteroid instanceof SmallAsteroid) {
        return;
    }

    asteroid1.asteroidNode.transform[12] = x
    asteroid1.asteroidNode.transform[13] = y
    asteroid2.asteroidNode.transform[12] = x
    asteroid2.asteroidNode.transform[13] = y

    var ang = 0

    asteroid1.asteroidNode.animationCallback = function () {

        x = this.transform[12] + (this.speed * Math.cos(this.angle))
        y = this.transform[13] + (this.speed * Math.sin(this.angle))

        ang += this.rotationalSpeed / 1000;
        Mat4x4.makeRotationY(this.transform, ang);

        this.transform[12] = x;
        this.transform[13] = y;
    }

    asteroid2.asteroidNode.animationCallback = function () {

        x = this.transform[12] + (this.speed * Math.cos(this.angle))
        y = this.transform[13] + (this.speed * Math.sin(this.angle))

        ang += this.rotationalSpeed / 1000;
        Mat4x4.makeRotationY(this.transform, ang);

        this.transform[12] = x;
        this.transform[13] = y;
    }

    game.asteroidsArray.push(asteroid1)
    game.asteroidsArray.push(asteroid2)
}

function SmallAsteroid(game) {
    Asteroid.call(this, game, 100, 0.075, 10, 0.4);
};

function MediumAsteroid(game) {
    Asteroid.call(this, game, 50, 0.05, 7.5, 0.75);
};

function LargeAsteroid(game) {
    Asteroid.call(this, game, 20, 0.01, 5, 1.25);
};

SmallAsteroid.prototype = Object.create(Asteroid.prototype);
MediumAsteroid.prototype = Object.create(Asteroid.prototype);
LargeAsteroid.prototype = Object.create(Asteroid.prototype);

SmallAsteroid.prototype.constructor = SmallAsteroid;
MediumAsteroid.prototype.constructor = MediumAsteroid;
LargeAsteroid.prototype.constructor = LargeAsteroid;