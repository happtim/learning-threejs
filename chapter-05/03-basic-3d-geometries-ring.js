import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module"
import {GUI} from "three/examples/jsm/libs/dat.gui.module"
import {SceneUtils } from 'three/examples/jsm/utils/SceneUtils'


var stats = initStats();

// create a scene, that will hold all our elements such as objects, cameras and lights.
var scene = new THREE.Scene();

// create a camera, which defines where we're looking at.
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

// create a render and set the size
var webGLRenderer = new THREE.WebGLRenderer();
webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
webGLRenderer.setSize(window.innerWidth, window.innerHeight);
webGLRenderer.shadowMapEnabled = true;

var torus = createMesh(new THREE.RingGeometry());
// add the sphere to the scene
scene.add(torus);

// position and point the camera to the center of the scene
camera.position.x = -30;
camera.position.y = 40;
camera.position.z = 50;
camera.lookAt(new THREE.Vector3(10, 0, 0));

// add the output of the renderer to the html element
document.getElementById("WebGL-output").appendChild(webGLRenderer.domElement);

// call the render function
var step = 0;

// setup the control gui
var controls = new function () {
    // we need the first child, since it's a multimaterial

    this.innerRadius = 0;
    this.outerRadius = 50;
    this.thetaSegments = 8;
    this.phiSegments = 8;
    this.thetaStart = 0;
    this.thetaLength = Math.PI * 2;

    this.redraw = function () {
        // remove the old plane
        scene.remove(torus);
        // create a new one

        torus = createMesh(new THREE.RingGeometry(controls.innerRadius, controls.outerRadius, controls.thetaSegments, controls.phiSegments, controls.thetaStart, controls.thetaLength));
        // add it to the scene.
        scene.add(torus);
    };
};

var gui = new GUI();
gui.add(controls, 'innerRadius', 0, 40).onChange(controls.redraw);
gui.add(controls, 'outerRadius', 0, 100).onChange(controls.redraw);
gui.add(controls, 'thetaSegments', 1, 40).step(1).onChange(controls.redraw);
gui.add(controls, 'phiSegments', 1, 20).step(1).onChange(controls.redraw);
gui.add(controls, 'thetaStart', 0, Math.PI * 2).onChange(controls.redraw);
gui.add(controls, 'thetaLength', 0, Math.PI * 2).onChange(controls.redraw);


render();

function createMesh(geom) {

    // assign two materials
    var meshMaterial = new THREE.MeshNormalMaterial();
    meshMaterial.side = THREE.DoubleSide;
    var wireFrameMat = new THREE.MeshBasicMaterial();
    wireFrameMat.wireframe = true;

    // create a multimaterial
    var mesh = SceneUtils.createMultiMaterialObject(geom, [meshMaterial, wireFrameMat]);

    return mesh;
}

function render() {
    stats.update();

    torus.rotation.y = step += 0.01;

    // render using requestAnimationFrame
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
