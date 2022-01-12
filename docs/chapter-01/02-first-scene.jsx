import React , { useRef, useEffect }from 'react';
import * as THREE from 'three';

export function Scene() {

    const ref = useRef(null);

    useEffect(()=>{

        const div = ref.current;

        const width = div.clientWidth
        const height = div.clientHeight
        
        // create a scene, that will hold all our elements such as objects, cameras and lights.
        var scene  = new THREE.Scene();
        
        // create a camera, which defines where we're looking at.
        var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        
        // position and point the camera to the center of the scene
        camera.position.x = -30;
        camera.position.y = 40;
        camera.position.z = 30;
        camera.lookAt(scene.position);
        
        // create a render and set the size
        var renderer = new THREE.WebGLRenderer({antialias: true});
        //renderer.setClearColorHex();
        renderer.setClearColor(new THREE.Color(0xEEEEEE));
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        // add the output of the renderer to the html element
        div.appendChild(renderer.domElement);
        
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
        cube.position.x = -4;
        cube.position.y = 3;
        cube.position.z = 0;
        
        // add the cube to the scene
        scene.add(cube);
        
        // create a sphere
        var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
        var sphereMaterial = new THREE.MeshBasicMaterial({color: 0x7777ff, wireframe: true});
        var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        
        // position the sphere
        sphere.position.x = 20;
        sphere.position.y = 4;
        sphere.position.z = 2;
        
        // add the sphere to the scene
        scene.add(sphere);

        // call the render function
        renderer.render(scene,camera);
    
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