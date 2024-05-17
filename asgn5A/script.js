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

	const fov = 45;
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 100;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.set( 0, 10, 20 );

	// controls
	const controls = new OrbitControls( camera, canvas );
	controls.target.set( 0, 5, 0 );
	controls.update();

	const scene = new THREE.Scene();

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
    '/lib/Sky.jpg',
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
	const geometry = new THREE.BoxGeometry( 1, 1, 1 );
	const cylinder = new THREE.CylinderGeometry(.5,.5,1,20);
	//const sphere = new THREE.SphereGeometry(.6, 16, 8);
	
	//path
	const path1 = new THREE.BoxGeometry(4,.5,16);
	makeInstance(path1, 0xbccae0, 0,0,-12);
	const path2 = new THREE.BoxGeometry(4,.5,16);
	makeInstance(path2, 0xbccae0, 0,0,12);
	const path3 = new THREE.BoxGeometry(16,.5,4);
	makeInstance(path3, 0xbccae0, -12,0,0);
	const path4 = new THREE.BoxGeometry(16,.5,4);
	makeInstance(path4, 0xbccae0, 12,0,0);

	const center = new THREE.CylinderGeometry(5, 5, .5, 20);
	makeCylinder(center, 0xbccae0, 0,0,0);

	//bushes
	const bush1 = new THREE.SphereGeometry(.6, 16, 8);
	const bush2 = new THREE.SphereGeometry(.6, 16, 8);




	//Tree Trunk
	const T1 = new THREE.TetrahedronGeometry()


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

  	function makeSphere( geometry, color, x, y, z ) {

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

	const cubes = [
		makeInstance( geometry, 0x7bba88, 2, 2, 1 ),
		makeCylinder( cylinder, 0x8eb0e8, -4,2, 0 ),
		makeSphere( bush1, 0xae7dc7, -1.3, .7, -6)
		//makeSphere( bush2, 0xae7dc7, 6, .7, -1.3)
		
	];


	//Custom Obj (apple)
  	const loader = new GLTFLoader();

  	loader.load( './lib/gala-apple.glb', function ( gltf ) {

      scene.add( gltf.scene );
      const apple = gltf.scene 
      apple.position.x=-3;
      apple.position.y= 2;
      apple.position.Z= 1 ;
	  apple.scale.set(.5,.5,.5);

    }, undefined, function ( error ) {

      console.error( error );

    } );


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

