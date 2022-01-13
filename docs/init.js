import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI  } from 'three/examples/jsm/libs/dat.gui.module'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export function initStats() {

    var stats = new Stats();

    stats.setMode(0); // 0: fps, 1: ms

    // Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    document.getElementById("Stats-output").appendChild(stats.domElement);

    return stats;
}

export function InitGui(){

    var gui = new GUI();
    // Align top-left
    gui.domElement.style.position = 'absolute';
    gui.domElement.style.right = '0px';
    gui.domElement.style.top = '0px';
    document.getElementById("Gui-output").appendChild(gui.domElement);

    return gui;
}

export function InitScene(div)
{
    const width = div.clientWidth
    const height = div.clientHeight

    // create a scene, that will hold all our elements such as objects, cameras and lights.
    var scene = new THREE.Scene();

    // create a camera, which defines where we're looking at.
    var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    // position and point the camera to the center of the scene
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);

    // create a render and set the size
    var renderer = new THREE.WebGLRenderer({antialias:true});

    renderer.setClearColor(new THREE.Color(0xEEEEEE));
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled= true;

    // add the output of the renderer to the html element
    div.appendChild(renderer.domElement);

    // OrbitControls allow a camera to orbit around the object
    // https://threejs.org/docs/#examples/controls/OrbitControls
    var orbitControls = new OrbitControls( camera, renderer.domElement );
    orbitControls.target.copy(scene.position);
    orbitControls.update();

    return [scene,camera,renderer];
}