import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';

function main() {

	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );
  renderer.setSize(300,200);

	const fov = 110;
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 10;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.z = 2.2;

	const scene = new THREE.Scene();

	{

		const color = 0xFFFFFF;
		const intensity = 3;
		const light = new THREE.DirectionalLight( color, intensity );
		light.position.set( - 1, 2, 4 );
		scene.add( light );

	}

	const boxWidth = 1;
	const boxHeight = 1;
	const boxDepth = 1;
	const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );
  const cylinder = new THREE.CylinderGeometry(.5,.5,1,20);
  const sphere = new THREE.SphereGeometry(.6, 16, 8);


	function makeInstance( geometry, color, x ) {

		const material = new THREE.MeshPhongMaterial( { color } );

		const cube = new THREE.Mesh( geometry, material );
		scene.add( cube );

		cube.position.x = x;

		return cube;
	}

  function makeCylinder( geometry, color, x ) {

		const material = new THREE.MeshPhongMaterial( { color } );

		const cylinder = new THREE.Mesh( geometry, material );
		scene.add( cylinder );

		cylinder.position.x = x;

		return cylinder;

	}

  function makeSphere( geometry, color, x ) {

    const loader = new THREE.TextureLoader();
    const texture = loader.load('./lib/grasstexture.jpg');
    texture.colorSpace = THREE.SRGBColorSpace;

		const material = new THREE.MeshBasicMaterial( {
      map: texture
    } );

		const sphere = new THREE.Mesh( geometry, material );
		scene.add( sphere );

		sphere.position.x = x;

		return sphere;

	}

	const cubes = [
		makeInstance( geometry, 0x7bba88, 2 ),
    makeCylinder( cylinder, 0x8eb0e8, -4 ),
    makeSphere( sphere, 0xae7dc7, 4),
	];

	function render( time ) {

		time *= 0.001; // convert time to seconds

		cubes.forEach( ( cube, ndx ) => {

			const speed = 1 + ndx * .1;
			const rot = time * speed;
			cube.rotation.x = rot;
			cube.rotation.y = rot;

		} );

		renderer.render( scene, camera );

		requestAnimationFrame( render );

	}

  const objLoader = new OBJLoader();
  const mtlLoader = new MTLLoader();
  mtlLoader.load('./lib/gala-apple.mtl', (mtl) => {
    mtl.preload();
    objLoader.setMaterials(mtl);
    objLoader.load('./lib/gala-apple.obj', (root) => {
      scene.add(root); root.position.x=-3;root.position.y=-2;root.position.z=.3;
    });
  });

	requestAnimationFrame( render );

}

main();

