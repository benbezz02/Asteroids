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

  var game = new Game(gl, scene);

  //Game Set UP
  setbackground(game, '/Asteroids/assets/Space.png')
  var player = new Player(game)
  // var saucer = new Saucer(game, 100)
  //  var ast = new LargeAsteroid(game)

  //var saucerNode = scene.addNode(lightNode, saucer.model, "saucerNode", Node.NODE_TYPE.MODEL);
  //nodesArray.push(saucerNode)
  //Mat4x4.makeTranslation(saucerNode.transform, [-5, 0, 0]);

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
    game.AsteroidSpawnerChecker();

    if (assetsCounter == assetsLoaded) {

      window.addEventListener('keydown', function (event) {
        player.checkForMovement(event, game);
      });

      scene.lookAt(observer, [0, 0, 0], [0, 1, 0]);

      scene.beginFrame();
      scene.animate();
      scene.draw();
      scene.endFrame();

      // Checking edges
      for (var asteroid of game.asteroidsArray) {
        if (asteroid.asteroidNode.transform[13] >= 7.1) {
          asteroid.asteroidNode.transform[13] = -7
        } else if (asteroid.asteroidNode.transform[13] <= -7.1) {
          asteroid.asteroidNode.transform[13] = 7
        }

        if (asteroid.asteroidNode.transform[13] >= 17.1) {
          asteroid.asteroidNode.transform[13] = -17
        } else if (asteroid.asteroidNode.transform[13] <= -17.1) {
          asteroid.asteroidNode.transform[13] = 17
        }
      }

      if (game.shipNode.transform[13] >= 7.1) {
        game.shipNode.transform[13] = -7
      } else if (game.shipNode.transform[13] <= -7.1) {
        game.shipNode.transform[13] = 7
      }

      if (game.shipNode.transform[13] >= 17.1) {
        game.shipNode.transform[13] = -17
      } else if (game.shipNode.transform[13] <= -17.1) {
        game.shipNode.transform[13] = 17
      }
    }
    window.requestAnimationFrame(animate);
  };
  // Go!
  animate();
};