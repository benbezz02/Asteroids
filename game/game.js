function Game(gl, scene) {
    this.wave = 1
    this.shipNode = null
    this.asteroidsArray = new Array()

    this.gl = gl
    this.scene = scene

    // Set up lights
    var light = new Light();
    //light.type = Light.LIGHT_TYPE.SPOT;
    //light.type = Light.LIGHT_TYPE.POINT;
    light.type = Light.LIGHT_TYPE.DIRECTIONAL;
    light.setDiffuse([2, 2, 2]);
    light.setSpecular([1, 1, 1]);
    light.setAmbient([0.2, 0.2, 0.2]);
    light.setPosition([0, 0, 2.5]);
    light.setDirection([0, 0, -1]);
    light.setCone(0.7, 0.6);
    light.attenuation = Light.ATTENUATION_TYPE.NONE;
    light.bind(gl, scene.shaderProgram, 0);
    this.lightNode = scene.addNode(scene.root, light, "lightNode", Node.NODE_TYPE.LIGHT);
}

Game.prototype.AsteroidSpawner = function () {
    var Mat4x4 = matrixHelper.matrix4;

    for (var i = 0; i < (this.wave + 4); i++) {
        var ang = 0

        if (i % 4 === 0) {
            var asteroid = new LargeAsteroid(this.gl, this.scene)
        }
        else if (i % 3 === 0) {
            var asteroid = new MediumAsteroid(this.gl, this.scene)
        }
        else {
            var asteroid = new SmallAsteroid(this.gl, this.scene)
        }

        console.log(asteroid.angularVel)

        //var asteroidNode = scene.addNode(lightNode, asteroid.model, "asteroidNode" + i, Node.NODE_TYPE.MODEL);
        this.asteroidsArray.push(scene.addNode(this.lightNode, asteroid.model, "asteroidNode" + i, Node.NODE_TYPE.MODEL))
        Mat4x4.makeTranslation(this.asteroidsArray[i].transform, [i, 0, 0]);

        this.asteroidsArray[i].animationCallback = function () {
            ang = asteroid.angularVel;
            this.transform[13] += asteroid.speed;

            var yTransform = Mat4x4.create();
            Mat4x4.makeRotationY(yTransform, ang);

            var copy = Mat4x4.clone(this.transform);

            Mat4x4.multiply(this.transform, copy, yTransform);
        };
    }
}