import React , { useRef, useEffect }from 'react';
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export function Scene() {

    const ref = useRef(null);

    useEffect(()=>{

        const div = ref.current;

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
        var renderer = new THREE.WebGLRenderer({
            antialias: true,
        });

        renderer.setClearColor(new THREE.Color(0xEEEEEE));
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled= true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        //renderer.shadowMap.type = THREE.BasicShadowMap
        //renderer.shadowMap.type = THREE.PCFShadowMap
        //renderer.shadowMap.type = THREE.VSMShadowMap

        // add the output of the renderer to the html element
        div.appendChild(renderer.domElement);

        // OrbitControls allow a camera to orbit around the object
        // https://threejs.org/docs/#examples/controls/OrbitControls
        const orbitControls = new OrbitControls( camera, renderer.domElement );
        orbitControls.target.copy(scene.position);
        orbitControls.update();

        // show axes in the screen
        var axes = new THREE.AxesHelper(20);
        scene.add(axes);

        // create the ground plane
        var planeGeometry = new THREE.PlaneGeometry(60, 20);
        var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
        planeMaterial.side = THREE.DoubleSide;
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;

        // rotate and position the plane
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 15;
        plane.position.y = 0;
        plane.position.z = 0;

        // add the plane to the scene
        scene.add(plane);

        // create a cube
        var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
        var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.castShadow = true;

        // position the cube
        cube.position.x = -4;
        cube.position.y = 3;
        cube.position.z = 0;

        // add the cube to the scene
        scene.add(cube);

        var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
        var sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff});
        var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

        // position the sphere
        sphere.position.x = 20;
        sphere.position.y = 4;
        sphere.position.z = 2;
        sphere.castShadow = true;

        // add the sphere to the scene
        scene.add(sphere);

        // add spotlight for the shadows
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-40, 60, -10);
        spotLight.castShadow = true;
        scene.add(spotLight);

        // call the render function
        function animate() {
            requestAnimationFrame( animate );
            // required if controls.enableDamping or controls.autoRotate are set to true
            orbitControls.update();
            renderer.render( scene, camera );
        }

        animate();

    },[]);

    return (

        <div
            style={{
            height: 500 ,
            display: 'block',
            }}
            ref={ref}
        >
        </div>
    );
}