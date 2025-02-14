// ColoredPoint.js (c) 2012 matsuda

// const { Matrix4 } = require("three");

// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec3 a_Normal;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  varying vec4 v_VertPos;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    v_Normal = a_Normal;
    v_VertPos = u_ModelMatrix * a_Position;
  }`


// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform int u_whichTexture;
  uniform vec3 u_lightPos;
  varying vec4 v_VertPos;
  uniform vec3 u_cameraPos;
  uniform bool u_lightOn;
  void main() {
    if (u_whichTexture == -3){
      gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0);
    }
    else if(u_whichTexture == -2){
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

    vec3 lightVector = u_lightPos - vec3(v_VertPos);
    // vec3 lightVector = vec3(v_VertPos) - u_lightPos;
    float r = length(lightVector);

    // if(r<1.0){
    //    gl_FragColor = vec4(1,0,0,1);
    // } else if (r<2.0){
    //    gl_FragColor = vec4(0,1,0,1);
    // }

    //gl_FragColor = vec4(vec3(gl_FragColor)/(r*r),1);

    vec3 L = normalize(lightVector);
    vec3 N = normalize(v_Normal);
    float nDotL = max(dot(N,L), 0.0);

    // gl_FragColor = gl_FragColor * nDotL;
    // gl_FragColor.a = 1.0;

    vec3 R = reflect(-L,N);
    vec3 E = normalize(u_cameraPos-vec3(v_VertPos));

    float specular = pow(max(dot(E,R), 0.0), 10.0);

    vec3 diffuse = vec3(gl_FragColor) * nDotL * 0.7;
    vec3 ambient = vec3(gl_FragColor) * 0.3;
    if(u_lightOn){
      gl_FragColor = vec4(specular+diffuse+ambient, 1.0);
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
let u_lightPos;
let u_cameraPos;
let u_lightOn;

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

  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (a_Normal < 0){
    console.log('Failed to get the storage location of a_Normal');
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

  u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
  if (!u_lightPos){
    console.log('Failed to get the storage location of u_lightPos');
    return;
  }

  u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
  if (!u_cameraPos){
    console.log('Failed to get the storage location of u_cameraPos');
    return;
  }

  u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
  if (!u_lightOn){
    console.log('Failed to get the storage location of u_lightOn');
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
let g_lightPos = [0,1,-2];
let g_lightOn = true;

var g_camera;

// let g_yellowAnimation = false;
// let g_magentaAnimation = false;
// let g_hoofAnimation = false;
let g_animation = false;
let g_normalOn = false;


function addActionsForHtmlUI(){

  document.onkeydown = keydown;
  document.onkeyup = keyup;

  document.getElementById('animationOnButton').onclick = function() {g_animation=true};
  document.getElementById('animationOffButton').onclick = function() {g_animation=false};

  document.getElementById('normalOnButton').onclick = function() {g_normalOn = true};
  document.getElementById('normalOffButton').onclick = function() {g_normalOn = false};

  document.getElementById('lightOnButton').onclick = function() {g_lightOn = true};
  document.getElementById('lightOffButton').onclick = function() {g_lightOn = false};

  document.getElementById('lightSlideX').addEventListener('mousemove', function(ev) {if(ev.buttons = 1){ g_lightPos[0] = this.value/100; renderScene();}});
  document.getElementById('lightSlideY').addEventListener('mousemove', function(ev) {if(ev.buttons = 1){ g_lightPos[1] = this.value/100; renderScene();}});
  document.getElementById('lightSlideZ').addEventListener('mousemove', function(ev) {if(ev.buttons = 1){ g_lightPos[2] = this.value/100; renderScene();}});
  // document.getElementById('yellowSlide').addEventListener('mousemove', function() { g_yellowAngle = this.value; renderScene();})
  // document.getElementById('magentaSlide').addEventListener('mousemove', function() { g_magentaAngle = this.value; renderScene();})
  // document.getElementById('hoofSlide').addEventListener('mousemove', function() { g_hoofAngle = this.value; renderScene();})
  // document.getElementById('neckSlide').addEventListener('mousemove', function() { g_neckAngle = this.value; renderScene();})

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

  image.src = '../lib/sky2.jpg';
  image1.src = '../lib/snow.jpg';

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

  g_camera = new Camera();
  

  initTextures();

  // Specify the color for clearing <canvas>
  gl.clearColor(0,0,0,1);

  requestAnimationFrame(tick);
}

var forward = false;
var back = false;
var left = false;
var right = false;
var pLeft = false;
var pRight = false;
var pUp = false;
var pDown = false;
// var f = false;
// var f = false;


function keydown(ev) {
  if (ev.keyCode == 87){ 
    forward = true;
  } else if (ev.keyCode == 83){
    back = true;
  } else if(ev.keyCode == 65){ 
    left = true;
  } else if (ev.keyCode == 68){ 
    right = true;
  } else if (ev.keyCode==81){ 
    pLeft = true;
  } else if (ev.keyCode==69){ 
    pRight = true;
  }else if(ev.keyCode==82){
    pUp = true;
  }else if(ev.keyCode==70){
    pDown = true;
  }
}

function keyup(ev) {
  if (ev.keyCode == 87){ 
    forward = false;
  } else if (ev.keyCode == 83){
    back = false;
  } else if(ev.keyCode == 65){ 
    left = false;
  } else if (ev.keyCode == 68){ 
    right = false;
  } else if (ev.keyCode==81){ 
    pLeft = false;
  } else if (ev.keyCode==69){ 
    pRight = false;
  }else if(ev.keyCode==82){
    pUp = false;
  }else if(ev.keyCode==70){
    pDown = false;
  }
}

function checkKey(){
  if(forward){
    g_camera.moveForward();
  }
  if(back){
    g_camera.moveBack();
  }
  if(left){
    g_camera.moveLeft();
  }
  if(right){
    g_camera.moveRight();
  }
  if(pLeft){
    g_camera.panLeft();
  }
  if(pRight){
    g_camera.panRight();
  }
  if(pUp){
    g_camera.panUp();
  }
  if(pDown){
    g_camera.panDown();
  }
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0-g_startTime;

function tick(){

  g_seconds = performance.now()/1000.0-g_startTime;
  
  checkKey();
  
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
  g_lightPos[0] = cos(g_seconds);
}

function renderScene(){
  g_camera.viewMat.setLookAt(g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2], 
                        g_camera.at.elements[0], g_camera.at.elements[1], g_camera.at.elements[2],
                        g_camera.up.elements[0], g_camera.up.elements[1], g_camera.up.elements[2]); 

  g_camera.projMat.setPerspective(60, 1*canvas.width/canvas.height, .1, 1000);

  gl.uniformMatrix4fv(u_ProjectionMatrix, false, g_camera.projMat.elements);

  gl.uniformMatrix4fv(u_ViewMatrix, false, g_camera.viewMat.elements);

  var globalRotMat=new Matrix4().rotate(g_globalAngle,0,1,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);

  gl.uniform1i(u_lightOn, g_lightOn);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  renderAllShapes();
}

var g_map = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1],
  [1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,0,0,0,1],
  [1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
  [1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
  [1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
  [1,0,0,0,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1],
  [1,0,0,0,1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,1,1,0,0,0,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,1],
  [1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,1],
  [1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,1],
  [1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,1],
  [1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,1],
  [1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,0,1,0,0,0,1],
  [1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,0,0,1,0,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1,1,1,1,1,1,1],
  [1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,0,0,1,0,1,0,0,0,1],
  [1,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1],
  [1,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1],
  [1,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1],
  [1,0,0,0,1,1,0,0,0,1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

function drawMap() {
  for (x = 0; x < 32; x++){
    for (y = 0; y < 32; y++){
      if(g_map[x][y]==1){
      // if (x == 0 || x == 15 || y==0 || y==15){
        var block = new Cube();
        if(g_normalOn) block.textureNum = -3;
        block.color = [.92,.92,.92,1];
        block.matrix.scale(.32, 1.7, .32);
        block.matrix.translate(x-16, -.6, y-16);
        block.renderfast();
      }
    }
  }
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

  drawMap();

  

  //light
  var light = new Cube();
  light.color = [2,2,0,1];
  light.matrix.translate(g_lightPos[0],g_lightPos[1],g_lightPos[2]);
  light.matrix.scale(-.1,-.1,-.1);
  light.matrix.translate(-.5,-.5,-.5);
  light.render();
  

  //sphere
  var sphere = new Sphere();
  sphere.color = [.63,.72,.89,1];
  if(g_normalOn) sphere.textureNum = -3;
  sphere.matrix.translate(-2,3,0);
  sphere.render();

  //cube
  var cube = new Cube();
  cube.color = [.63,.44,.92,1];
  if(g_normalOn) cube.textureNum = -3;
  cube.matrix.translate(2,2,0);
  cube.render();

  
  //block1
  var block1 = new Cube();
  block1.color = [1,1,1,1];
  block1.textureNum = 1;
  if(g_normalOn) block1.textureNum = -3;
  block1.matrix.translate(-1,-.79,-.5);
  block1.matrix.scale(2,.2,1.2);
  block1.render();
  //block2
  var block2 = new Cube();
  block2.color = [1,1,1,1];
  block2.textureNum = 1;
  if(g_normalOn) block2.textureNum = -3;
  block2.matrix.translate(-1,-.79,-1.5);
  block2.matrix.scale(2,.2,.5);
  block2.render();
  //block3
  var block3 = new Cube();
  block3.color = [1,1,1,1];
  block3.textureNum = 1;
  if(g_normalOn) block3.textureNum = -3;
  block3.matrix.translate(.5,-.79,-1);
  block3.matrix.scale(.5,.2,.5);
  block3.render();
  //block4
  var block4 = new Cube();
  block4.color = [1,1,1,1];
  block4.textureNum = 1;
  if(g_normalOn) block4.textureNum = -3;
  block4.matrix.translate(-1,-.79,-1);
  block4.matrix.scale(.5,.2,.5);
  block4.render();

  //iceblock
  var iceblock = new Cube();
  if(g_normalOn) iceblock.textureNum = -3;
  iceblock.color = [.72,.91,.92,1];
  iceblock.matrix.translate(-.5,-.79,-1);
  iceblock.matrix.scale(.5,.2,.5);
  iceblock.render();
  //iceblock2
  var iceblock2 = new Cube();
  iceblock2.color = [.72,.91,.92,1];
  if(g_normalOn) iceblock2.textureNum = -3;
  iceblock2.matrix.translate(0,-.79,-1);
  iceblock2.matrix.scale(.5,.2,.5);
  iceblock2.render();

  //ground
  var ground = new Cube();
  ground.color=[1,1,1,1];
  ground.textureNum = 1;
  if(g_normalOn) ground.textureNum = -3;
  ground.matrix.translate (0,-.75,0);
  ground.matrix.scale(10,0,10);
  ground.matrix.translate(-.5,0,-.5);
  ground.render();

  //sky
  var sky = new Cube();
  sky.color=[1,0,0,1];
  sky.textureNum = 0;
  if(g_normalOn) sky.textureNum = -3;
  sky.matrix.scale(-30,-30,-30);
  sky.matrix.translate(-.5,-.5,-.5);
  sky.render();

  // body
  var body = new Cube();
  body.color = bodycolor;
  if(g_normalOn) body.textureNum = -3;
  body.matrix.scale(.4, 0.5, 0.8);
  body.matrix.translate(-.5, -.4, -0.35);
  body.render();

  //tail base
  var tailBase = new Cube();
  tailBase.color = bodycolor;
  //tailBase.matrix.setTranslate(0,0,0);
  var tailCoord = tailBase.matrix;
  if(g_normalOn) tailCoord.textureNum = -3;
  tailBase.matrix.rotate(30,1,0,0);
  tailBase.matrix.scale(.08, 0.05, 0.12);
  tailBase.matrix.translate(-.5, 9, 2.2);
  tailBase.render();

  //1st tail segment
  var tail1 = new Cube();
  tail1.color = hairColor;
  tail1.matrix = tailCoord;
  if(g_normalOn) tail1.textureNum = -3;
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
  if(g_normalOn) tail2.textureNum = -3;
  tail2.matrix.translate(0,-.45,.01);
  tail2.matrix.rotate(10,1,0,0);
  //tail2.matrix.rotate(-g_tailAngle,1,0,0);
  tail2.matrix.scale(.11, .25, .11);
  tail2.render();


  //neck
  var neck = new Cube();
  neck.color = bodycolor;
  if(g_normalOn) neck.textureNum = -3;
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
  if(g_normalOn) headHair.textureNum = -3;
  headHair.matrix.scale(.1,.44,.1);
  headHair.matrix.translate(-.45,.6,-.6);
  headHair.render();

  //head
  var head = new Cube();
  head.color = bodycolor;
  //head.matrix = neckCoord;
  if(g_normalOn) head.textureNum = -3;
  head.matrix.rotate(g_neckAngle,1,0,0);
  head.matrix.rotate(g_headAngle,0,1,0);
  head.matrix.scale(.22,.2,.27);
  head.matrix.translate(-.5,2.5,-1.15)
  head.render();

  //rightpupil
  var rPupil = new Cube();
  rPupil.color = pupilColor;
  if(g_normalOn) rPupil.textureNum = -3;
  rPupil.matrix.rotate(g_neckAngle,1,0,0);
  rPupil.matrix.rotate(g_headAngle,0,1,0);
  rPupil.matrix.scale(.01,.05,.05);
  rPupil.matrix.translate(10.2,12,-5);
  rPupil.render();

  //leftpupil
  var lPupil = new Cube();
  lPupil.color = pupilColor;
  if(g_normalOn) lPupil.textureNum = -3;
  lPupil.matrix.rotate(g_neckAngle,1,0,0);
  lPupil.matrix.rotate(g_headAngle,0,1,0);
  lPupil.matrix.scale(.01,.05,.05);
  lPupil.matrix.translate(-11.2,12,-5);
  lPupil.render();


  //rightSclera
  var rSclera = new Cube();
  rSclera.color = scleraColor;
  if(g_normalOn) rSclera.textureNum = -3;
  rSclera.matrix.rotate(g_neckAngle,1,0,0);
  rSclera.matrix.rotate(g_headAngle,0,1,0);
  rSclera.matrix.scale(.01,.05,.05);
  rSclera.matrix.translate(10.2,12,-4);
  rSclera.render();

  //leftSclera
  var lSclera = new Cube();
  lSclera.color = scleraColor;
  if(g_normalOn) lSclera.textureNum = -3;
  lSclera.matrix.rotate(g_neckAngle,1,0,0);
  lSclera.matrix.rotate(g_headAngle,0,1,0);
  lSclera.matrix.scale(.01,.05,.05);
  lSclera.matrix.translate(-11.2,12,-4);
  lSclera.render();

  //snout
  var snout = new Cube();
  snout.color = bodycolor;
  if(g_normalOn) snout.textureNum = -3;
  snout.matrix.rotate(g_neckAngle,1,0,0);
  snout.matrix.rotate(g_headAngle,0,1,0);
  snout.matrix.scale(.18,.18,.2);
  snout.matrix.translate(-.5,2.8,-2.5)
  snout.render();

  //left nose
  var lNose = new Cube();
  lNose.color = noseColor;
  if(g_normalOn) lNose.textureNum = -3;
  lNose.matrix.rotate(g_neckAngle,1,0,0);
  lNose.matrix.rotate(g_headAngle,0,1,0);
  lNose.matrix.scale(.05,.05,.01);
  lNose.matrix.translate(-1.5,12,-50.2);
  lNose.render();
  
  //right nose
  var rNose = new Cube();
  rNose.color = noseColor;
  if(g_normalOn) rNose.textureNum = -3;
  rNose.matrix.rotate(g_neckAngle,1,0,0);
  rNose.matrix.rotate(g_headAngle,0,1,0);
  rNose.matrix.scale(.05,.05,.01);
  rNose.matrix.translate(.5,12,-50.2);
  rNose.render();

  //mouth
  var mouth = new Cube();
  mouth.color = bodycolor;
  if(g_normalOn) mouth.textureNum = -3;
  mouth.matrix.rotate(g_neckAngle,1,0,0);
  mouth.matrix.rotate(g_headAngle,0,1,0);
  mouth.matrix.scale(.18,.05,.18);
  mouth.matrix.translate(-.5, 9.1,-2.6)
  mouth.render();

  // upper legs
  var frLeg = new Cube();
  frLeg.color = upLegColor;
  if(g_normalOn) frLeg.textureNum = -3;
  frLeg.matrix.setTranslate(.13, -.03, -.3);
  frLeg.matrix.rotate(-g_yellowAngle, 1, 0, 0); 
  var frCoord = new Matrix4(frLeg.matrix);
  frLeg.matrix.scale(.15, -0.30, 0.15);
  frLeg.matrix.translate(-.5,0,0);
  frLeg.render();

  var flLeg = new Cube();
  flLeg.color = upLegColor;
  if(g_normalOn) flLeg.textureNum = -3;
  flLeg.matrix.setTranslate(-.13, -0.03, -.3);
  flLeg.matrix.rotate(g_yellowAngle, 1, 0, 0);
  var flCoord = new Matrix4(flLeg.matrix);
  flLeg.matrix.scale(.15, -0.3, 0.15);
  flLeg.matrix.translate(-.5,0,0);
  flLeg.render();

  var brLeg = new Cube();
  brLeg.color = upLegColor;
  if(g_normalOn) brLeg.textureNum = -3;
  brLeg.matrix.setTranslate(.13, -.03 , .38);
  brLeg.matrix.rotate(g_yellowAngle, 1, 0, 0);
  var brCoord = new Matrix4(brLeg.matrix);
  brLeg.matrix.scale(.15, -0.30, 0.15);
  brLeg.matrix.translate(-.5,0,0);
  brLeg.render();

  var blLeg = new Cube();
  blLeg.color = upLegColor;
  if(g_normalOn) blLeg.textureNum = -3;
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
  if(g_normalOn) frLow.textureNum = -3;
  frLow.matrix.translate(.055, -.25, .02);
  frLow.matrix.rotate(g_magentaAngle, 1, 0, 0);
  var frLowCoord = new Matrix4(frLow.matrix);
  frLow.matrix.scale(0.11, 0.25, 0.11);
  frLow.matrix.translate(-1, -1, 0);
  frLow.render();

  var flLow = new Cube();
  flLow.color = lowLegColor;
  flLow.matrix = flCoord;
  if(g_normalOn) flLow.textureNum = -3;
  flLow.matrix.translate(.06, -.25, .015);
  flLow.matrix.rotate(g_magentaAngle, 1, 0, 0);
  var flLowCoord = new Matrix4(flLow.matrix);
  flLow.matrix.scale(0.11, 0.25, 0.11);
  flLow.matrix.translate(-1, -1, 0);
  flLow.render();

  var brLow = new Cube();
  brLow.color = lowLegColor;
  brLow.matrix = brCoord;
  if(g_normalOn) brLow.textureNum = -3;
  brLow.matrix.translate(.055, -.25, .02);
  brLow.matrix.rotate(g_magentaAngle, 1, 0, 0);
  var brLowCoord = new Matrix4(brLow.matrix);
  brLow.matrix.scale(.11, .25, 0.11);
  brLow.matrix.translate(-1, -1, 0);
  brLow.render();

  var blLow = new Cube();
  blLow.color = lowLegColor;
  blLow.matrix = blCoord;
  if(g_normalOn) blLow.textureNum = -3;
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
  if(g_normalOn) frHoof.textureNum = -3;
  frHoof.matrix.translate(-.13, -.2 , .13);
  frHoof.matrix.rotate(g_hoofAngle, 1, 0, 0);
  frHoof.matrix.scale(.15, .1, 0.15);
  frHoof.matrix.translate(0, -1,-1);
  frHoof.render();

  var flHoof = new Cube();
  flHoof.color = hoofColor;
  flHoof.matrix = flLowCoord;
  if(g_normalOn) flHoof.textureNum = -3;
  flHoof.matrix.translate(-.13, -.2 , .13);
  flHoof.matrix.rotate(g_hoofAngle, 1, 0, 0);
  flHoof.matrix.scale(.15, .1, 0.15);
  flHoof.matrix.translate(0, -1,-1);
  flHoof.render();

  var brHoof = new Cube();
  brHoof.color = hoofColor;
  brHoof.matrix = brLowCoord;
  if(g_normalOn) brHoof.textureNum = -3;
  brHoof.matrix.translate(-.13, -.2 , .13);
  brHoof.matrix.rotate(g_hoofAngle, 1, 0, 0);
  brHoof.matrix.scale(.15, .1, 0.15);
  brHoof.matrix.translate(0, -1,-1);
  brHoof.render();

  var blHoof = new Cube();
  blHoof.color = hoofColor;
  blHoof.matrix = blLowCoord;
  if(g_normalOn) blHoof.textureNum = -3;
  blHoof.matrix.translate(-.13, -.2 , .13);
  blHoof.matrix.rotate(g_hoofAngle, 1, 0, 0);
  blHoof.matrix.scale(.15, .1, 0.15);
  blHoof.matrix.translate(0, -1,-1);
  blHoof.render();

  var lEar = new triPrism();
  lEar.color = bodycolor;
  if(g_normalOn) lEar.textureNum = -3;
  lEar.matrix.rotate(g_neckAngle,1,0,0);
  lEar.matrix.rotate(g_headAngle,0,1,0);
  lEar.matrix.translate(0,.68,-.12);
  lEar.matrix.scale(.1,.15,.1);
  lEar.render();

  var rEar = new triPrism();
  rEar.color = bodycolor;
  if(g_normalOn) rEar.textureNum = -3;
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