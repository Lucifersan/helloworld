import './style.css'
import * as THREE from 'three';
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js';
import { CardBody } from 'reactstrap';


const randomLocation = ["tower.html", "cntower.html", "colosseum.html", "pyramid.html"]

//create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector('#bg'),

});

const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = function(url, item, total) {
    console.log(`Started loading: ${url}`);
}


const progressBar = document.getElementById('progress-bar');
const body = document.getElementById("myModal")

loadingManager.onProgress = function(url, loaded, total) {
    progressBar.value = (loaded / total) * 100;
}

const progressBarContainer = document.querySelector('.progress-bar-container');

loadingManager.onLoad = function() {
    progressBarContainer.style.display = 'none';
}




//ADDING IN CLICKABILITY MAYHAPS!!!

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let clickable = THREE.Object3D;

function onDblClick( event ) {
	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  
  // update the picking ray with the camera and pointer position
  raycaster.setFromCamera( pointer, camera );

  // calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(scene.children) ;
  let number = Math.floor(Math.random()*4);

  console.log(randomLocation[number])
  window.location.href = randomLocation[number];

  // if(intersects.length > 0&& intersects[0].object.userData.name != undefined){
  //   // modals[number].style.display = "block";
  //   console.log(intersects[0].object.userData.name)
    
  // }

} 

//END OF CLICKING STUFF

//Keep track of the mouse position, so we can make the earth move
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

//Keep the 3D object on a global variable so we can access it later
let earth;
let toronto, paris, egypt;
const world = new THREE.Group();

//OrbitControls allow the camera to move around the scene
let controls;

//Instantiate a loader for the .gltf file
const loader = new GLTFLoader(loadingManager);

//Load the earth file
function loadEarth(){
  loader.load(`./models/earth.gltf`, (gltf) =>{
    gltf.scene.scale.set( 20 , 20, 20 );
    //If the file is loaded, add it to the scene
    earth = gltf.scene;
    earth.position.set(0, 0, 0);
    earth.userData = {
      name:"earth"
    };
    world.add(earth);
  }, undefined, function ( error ) {
  //log any errors
    console.error( error );
  });
}

//Load the OTHER files (pins)

function loadToronto(){
  loader.load(`./models/pin.gltf`, (gltf) =>{
    gltf.scene.scale.set( 20 , 20, 20 );
    toronto = gltf.scene;
    toronto.position.set(0, 20, 0);
    toronto.userData.clickable = true;
    toronto.userData.name = "Toronto"
    world.add(toronto);
  }, undefined, function ( error ) {
    console.error( error );
  });
}

//This adds controls to the camera, so we can rotate / zoom it with the mouse
controls = new OrbitControls(camera, renderer.domElement);

// Scene object (kinda like the 3d space where everything exists)
const scene = new THREE.Scene();
renderer.setPixelRatio( window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
scene.add(world);

// sets camera position (x, y, z)
camera.position.set(0,0,50);
renderer.render(scene, camera );

//Pointed Light (spotlight)
const pointLight = new THREE.PointLight(0x05faf2);
pointLight.position.set(20,20,20);

//Light in general i guess?
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

function animate(){
  requestAnimationFrame(animate);
  world.rotation.x += 0.001;
  world.rotation.y += 0.001;
  renderer.render(scene,camera);
}

window.addEventListener( 'dblclick', onDblClick );


//Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


function addStar(){
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({color:0xFFFFFF});
  const star = new THREE.Mesh(geometry, material);
  //randomly fills an array of size 3 with numbers from 1-100
  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

loadEarth();
loadToronto();

animate();