import React , { useRef, useEffect }from 'react';
import * as THREE from 'three';
import  {InitStats} from '/src/components/initStats';
import  {InitGui}  from '/src/components/initGui';


export function Scene() {

    const ref = useRef(null);

    useEffect(()=>{

        var stats = InitStats();
        var gui = InitGui();

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
        var renderer = new THREE.WebGLRenderer({antialias:true});
    
        renderer.setClearColor(new THREE.Color(0xEEEEEE));
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled= true;
    
        // add the output of the renderer to the html element
        div.appendChild(renderer.domElement);

        // create the ground plane
        var planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1);
        var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
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
        sphere.position.y = 0;
        sphere.position.z = 2;
        sphere.castShadow = true;

        // add the sphere to the scene
        scene.add(sphere);

        // position and point the camera to the center of the scene
        camera.position.x = -30;
        camera.position.y = 40;
        camera.position.z = 30;
        camera.lookAt(scene.position);

        // add subtle ambient lighting
        var ambientLight = new THREE.AmbientLight(0x0c0c0c);
        scene.add(ambientLight);

        // add spotlight for the shadows
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-40, 60, -10);
        spotLight.castShadow = true;
        scene.add(spotLight);

        // call the render function
        var step = 0;

        var controls = new function () {
            this.rotationSpeed = 0.02;
            this.bouncingSpeed = 0.03;
        };

        gui.add(controls, 'rotationSpeed', 0, 0.5);
        gui.add(controls, 'bouncingSpeed', 0, 0.5);

        function animate() {
            stats.update();
            // rotate the cube around its axes
            cube.rotation.x += controls.rotationSpeed;
            cube.rotation.y += controls.rotationSpeed;
            cube.rotation.z += controls.rotationSpeed;

            // bounce the sphere up and down
            step += controls.bouncingSpeed;
            sphere.position.x = 20 + ( 10 * (Math.cos(step)));
            sphere.position.y = 2 + ( 10 * Math.abs(Math.sin(step)));

            // render using requestAnimationFrame
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }

        animate();

        function onResize() {
            camera.aspect = window.innerWidth / window.innerHeight;     
            camera.updateProjectionMatrix(); 
            renderer.setSize(window.innerWidth , window.innerHeight);
        }

        // listen to the resize events
        window.addEventListener('resize', onResize, false);

    },[]);

    return (
   
        <div
            style={{
            position:'absolute',
            height:'100%',
            width:'100%'
            }}
            ref={ref}
        >
        <div id="Stats-output" >
        </div>
        <div id="Gui-output">
        </div>
        </div>
    );
}