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

var game = function (gl, canvas) {

  // Set up scene
  scene = new Scene();
  scene.initialise(gl, canvas);

  // Set up lights
  var light = new Light();
  light.type = Light.LIGHT_TYPE.SPOT;
  //light.type = Light.LIGHT_TYPE.POINT;
  //light.type = Light.LIGHT_TYPE.DIRECTIONAL;
  light.setDiffuse([2, 2, 2]);
  light.setSpecular([1, 1, 1]);
  light.setAmbient([0.2, 0.2, 0.2]);
  light.setPosition([0, 0, 2.5]);
  light.setDirection([0, 0, -1]);
  light.setCone(0.7, 0.6);
  light.attenuation = Light.ATTENUATION_TYPE.NONE;
  light.bind(gl, scene.shaderProgram, 0);

  var player = new Player(gl, scene)

  var lightNode = scene.addNode(scene.root, light, "lightNode", Node.NODE_TYPE.LIGHT);
  var shipNode = scene.addNode(lightNode, player.model, "shipNode", Node.NODE_TYPE.MODEL);

  //var asteroid = new SmallAsteroid(gl, scene)

  // Set up animation


  var Vec3 = matrixHelper.vector3;
  var Mat4x4 = matrixHelper.matrix4;

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
      //Mat4x4.makeRotationY(viewTransform, theta);  // rotate camera about y
      //Mat4x4.multiplyPoint(observer, viewTransform, [0,0,15]);  // apply camera rotation   
      scene.lookAt(observer, [0, 0, 0], [0, 1, 0]);

      scene.beginFrame();
      scene.animate();
      scene.draw();
      scene.endFrame();
    }
    window.requestAnimationFrame(animate);
  };
  // Go!
  animate();
};