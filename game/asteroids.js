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
    material.bind(game.gl, game.scene.shaderProgram);

    model.material = material;
    return game.scene.addNode(game.lightNode, model, "asteroidNode", Node.NODE_TYPE.MODEL);
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

SmallAsteroid.prototype = Object.create(Asteroid.prototype);
MediumAsteroid.prototype = Object.create(Asteroid.prototype);
LargeAsteroid.prototype = Object.create(Asteroid.prototype);

SmallAsteroid.prototype.constructor = SmallAsteroid;
MediumAsteroid.prototype.constructor = MediumAsteroid;
LargeAsteroid.prototype.constructor = LargeAsteroid;


generateRandomCoordinatesOnEdge = function () {
    // Select a random edge of the square (top, bottom, left, or right)
    const edges = ['top', 'bottom', 'left', 'right'];
    const edge = edges[Math.floor(Math.random() * edges.length)];

    // Generate random coordinates on the selected edge
    let x, y;
    switch (edge) {
        case 'top':
            x = (Math.random() * 28.8 - 14.4).toFixed(1);
            y = 6.9;
            break;
        case 'bottom':
            x = (Math.random() * 28.8 - 14.4).toFixed(1);
            y = -6.9;
            break;
        case 'left':
            x = -14.4;
            y = (Math.random() * 13.8 - 6.9).toFixed(1);
            break;
        case 'right':
            x = 14.4;
            y = (Math.random() * 13.8 - 6.9).toFixed(1);
            break;
    }
    x = parseFloat(x)
    y = parseFloat(y)
    return { x, y };
}