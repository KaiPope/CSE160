import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

function main() {

	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );
	renderer.setSize(450,300);

	const scene = new THREE.Scene();
	
	const fov = 45;
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 100;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.set( 0, 10, 20 );
	camera.lookAt(scene.position);

	

	// controls
	const controls = new OrbitControls( camera, renderer.domElement );
	controls.target.set( 0, 5, 0 );
	controls.update();

	class MinMaxGUIHelper {
		constructor(obj, minProp, maxProp, minDif) {
		  this.obj = obj;
		  this.minProp = minProp;
		  this.maxProp = maxProp;
		  this.minDif = minDif;
		}
		get min() {
		  return this.obj[this.minProp];
		}
		set min(v) {
		  this.obj[this.minProp] = v;
		  this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
		}
		get max() {
		  return this.obj[this.maxProp];
		}
		set max(v) {
		  this.obj[this.maxProp] = v;
		  this.min = this.min;  // this will call the min setter
		}
	  }

	  function updateCamera() {
		camera.updateProjectionMatrix();
	  }
	   

	  //const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);

	  

	//Directional Light
	{

		const color = 0xFFFFFF;
		const intensity = 3;
		const light = new THREE.DirectionalLight( color, intensity );
		light.position.set( - 1, 2, 4 );
		scene.add( light );

	}

	//Ambient Light
	{

		const color = 0xFFFFFF;
		const intensity = 1;
		const light = new THREE.AmbientLight( color, intensity );
		scene.add( light );

	}
	
	//Hemisphere Light
	{

		const skyColor = 0xB1E1FF;  // light blue
		const groundColor = 0xB97A20;  // brownish orange
		const intensity = 1;
		const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
		scene.add( light );

	}


	//sky box
	const skyloader = new THREE.TextureLoader();
 	const texture = skyloader.load(
    './lib/Sky.jpg',
    () => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      texture.colorSpace = THREE.SRGBColorSpace;
      scene.background = texture;
    });


	{

		const planeSize = 40;

		const loader = new THREE.TextureLoader();
		const texture = loader.load( './lib/Grass.jpg' );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.magFilter = THREE.NearestFilter;
		texture.colorSpace = THREE.SRGBColorSpace;
		const repeats = planeSize / 2;
		texture.repeat.set( repeats, repeats );

		const planeGeo = new THREE.PlaneGeometry( planeSize, planeSize );
		const planeMat = new THREE.MeshPhongMaterial( {
			map: texture,
			side: THREE.DoubleSide,
		} );
		const mesh = new THREE.Mesh( planeGeo, planeMat );
		mesh.rotation.x = Math.PI * - .5;
		scene.add( mesh );

	}

	//Shapes 
	
	//path
	const path1 = new THREE.BoxGeometry(4,.5,16);
	makeInstance(path1, 0xbccae0, 0,0,-12);
	const path2 = new THREE.BoxGeometry(4,.5,16);
	makeInstance(path2, 0xbccae0, 0,0,12);
	const path3 = new THREE.BoxGeometry(16,.5,4);
	makeInstance(path3, 0xbccae0, -12,0,0);
	const path4 = new THREE.BoxGeometry(16,.5,4);
	makeInstance(path4, 0xbccae0, 12,0,0);

	const center = new THREE.CylinderGeometry(6, 6, .5, 20);
	makeCylinder(center, 0xbccae0, 0,0,0);

	//bushes
	const bush1 = new THREE.SphereGeometry(.6, 16, 8);
	makeBush(bush1, -3.8, .5, 5.8);
	const bush2 = new THREE.SphereGeometry(.6, 16, 8);
	makeBush(bush2, 3.5, .5, 5.8);
	const bush3 = new THREE.SphereGeometry(.6, 16, 8);
	makeBush(bush3, -5.8, .5, 3.8);
	const bush4 = new THREE.SphereGeometry(.6, 16, 8);
	makeBush(bush4, 5.8, .5, 3.8);
	const bush5 = new THREE.SphereGeometry(.6, 16, 8);
	makeBush(bush5, -4.8, .5, 4.8);
	const bush6 = new THREE.SphereGeometry(.6, 16, 8);
	makeBush(bush6, 4.8, .5, 4.8);
	const bush7 = new THREE.SphereGeometry(.6, 16, 8);
	makeBush(bush7, -3.8, .5, -5.8);
	const bush8 = new THREE.SphereGeometry(.6, 16, 8);
	makeBush(bush8, 3.8, .5, -5.8);
	const bush9 = new THREE.SphereGeometry(.6, 16, 8);
	makeBush(bush9, -5.8, .5, -3.8);
	const bush10 = new THREE.SphereGeometry(.6, 16, 8);
	makeBush(bush10, 5.8, .5, -3.8);
	const bush11 = new THREE.SphereGeometry(.6, 16, 8);
	makeBush(bush11, -4.8, .5, -4.8);
	const bush12 = new THREE.SphereGeometry(.6, 16, 8);
	makeBush(bush12, 4.8, .5, -4.8);
	


	//Tree
	const trunk1 = new THREE.CylinderGeometry(.3,.3,4,8);
	makeTrunk(trunk1, 3,2,7);
	const trunk2 = new THREE.CylinderGeometry(.3,.3,4,8);
	makeTrunk(trunk2, 3,2,12);
	const trunk3 = new THREE.CylinderGeometry(.3,.3,4,8);
	makeTrunk(trunk3, 3,2,17);
	const trunk4 = new THREE.CylinderGeometry(.3,.3,4,8);
	makeTrunk(trunk4, -3,2,7);
	const trunk5 = new THREE.CylinderGeometry(.3,.3,4,8);
	makeTrunk(trunk5, -3,2,12);
	const trunk6 = new THREE.CylinderGeometry(.3,.3,4,8);
	makeTrunk(trunk6, -3,2,17);

	const trunk7= new THREE.CylinderGeometry(.3,.3,4,8);
	makeTrunk(trunk7, 3,2,-7);
	const trunk8 = new THREE.CylinderGeometry(.3,.3,4,8);
	makeTrunk(trunk8, 3,2,-12);
	const trunk9 = new THREE.CylinderGeometry(.3,.3,4,8);
	makeTrunk(trunk9, 3,2,-17);
	const trunk10 = new THREE.CylinderGeometry(.3,.3,4,8);
	makeTrunk(trunk10, -3,2,-7);
	const trunk11 = new THREE.CylinderGeometry(.3,.3,4,8);
	makeTrunk(trunk11, -3,2,-12);
	const trunk12 = new THREE.CylinderGeometry(.3,.3,4,8);
	makeTrunk(trunk12, -3,2,-17);

	const trunk13= new THREE.CylinderGeometry(.3,.3,4,8);
	makeTrunk(trunk13, 7,2,-3);
	const trunk14 = new THREE.CylinderGeometry(.3,.3,4,8);
	makeTrunk(trunk14, 12,2,-3);
	const trunk15 = new THREE.CylinderGeometry(.3,.3,4,8);
	makeTrunk(trunk15, 17,2,-3);
	const trunk16 = new THREE.CylinderGeometry(.3,.3,4,8);
	makeTrunk(trunk16, 7,2,3);
	const trunk17 = new THREE.CylinderGeometry(.3,.3,4,8);
	makeTrunk(trunk17, 12,2,3);
	const trunk18 = new THREE.CylinderGeometry(.3,.3,4,8);
	makeTrunk(trunk18, 17,2,3);
	
	const trunk19= new THREE.CylinderGeometry(.3,.3,4,8);
	makeTrunk(trunk19, -7,2,3);
	const trunk20 = new THREE.CylinderGeometry(.3,.3,4,8);
	makeTrunk(trunk20, -12,2,3);
	const trunk21 = new THREE.CylinderGeometry(.3,.3,4,8);
	makeTrunk(trunk21, -17,2,3);
	const trunk22 = new THREE.CylinderGeometry(.3,.3,4,8);
	makeTrunk(trunk22, -7,2,-3);
	const trunk23 = new THREE.CylinderGeometry(.3,.3,4,8);
	makeTrunk(trunk23, -12,2,-3);
	const trunk24 = new THREE.CylinderGeometry(.3,.3,4,8);
	makeTrunk(trunk24, -17,2,-3);



	function makeInstance( geometry, color, x,y, z ) {

		const material = new THREE.MeshPhongMaterial( { color } );

		const cube = new THREE.Mesh( geometry, material );
		scene.add( cube );
		cube.position.x = x;
		cube.position.y = y;
		cube.position.z = z;


		return cube;
	}

  	function makeCylinder( geometry, color, x, y, z ) {
		const material = new THREE.MeshPhongMaterial( { color } );

		const cylinder = new THREE.Mesh( geometry, material );
		scene.add( cylinder );

		cylinder.position.x = x;
		cylinder.position.y = y;
		cylinder.position.z = z;

		return cylinder;
	}

	function makeTrunk( geometry, x, y, z ) {
		const loader = new THREE.TextureLoader();
		const texture = loader.load('./lib/Tree.jpg');
		texture.colorSpace = THREE.SRGBColorSpace;

		const material = new THREE.MeshBasicMaterial( {
		map: texture
    	} );

		const cylinder = new THREE.Mesh( geometry, material );
		scene.add( cylinder );

		cylinder.position.x = x;
		cylinder.position.y = y;
		cylinder.position.z = z;

		return cylinder;
	}

  	function makeSphere( geometry, color, x, y, z ) {

		const loader = new THREE.TextureLoader();

		const material = new THREE.MeshBasicMaterial( {
		color
    	} );

		const sphere = new THREE.Mesh( geometry, material );
		scene.add( sphere );

		sphere.position.x = x;
		sphere.position.y = y;
		sphere.position.z = z;

		return sphere;

	}

	function makeBush( geometry, x, y, z ) {

		const loader = new THREE.TextureLoader();
		const texture = loader.load('./lib/Leaf.jpg');
		texture.colorSpace = THREE.SRGBColorSpace;

		const material = new THREE.MeshBasicMaterial( {
		map: texture
    	} );

		const sphere = new THREE.Mesh( geometry, material );
		scene.add( sphere );

		sphere.position.x = x;
		sphere.position.y = y;
		sphere.position.z = z;

		return sphere;

	}
	function makeRing(geometry, color, x, y, z){
		const material = new THREE.MeshPhongMaterial( { color } );

		const ring = new THREE.Mesh( geometry, material );
		scene.add( ring );

		ring.rotateX = Math.PI/2;
		ring.position.x = x;
		ring.position.y = y;
		ring.position.z = z;

		return ring;
	}

	function makeTetra(geometry, color, x, y ,z){
		const material = new THREE.MeshPhongMaterial( { color } );

		const tetra = new THREE.Mesh( geometry, material );
		scene.add( tetra );		
		tetra.position.x = x;
		tetra.position.y = y;
		tetra.position.z = z;

		return tetra;
	}
	
	//const cylinder = new THREE.CylinderGeometry(.5,.5,1,20);	
	const geometry = new THREE.BoxGeometry( 1.5, 1.5, 1.5 );
	const geometry2 = new THREE.BoxGeometry( 1.5, 1.5, 1.5 );
	const geometry3 = new THREE.BoxGeometry( 1.5, 1.5, 1.5 );
	const geometry4 = new THREE.BoxGeometry( 1.5, 1.5, 1.5 );
	const geometry5 = new THREE.BoxGeometry( 1.5, 1.5, 1.5 );
	const geometry6 = new THREE.BoxGeometry( 1.5, 1.5, 1.5 );
	const geometry7 = new THREE.BoxGeometry( 1.5, 1.5, 1.5 );
	const geometry8 = new THREE.BoxGeometry( 1.5, 1.5, 1.5 );
	const sphere = new THREE.SphereGeometry(1, 16, 8);
	const sphere2 = new THREE.SphereGeometry(1, 16, 8);
	const sphere3 = new THREE.SphereGeometry(1, 16, 8);
	const sphere4 = new THREE.SphereGeometry(1, 16, 8);
	const sphere5 = new THREE.SphereGeometry(1, 16, 8);
	const sphere6 = new THREE.SphereGeometry(1, 16, 8);
	const sphere7 = new THREE.SphereGeometry(1, 16, 8);
	const sphere8 = new THREE.SphereGeometry(1, 16, 8);
	const tetra = new THREE.TetrahedronGeometry(1.5, 0);
	const tetra2 = new THREE.TetrahedronGeometry(1.5, 0);
	const tetra3 = new THREE.TetrahedronGeometry(1.5, 0);
	const tetra4 = new THREE.TetrahedronGeometry(1.5, 0);
	const tetra5 = new THREE.TetrahedronGeometry(1.5, 0);
	const tetra6 = new THREE.TetrahedronGeometry(1.5, 0);
	const tetra7 = new THREE.TetrahedronGeometry(1.5, 0);
	const tetra8 = new THREE.TetrahedronGeometry(1.5, 0);
	// makeTetra( tetra, 0x7cd3f2, 3, 4, 17)

	const cubes = [
		makeInstance( geometry, 0x7bba88, 3, 4, 12 ),
		makeInstance( geometry2, 0x7bba88, -3, 4, 12 ),
		makeInstance( geometry3, 0x7bba88, 3, 4, -12 ),
		makeInstance( geometry4, 0x7bba88, -3, 4, -12 ),
		makeInstance( geometry5, 0x7bba88, 12, 4, -3 ),
		makeInstance( geometry6, 0x7bba88, 12, 4, 3 ),
		makeInstance( geometry7, 0x7bba88, -12, 4, -3 ),
		makeInstance( geometry8, 0x7bba88, -12, 4, 3 ),
		//makeCylinder( cylinder, 0x8eb0e8, -4,2, -3 ),
		makeSphere( sphere, 0xae7dc7, 3, 4, 7),
		makeSphere( sphere2, 0xae7dc7, -3, 4, 7),
		makeSphere( sphere3, 0xae7dc7, 3, 4, -7),
		makeSphere( sphere4, 0xae7dc7, -3, 4, -7),
		makeSphere( sphere5, 0xae7dc7, 7, 4, 3),
		makeSphere( sphere6, 0xae7dc7, 7, 4, -3),
		makeSphere( sphere7, 0xae7dc7, -7, 4, 3),
		makeSphere( sphere8, 0xae7dc7, -7, 4, -3),
		makeTetra( tetra, 0x7cd3f2, 3, 4, 17),
		makeTetra( tetra2, 0x7cd3f2, -3, 4, 17),
		makeTetra( tetra3, 0x7cd3f2, 3, 4, -17),
		makeTetra( tetra4, 0x7cd3f2, -3, 4, -17),
		makeTetra( tetra5, 0x7cd3f2, 17, 4, 3),
		makeTetra( tetra6, 0x7cd3f2, 17, 4, -3),
		makeTetra( tetra7, 0x7cd3f2, -17, 4, 3),
		makeTetra( tetra8, 0x7cd3f2, -17, 4, -3),
		
	];


	//Custom Obj (apple)
  	const loader = new GLTFLoader();

  	loader.load( './lib/gala-apple.glb', function ( gltf ) {

      scene.add( gltf.scene );
      const apple = gltf.scene 
      apple.position.x=-6.5;
      apple.position.y= -.1;
      apple.position.Z= 0 ;
	  apple.scale.set(2.5,2.5,2.5);

    }, undefined, function ( error ) {

      console.error( error );

    } );

    const gltfLoader = new GLTFLoader();
    let car1, car2;
    gltfLoader.load('./lib/car2.gltf', (gltf) => {
        car1 = gltf.scene.clone();
        car1.position.set(1, 0.25, -20);
		car1.scale.set(.006,.006,.006);
        scene.add(car1);
        
        car2 = gltf.scene.clone();
        car2.position.set(-20, 0.25, -1); // Start point for second car
		car2.scale.set(.006,.006,.006);
        scene.add(car2);
    });

	// Path Points for Cars
    let pathIndex1 = 0;
    const pathPoints1 = [
		{ x: 1, y: 0.25, z: -20 },
		{ x: 1, y: 0.25, z: -4.5 },
		{ x: 1, y: 0.25, z: -4 },
		{ x: 1.1, y: 0.25, z: -3.9 },
		{ x: 1.2, y: 0.25, z: -3.8 },
		{ x: 1.3, y: 0.25, z: -3.7 },
		{ x: 1.4, y: 0.25, z: -3.6 },
		{ x: 1.5, y: 0.25, z: -3.5 },
		{ x: 1.7, y: 0.25, z: -3.4 },
		{ x: 1.9, y: 0.25, z: -3.3 },
		{ x: 2, y: 0.25, z: -3.25 },
		{ x: 2.1, y: 0.25, z: -3.2 },
		{ x: 2.2, y: 0.25, z: -3.1 },
		{ x: 2.3, y: 0.25, z: -3 },
		{ x: 2.4, y: 0.25, z: -2.8 },
		{ x: 2.5, y: 0.25, z: -2.6 },
		{ x: 2.6, y: 0.25, z: -2.5 },
		{ x: 2.8, y: 0.25, z: -2.2 },
		{ x: 3, y: 0.25, z: -2 },
		{ x: 3.2, y: 0.25, z: -1.8 },
		{ x: 3.4, y: 0.25, z: -1.6 },
		{ x: 3.5, y: 0.25, z: -1.5 },
		{ x: 3.6, y: 0.25, z: -1.4 },
		{ x: 3.7, y: 0.25, z: -1.3 },
		{ x: 3.8, y: 0.25, z: -1.2 },
		{ x: 3.9, y: 0.25, z: -1 },
		{ x: 4, y: 0.25, z: -0.5 },
		{ x: 4.1, y: 0.25, z: 0 },
		{ x: 3.95, y: 0.25, z: 0.4 },
		{ x: 3.8, y: 0.25, z: 0.75 },
		{ x: 3.65, y: 0.25, z: 1.1 },
		{ x: 3.5, y: 0.25, z: 1.5 },
		{ x: 3.4, y: 0.25, z: 1.7 },
		{ x: 3.3, y: 0.25, z: 1.9 },
		{ x: 3.2, y: 0.25, z: 2 },
		{ x: 3, y: 0.25, z: 2.2 },
		{ x: 2.8, y: 0.25, z: 2.4 },
		{ x: 2.6, y: 0.25, z: 2.5 },
		{ x: 2.4, y: 0.25, z: 2.7 },
		{ x: 2.2, y: 0.25, z: 2.9 },
		{ x: 2, y: 0.25, z: 3 },
		{ x: 1.8, y: 0.25, z: 3.2 },
		{ x: 1.6, y: 0.25, z: 3.4 },
		{ x: 1.4, y: 0.25, z: 3.6 },
		{ x: 1.2, y: 0.25, z: 3.75 },
		{ x: 1, y: 0.25, z: 3.9 },
		{ x: .9, y: 0.25, z: 3.95 },
		{ x: .7, y: 0.25, z: 4 },
		{ x: .8, y: 0.25, z: 4.25 },
		{ x: 1, y: 0.25, z: 4.5 },
		{ x: 1, y: 0.25, z: 20 }
	];

    let pathIndex2 = 0;
    const pathPoints2 = [
		{x: -20, y: 0.25, z: -1 },
		{ x: -4.5, y: 0.25, z: -1 },
		{ x: -4, y: 0.25, z: -1 },
		{ x: -3.9, y: 0.25, z: -1.1 },
		{ x: -3.8, y: 0.25, z: -1.2 },
		{ x: -3.7, y: 0.25, z: -1.3 },
		{ x: -3.6, y: 0.25, z: -1.4 },
		{ x: -3.5, y: 0.25, z: -1.5 },
		{ x: -3.4, y: 0.25, z: -1.7 },
		{ x: -3.3, y: 0.25, z: -1.9 },
		{ x: -3.25, y: 0.25, z: -2 },
		{ x: -3.2, y: 0.25, z: -2.1 },
		{ x: -3.1, y: 0.25, z: -2.2 },
		{ x: -3, y: 0.25, z: -2.3 },
		{ x: -2.8, y: 0.25, z: -2.4 },
		{ x: -2.6, y: 0.25, z: -2.5 },
		{ x: -2.5, y: 0.25, z: -2.6 },
		{ x: -2.2, y: 0.25, z: -2.8 },
		{ x: -2, y: 0.25, z: -3 },
		{ x: -1.8, y: 0.25, z: -3.2 },
		{ x: -1.6, y: 0.25, z: -3.4 },
		{ x: -1.5, y: 0.25, z: -3.6 },
		{ x: -1.4, y: 0.25, z: -3.75 },
		{ x: -1.3, y: 0.25, z: -3.9 },
		{ x: -1.2, y: 0.25, z: -3.95 },
		{ x: -1, y: 0.25, z: -4 },
		{ x: -0.5, y: 0.25, z: -4.25 },
		{ x: 0, y: 0.25, z: -4.5 },
		{ x: 0.4, y: 0.25, z: -3.95 },
		{ x: 0.75, y: 0.25, z: -3.8 },
		{ x: 1.1, y: 0.25, z: -3.65 },
		{ x: 1.5, y: 0.25, z: -3.5 },
		{ x: 1.7, y: 0.25, z: -3.4 },
		{ x: 1.9, y: 0.25, z: -3.3 },
		{ x: 2, y: 0.25, z: -3.2 },
		{ x: 2.2, y: 0.25, z: -3 },
		{ x: 2.4, y: 0.25, z: -2.8 },
		{ x: 2.5, y: 0.25, z: -2.6 },
		{ x: 2.7, y: 0.25, z: -2.3 },
		{ x: 3, y: 0.25, z: -2.2 },
		{ x: 3.2, y: 0.25, z: -2 },
		{ x: 3.4, y: 0.25, z: -1.8 },
		{ x: 3.6, y: 0.25, z: -1.6 },
		{ x: 3.75, y: 0.25, z: -1.2 },
		{ x: 3.9, y: 0.25, z: -1 },
		{ x: 3.95, y: 0.25, z: -.9 },
		{ x: 4, y: 0.25, z: -.7 },
		{ x: 4.25, y: 0.25, z: -.8 },
		{ x: 4.5, y: 0.25, z: -1 },
		{ x: 20, y: 0.25, z: -1},
	];


    function animate() {
		requestAnimationFrame(animate);
	
		if (car1) {
			moveCar(car1, pathPoints1, pathIndex1);
			if (car1.position.distanceTo(new THREE.Vector3(pathPoints1[pathIndex1].x, pathPoints1[pathIndex1].y, pathPoints1[pathIndex1].z)) < 2.5) {
				pathIndex1++;
				if (pathIndex1 === pathPoints1.length) {
					// Teleport car1 back to the starting point
					pathIndex1 = 0;
					car1.position.set(pathPoints1[0].x, pathPoints1[0].y, pathPoints1[0].z);
					car1.rotation.y = 0; 
				}
			}
		}
	
		if (car2) {
			moveCar(car2, pathPoints2, pathIndex2);
			if (car2.position.distanceTo(new THREE.Vector3(pathPoints2[pathIndex2].x, pathPoints2[pathIndex2].y, pathPoints2[pathIndex2].z)) < 2.5) {
				pathIndex2++;
				if (pathIndex2 === pathPoints2.length) {
					// Teleport car2 back to the starting point
					pathIndex2 = 0;
					car2.position.set(pathPoints2[0].x, pathPoints2[0].y, pathPoints2[0].z);
					car2.rotation.y = 0; 
				}
			}
		}
	
		renderer.render(scene, camera);
	}

    function moveCar(car, pathPoints, pathIndex) {
		const nextPoint = new THREE.Vector3(pathPoints[pathIndex].x, pathPoints[pathIndex].y, pathPoints[pathIndex].z);
		car.position.lerp(nextPoint, 0.04); 
	
		// Rotate the car to face the direction of movement
		const nextPathIndex = (pathIndex + 1) % pathPoints.length;
		const futurePoint = new THREE.Vector3(pathPoints[nextPathIndex].x, pathPoints[nextPathIndex].y, pathPoints[nextPathIndex].z);
		const direction = futurePoint.clone().sub(car.position).normalize();
		const angle = Math.atan2(direction.x, direction.z);
		car.rotation.y = angle;

		if (pathIndex === pathPoints.length - 1) {
			car.rotation.y += Math.PI;
		}
	}

    animate();


	// Render Display Size
	function resizeRendererToDisplaySize( renderer ) {

		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if ( needResize ) {

			renderer.setSize( width, height, false );

		}

		return needResize;

	}


	//Render
	function render( time ) {

		time *= 0.001; // convert time to seconds

		cubes.forEach( ( cube, ndx ) => {

			const speed = 1 + ndx * .1;
			const rot = time * speed;
			cube.rotation.x = rot;
			cube.rotation.y = rot;

		} );

		if ( resizeRendererToDisplaySize( renderer ) ) {

			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();

		}

		renderer.render( scene, camera );

		requestAnimationFrame( render );

	}

	requestAnimationFrame( render );

}

main();

