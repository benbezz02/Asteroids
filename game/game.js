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
    this.player.createAnimation()
    this.lifesArray = new Array()

    this.asteroidsArray = new Array()
    this.saucersArray = new Array()
}

Game.prototype.runAllChecks = function () {
    this.AsteroidCollisionChecker()
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
}

Game.prototype.AsteroidCollisionChecker = function () {
    for (let i = 0; i < this.asteroidsArray.length; i++) {
        for (let j = 0; j < this.player.lasersArray.length; j++) {
            let distanceX = Math.pow(this.asteroidsArray[i].asteroidNode.transform[12] - this.player.lasersArray[j].laserNode.transform[12], 2);
            let distanceY = Math.pow(this.asteroidsArray[i].asteroidNode.transform[13] - this.player.lasersArray[j].laserNode.transform[13], 2);
            let distance = Math.sqrt(distanceX + distanceY)

            if (distance <= (0.141 + this.asteroidsArray[i].radius)) {
                this.scene.removeNode(this.player.lasersArray[j].laserNode);
                this.player.lasersArray.splice(j, 1);
                j--;

                var asteroid = this.asteroidsArray[i];
                this.asteroidsArray.splice(i, 1);
                if (i != (this.asteroidsArray.length - 1)) { i--; }

                AsteroidDestroyer(this, asteroid);
            }
        }
    }
}

Game.prototype.LivesChecker = function () {
    if (this.player.lifes <= 0) {
        window.location.href = '/Asteroids/gameover/over.html';
        return
    }

    if (this.lifesArray.length === 0) {
        for (let i = 1; i <= this.player.lifes; i++) {
            var heart = addHeart(this);
            matrixHelper.matrix4.makeTranslation(heart.transform, [-12 + (i * 0.6), 5, 3]);
            this.lifesArray.push(heart)
        }
    }

    this.player.checkAdditionalLife();

    if (this.player.lifes < this.lifesArray.length) {
        var heart = this.lifesArray[this.lifesArray.length - 1]; // no idea why -1 alone is not working
        this.scene.removeNode(heart);
        this.lifesArray.pop()
    } else if (this.player.lifes > this.lifesArray.length) {
        var heart = addHeart(this);
        matrixHelper.matrix4.makeTranslation(heart.transform, [-12 + ((this.player.lifes + 1) * 0.6), 5, 3]);
        this.lifesArray.push(heart)
    }

}

Game.prototype.ScoreWaveChecker = function () {

    document.getElementById('wave').innerText = ("Wave " + this.wave);
    document.getElementById('score').innerText = this.player.score;
}