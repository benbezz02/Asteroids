var setbackground = function (game, imagePath) {
    var quad = makeQuad(
        [[-20, -10, 0], [20, -10, 0], [20, 10, 0], [-20, 10, 0]],
        [[0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1]],
        [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
        [[0, 0], [1, 0], [1, 1], [0, 1]]);

    var model = new Model();
    model.name = "quad";
    model.index = quad.index;
    model.vertex = quad.vertex;
    model.compile(game.scene);

    var material = new Material();

    const backgroundImage = new Image();
    backgroundImage.src = imagePath;
    NewAsset();

    backgroundImage.onload = () => {
        material.setAlbedo(game.gl, backgroundImage);
        console.log("Background Loaded");
        AssetsLoaded();
    };

    material.setDiffuse([1, 1, 1]);
    material.setShininess(5.0);
    material.setSpecular([1, 1, 1]);
    material.setAmbient([0.2, 0.2, 0.2]);
    material.bind(game.gl, scene.shaderProgram);

    model.material = material;

    var backgroundNode = scene.addNode(game.lightNode, model, "backgroundNode", Node.NODE_TYPE.MODEL);
    matrixHelper.matrix4.makeTranslation(backgroundNode.transform, [0, 0, -10]);
}

var addHeart = function (game) {
    var quad = makeQuad(
        [[-0.25, -0.25, 0], [0.25, -0.25, 0], [0.25, 0.25, 0], [-0.25, 0.25, 0]],
        [[0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1]],
        [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
        [[0, 0], [1, 0], [1, 1], [0, 1]]);

    var model = new Model();
    model.name = "quad";
    model.index = quad.index;
    model.vertex = quad.vertex;
    model.compile(game.scene);

    var material = new Material();

    const heartImage = new Image();
    heartImage.src = '/Asteroids/assets/Pack2/redheart.png';
    NewAsset();

    heartImage.onload = () => {
        material.setAlbedo(game.gl, heartImage);
        console.log("Heart Loaded");
        AssetsLoaded();
    };

    material.setDiffuse([1, 1, 1]);
    material.setShininess(5.0);
    material.setSpecular([1, 1, 1]);
    material.setAmbient([0.2, 0.2, 0.2]);
    material.bind(game.gl, game.scene.shaderProgram);

    model.material = material;

    return game.scene.addNode(game.lightNode, model, "backgroundNode", Node.NODE_TYPE.MODEL);
}