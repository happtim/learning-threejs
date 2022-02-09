import * as THREE from 'three';
import React , { useRef, useEffect }from 'react';
import { InitStats} from '@site/src/components/initStats';
import { InitScene} from '@site/src/components/InitScene';
import { InitGui } from '@site/src/components/InitGui';

import  GrassImageUrl  from '@site/static/img/chapter-03/grasslight-big.jpg';
import { Vector2 } from 'three';

export function Scene() {

    const ref = useRef(null);

    useEffect(()=>{

        const div = ref.current;
        var [scene, camera, renderer] = InitScene(div);
        var stats = InitStats();
        var gui = InitGui();

        scene.fog = new THREE.Fog(0xaaaaaa, 0.010, 200);

        console.log(GrassImageUrl);

        // create the ground plane
        var texture  = new THREE.TextureLoader().load(GrassImageUrl);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(4,4);

        var planeGeometry = new THREE.PlaneGeometry(1000, 200, 20, 20);
        var planeMaterial = new THREE.MeshLambertMaterial({map: texture});
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
        var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff3333});
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.castShadow = true;

        // position the cube
        cube.position.x = -4;
        cube.position.y = 3;
        cube.position.z = 0;

        // add the cube to the scene
        scene.add(cube);

        var sphereGeometry = new THREE.SphereGeometry(4, 25, 25);
        var sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff});
        var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

        // position the sphere
        sphere.position.x = 10;
        sphere.position.y = 5;
        sphere.position.z = 10;
        sphere.castShadow = true;

        // add the sphere to the scene
        scene.add(sphere);

        // add spotlight for a bit of light
        var spotLight0 = new THREE.SpotLight(0xcccccc);
        spotLight0.position.set(-40, 60, -10);
        spotLight0.lookAt(plane);
        scene.add(spotLight0);


        var target = new THREE.Object3D();
        target.position .set(5, 0, 0);

        var hemiLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.6);
        hemiLight.position.set(0, 500, 0);
        scene.add(hemiLight);


        var pointColor = "#ffffff";
        //    var dirLight = new THREE.SpotLight( pointColor);
        var dirLight = new THREE.DirectionalLight(pointColor);
        dirLight.position.set(30, 10, -50);
        dirLight.castShadow = true;
        //        dirLight.shadowCameraNear = 0.1;
        //        dirLight.shadowCameraFar = 100;
        //        dirLight.shadowCameraFov = 50;
        dirLight.target = plane;
        dirLight.shadow.camera.near = 0.1;
        dirLight.shadow.camera.far = 200;
        dirLight.shadow.camera.left = -50;
        dirLight.shadow.camera.right = 50;
        dirLight.shadow.camera.top = 50;
        dirLight.shadow.camera.bottom = -50;
        dirLight.shadow.mapWidth = 2048;
        dirLight.shadow.mapHeight = 2048;


        scene.add(dirLight);

        // call the render function
        var step = 0;

        // used to determine the switch point for the light animation
        var invert = 1;
        var phase = 0;

        var controls = new function () {
            this.rotationSpeed = 0.03;
            this.bouncingSpeed = 0.03;

            this.hemisphere = true;
            this.color = 0x00ff00;
            this.skyColor = 0x0000ff;
            this.intensity = 0.6;

        };

        gui.add(controls, 'hemisphere').onChange(function (e) {

            if (!e) {
                hemiLight.intensity = 0;
            } else {
                hemiLight.intensity = controls.intensity;
            }
        });
        gui.addColor(controls, 'color').onChange(function (e) {
            hemiLight.groundColor = new THREE.Color(e);
        });
        gui.addColor(controls, 'skyColor').onChange(function (e) {
            hemiLight.color = new THREE.Color(e);
        });
        gui.add(controls, 'intensity', 0, 5).onChange(function (e) {
            hemiLight.intensity = e;
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
