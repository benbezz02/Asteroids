//--------------------------------------------------------------------------------------------------------//
// Make sphere helper method
//--------------------------------------------------------------------------------------------------------//
function makeSphere(centre, radius, h, v, colour)
{
  var vertexList = [], indexList = [];
  for (var i = 0; i <= v + 1; i++) {
    for (var j = 0; j <= h; j++) {
      var theta = 2 * Math.PI * j / h;
      var y = (i / v - 0.5) * 2;
      var r = Math.sqrt(1 - y * y);
      var x = Math.cos(theta) * r; 
      var z = Math.sin(theta) * r;
      var point = [x, y, z];

      for (var k=0; k<3; k++)
        vertexList[vertexList.length] = point[k] * radius + centre[k];
      for (var k=0; k<3; k++)
        vertexList[vertexList.length] = point[k];
      for (var k=0; k<3; k++)
        vertexList[vertexList.length] = colour[k];

      vertexList[vertexList.length] = j/h;
      vertexList[vertexList.length] = i/v;
  }}
  
  for (var i = 0; i < v; i++) {
    for (var j = 0; j < h; j++) {
      indexList[indexList.length] = i * h + j;
      indexList[indexList.length] = (i + 1) * h + (j + 1) % h;
      indexList[indexList.length] = i * h + (j + 1) % h;
      indexList[indexList.length] = i * h + j;
      indexList[indexList.length] = (i + 1) * h + j;
      indexList[indexList.length] = (i + 1) * h + (j + 1) % h;
  }}

  return {vertex : vertexList, index : indexList};
};

//--------------------------------------------------------------------------------------------------------//
function makeQuad(positions, normals, colours, uvs)
{
  var vertexList = [], indexList = [];

  for (var i = 0; i < 4; ++i)
  {
    for (var k = 0; k<3; ++k)
     vertexList[vertexList.length] = positions[i][k];
    for (var k = 0; k<3; ++k)
     vertexList[vertexList.length] = normals[i][k];
    for (var k = 0; k<3; ++k)
     vertexList[vertexList.length] = colours[i][k];
    for (var k = 0; k<2; ++k)
     vertexList[vertexList.length] = uvs[i][k];
  }

  indexList[indexList.length] = 0;
  indexList[indexList.length] = 1;
  indexList[indexList.length] = 2;
  indexList[indexList.length] = 0;
  indexList[indexList.length] = 2;
  indexList[indexList.length] = 3;

  return {vertex : vertexList, index : indexList};
};

//--------------------------------------------------------------------------------------------------------//
// Program main entry point
//--------------------------------------------------------------------------------------------------------//
var main=function() 
{
  // Initialise context (canvas, gl)

  // Get reference to canvas
  var canvas = document.getElementById("canvas-cg-lab");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.aspect = canvas.width / canvas.height;

  // Assign context to gl
  var gl = null;
  try { gl = canvas.getContext("experimental-webgl", {antialias: true}); }
  catch (e) {alert("No webGL compatibility detected!"); return false;}

  //--------------------------------------------------------------------------------------------------------//
  // Set up scene
  //--------------------------------------------------------------------------------------------------------//
  scene = new Scene();
  scene.initialise(gl, canvas);

  //--------------------------------------------------------------------------------------------------------//
  // Set up geometry
  //--------------------------------------------------------------------------------------------------------//
  var sphere = makeSphere([0,0,0], 2, 50, 50, [0,0,0]);

  // Create two objects, reusing the same model geometry
  var model = new Model();
  model.name = "sphere";
  model.index = sphere.index;
  model.vertex = sphere.vertex;
  model.compile(scene);

  var model2 = new Model();
  model2.name = "sphere2";
  model2.index = sphere.index;
  model2.vertex = sphere.vertex;
  model2.compile(scene);

  var quad = makeQuad(
    [[-5, -5, 0], [5, -5, 0], [5, 5, 0], [-5, 5, 0]],
    [[0,0,1], [0,0,1], [0,0,1], [0,0,1]],
    [[0,0,0], [0,0,0], [0,0,0], [0,0,0]],
    [[0,0], [1,0], [1,1], [0,1]]);

  var model3 = new Model();
  model3.name = "quad";
  model3.index = quad.index;
  model3.vertex = quad.vertex;
  model3.compile(scene);

  //--------------------------------------------------------------------------------------------------------//
  // Set up lights
  //--------------------------------------------------------------------------------------------------------//
  var light = new Light();
  //light.type = Light.LIGHT_TYPE.SPOT;
  light.type = Light.LIGHT_TYPE.POINT;
  //light.type = Light.LIGHT_TYPE.DIRECTIONAL;
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
  var textureList = new Textures();
  var material = new Material();

  material.setAlbedo(gl, textureList.venus);
  material.setShininess(96.0);
  material.setSpecular([1,1,1]);
  material.setAmbient([1,1,1]);
  material.setDiffuse([1,1,1]);
  material.bind(gl, scene.shaderProgram);

  var material2 = new Material();

  material2.setAlbedo(gl, textureList.earth);
  material2.setDiffuse([1,1,1]);
  material2.setShininess(0.0);
  material2.setSpecular([0,0,0]);
  material2.setAmbient([1,1,1]);
  material2.bind(gl, scene.shaderProgram);

  var material3 = new Material();

  material3.setAlbedo(gl, textureList.earth);
  material3.setDiffuse([1,1,1]);
  material3.setShininess(8.0);
  material3.setSpecular([1,1,1]);
  material3.setAmbient([0.2,0.2,0.2]);
  material3.bind(gl, scene.shaderProgram);

  //--------------------------------------------------------------------------------------------------------//
  // Set up scene graph
  //--------------------------------------------------------------------------------------------------------//
  model.material = material;
  model2.material = material2;
  model3.material = material3;

  var lightNode = scene.addNode(scene.root, light, "lightNode", Node.NODE_TYPE.LIGHT);
  var sphereNode = scene.addNode(lightNode, model, "sphereNode", Node.NODE_TYPE.MODEL);
  var sphereNode2 = scene.addNode(sphereNode, model2, "sphereNode2", Node.NODE_TYPE.MODEL);
  // var quadNode = scene.addNode(lightNode, model3, "quadNode", Node.NODE_TYPE.MODEL);

  //--------------------------------------------------------------------------------------------------------//
  // Set up animation
  //--------------------------------------------------------------------------------------------------------//
  var ang = 0;

  sphereNode2.animationCallback = function(deltaTime) {
    ang += deltaTime / 1000;
    this.transform[13] = Math.cos(ang) * 3;
  };

  // quadNode.animationCallback = function(deltaTime) {
  //   ang += deltaTime / 1000;
  //   this.transform[13] = Math.cos(ang) * 3;
  // };

  var Vec3 = matrixHelper.vector3;
  var Mat4x4 = matrixHelper.matrix4;

  var theta = 0;
  var lightTransform = Mat4x4.create();
  var modelTransform = Mat4x4.create(); 
  var viewTransform = Mat4x4.create(); 
  var observer = Vec3.from(0,0,25);

  Mat4x4.makeIdentity(viewTransform);
  Mat4x4.makeIdentity(modelTransform);
  Mat4x4.makeIdentity(lightTransform);

  //--------------------------------------------------------------------------------------------------------//
  // Set up render loop
  //--------------------------------------------------------------------------------------------------------//

  scene.setViewFrustum(1, 100, 0.5236);

  var animate=function() 
  {
    theta += 0.01; // Increment rotation angle

    Mat4x4.makeTranslation(sphereNode2.transform, [10,0,0]);

    Mat4x4.makeRotationY(viewTransform, theta);  // rotate camera about y
    Mat4x4.multiplyPoint(observer, viewTransform, [0,0,15]);  // apply camera rotation   
    scene.lookAt(observer, [0,0,0], [0,1,0]);

    scene.beginFrame();
    scene.animate();
    scene.draw();
    scene.endFrame();

    window.requestAnimationFrame(animate);
  };

  // Go!
  animate();
};