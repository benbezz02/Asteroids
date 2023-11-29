//--------------------------------------------------------------------------------------------------------//
// Make sphere helper method
//--------------------------------------------------------------------------------------------------------//
function makeSphere(centre, radius, h, v, colour) {
  var vertexList = [], indexList = [];
  for (var i = 0; i <= v + 1; i++) {
    for (var j = 0; j <= h; j++) {
      var theta = 2 * Math.PI * j / h;
      var y = (i / v - 0.5) * 2;
      var r = Math.sqrt(1 - y * y);
      var x = Math.cos(theta) * r;
      var z = Math.sin(theta) * r;
      var point = [x, y, z];

      for (var k = 0; k < 3; k++)
        vertexList[vertexList.length] = point[k] * radius + centre[k];
      for (var k = 0; k < 3; k++)
        vertexList[vertexList.length] = point[k];
      for (var k = 0; k < 3; k++)
        vertexList[vertexList.length] = colour[k];

      vertexList[vertexList.length] = j / h;
      vertexList[vertexList.length] = i / v;
    }
  }

  for (var i = 0; i < v; i++) {
    for (var j = 0; j < h; j++) {
      indexList[indexList.length] = i * h + j;
      indexList[indexList.length] = (i + 1) * h + (j + 1) % h;
      indexList[indexList.length] = i * h + (j + 1) % h;
      indexList[indexList.length] = i * h + j;
      indexList[indexList.length] = (i + 1) * h + j;
      indexList[indexList.length] = (i + 1) * h + (j + 1) % h;
    }
  }

  return { vertex: vertexList, index: indexList };
};

//--------------------------------------------------------------------------------------------------------//
function makeQuad(positions, normals, colours, uvs) {
  var vertexList = [], indexList = [];

  for (var i = 0; i < 4; ++i) {
    for (var k = 0; k < 3; ++k)
      vertexList[vertexList.length] = positions[i][k];
    for (var k = 0; k < 3; ++k)
      vertexList[vertexList.length] = normals[i][k];
    for (var k = 0; k < 3; ++k)
      vertexList[vertexList.length] = colours[i][k];
    for (var k = 0; k < 2; ++k)
      vertexList[vertexList.length] = uvs[i][k];
  }

  indexList[indexList.length] = 0;
  indexList[indexList.length] = 1;
  indexList[indexList.length] = 2;
  indexList[indexList.length] = 0;
  indexList[indexList.length] = 2;
  indexList[indexList.length] = 3;

  return { vertex: vertexList, index: indexList };
};

//--------------------------------------------------------------------------------------------------------//
// Program main entry point
//--------------------------------------------------------------------------------------------------------//
var main = function () {
  // Initialise context (canvas, gl)

  // Get reference to canvas
  var canvas = document.getElementById("canvas-cg-lab");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.aspect = canvas.width / canvas.height;

  // Assign context to gl
  var gl = null;
  try { gl = canvas.getContext("experimental-webgl", { antialias: true }); }
  catch (e) { alert("No webGL compatibility detected!"); return false; }

  //--------------------------------------------------------------------------------------------------------//
  // Game Set up
  //--------------------------------------------------------------------------------------------------------//
  // var player = new Player();

  //--------------------------------------------------------------------------------------------------------//
  // Set up scene
  //--------------------------------------------------------------------------------------------------------//
  scene = new Scene();
  scene.initialise(gl, canvas);

  //--------------------------------------------------------------------------------------------------------//
  // Set up geometry
  //--------------------------------------------------------------------------------------------------------//
  var quad = makeQuad(
    [[-5, -5, 0], [5, -5, 0], [5, 5, 0], [-5, 5, 0]],
    [[0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1]],
    [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
    [[0, 0], [1, 0], [1, 1], [0, 1]]);

  var model = new Model();
  model.name = "quad";
  model.index = quad.index;
  model.vertex = quad.vertex;
  model.compile(scene);

  //--------------------------------------------------------------------------------------------------------//
  // Set up lights
  //--------------------------------------------------------------------------------------------------------//
  var light = new Light();
  //light.type = Light.LIGHT_TYPE.SPOT;
  // light.type = Light.LIGHT_TYPE.POINT;
  light.type = Light.LIGHT_TYPE.DIRECTIONAL;
  light.setDiffuse([2, 2, 2]);
  light.setSpecular([1, 1, 1]);
  light.setAmbient([0.2, 0.2, 0.2]);
  light.setPosition([0, 0, 2.5]);
  light.setDirection([0, 0, -1]);
  light.setCone(0.7, 0.6);
  light.attenuation = Light.ATTENUATION_TYPE.NONE;
  light.bind(gl, scene.shaderProgram, 0);

  //--------------------------------------------------------------------------------------------------------//
  // Set up textures and materials
  //--------------------------------------------------------------------------------------------------------//
  var material = new Material();

  const shipImage = new Image();
  shipImage.src = '/Asteroids/assets/flare.png';
  shipImage.onload = () => {
    //material3.setAlbedo(gl, shipImage);
    console.log("Ship Loaded");
  };

  material.setAlbedo(gl, shipImage);
  material.setDiffuse([1, 1, 1]);
  material.setShininess(8.0);
  material.setSpecular([1, 1, 1]);
  material.setAmbient([0.2, 0.2, 0.2]);
  material.bind(gl, scene.shaderProgram);

  //--------------------------------------------------------------------------------------------------------//
  // Set up scene graph
  //--------------------------------------------------------------------------------------------------------//

  model.material = material;

  var lightNode = scene.addNode(scene.root, light, "lightNode", Node.NODE_TYPE.LIGHT);
  var quadNode = scene.addNode(lightNode, model, "quadNode", Node.NODE_TYPE.MODEL);

  //--------------------------------------------------------------------------------------------------------//
  // Set up animation
  //--------------------------------------------------------------------------------------------------------//
  var ang = 0;

  quadNode.animationCallback = function (deltaTime) {
    ang += deltaTime / 1000;
    this.transform[13] = Math.cos(ang) * 3;
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

  //--------------------------------------------------------------------------------------------------------//
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