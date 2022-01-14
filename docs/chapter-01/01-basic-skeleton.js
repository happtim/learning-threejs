import * as THREE from 'three';

// create a scene, that will hold all our elements such as objects, cameras and lights.
var scene  = new THREE.Scene();

// create a camera, which defines where we're looking at.
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

// position and point the camera to the center of the scene
camera.position.x = -30;
camera.position.y = 40;
camera.position.z = 30;
camera.lookAt(scene.position);

// create a render and set the size
var renderer = new THREE.WebGLRenderer({antialias: true});
//renderer.setClearColorHex();
renderer.setClearColor(new THREE.Color(0xEEEEEE));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
// add the output of the renderer to the html element
document.body.appendChild(renderer.domElement);

// show axes in the screen
var axes = new THREE.AxesHelper(20);
scene.add(axes);

// create the ground plane
var planeGeometry = new THREE.PlaneGeometry(60, 20);
var planeMaterial = new THREE.MeshBasicMaterial({color: 0xcccccc});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);

// rotate and position the plane
plane.rotation.x = -0.5 * Math.PI;
plane.position.set(15,0,0);
// add the plane to the scene
scene.add(plane);

// create a cube
var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
var cubeMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true});
var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

// position the cube
cube.position.set(-4,3,0);
// add the cube to the scene
scene.add(cube);

// create a sphere
var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
var sphereMaterial = new THREE.MeshBasicMaterial({color: 0x7777ff, wireframe: true});
var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

// position the sphere
sphere.position.set(20,4,2);
// add the sphere to the scene
scene.add(sphere);

// call the render function
renderer.render(scene,camera);