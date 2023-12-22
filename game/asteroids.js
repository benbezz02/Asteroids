function Asteroid(gl, scene, points) {
    this.points = points;
    this.speed = 0;
    this.angularVel = 0;

    this.model = this.createAsteroid(gl, scene);
};

Asteroid.prototype.createAsteroid = function (gl, scene) {

    var sphere = makeSphere([0, 0, 0], 0.5, 50, 50, [0, 0, 0]);

    var model = new Model();
    model.name = "sphere";
    model.index = sphere.index;
    model.vertex = sphere.vertex;
    model.compile(scene);

    var material = new Material();

    const asteroidImage = new Image();
    asteroidImage.src = '/Asteroids/assets/meteor.png';
    NewAsset();

    asteroidImage.onload = () => {
        material.setAlbedo(gl, asteroidImage);
        console.log("Rock Loaded");
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

function SmallAsteroid(gl, scene) {
    Asteroid.call(this, gl, scene, 100);

    SmallAsteroid.speed = 150;
};

function MediumAsteroid(gl, scene) {
    Asteroid.call(this, gl, scene, 50);
};

function LargeAsteroid(gl, scene) {
    Asteroid.call(this, gl, scene, 20);
};