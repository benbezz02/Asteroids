// Used to not run anything until all Imgaes have been Loaded IN 
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

  // Set up Game 
  var game = new Game(gl, scene);
  setbackground(game, '/assets/Pack2/3d-hyperspace-background-with-warp-tunnel-effect.jpg')

  // Set up animation
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

  var spacebarCounter = 0

  // Start timers
  game.SaucerSpawnChecker();

  // Key Events for Movement
  function handleKeyDown(event) {
    spacebarCounter++;
    game.player.checkForMovement(event, game, spacebarCounter);
  }

  function handleKeyUp(event) {
    game.player.cancelMovement(event, game);
  }

  var animate = function () {
    if (game.player.lives > 0) {
      game.runAllChecks()

      if (assetsCounter == assetsLoaded) {

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        spacebarCounter = 0

        scene.lookAt(observer, [0, 0, 0], [0, 1, 0]);

        scene.beginFrame();
        scene.animate();
        scene.draw();
        scene.endFrame();

        game.EdgeChecker();
      }
    } else {

      // Keeping the Game running in background of Game Over
      if (assetsCounter == assetsLoaded) {
        if (game.player.shipNode.name != null) {
          game.scene.removeNode(game.player.shipNode)
          scoreboard.push(game.player)
          toggleGameOver(game.player.score);
          over();

          window.removeEventListener('keydown', handleKeyDown);
          window.removeEventListener('keyup', handleKeyUp);
        }

        scene.lookAt(observer, [0, 0, 0], [0, 1, 0]);

        scene.beginFrame();
        scene.animate();
        scene.draw();
        scene.endFrame();

        edgeChecker(game);
      }
    }
    animationFrameId = window.requestAnimationFrame(animate)
  };
  // Go!
  animate();
};