import * as THREE from "three";
import React , { useRef, useEffect }from 'react';
import { InitStats} from '/src/components/initStats';
import { InitScene} from '/src/components/initScene';
import { InitGui } from '/src/components/initGui';

export function Scene() {

    const ref = useRef(null);

    useEffect(()=>{

        const div = ref.current;
        var [scene, camera, renderer] = InitScene(div);
        var stats = InitStats();
        var gui = InitGui();

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

        // add subtle ambient lighting
        var ambiColor = "#0c0c0c";
        var intensity = 1;
        var ambientLight = new THREE.AmbientLight(ambiColor,intensity);
        scene.add(ambientLight);

        // add spotlight for the shadows
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-40, 60, -10);
        spotLight.castShadow = true;
        scene.add(spotLight);

        // call the render function
        var step = 0;

        var controls = new function () {
            this.intensity = 1;
            this.rotationSpeed = 0.02;
            this.bouncingSpeed = 0.03;
            this.ambientColor = ambiColor;
            this.disableSpotlight = false;
        };

        gui.addColor(controls, 'ambientColor').onChange(function (e) {
            ambientLight.color = new THREE.Color(e);
        });
        gui.add(controls,'intensity',0,3).onChange(function(e) {
            ambientLight.intensity = e;
        });
        gui.add(controls, 'disableSpotlight').onChange(function (e) {
            spotLight.visible = !e;
        });


        render();

        function render() {
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
            requestAnimationFrame(render);
            renderer.render(scene, camera);
        }

  },[]);

    return (
   
        <div
            style={{
                height: 500 ,
                position:'relative'
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