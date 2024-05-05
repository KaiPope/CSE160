// ColoredPoint.js (c) 2012 matsuda

// const { Matrix4 } = require("three");

// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`


// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform int u_whichTexture;
  void main() {
    if(u_whichTexture == -2){
       gl_FragColor = u_FragColor;
    } else if (u_whichTexture == -1){
       gl_FragColor = vec4(v_UV, 1.0, 1.0);
    } else if(u_whichTexture == 0){
       gl_FragColor = texture2D(u_Sampler0, v_UV);
    } else if (u_whichTexture == 1) {
      gl_FragColor = texture2D(u_Sampler1, v_UV);
    } else {
       gl_FragColor = vec4(1,.2,.2,1);
    }

  }`

//Global Variables
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1;
let u_whichTexture;

function setupWebGL(){
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  // gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preservedDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (!a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix){
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix){
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix){
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix){
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0){
    console.log('Failed to get the storage location of u_Sampler0');
    return;
  }

  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1){
    console.log('Failed to get the storage location of u_Sampler1');
    return;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture){
    console.log('Failed to get the storage location of u_whichTexture');
    return;
  }

  var identityM = new Matrix4();
 
  
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

}

//constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;


//UI Global Variables
let g_selectedColor=[1.0,0.0,0.0,1.0];
// let g_selectedSize=12;
// let g_selectedType=POINT;
// let g_segments=5;
let g_globalAngle = 0;
let g_neckAngle = 0;
let g_headAngle = 0;
let g_tail1Angle = 0;
let g_tail2Angle = 0;
let g_yellowAngle = 0;
let g_magentaAngle = 0;
let g_hoofAngle = 0;
let g_tailAngle = 0;

let g_yellowAnimation = false;
let g_magentaAnimation = false;
let g_hoofAnimation = false;
let g_animation = false;


function addActionsForHtmlUI(){

  document.getElementById('animationOnButton').onclick = function() {g_animation=true};
  document.getElementById('animationOffButton').onclick = function() {g_animation=false};


  document.getElementById('yellowSlide').addEventListener('mousemove', function() { g_yellowAngle = this.value; renderScene();})
  document.getElementById('magentaSlide').addEventListener('mousemove', function() { g_magentaAngle = this.value; renderScene();})
  document.getElementById('hoofSlide').addEventListener('mousemove', function() { g_hoofAngle = this.value; renderScene();})
  document.getElementById('neckSlide').addEventListener('mousemove', function() { g_neckAngle = this.value; renderScene();})

  document.getElementById('angleSlide').addEventListener('mousemove', function() { g_globalAngle = this.value; renderScene();})

}

function initTextures(){

  var image = new Image();
  var image1 = new Image();

  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }
  if (!image1) {
    console.log('Failed to create the image1 object');
    return false;
  }

  image.onload = function() { sendTextureToGLSL0(image); };

  image1.onload = function() { sendTextureToGLSL1(image1); };

  image.src = '/lib/sky2.jpg';
  image1.src = '/lib/snow.jpg';

  return true;

}

function sendTextureToGLSL0(image){

  var texture = gl.createTexture();
  if(!texture){
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

  gl.activeTexture(gl.TEXTURE0);

  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  gl.uniform1i(u_Sampler0, 0);

  console.log('finished loadTexture');
}

function sendTextureToGLSL1(image){

  var texture = gl.createTexture();
  if(!texture){
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

  gl.activeTexture(gl.TEXTURE1);

  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  gl.uniform1i(u_Sampler1, 1);

  console.log('finished loadTexture1');
}

function main() {

  setupWebGL();
  connectVariablesToGLSL();

  addActionsForHtmlUI();

  document.onkeydown = keydown;

  initTextures();


  // Specify the color for clearing <canvas>
  gl.clearColor(0,0,0,1);

  // Clear <canvas>
  // gl.clear(gl.COLOR_BUFFER_BIT);
  //renderAllShapes();
  requestAnimationFrame(tick);
}

function keydown(ev) {
  if(ev.keyCode==39 || ev.keyCode == 68){ // Right Arrow or D
    // g_camera.right();
 } else if (ev.keyCode==37 || ev.keyCode == 65){ // Left Arrow or A
    // g_camera.left();
 } else if (ev.keyCode==38 || ev.keyCode == 87){ // up Arrow or W
    // g_camera.forward();
 } else if (ev.keyCode==40 || ev.keyCode == 83){ // down Arrow or S
    // g_camera.back();
  } //else if (ev.keyCode==81){ // Q
//     g_camera.panLeft();
//  } else if (ev.keyCode==69){ // E
//     g_camera.panRight();
//  }
 renderScene();
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0-g_startTime;

function tick(){
  
  g_seconds = performance.now()/1000.0-g_startTime;
  
  updateAnimationAngles();

  renderScene();

  requestAnimationFrame(tick);
}


function updateAnimationAngles(){
  if(g_animation){

    //legs
    g_yellowAngle = (10*Math.cos(2*g_seconds));
    g_magentaAngle = (-10*Math.cos(2*g_seconds)-10);
    g_hoofAngle = (-5*Math.cos(2*g_seconds)+5);

    //head
    g_neckAngle = (3*Math.cos(2*g_seconds));
    g_headAngle = (2*Math.sin(2*g_seconds));

    //tail
    g_tailAngle = (3*Math.cos(2*g_seconds));

  }
}

function renderScene(){

  var projMat = new Matrix4();
  projMat.setPerspective(60, canvas.width/canvas.height, .1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  var viewMat = new Matrix4();
  viewMat.setLookAt(0,0,-3, 0,0,100, 0,1,0);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  var globalRotMat=new Matrix4().rotate(g_globalAngle,0,1,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  

  renderAllShapes();
}

function renderAllShapes(){

  var startTime = performance.now();

  
  var bodycolor = [0.23, 0.15, 0.06, 1];
  var upLegColor = [0.2, 0.13, 0.05,1];
  var lowLegColor = [0.69, 0.67, 0.64,1];
  var hoofColor = [0.17, 0.18, 0.17,1];
  var hairColor = [0.71, 0.72, 0.5,1];
  var pupilColor = [0,0,0,1];
  var scleraColor = [1,1,1,1];
  var noseColor = [0.12, 0.12, 0.09,1];

  //ground
  var ground = new Cube();
  ground.color=[1,1,1,1];
  ground.textureNum = 1;
  ground.matrix.translate (0,-.75,0);
  ground.matrix.scale(10,0,10);
  ground.matrix.translate(-.5,0,-.5);
  ground.render();

  //sky
  var sky = new Cube();
  sky.color=[1,0,0,1];
  sky.textureNum = 0;
  sky.matrix.scale(50,50,50);
  sky.matrix.translate(-.5,-.5,-.5);
  sky.render();

  // body
  var body = new Cube();
  body.color = bodycolor;
  body.matrix.scale(.4, 0.5, 0.8);
  body.matrix.translate(-.5, -.4, -0.35);
  body.render();

  //tail base
  var tailBase = new Cube();
  tailBase.color = bodycolor;
  //tailBase.matrix.setTranslate(0,0,0);
  var tailCoord = tailBase.matrix;
  tailBase.matrix.rotate(30,1,0,0);
  tailBase.matrix.scale(.08, 0.05, 0.12);
  tailBase.matrix.translate(-.5, 9, 2.2);
  tailBase.render();

  //1st tail segment
  var tail1 = new Cube();
  tail1.color = hairColor;
  tail1.matrix = tailCoord;
  tail1.matrix.setTranslate(-.055,.24,.49);
  tail1.matrix.rotate(-10,1,0,0);
  tail1.matrix.rotate(-g_tailAngle,1,0,0);
  var tail1Coord = new Matrix4(tail1.matrix);
  tail1.matrix.scale(.11, .25, .11);
  tail1.matrix.translate(0,-1,.5);
  tail1.render();

  //2nd tail segment
  var tail2 = new Cube();
  tail2.color = hairColor;
  tail2.matrix = tail1Coord;
  tail2.matrix.translate(0,-.45,.01);
  tail2.matrix.rotate(10,1,0,0);
  //tail2.matrix.rotate(-g_tailAngle,1,0,0);
  tail2.matrix.scale(.11, .25, .11);
  tail2.render();


  //neck
  var neck = new Cube();
  neck.color = bodycolor;
  neck.matrix.setTranslate(0,0,0);
  neck.matrix.rotate(g_neckAngle,1,0,0);
  var neckCoord = new Matrix4(neck.matrix);
  neck.matrix.scale(.2, .4, .25)
  neck.matrix.translate(-.5,.3,-1.2);
  neck.render();

  //head hair
  var headHair = new Cube();
  headHair.color = hairColor;
  headHair.matrix = neckCoord;
  headHair.matrix.scale(.1,.44,.1);
  headHair.matrix.translate(-.45,.6,-.6);
  headHair.render();

  //head
  var head = new Cube();
  head.color = bodycolor;
  //head.matrix = neckCoord;
  head.matrix.rotate(g_neckAngle,1,0,0);
  head.matrix.rotate(g_headAngle,0,1,0);
  head.matrix.scale(.22,.2,.27);
  head.matrix.translate(-.5,2.5,-1.15)
  head.render();

  //rightpupil
  var rPupil = new Cube();
  rPupil.color = pupilColor;
  rPupil.matrix.rotate(g_neckAngle,1,0,0);
  rPupil.matrix.rotate(g_headAngle,0,1,0);
  rPupil.matrix.scale(.01,.05,.05);
  rPupil.matrix.translate(10.2,12,-5);
  rPupil.render();

  //leftpupil
  var lPupil = new Cube();
  lPupil.color = pupilColor;
  lPupil.matrix.rotate(g_neckAngle,1,0,0);
  lPupil.matrix.rotate(g_headAngle,0,1,0);
  lPupil.matrix.scale(.01,.05,.05);
  lPupil.matrix.translate(-11.2,12,-5);
  lPupil.render();


  //rightSclera
  var rSclera = new Cube();
  rSclera.color = scleraColor;
  rSclera.matrix.rotate(g_neckAngle,1,0,0);
  rSclera.matrix.rotate(g_headAngle,0,1,0);
  rSclera.matrix.scale(.01,.05,.05);
  rSclera.matrix.translate(10.2,12,-4);
  rSclera.render();

  //leftSclera
  var lSclera = new Cube();
  lSclera.color = scleraColor;
  lSclera.matrix.rotate(g_neckAngle,1,0,0);
  lSclera.matrix.rotate(g_headAngle,0,1,0);
  lSclera.matrix.scale(.01,.05,.05);
  lSclera.matrix.translate(-11.2,12,-4);
  lSclera.render();

  //snout
  var snout = new Cube();
  snout.color = bodycolor;
  snout.matrix.rotate(g_neckAngle,1,0,0);
  snout.matrix.rotate(g_headAngle,0,1,0);
  snout.matrix.scale(.18,.18,.2);
  snout.matrix.translate(-.5,2.8,-2.5)
  snout.render();

  //left nose
  var lNose = new Cube();
  lNose.color = noseColor;
  lNose.matrix.rotate(g_neckAngle,1,0,0);
  lNose.matrix.rotate(g_headAngle,0,1,0);
  lNose.matrix.scale(.05,.05,.01);
  lNose.matrix.translate(-1.5,12,-50.2);
  lNose.render();
  
  //right nose
  var rNose = new Cube();
  rNose.color = noseColor;
  rNose.matrix.rotate(g_neckAngle,1,0,0);
  rNose.matrix.rotate(g_headAngle,0,1,0);
  rNose.matrix.scale(.05,.05,.01);
  rNose.matrix.translate(.5,12,-50.2);
  rNose.render();

  //mouth
  var mouth = new Cube();
  mouth.color = bodycolor;
  mouth.matrix.rotate(g_neckAngle,1,0,0);
  mouth.matrix.rotate(g_headAngle,0,1,0);
  mouth.matrix.scale(.18,.05,.18);
  mouth.matrix.translate(-.5, 9.1,-2.6)
  mouth.render();

  // upper legs
  var frLeg = new Cube();
  frLeg.color = upLegColor;
  frLeg.matrix.setTranslate(.13, -.03, -.3);
  frLeg.matrix.rotate(-g_yellowAngle, 1, 0, 0); 
  var frCoord = new Matrix4(frLeg.matrix);
  frLeg.matrix.scale(.15, -0.30, 0.15);
  frLeg.matrix.translate(-.5,0,0);
  frLeg.render();

  var flLeg = new Cube();
  flLeg.color = upLegColor;
  flLeg.matrix.setTranslate(-.13, -0.03, -.3);
  flLeg.matrix.rotate(g_yellowAngle, 1, 0, 0);
  var flCoord = new Matrix4(flLeg.matrix);
  flLeg.matrix.scale(.15, -0.3, 0.15);
  flLeg.matrix.translate(-.5,0,0);
  flLeg.render();

  var brLeg = new Cube();
  brLeg.color = upLegColor;
  brLeg.matrix.setTranslate(.13, -.03 , .38);
  brLeg.matrix.rotate(g_yellowAngle, 1, 0, 0);
  var brCoord = new Matrix4(brLeg.matrix);
  brLeg.matrix.scale(.15, -0.30, 0.15);
  brLeg.matrix.translate(-.5,0,0);
  brLeg.render();

  var blLeg = new Cube();
  blLeg.color = upLegColor;
  blLeg.matrix.setTranslate(-.13, -.03, .38);
  blLeg.matrix.rotate(-g_yellowAngle, 1, 0, 0);
  var blCoord = new Matrix4(blLeg.matrix);
  blLeg.matrix.scale(.15, -0.30, 0.15);
  blLeg.matrix.translate(-.5,0,0);
  blLeg.render();

  // lower legs
  var frLow = new Cube();
  frLow.color = lowLegColor;
  frLow.matrix = frCoord;
  frLow.matrix.translate(.055, -.25, .02);
  frLow.matrix.rotate(g_magentaAngle, 1, 0, 0);
  var frLowCoord = new Matrix4(frLow.matrix);
  frLow.matrix.scale(0.11, 0.25, 0.11);
  frLow.matrix.translate(-1, -1, 0);
  frLow.render();

  var flLow = new Cube();
  flLow.color = lowLegColor;
  flLow.matrix = flCoord;
  flLow.matrix.translate(.06, -.25, .015);
  flLow.matrix.rotate(g_magentaAngle, 1, 0, 0);
  var flLowCoord = new Matrix4(flLow.matrix);
  flLow.matrix.scale(0.11, 0.25, 0.11);
  flLow.matrix.translate(-1, -1, 0);
  flLow.render();

  var brLow = new Cube();
  brLow.color = lowLegColor;
  brLow.matrix = brCoord;
  brLow.matrix.translate(.055, -.25, .02);
  brLow.matrix.rotate(g_magentaAngle, 1, 0, 0);
  var brLowCoord = new Matrix4(brLow.matrix);
  brLow.matrix.scale(.11, .25, 0.11);
  brLow.matrix.translate(-1, -1, 0);
  brLow.render();

  var blLow = new Cube();
  blLow.color = lowLegColor;
  blLow.matrix = blCoord;
  blLow.matrix.translate(.06, -.25, 0.02);
  blLow.matrix.rotate(g_magentaAngle, 1, 0, 0);
  var blLowCoord = new Matrix4(blLow.matrix);
  blLow.matrix.scale(0.11, 0.25, 0.11);
  blLow.matrix.translate(-1, -1, 0);
  blLow.render();

  //hooves
  var frHoof = new Cube();
  frHoof.color = hoofColor;
  frHoof.matrix = frLowCoord;
  frHoof.matrix.translate(-.13, -.2 , .13);
  frHoof.matrix.rotate(g_hoofAngle, 1, 0, 0);
  frHoof.matrix.scale(.15, .1, 0.15);
  frHoof.matrix.translate(0, -1,-1);
  frHoof.render();

  var flHoof = new Cube();
  flHoof.color = hoofColor;
  flHoof.matrix = flLowCoord;
  flHoof.matrix.translate(-.13, -.2 , .13);
  flHoof.matrix.rotate(g_hoofAngle, 1, 0, 0);
  flHoof.matrix.scale(.15, .1, 0.15);
  flHoof.matrix.translate(0, -1,-1);
  flHoof.render();

  var brHoof = new Cube();
  brHoof.color = hoofColor;
  brHoof.matrix = brLowCoord;
  brHoof.matrix.translate(-.13, -.2 , .13);
  brHoof.matrix.rotate(g_hoofAngle, 1, 0, 0);
  brHoof.matrix.scale(.15, .1, 0.15);
  brHoof.matrix.translate(0, -1,-1);
  brHoof.render();

  var blHoof = new Cube();
  blHoof.color = hoofColor;
  blHoof.matrix = blLowCoord;
  blHoof.matrix.translate(-.13, -.2 , .13);
  blHoof.matrix.rotate(g_hoofAngle, 1, 0, 0);
  blHoof.matrix.scale(.15, .1, 0.15);
  blHoof.matrix.translate(0, -1,-1);
  blHoof.render();

  var lEar = new triPrism();
  lEar.color = bodycolor;
  lEar.matrix.rotate(g_neckAngle,1,0,0);
  lEar.matrix.rotate(g_headAngle,0,1,0);
  lEar.matrix.translate(0,.68,-.12);
  lEar.matrix.scale(.1,.15,.1);
  lEar.render();

  var rEar = new triPrism();
  rEar.color = bodycolor;
  rEar.matrix.rotate(g_neckAngle,1,0,0);
  rEar.matrix.rotate(g_headAngle,0,1,0);
  rEar.matrix.translate(-.1,.68,-.12);
  rEar.matrix.scale(.1,.15,.1);
  rEar.render();

  var duration = performance.now() - startTime;
  sendTextToHTML("ms: "+ Math.floor(duration)+ " fps: "+ Math.floor(1000/duration), 'numdot')

}

function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if( !htmlElm ){
    console.log("Failed to get", htmlID,"from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}