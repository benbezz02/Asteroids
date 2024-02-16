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
    model.name = "heart";
    model.index = quad.index;
    model.vertex = quad.vertex;
    model.compile(game.scene);

    var material = new Material();

    const heartImage = new Image();
    heartImage.src = '/assets/Pack2/redheart.png';
    NewAsset();

    heartImage.onload = () => {
        material.setAlbedo(game.gl, heartImage);
        AssetsLoaded();
    };

    material.setDiffuse([1, 1, 1]);
    material.setShininess(5.0);
    material.setSpecular([1, 1, 1]);
    material.setAmbient([0.2, 0.2, 0.2]);
    material.bind(game.gl, game.scene.shaderProgram);

    model.material = material;
    return game.scene.addNode(game.lightNode, model, "heartNode", Node.NODE_TYPE.MODEL);
}

var makeExplosion = function (game, node) {
    var x = node.transform[12]
    var y = node.transform[13]
    game.scene.removeNode(node);

    var quad = makeQuad(
        [[-0.5, -0.5, 0], [0.5, -0.5, 0], [0.5, 0.5, 0], [-0.5, 0.5, 0]],
        [[0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1]],
        [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
        [[0, 0], [1, 0], [1, 1], [0, 1]]);

    var model = new Model();
    model.name = "explosion";
    model.index = quad.index;
    model.vertex = quad.vertex;
    model.compile(game.scene);

    var i = 0;
    model.material = game.explosionsMaterialArray[i];

    setInterval(function () {
        model.material = game.explosionsMaterialArray[i];
        i++;
    }, 50);

    var explosionNode = game.scene.addNode(game.lightNode, model, "explosionNode", Node.NODE_TYPE.MODEL);
    explosionNode.transform[12] = x
    explosionNode.transform[13] = y

    setInterval(function () {
        game.scene.removeNode(explosionNode);
    }, 350);
}

var fillExplosionsArray = function (game) {
    game.explosionsMaterialArray.push(createMaterialExplosion(game, '/assets/Pack2/Explosion1.png'))
    game.explosionsMaterialArray.push(createMaterialExplosion(game, '/assets/Pack2/Explosion2.png'))
    game.explosionsMaterialArray.push(createMaterialExplosion(game, '/assets/Pack2/Explosion3.png'))
    game.explosionsMaterialArray.push(createMaterialExplosion(game, '/assets/Pack2/Explosion4.png'))
    game.explosionsMaterialArray.push(createMaterialExplosion(game, '/assets/Pack2/Explosion5.png'))
    game.explosionsMaterialArray.push(createMaterialExplosion(game, '/assets/Pack2/Explosion6.png'))
    game.explosionsMaterialArray.push(createMaterialExplosion(game, '/assets/Pack2/Explosion7.png'))
}

var createMaterialExplosion = function (game, imagePath) {
    var material = new Material();

    const shipImage = new Image();
    shipImage.src = imagePath;
    NewAsset();

    shipImage.onload = () => {
        material.setAlbedo(game.gl, shipImage);
        AssetsLoaded();
    };

    material.setDiffuse([1, 1, 1]);
    material.setShininess(8.0);
    material.setSpecular([1, 1, 1]);
    material.setAmbient([0.2, 0.2, 0.2]);
    material.bind(game.gl, game.scene.shaderProgram);

    return material
}

var generateRandomCoordinatesOnEdge = function (customEdges) {
    // Select a random edge of the square (top, bottom, left, or right)
    const edges = customEdges || ['top', 'bottom', 'left', 'right'];
    const edge = edges[Math.floor(Math.random() * edges.length)];

    // Generate random coordinates on the selected edge
    let x, y;
    switch (edge) {
        case 'top':
            x = (Math.random() * 28.8 - 14.4).toFixed(1);
            y = 6.9;
            break;
        case 'bottom':
            x = (Math.random() * 28.8 - 14.4).toFixed(1);
            y = -6.9;
            break;
        case 'left':
            x = -14.4;
            y = (Math.random() * 13.8 - 6.9).toFixed(1);
            break;
        case 'right':
            x = 14.4;
            y = (Math.random() * 13.8 - 6.9).toFixed(1);
            break;
    }
    x = parseFloat(x)
    y = parseFloat(y)
    return { x, y };
}

var BernoulliTrial = function () {
    numSuccess = 0
    numFailure = 0

    for (let i = 0; i < 25; i++) {
        var randomNum = Math.random();

        if (randomNum > 0.5) {
            numSuccess++;
        }
        else {
            numFailure++;
        }
    }

    if (numSuccess > numFailure) {
        return true
    }
    else {
        return false
    }
}