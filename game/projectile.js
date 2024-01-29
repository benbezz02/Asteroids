function Projectile(game, angle, arrayPosition) {
    this.laserArrayPosition = arrayPosition

    this.laserNode = this.createProjectile(game);
    this.laserNode.speed = 0.1;
    this.laserNode.angle = angle
}

Projectile.prototype.createProjectile = function (game) {
    var quad = makeQuad(
        [[-0.15, -0.15, 0], [0.15, -0.15, 0], [0.15, 0.15, 0], [-0.15, 0.15, 0]],
        [[0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1]],
        [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
        [[0, 0], [1, 0], [1, 1], [0, 1]]);

    var model = new Model();
    model.name = "quad";
    model.index = quad.index;
    model.vertex = quad.vertex;
    model.compile(game.scene);

    var material = new Material();

    const projectileImage = new Image();
    projectileImage.src = '/Asteroids/assets/laser.png';
    NewAsset();

    projectileImage.onload = () => {
        material.setAlbedo(game.gl, projectileImage);
        console.log("Laser Loaded");
        AssetsLoaded();
    };

    material.setDiffuse([1, 1, 1]);
    material.setShininess(8.0);
    material.setSpecular([1, 1, 1]);
    material.setAmbient([0.2, 0.2, 0.2]);
    material.bind(game.gl, game.scene.shaderProgram);

    model.material = material;
    return game.scene.addNode(game.lightNode, model, "laserNode", Node.NODE_TYPE.MODEL);
}