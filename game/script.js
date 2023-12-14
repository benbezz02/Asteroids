var assetsCounter = 0;
var assetsLoaded = 0;

var NewAsset = function () {
  assetsCounter += 1;
  return assetsCounter;
}

var AssetsLoaded = function () {
  assetsLoaded += 1;
  return assetsLoaded;
}

var animateGame = function (gl, canvas) {

  var Vec3 = matrixHelper.vector3;
  var Mat4x4 = matrixHelper.matrix4;

  // Set up scene
  scene = new Scene();
  scene.initialise(gl, canvas);

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

  //Game Set UP
  var background = setbackground(gl, scene, '/Asteroids/assets/Space.png')
  var player = new Player(gl, scene)
  var asteroid = new Asteroid(gl, scene, 100)
  var saucer = new Saucer(gl, scene, 100)

  var lightNode = scene.addNode(scene.root, light, "lightNode", Node.NODE_TYPE.LIGHT);

  var nodesArray = new Array()

  var backgroundNode = scene.addNode(lightNode, background, "backgroundNode", Node.NODE_TYPE.MODEL);
  nodesArray.push(backgroundNode)
  Mat4x4.makeTranslation(backgroundNode.transform, [0, 0, -10]);

  var shipNode = scene.addNode(lightNode, player.model, "shipNode", Node.NODE_TYPE.MODEL);
  nodesArray.push(shipNode)

  var asteroidNode = scene.addNode(lightNode, asteroid.model, "asteroidNode", Node.NODE_TYPE.MODEL);
  nodesArray.push(asteroidNode)
  Mat4x4.makeTranslation(asteroidNode.transform, [5, 0, 0]);

  var saucerNode = scene.addNode(lightNode, saucer.model, "saucerNode", Node.NODE_TYPE.MODEL);
  nodesArray.push(saucerNode)
  Mat4x4.makeTranslation(saucerNode.transform, [-5, 0, 0]);

  // Set up animation

  var theta = 0;
  var lightTransform = Mat4x4.create();
  var modelTransform = Mat4x4.create();
  var viewTransform = Mat4x4.create();
  var observer = Vec3.from(0, 0, 25);

  Mat4x4.makeIdentity(viewTransform);
  Mat4x4.makeIdentity(modelTransform);
  Mat4x4.makeIdentity(lightTransform);

  // Set up render loop
  //--------------------------------------------------------------------------------------------------------//
  scene.setViewFrustum(1, 100, 0.5236);
  var animate = function () {
    if (assetsCounter == assetsLoaded) {

      window.addEventListener('keydown', function (event) {
        player.checkForMovement(event, shipNode);
      });

      scene.lookAt(observer, [0, 0, 0], [0, 1, 0]);

      scene.beginFrame();
      scene.animate();
      scene.draw();
      scene.endFrame();

      // Checking edges
      for (var node of nodesArray) {
        if (node.transform[13] >= 7.1) {
          node.transform[13] = -7
        } else if (node.transform[13] <= -7.1) {
          node.transform[13] = 7
        }

        if (node.transform[13] >= 17.1) {
          node.transform[13] = -17
        } else if (node.transform[13] <= -17.1) {
          node.transform[13] = 17
        }
      }
    }
    window.requestAnimationFrame(animate);
  };
  // Go!
  animate();
};