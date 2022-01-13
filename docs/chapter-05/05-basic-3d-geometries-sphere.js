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
var webGLRenderer = new THREE.WebGLRenderer({antialias:true});
webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE));
webGLRenderer.setPixelRatio(window.devicePixelRatio);
webGLRenderer.setSize(window.innerWidth, window.innerHeight);
webGLRenderer.shadowMapEnabled = true;

var sphere = createMesh(new THREE.SphereGeometry(4, 10, 10));
// add the sphere to the scene
scene.add(sphere);

// position and point the camera to the center of the scene
camera.position.x = -20;
camera.position.y = 30;
camera.position.z = 40;
camera.lookAt(new THREE.Vector3(10, 0, 0));


// add the output of the renderer to the html element
document.getElementById("WebGL-output").appendChild(webGLRenderer.domElement);

// call the render function
var step = 0;


    console.log(sphere);
// setup the control gui
var controls = new function () {
    // we need the first child, since it's a multimaterial
    this.radius = sphere.children[0].geometry.parameters.radius;
    this.widthSegments = sphere.children[0].geometry.parameters.widthSegments;
    this.heightSegments = sphere.children[0].geometry.parameters.heightSegments;
    this.phiStart = 0;
    this.phiLength = Math.PI * 2;
    this.thetaStart = 0;
    this.thetaLength = Math.PI;


    this.redraw = function () {
        // remove the old plane
        scene.remove(sphere);
        // create a new one
        sphere = createMesh(new THREE.SphereGeometry(controls.radius, controls.widthSegments, controls.heightSegments, controls.phiStart, controls.phiLength, controls.thetaStart, controls.thetaLength));
        // add it to the scene.
        scene.add(sphere);
    };
};

var gui = new GUI();
gui.add(controls, 'radius', 0, 40).onChange(controls.redraw);
gui.add(controls, 'widthSegments', 0, 20).onChange(controls.redraw);
gui.add(controls, 'heightSegments', 0, 20).onChange(controls.redraw);
gui.add(controls, 'phiStart', 0, 2 * Math.PI).onChange(controls.redraw);
gui.add(controls, 'phiLength', 0, 2 * Math.PI).onChange(controls.redraw);
gui.add(controls, 'thetaStart', 0, 2 * Math.PI).onChange(controls.redraw);
gui.add(controls, 'thetaLength', 0, 2 * Math.PI).onChange(controls.redraw);


render();

function createMesh(geom) {

    // assign two materials
    var meshMaterial = new THREE.MeshNormalMaterial();
    meshMaterial.side = THREE.DoubleSide;
    var wireFrameMat = new THREE.MeshBasicMaterial();
    wireFrameMat.wireframe = true;

    // create a multimaterial
    var mesh = SceneUtils.createMultiMaterialObject(geom, [meshMaterial, wireFrameMat]);
    //var mesh = new THREE.Mesh(geom,meshMaterial);

    return mesh;
}

function render() {
    stats.update();

    sphere.rotation.y = step += 0.01;

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
