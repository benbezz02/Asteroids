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
    this.EdgeChecker()

    // this.AsteroidCollisionChecker()
    this.AsteroidSpawnerChecker()

    // this.SaucerSpawnChecker()
}

Game.prototype.EdgeChecker = function () {
    var width = 17
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

    for (var laser of this.player.lasersArray) {
        if (laser.laserNode.transform[12] >= width) {
            this.player.lasersArray.splice(laser.laserArrayPosition, 1)
        } else if (laser.laserNode.transform[12] <= -width) {
            this.player.lasersArray.splice(laser.laserArrayPosition, 1)
        }

        if (laser.laserNode.transform[13] >= height) {
            this.player.lasersArray.splice(laser.laserArrayPosition, 1)
        } else if (laser.laserNode.transform[13] <= -height) {
            this.player.lasersArray.splice(laser.laserArrayPosition, 1)
        }
    }

    for (var asteroid of this.asteroidsArray) {
        asteroid.asteroidNode.transform[12] = updateTransformOnEdge(
            this.player.shipNode.transform[12],
            width,
        );

        asteroid.asteroidNode.transform[13] = updateTransformOnEdge(
            this.player.shipNode.transform[13],
            height,
        );
    }

    for (var saucer of this.saucersArray) {
        saucer.saucerNode.transform[12] = updateTransformOnEdge(
            this.player.shipNode.transform[12],
            width,
        );

        saucer.saucerNode.transform[13] = updateTransformOnEdge(
            this.player.shipNode.transform[13],
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
    console.log(Math.round((this.gameTime / 1000)))
    if (Math.round((this.gameTime / 1000)) % 10 === 0) {
        if (SaucerSpawner() === true) {
            if (this.player.points < 10000) {
                this.saucersArray.push(new SmallSaucer(this))
            } else {
                this.saucersArray.push(new LargeSaucer(this))
            }
        }
    }
}

Game.prototype.AsteroidCollisionChecker = function () {
    for (var asteroid in this.asteroidsArray) {
        for (var playerLaser in this.player.lasersArray) {
            let closestX = Math.max(cube.minX, Math.min(sphere.x, cube.maxX));
            let closestY = Math.max(cube.minY, Math.min(sphere.y, cube.maxY));
            let closestZ = Math.max(cube.minZ, Math.min(sphere.z, cube.maxZ));

            // Calculate the distance between the closest point on the cube and the sphere's center
            let distanceX = closestX - sphere.x;
            let distanceY = closestY - sphere.y;
            let distanceZ = closestZ - sphere.z;
            let distanceSquared = distanceX * distanceX + distanceY * distanceY + distanceZ * distanceZ;

            // Check if the distance is less than or equal to the sphere's radius
            return distanceSquared <= sphere.radius * sphere.radius;
        }
    }
}