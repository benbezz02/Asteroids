function Game(gl, scene) {
    this.gl = gl
    this.scene = scene

    this.gameSeconds = 0;
    this.gameTime = 0;

    // Set up lights
    var light = new Light();
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

    this.wave = 0
    this.player = new Player(this)

    this.asteroidsArray = new Array()
    this.saucersArray = new Array()
}

Game.prototype.runAllChecks = function () {
    this.AsteroidCollisionChecker()
    this.AsteroidSpawnerChecker()
}

Game.prototype.EdgeChecker = function () {
    var width = 14.5
    var height = 7

    function updateTransformOnEdge(coordinate, size) {
        if (coordinate >= size + 0.1) {
            return -size;
        } else if (coordinate <= -size - 0.1) {
            return size;
        }
        return coordinate;
    }

    // Checking edges
    this.player.shipNode.transform[12] = updateTransformOnEdge(
        this.player.shipNode.transform[12],
        width,
    );

    this.player.shipNode.transform[13] = updateTransformOnEdge(
        this.player.shipNode.transform[13],
        height,
    );

    for (let i = 0; i < this.player.lasersArray.length; i++) {
        if (this.player.lasersArray[i].laserNode.transform[12] >= width || this.player.lasersArray[i].laserNode.transform[12] <= -width) {
            this.player.lasersArray.splice(i, 1)
            i--
        } else if (this.player.lasersArray[i].laserNode.transform[13] >= height || this.player.lasersArray[i].laserNode.transform[13] <= -height) {
            this.player.lasersArray.splice(i, 1)
            i--
        }
    }

    for (var asteroid of this.asteroidsArray) {
        asteroid.asteroidNode.transform[12] = updateTransformOnEdge(
            asteroid.asteroidNode.transform[12],
            width,
        );

        asteroid.asteroidNode.transform[13] = updateTransformOnEdge(
            asteroid.asteroidNode.transform[13],
            height,
        );
    }

    for (var saucer of this.saucersArray) {
        saucer.saucerNode.transform[13] = updateTransformOnEdge(
            saucer.saucerNode.transform[13],
            height,
        );
    }
}

Game.prototype.AsteroidSpawnerChecker = function () {
    if (this.asteroidsArray.length === 0) {
        this.wave += 1;
        AsteroidSpawner(this)
    }
}

Game.prototype.SaucerSpawnChecker = function () {
    var timerInterval = setInterval(() => {
        SaucerSpawner(this)
    }, 10000);
}

Game.prototype.AsteroidCollisionChecker = function () {
    for (let i = 0; i < this.asteroidsArray.length; i++) {
        for (let j = 0; j < this.player.lasersArray.length; j++) {
            let distanceX = Math.abs(this.asteroidsArray[i].asteroidNode.transform[12] - this.player.lasersArray[j].laserNode.transform[12]);
            let distanceY = Math.abs(this.asteroidsArray[i].asteroidNode.transform[13] - this.player.lasersArray[j].laserNode.transform[13]);

            // Check for collision in each dimension 
            if (distanceX <= (0.15 + this.asteroidsArray[i].radius) ||
                distanceY <= (0.15 + this.asteroidsArray[i].radius)) {

                this.asteroidsArray.splice(i, 1);
                this.player.lasersArray.splice(j, 1);

                i--;
                j--;

                console.log(distanceX)
                console.log(distanceY)
                console.log(this.asteroidsArray.length)
            }
        }
    }
}