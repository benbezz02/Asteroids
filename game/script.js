var game = function (gl, canvas) {

  // Game Set up
  //var player = new Player();

  // Set up scene
  scene = new Scene();
  scene.initialise(gl, canvas);

  // Set up geometry
  var quad = makeQuad(
    [[-0.5, -0.5, 0], [0.5, -0.5, 0], [0.5, 0, 5, 0], [-0.5, 0.5, 0]],
    [[0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1]],
    [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
    [[0, 0], [1, 0], [1, 1], [0, 1]]);

  var model = new Model();
  model.name = "quad";
  model.index = quad.index;
  model.vertex = quad.vertex;
  model.compile(scene);

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

  // Set up textures and materials
  var material = new Material();

  const shipImage = new Image();
  shipImage.src = '/Asteroids/assets/ship_2.png';
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

  // Set up scene graph
  model.material = material;

  var lightNode = scene.addNode(scene.root, light, "lightNode", Node.NODE_TYPE.LIGHT);
  var quadNode = scene.addNode(lightNode, model, "quadNode", Node.NODE_TYPE.MODEL);

  // Set up animation
  var ang = 0;

  quadNode.animationCallback = function (deltaTime) {
    ang += deltaTime / 1000;
    //this.transform[13] = Math.cos(ang) * 3;
  };

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
    theta += 0.01; // Increment rotation angle

    //Mat4x4.makeRotationY(viewTransform, theta);  // rotate camera about y
    //Mat4x4.multiplyPoint(observer, viewTransform, [0, 0, 15]);  // apply camera rotation   
    scene.lookAt(observer, [0, 0, 0], [0, 1, 0]);

    scene.beginFrame();
    scene.animate();
    scene.draw();
    scene.endFrame();

    // window.onkeydown = player.checkForMovement()
    window.requestAnimationFrame(animate);
  };

  // Go!
  animate();
};