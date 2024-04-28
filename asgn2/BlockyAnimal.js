// ColoredPoint.js (c) 2012 matsuda

// const { Matrix4 } = require("three");

// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }`


// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`

//Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
  

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

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
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

let g_yellowAnimation = false;
let g_magentaAnimation = false;
let g_hoofAnimation = false;
let g_animation = false;


function addActionsForHtmlUI(){

  // document.getElementById('animationMagentaOnButton').onclick = function() {g_magentaAnimation=true};
  // document.getElementById('animationMagentaOffButton').onclick = function() {g_magentaAnimation=false};

  // document.getElementById('animationYellowOnButton').onclick = function() {g_yellowAnimation=true};
  // document.getElementById('animationYellowOffButton').onclick = function() {g_yellowAnimation=false};

  document.getElementById('animationOnButton').onclick = function() {g_animation=true};
  document.getElementById('animationOffButton').onclick = function() {g_animation=false};


  document.getElementById('yellowSlide').addEventListener('mousemove', function() { g_yellowAngle = this.value; renderAllShapes();})
  document.getElementById('magentaSlide').addEventListener('mousemove', function() { g_magentaAngle = this.value; renderAllShapes();})
  document.getElementById('neckSlide').addEventListener('mousemove', function() { g_neckAngle = this.value; renderAllShapes();})

  document.getElementById('angleSlide').addEventListener('mousemove', function() { g_globalAngle = this.value; renderAllShapes();})

}

function main() {

  setupWebGL();
  connectVariablesToGLSL();

  addActionsForHtmlUI();

  // Specify the color for clearing <canvas>
  gl.clearColor(0.27, 0.5, 0.16,1);

  // Clear <canvas>
  // gl.clear(gl.COLOR_BUFFER_BIT);
  //renderAllShapes();
  requestAnimationFrame(tick);
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0-g_startTime;

function tick(){
  
  g_seconds = performance.now()/1000.0-g_startTime;
  
  updateAnimationAngles();

  renderAllShapes();

  requestAnimationFrame(tick);
}


function updateAnimationAngles(){
  if(g_animation){

    //legs
    g_yellowAngle = (10*Math.cos(g_seconds));
    g_magentaAngle = (5*Math.sin(g_seconds));
    g_hoofAngle = (5*Math.sin(g_seconds));

    //head
    g_neckAngle = (3*Math.cos(g_seconds));
    g_HeadAngle = (2*Math.cos(g_seconds));


    //tail



  }
}

function renderAllShapes(){
  
  var startTime = performance.now();

  var globalRotMat=new Matrix4().rotate(g_globalAngle,0,1,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // var eye = new Sphere();
  // eye.color = [1,1,0,1];
  // eye.matrix.translate(-.8,-.5,0);
  // eye .matrix.scale(1.5,1.5,1.5);
  // eye.render();

  var bodycolor = [0.23, 0.15, 0.06, 1];
  var upLegColor = [0.2, 0.13, 0.05,1];
  var lowLegColor = [0.69, 0.67, 0.64,1];
  var hoofColor = [0.17, 0.18, 0.17,1];
  var hairColor = [0.71, 0.72, 0.5,1];
  var pupilColor = [0,0,0,1];
  var scleraColor = [1,1,1,1];
  var noseColor = [0.12, 0.12, 0.09,1];


  //body
  var body = new Cube();
  body.color = bodycolor;
  body.matrix.scale(.4, 0.5, 0.8);
  body.matrix.translate(-.5, -.4, -0.35);
  body.render();

  //tail base
  var tailBase = new Cube();
  tailBase.color = bodycolor;
  tailBase.matrix.rotate(0,0,0,1);
  tailBase.matrix.scale(.08, 0.05, 0.15);
  tailBase.matrix.translate(0, 5, 3);
  tailBase.render();

  //1st tail segment
  var tail1 = new Cube();
  tail1.color = hairColor;
  tail1.matrix.setTranslate(0, 0, 0);
  tail1.matrix.rotate(30,-50,0,1);
  tail1.matrix.scale(.11, .25, .11);
  tail1.matrix.translate(-.5,0,5);
  
  tail1.render();

  //2nd tail segment
  var tail2 = new Cube();
  tail2.color = hairColor;
  tail2.matrix.rotate(0,0,0,1);
  tail2.matrix.scale(.11, .25, .11);
  tail2.matrix.translate(-.5,-1,5);
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
  headHair.matrix.rotate(0,0,0,1);
  headHair.matrix.scale(.1,.44,.1);
  headHair.matrix.translate(-.45,.6,-.6);
  headHair.render();

  //head
  var head = new Cube();
  head.color = bodycolor;
  head.matrix = neckCoord;
  head.matrix.rotate(0,0,0,1);
  head.matrix.scale(.22,.2,.27);
  head.matrix.translate(-.5,2.5,-1.15)
  head.render();

  //rightpupil
  var rPupil = new Cube();
  rPupil.color = pupilColor;
  rPupil.matrix.rotate(0,0,0,1);
  rPupil.matrix.scale(.01,.05,.05);
  rPupil.matrix.translate(10.2,12,-5);
  rPupil.render();

  //leftpupil
  var lPupil = new Cube();
  lPupil.color = pupilColor;
  lPupil.matrix.rotate(0,0,0,1);
  lPupil.matrix.scale(.01,.05,.05);
  lPupil.matrix.translate(-11.2,12,-5);
  lPupil.render();


  //rightSclera
  var rSclera = new Cube();
  rSclera.color = scleraColor;
  rSclera.matrix.rotate(0,0,0,1);
  rSclera.matrix.scale(.01,.05,.05);
  rSclera.matrix.translate(10.2,12,-4);
  rSclera.render();

  //leftSclera
  var lSclera = new Cube();
  lSclera.color = scleraColor;
  lSclera.matrix.rotate(0,0,0,1);
  lSclera.matrix.scale(.01,.05,.05);
  lSclera.matrix.translate(-11.2,12,-4);
  lSclera.render();

  //snout
  var snout = new Cube();
  snout.color = bodycolor;
  snout.matrix.rotate(0,0,0,1);
  snout.matrix.scale(.18,.18,.2);
  snout.matrix.translate(-.5,2.8,-2.5)
  snout.render();

  //left nose
  var lNose = new Cube();
  lNose.color = noseColor;
  lNose.matrix.rotate(0,0,0,1);
  lNose.matrix.scale(.05,.05,.01);
  lNose.matrix.translate(-1.5,12,-50.2);
  lNose.render();
  
  //right nose
  var rNose = new Cube();
  rNose.color = noseColor;
  rNose.matrix.rotate(0,0,0,1);
  rNose.matrix.scale(.05,.05,.01);
  rNose.matrix.translate(.5,12,-50.2);
  rNose.render();

  //mouth
  var mouth = new Cube();
  mouth.color = bodycolor;
  mouth.matrix.rotate(0,0,0,1);
  mouth.matrix.scale(.18,.05,.18);
  mouth.matrix.translate(-.5, 9.1,-2.6)
  mouth.render();

  // upper legs
  var frLeg = new Cube();
  frLeg.color = upLegColor;
  frLeg.matrix.setTranslate(0, 0, 0);
  frLeg.matrix.rotate(-g_yellowAngle, 1, 0, 0); 
  var frCoord = new Matrix4(frLeg.matrix);
  frLeg.matrix.scale(.15, -0.30, 0.15);
  frLeg.matrix.translate(.35, .1, -1.9);
  frLeg.render();

  var flLeg = new Cube();
  flLeg.color = upLegColor;
  flLeg.matrix.setTranslate(0, 0, 0);
  flLeg.matrix.rotate(g_yellowAngle, 1, 0, 0);
  var flCoord = new Matrix4(flLeg.matrix);
  flLeg.matrix.scale(.15, -0.3, 0.15);
  flLeg.matrix.translate(-1.35, .1, -1.9);
  flLeg.render();

  var brLeg = new Cube();
  brLeg.color = upLegColor;
  brLeg.matrix.setTranslate(0, 0, 0);
  brLeg.matrix.rotate(-g_yellowAngle, 1, 0, 0);
  var brCoord = new Matrix4(brLeg.matrix);
  brLeg.matrix.scale(.15, -0.30, 0.15);
  brLeg.matrix.translate(.4, .1, 2.5);
  
  brLeg.render();

  var blLeg = new Cube();
  blLeg.color = upLegColor;
  blLeg.matrix.setTranslate(0, 0, 0);
  blLeg.matrix.rotate(-g_yellowAngle, 1, 0, 0);
  var blCoord = new Matrix4(blLeg.matrix);
  blLeg.matrix.scale(.15, -0.30, 0.15);
  blLeg.matrix.translate(-1.4, .1, 2.5);
  
  blLeg.render();

  // lower legs
  var frLow = new Cube();
  frLow.color = lowLegColor;
  frLow.matrix = frCoord;
  frLow.matrix.rotate(-g_magentaAngle, 1, 0, 0);
  var frLowCoord = new Matrix4(frLow.matrix);
  frLow.matrix.scale(0.11, 0.25, 0.11);
  frLow.matrix.translate(.65, -2.1, -2.4);
  
  frLow.render();

  var flLow = new Cube();
  flLow.color = lowLegColor;
  flLow.matrix = flCoord;
  flLow.matrix.rotate(-g_magentaAngle, 1, 0, 0);
  var flLowCoord = new Matrix4(flLow.matrix);
  flLow.matrix.scale(0.11, 0.25, 0.11);
  flLow.matrix.translate(-1.65, -2.1, -2.4);
  
  flLow.render();

  var brLow = new Cube();
  brLow.color = lowLegColor;
  brLow.matrix = brCoord;
  
  var brLowCoord = new Matrix4(brLow.matrix);
  brLow.matrix.scale(.11, .25, 0.11);
  brLow.matrix.translate(.7, -2.1, 3.6);
  brLow.matrix.rotate(g_magentaAngle, 1, 0, 0);
  brLow.render();

  var blLow = new Cube();
  blLow.color = lowLegColor;
  blLow.matrix = blCoord;
  
  var blLowCoord = new Matrix4(blLow.matrix);
  blLow.matrix.scale(0.11, 0.25, 0.11);
  blLow.matrix.translate(-1.7, -2.1, 3.6);
  blLow.matrix.rotate(-g_magentaAngle, 1, 0, 0);
  blLow.render();

  //hooves
  var frHoof = new Cube();
  frHoof.color = hoofColor;
  frHoof.matrix = frLowCoord;
  frHoof.matrix.rotate(g_hoofAngle, 0, 1, 0);
  frHoof.matrix.scale(.15, .1, 0.15);
  frHoof.matrix.translate(.35, -6, -1.9);
  frHoof.render();

  var flHoof = new Cube();
  flHoof.color = hoofColor;
  flHoof.matrix = flLowCoord;
  flHoof.matrix.rotate(-g_hoofAngle, 0, 1, 0);
  flHoof.matrix.scale(.15, .1, 0.15);
  flHoof.matrix.translate(-1.35, -6, -1.9);
  flHoof.render();

  var brHoof = new Cube();
  brHoof.color = hoofColor;
  brHoof.matrix = brLowCoord;
  brHoof.matrix.rotate(g_hoofAngle, 0, 1, 0);
  brHoof.matrix.scale(.15, .1, 0.15);
  brHoof.matrix.translate(.35, -6, 2.5);
  brHoof.render();

  var blHoof = new Cube();
  blHoof.color = hoofColor;
  blHoof.matrix = blLowCoord;
  blHoof.matrix.rotate(-g_hoofAngle, 0, 1, 0);
  blHoof.matrix.scale(.15, .1, 0.15);
  blHoof.matrix.translate(-1.4, -6, 2.5);
  blHoof.render();

 


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