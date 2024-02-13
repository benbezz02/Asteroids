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

edgeChecker = function (game) {
  var width = 14.5
  var height = 7

  function updateTransformOnEdge(coordinate, size) {
    if (coordinate >= size + 0.1) {
      return -size;
    } else if (coordinate <= -size - 0.1) {
      return size;
    }
    return coordinate;
  }

  for (var asteroid of game.asteroidsArray) {
    asteroid.asteroidNode.transform[12] = updateTransformOnEdge(
      asteroid.asteroidNode.transform[12],
      width,
    );

    asteroid.asteroidNode.transform[13] = updateTransformOnEdge(
      asteroid.asteroidNode.transform[13],
      height,
    );
  }

  for (var saucer of game.saucersArray) {
    saucer.saucerNode.transform[13] = updateTransformOnEdge(
      saucer.saucerNode.transform[13],
      height,
    );

    for (let i = 0; i < saucer.lasersArray.length; i++) {
      if (saucer.lasersArray[i].laserNode.transform[12] >= width || saucer.lasersArray[i].laserNode.transform[12] <= -width) {
        game.scene.removeNode(saucer.lasersArray[i].laserNode);
        saucer.lasersArray.splice(i, 1)
        i--
      } else if (saucer.lasersArray[i].laserNode.transform[13] >= height || saucer.lasersArray[i].laserNode.transform[13] <= -height) {
        game.scene.removeNode(saucer.lasersArray[i].laserNode);
        saucer.lasersArray.splice(i, 1)
        i--
      }
    }
  }
}

var animateNoPlayerGame = function (gl, canvas) {

  var Vec3 = matrixHelper.vector3;
  var Mat4x4 = matrixHelper.matrix4;

  // Set up scene
  scene = new Scene();
  scene.initialise(gl, canvas);

  //Game Set UP
  var game = new Game(gl, scene)
  game.scene.removeNode(game.player.shipNode);
  game.player = null;

  var saucer1 = new LargeSaucer(game)
  var saucer2 = new LargeSaucer(game)

  saucer1.saucerNode.transform[12] = (Math.random() * 26.8 - 13.4).toFixed(1);
  saucer1.saucerNode.transform[13] = 6.9;

  saucer1.saucerNode.animationCallback = function () {
    if (this.transform[12] >= 13 || this.transform[12] <= -13) {
      this.angle = Math.PI - this.angle;
    }

    x = this.transform[12] + (this.speed * Math.cos(this.angle))
    y = this.transform[13] + (this.speed * Math.sin(this.angle))

    this.transform[12] = x;
    this.transform[13] = y;
  }
  game.saucersArray.push(saucer1)

  saucer2.saucerNode.transform[12] = (Math.random() * 26.8 - 13.4).toFixed(1);
  saucer2.saucerNode.transform[13] = 6.9;

  saucer2.saucerNode.animationCallback = function () {
    if (this.transform[12] >= 13 || this.transform[12] <= -13) {
      this.angle = Math.PI - this.angle;
    }

    x = this.transform[12] + (this.speed * Math.cos(this.angle))
    y = this.transform[13] + (this.speed * Math.sin(this.angle))

    this.transform[12] = x;
    this.transform[13] = y;
  }
  game.saucersArray.push(saucer2)

  AsteroidSpawner(game);

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

  var animate = function () {

    if (assetsCounter == assetsLoaded) {
      scene.lookAt(observer, [0, 0, 0], [0, 1, 0]);

      scene.beginFrame();
      scene.animate();
      scene.draw();
      scene.endFrame();

      edgeChecker(game);
    }
    window.requestAnimationFrame(animate);
  };
  // Go!
  animate();
};