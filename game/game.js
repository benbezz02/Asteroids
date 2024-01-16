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