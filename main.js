import './style.css'
import * as THREE from 'three';
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from "/node_modules/three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "/node_modules/three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "/node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js";

//create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector('#bg'),

});

//Keep track of the mouse position, so we can make the earth move
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

//Keep the 3D object on a global variable so we can access it later
let object;

//OrbitControls allow the camera to move around the scene
let controls;

//Set which object to render
let objToRender = 'earth';

//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

//Load the file 
loader.load(`./${objToRender}.gltf`, (gltf) =>{
    gltf.scene.scale.set( 20 , 20, 20 );
    //If the file is loaded, add it to the scene
    object = gltf.scene;
    scene.add(object);
  },
  function (xhr) {
    //While it is loading, log the progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    //If there is an error, log it
    console.error(error);
  }
);

//This adds controls to the camera, so we can rotate / zoom it with the mouse
if (objToRender === "earth") {
  controls = new OrbitControls(camera, renderer.domElement);
}

// Scene object (kinda like the 3d space where everything exists)
const scene = new THREE.Scene();
renderer.setPixelRatio( window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// sets camera position (x, y, z)
camera.position.set(20,0,50);
renderer.render(scene, camera );

//Pointed Light (spotlight)
const pointLight = new THREE.PointLight(0xdc2eff, 100, 0, 0);
pointLight.position.set(0,0,0);

//Light in general i guess?
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(pointLight, ambientLight);

//bloom
const renderScene = new RenderPass(scene, camera)
const composer = new EffectComposer(renderer)
composer.addPass(renderScene)
const bloomPass = new UnrealBloomPass (
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  .2,
  1.5,
  .7
)
composer.addPass(bloomPass);

function animate(){
  requestAnimationFrame(animate);
  object.rotation.x += 0.01;
  object.rotation.y += 0.01;
  composer.render();
}

//Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
