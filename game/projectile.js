function Projectile(gl, scene) {
    this.speed = 2

    this.model = this.createProjectile(gl, scene);
}

Projectile.prototype.createProjectile = function (gl, scene) {
    var quad = makeQuad(
        [[-0.25, -0.25, 0], [0.25, -0.25, 0], [0.25, 0.25, 0], [-0.25, 0.25, 0]],
        [[0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1]],
        [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
        [[0, 0], [1, 0], [1, 1], [0, 1]]);

    var model = new Model();
    model.name = "quad";
    model.index = quad.index;
    model.vertex = quad.vertex;
    model.compile(scene);

    var material = new Material();

    const projectileImage = new Image();
    projectileImage.src = '/Asteroids/assets/laser.png';
    NewAsset();

    projectileImage.onload = () => {
        material.setAlbedo(gl, projectileImage);
        console.log("Laser Loaded");
        AssetsLoaded();
    };

    material.setDiffuse([1, 1, 1]);
    material.setShininess(8.0);
    material.setSpecular([1, 1, 1]);
    material.setAmbient([0.2, 0.2, 0.2]);
    material.bind(gl, scene.shaderProgram);

    model.material = material;
    return model;
}