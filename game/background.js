var setbackground = function (gl, scene, imagePath) {
    var quad = makeQuad(
        [[-20, -10, 0], [20, -10, 0], [20, 10, 0], [-20, 10, 0]],
        [[0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1]],
        [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
        [[0, 0], [1, 0], [1, 1], [0, 1]]);

    var model = new Model();
    model.name = "quad";
    model.index = quad.index;
    model.vertex = quad.vertex;
    model.compile(scene);

    var material = new Material();

    const backgroundImage = new Image();
    backgroundImage.src = imagePath;
    NewAsset();

    backgroundImage.onload = () => {
        material.setAlbedo(gl, backgroundImage.src);
        console.log("Background Loaded");
        AssetsLoaded();
    };

    material.setDiffuse([1, 1, 1]);
    material.setShininess(8.0);
    material.setSpecular([1, 1, 1]);
    material.setAmbient([0.2, 0.2, 0.2]);
    material.bind(gl, scene.shaderProgram);

    model.material = material;
    return model
}