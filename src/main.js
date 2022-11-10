import * as THREE from "../threejs/build/three.module.js";

let elThreejs = document.getElementById("threejs");
let camera,scene,renderer;
let axesHelper;

let keyboard = {};
let playerMesh;

let projectileMeshes = [];
let projectileMesh;

let animalMeshes = [];
let animalMesh;

init();

function init() {

  // Scene
	scene = new THREE.Scene();

  // Camera
	camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	camera.position.z = -10;
	// camera.position.z = 0;
	camera.position.y = 20;
  
	// rotate camera to see the scene from the top
	camera.rotation.x = -Math.PI / 2;


  // render
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	renderer.outputEncoding = THREE.sRGBEncoding;


	axesHelper = new THREE.AxesHelper( 100 );
	scene.add( axesHelper );

	elThreejs.appendChild(renderer.domElement);

	addBox();
	addPlane();
	addProjectile();

	spawnAnimals();

	addKeysListener();
	animate();
}

function animate(){

	movePlayer();
	updateProjectiles();
	updateAnimals();

	// collision detection between projectileMeshes and animalMeshes
	animalMeshes.forEach((animal, indexa) => {
		projectileMeshes.forEach((projectile, indexb) => {
			if( animal.position.x >= projectile.position.x - 1 &&
				animal.position.x <= projectile.position.x + 1 &&
				animal.position.z >= projectile.position.z - 1 &&
				animal.position.z <= projectile.position.z + 1){
					scene.remove(animal);
					animalMeshes.splice(indexa, 1);
					scene.remove(projectile);
					projectileMeshes.splice(indexb, 1);
			}
		});
	});

	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}

function addBox(){
	let geometry = new THREE.BoxGeometry(1,1,1);
	let material = new THREE.MeshBasicMaterial({color: 'pink'});
	playerMesh = new THREE.Mesh(geometry, material);
	// playerMesh.position.set(0, 0, 0); default
	scene.add(playerMesh);
}


function addPlane(){
	let geometry =  new THREE.BoxGeometry(50, 0, 50);
	let material = new THREE.MeshBasicMaterial({color: 'gray'});
	let plane = new THREE.Mesh(geometry, material);
	plane.position.set(0, 0, -10);
	scene.add(plane);
  }


function addKeysListener(){
	window.addEventListener('keydown', function(event){
	  keyboard[event.keyCode] = true;
	} , false);
	window.addEventListener('keyup', function(event){
	  keyboard[event.keyCode] = false;
	} , false);

	window.addEventListener("keyup", (event) => {
		// boiler plate code to prevent side effects
		if (event.isComposing || event.keyCode === 229) {
		  return;
		}
	
		// space bar 
		if (event.keyCode == 32) {
		  let projectileMeshClone = projectileMesh.clone();
		  projectileMeshClone.position.x = playerMesh.position.x;
		  projectileMeshClone.position.y = playerMesh.position.y;
		  projectileMeshClone.position.z = playerMesh.position.z;
		  scene.add(projectileMeshClone);
		  projectileMeshes.push(projectileMeshClone);
		}
	  });
}



function movePlayer(){
	// left letter A
	if(keyboard[65] && playerMesh.position.x > -20) playerMesh.position.x -= 0.25;
	// right letter D
	if(keyboard[68] && playerMesh.position.x < 20) playerMesh.position.x += 0.25;
  }



async function addProjectile(){
	let geometry = new THREE.BoxGeometry(1,1,1);
	let material = new THREE.MeshBasicMaterial({color: 'green'});
	projectileMesh = new THREE.Mesh(geometry, material);
}



function updateProjectiles(){
	projectileMeshes.forEach((projectile, index) => {
		projectile.position.z -= 0.5;
		if(projectile.position.z < -20){
			scene.remove(projectile);
			projectileMeshes.splice(index, 1);
		  }
	});
}


function addAnimal(posX = 0){

	let geometry = new THREE.BoxGeometry(1,1,1);
	let material = new THREE.MeshBasicMaterial({color: 'yellow'});
	animalMesh = new THREE.Mesh(geometry, material);

	//set position
	animalMesh.position.x = posX;
	animalMesh.position.y = 0;
	animalMesh.position.z = -20;
  
	animalMeshes.push(animalMesh);
	scene.add(animalMesh);
  }

function spawnAnimals(){
	// random number between -20 and 20
	let randomX = Math.floor(Math.random() * 20) - 10;
	addAnimal(randomX);
	setInterval(() => {
		randomX = Math.floor(Math.random() * 20) - 10;
		addAnimal(randomX);
	}, 2000);
  }

function updateAnimals(){
	animalMeshes.forEach((animal, index) => {
		animal.position.z += 0.15;
		if(animal.position.z > 0){
		  scene.remove(animal);
		  animalMeshes.splice(index, 1);
		}
	  });

}
  