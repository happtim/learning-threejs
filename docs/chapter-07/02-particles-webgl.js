import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module"
import {GUI} from "three/examples/jsm/libs/dat.gui.module"
import {SceneUtils } from 'three/examples/jsm/utils/SceneUtils'
import {ConvexGeometry} from 'three/examples/jsm/geometries/ConvexGeometry'

var stats = initStats();

// create a scene, that will hold all our elements such as objects, cameras and lights.
var scene = new THREE.Scene();

// create a camera, which defines where we're looking at.
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

// create a render and set the size
var webGLRenderer = new THREE.WebGLRenderer();
webGLRenderer.setClearColor(new THREE.Color(0x000000));
webGLRenderer.setSize(window.innerWidth, window.innerHeight);

// position and point the camera to the center of the scene
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 150;

// add the output of the renderer to the html element
document.getElementById("WebGL-output").appendChild(webGLRenderer.domElement);


createParticles();
render();

function createParticles() {

    var geom = new THREE.BufferGeometry();
    var material = new THREE.PointsMaterial({size: 4, vertexColors: true, color: 0xffffff});

    var points  = [];
    var colors = [];
    for (var x = -5; x < 5; x++) {
        for (var y = -5; y < 5; y++) {
            var particle = new THREE.Vector3(x * 10, y * 10, 0);
            points.push(particle);
            var color = new THREE.Color(Math.random() * 0x00ffff);
            colors.push(color.r,color.g, color.b);
        }
    }

    geom.setFromPoints(points);
    geom.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

    var cloud = new THREE.Points(geom, material);
    scene.add(cloud);
}


function render() {
    stats.update();


    requestAnimationFrame(render);
    webGLRenderer.render(scene, camera);
}

function initStats() {

    var stats = new Stats();
    stats.setMode(0); // 0: fps, 1: ms

    // Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    document.getElementById("Stats-output").appendChild(stats.domElement);

    return stats;
}