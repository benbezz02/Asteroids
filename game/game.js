function Game(gl, scene) {
    this.wave = 0
    this.shipNode = null
    this.asteroidsArray = new Array()
    this.saucersArray = new Array()

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

Game.prototype.AsteroidSpawnerChecker = function () {
    if (this.asteroidsArray.length === 0) {
        this.wave += 1;
        AsteroidSpawner(this)
    }
}