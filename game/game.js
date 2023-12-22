function Game(gl, scene) {
    this.wave = 1
    this.nodesArray = new Array()

    this.gl = gl
    this.scene = scene
}

Game.prototype.AsteroidSpawner = function (lightNode) {
    var Mat4x4 = matrixHelper.matrix4;

    for (var i = 0; i < (this.wave + 4); i++) {
        var asteroid = new Asteroid(this.gl, this.scene, 100)

        var asteroidNode = scene.addNode(lightNode, asteroid.model, "asteroidNode", Node.NODE_TYPE.MODEL);
        this.nodesArray.push(asteroidNode)
        Mat4x4.makeTranslation(asteroidNode.transform, [i, 0, 0]);
    }
}