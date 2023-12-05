function Asteroid(gl, scene, points) {
    this.points = points;
    this.speed = 0
    this.angularVel = 0

    this.node = createAsteroid(gl, scene)
};

Player.prototype.createAsteroid = function (gl, scene) {

    var sphere = makeSphere([0, 0, 0], 2, 50, 50, [0, 0, 0]);

    var model = new Model();
    model.name = "sphere";
    model.index = sphere.index;
    model.vertex = sphere.vertex;
    model.compile(scene);

    var material = new Material();

    const shipImage = new Image();
    shipImage.src = '/Asteroids/assets/meteor.png';
    shipImage.onload = () => {
        material.setAlbedo(gl, shipImage.src);
        console.log("Ship Loaded");
        animate();
    };

    //material.setAlbedo(gl, shipImage);
    material.setDiffuse([1, 1, 1]);
    material.setShininess(8.0);
    material.setSpecular([1, 1, 1]);
    material.setAmbient([0.2, 0.2, 0.2]);
    material.bind(gl, scene.shaderProgram);

    model.material = material;
    var asteroidNode = scene.addNode(lightNode, model, "asteroidNode", Node.NODE_TYPE.MODEL);

    return asteroidNode;
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