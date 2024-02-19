function Game(gl, scene) {
    this.gl = gl
    this.scene = scene

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
    this.livesArray = new Array()

    this.asteroidsArray = new Array()
    this.saucersArray = new Array()

    this.explosionsMaterialArray = new Array()
    fillExplosionsArray(this)
}

Game.prototype.runAllChecks = function () {
    this.AsteroidCollisionChecker()
    this.SaucerCollisionChecker()
    this.PlayerCollisionChecker()
    this.AsteroidSpawnerChecker()
    this.LivesChecker()
    this.ScoreWaveChecker()
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
            this.scene.removeNode(this.player.lasersArray[i].laserNode);
            this.player.lasersArray.splice(i, 1)
            i--
        } else if (this.player.lasersArray[i].laserNode.transform[13] >= height || this.player.lasersArray[i].laserNode.transform[13] <= -height) {
            this.scene.removeNode(this.player.lasersArray[i].laserNode);
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

        for (let i = 0; i < saucer.lasersArray.length; i++) {
            if (saucer.lasersArray[i].laserNode.transform[12] >= width || saucer.lasersArray[i].laserNode.transform[12] <= -width) {
                this.scene.removeNode(saucer.lasersArray[i].laserNode);
                saucer.lasersArray.splice(i, 1)
                i--
            } else if (saucer.lasersArray[i].laserNode.transform[13] >= height || saucer.lasersArray[i].laserNode.transform[13] <= -height) {
                this.scene.removeNode(saucer.lasersArray[i].laserNode);
                saucer.lasersArray.splice(i, 1)
                i--
            }
        }
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

Game.prototype.PlayerCollisionChecker = function () {
    for (let i = 0; i < this.asteroidsArray.length; i++) {
        let distanceX = Math.pow(this.asteroidsArray[i].asteroidNode.transform[12] - this.player.shipNode.transform[12], 2);
        let distanceY = Math.pow(this.asteroidsArray[i].asteroidNode.transform[13] - this.player.shipNode.transform[13], 2);
        let distance = Math.sqrt(distanceX + distanceY)

        if ((distance <= (0.7 + this.asteroidsArray[i].radius)) && (this.player.isHittable === true)) {
            this.player.getsHit();
            AsteroidDestroyer(this, this.asteroidsArray[i]);
            this.asteroidsArray.splice(i, 1);
            i--;
        }
    }

    for (let i = 0; i < this.saucersArray.length; i++) {
        let distanceX = Math.pow(this.saucersArray[i].saucerNode.transform[12] - this.player.shipNode.transform[12], 2);
        let distanceY = Math.pow(this.saucersArray[i].saucerNode.transform[13] - this.player.shipNode.transform[13], 2);
        let distance = Math.sqrt(distanceX + distanceY)

        if ((distance <= (0.7 + 0.5)) && (this.player.isHittable === true)) {
            this.player.getsHit();
            SaucerDestroyer(this, this.saucersArray[i]);
            this.saucersArray.splice(i, 1);
            i--;
        }

        let saucer = this.saucersArray[i]

        for (let j = 0; j < saucer.lasersArray.length; j++) {
            let DistanceX = Math.pow(saucer.lasersArray[j].laserNode.transform[12] - this.player.shipNode.transform[12], 2);
            let DistanceY = Math.pow(saucer.lasersArray[j].laserNode.transform[13] - this.player.shipNode.transform[13], 2);
            let Distance = Math.sqrt(DistanceX + DistanceY)

            if ((Distance <= (0.7 + 0.141)) && (this.player.isHittable === true)) {
                this.player.getsHit();
                this.player.score += this.saucersArray[i].points;
                this.scene.removeNode(this.saucersArray[i].lasersArray[j].laserNode);
                this.saucersArray[i].lasersArray.splice(j, 1);
                i--;
            }
        }

    }
}

Game.prototype.AsteroidCollisionChecker = function () {
    for (let i = 0; i < this.asteroidsArray.length; i++) {

        var asteroid = this.asteroidsArray[i];
        if (asteroid != null) {
            for (let j = 0; j < this.player.lasersArray.length; j++) {


                let distanceX = Math.pow(asteroid.asteroidNode.transform[12] - this.player.lasersArray[j].laserNode.transform[12], 2);
                let distanceY = Math.pow(asteroid.asteroidNode.transform[13] - this.player.lasersArray[j].laserNode.transform[13], 2);
                let distance = Math.sqrt(distanceX + distanceY)

                if (distance <= (0.141 + asteroid.radius)) {
                    if (asteroid instanceof SmallAsteroid) {
                        makeExplosion(this, this.player.lasersArray[j].laserNode)
                    } else {
                        this.scene.removeNode(this.player.lasersArray[j].laserNode);
                    }
                    this.player.lasersArray.splice(j, 1);
                    j--;

                    AsteroidDestroyer(this, this.asteroidsArray[i]);
                    this.asteroidsArray.splice(i, 1);
                    i--;
                }
            }



            for (let j = 0; j < this.saucersArray.length; j++) {
                let distanceX = Math.pow(this.saucersArray[j].saucerNode.transform[12] - this.asteroidsArray[i].asteroidNode.transform[12], 2);
                let distanceY = Math.pow(this.saucersArray[j].saucerNode.transform[13] - this.asteroidsArray[i].asteroidNode.transform[13], 2);
                let distance = Math.sqrt(distanceX + distanceY)

                if ((distance <= (this.asteroidsArray[i].radius + 0.5))) {
                    SaucerDestroyer(this, this.saucersArray[j]);
                    this.saucersArray.splice(j, 1);
                    j--;

                    var asteroid = this.asteroidsArray[i];
                    this.asteroidsArray.splice(i, 1);
                    if (i != (this.asteroidsArray.length - 1)) { i--; }

                    AsteroidDestroyer(this, asteroid);
                }

                let saucer = this.saucersArray[j]

                if (saucer != null) {
                    for (let k = 0; k < saucer.lasersArray.length; k++) {
                        let DistanceX = Math.pow(saucer.lasersArray[k].laserNode.transform[12] - this.asteroidsArray[i].asteroidNode.transform[12], 2);
                        let DistanceY = Math.pow(saucer.lasersArray[k].laserNode.transform[13] - this.asteroidsArray[i].asteroidNode.transform[13], 2);
                        let Distance = Math.sqrt(DistanceX + DistanceY)

                        if ((Distance <= (this.asteroidsArray[i].radius + 0.141))) {
                            AsteroidDestroyer(this, asteroid);
                            this.asteroidsArray.splice(i, 1);
                            i--;

                            this.scene.removeNode(this.saucersArray[j].lasersArray[k].laserNode);
                            this.saucersArray[j].lasersArray.splice(k, 1);
                            k--;
                        }
                    }
                }

            }
        }
    }
}

Game.prototype.SaucerCollisionChecker = function () {
    for (let i = 0; i < this.saucersArray.length; i++) {

        var saucer = this.saucersArray[i]
        if (saucer != null) {
            for (let j = 0; j < this.player.lasersArray.length; j++) {
                let distanceX = Math.pow(saucer.saucerNode.transform[12] - this.player.lasersArray[j].laserNode.transform[12], 2);
                let distanceY = Math.pow(saucer.saucerNode.transform[13] - this.player.lasersArray[j].laserNode.transform[13], 2);
                let distance = Math.sqrt(distanceX + distanceY)

                if (distance <= (0.5 + 0.141)) {
                    this.scene.removeNode(this.player.lasersArray[j].laserNode);
                    this.player.lasersArray.splice(j, 1);
                    j--;

                    SaucerDestroyer(this, this.saucersArray[i]);
                    this.saucersArray.splice(i, 1);
                    i--;
                }
            }
        }

    }
}

Game.prototype.LivesChecker = function () {
    if (this.livesArray.length === 0) {
        for (let i = 1; i <= this.player.lives; i++) {
            var heart = addHeart(this);
            matrixHelper.matrix4.makeTranslation(heart.transform, [-12 + (i * 0.6), 5, 3]);
            this.livesArray.push(heart)
        }
    }

    this.player.checkAdditionalLife();

    if (this.player.lives < this.livesArray.length) {
        var heart = this.livesArray[this.livesArray.length - 1]; // no idea why -1 alone is not working
        this.scene.removeNode(heart);
        this.livesArray.pop()
    } else if (this.player.lives > this.livesArray.length) {
        var heart = addHeart(this);
        matrixHelper.matrix4.makeTranslation(heart.transform, [-12 + ((this.player.lives) * 0.6), 5, 3]);
        this.livesArray.push(heart)
    }
}

Game.prototype.ScoreWaveChecker = function () {
    document.getElementById('wave').innerText = ("Wave " + this.wave);
    document.getElementById('score').innerText = this.player.score;
}