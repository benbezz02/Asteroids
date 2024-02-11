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

var animateModernGame = function (gl, canvas) {

  var Vec3 = matrixHelper.vector3;
  var Mat4x4 = matrixHelper.matrix4;

  // Set up scene
  scene = new Scene();
  scene.initialise(gl, canvas);

  var game = new Game(gl, scene);

  //Game Set UP
  // setbackground(game, '/Asteroids/assets/Space.png')

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

  var animate = function () {
    game.runAllChecks()

    if (assetsCounter == assetsLoaded) {

      window.addEventListener('keydown', function (event) {
        spacebarCounter++
        game.player.checkForMovement(event, game, spacebarCounter);
      });
      window.addEventListener('keyup', function (event) {
        game.player.cancelMovement(event);
      });
      spacebarCounter = 0

      scene.lookAt(observer, [0, 0, 0], [0, 1, 0]);

      scene.beginFrame();
      scene.animate();
      scene.draw();
      scene.endFrame();

      game.EdgeChecker();
    }
    window.requestAnimationFrame(animate);
  };
  // Go!
  animate();
};