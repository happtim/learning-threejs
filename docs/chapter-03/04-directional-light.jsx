import * as THREE from 'three';
import React , { useRef, useEffect }from 'react';
import { InitStats} from '@site/src/components/initStats';
import { InitScene} from '@site/src/components/InitScene';
import { InitGui } from '@site/src/components/InitGui';

export function Scene() {

    const ref = useRef(null);

    useEffect(()=>{

        const div = ref.current;
        var [scene, camera, renderer] = InitScene(div);
        var stats = InitStats();
        var gui = InitGui();


        // create the ground plane
        var planeGeometry = new THREE.PlaneGeometry(600, 200, 20, 20);
        var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;

        // rotate and position the plane
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 15;
        plane.position.y = -5;
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
        var ambiColor = "#1c1c1c";
        var ambientLight = new THREE.AmbientLight(ambiColor);
        scene.add(ambientLight);


        var target = new THREE.Object3D();
        target.position .set(5, 0, 0);


        var pointColor = "#ff5808";
        var directionalLight = new THREE.DirectionalLight(pointColor);
        directionalLight.intensity = 0.5;
        directionalLight.position.set(-40, 60, -10);
        directionalLight.castShadow = true;

        directionalLight.shadow.camera.near = 2;
        directionalLight.shadow.camera.far = 200;
        directionalLight.shadow.camera.left = -50;
        directionalLight.shadow.camera.right = 50;
        directionalLight.shadow.camera.top = 50;
        directionalLight.shadow.camera.bottom = -50;

        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.mapSize.Width = 1024;

        scene.add(directionalLight);

        const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight,6);
        directionalLightHelper.visible = false;
        scene.add( directionalLightHelper);

        const debugCamera = new THREE.CameraHelper(directionalLight.shadow.camera);
        debugCamera.visible = false;
        scene.add(debugCamera);

        // add a small sphere simulating the pointlight
        var sphereLight = new THREE.SphereGeometry(0.2);
        var sphereLightMaterial = new THREE.MeshBasicMaterial({color: 0xac6c25});
        var sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
        sphereLightMesh.castShadow = true;

        sphereLightMesh.position .set(3, 20, 3);
        scene.add(sphereLightMesh);

        // call the render function
        var step = 0;

        // used to determine the switch point for the light animation
        var invert = 1;
        var phase = 0;

        var controls = new function () {
            this.rotationSpeed = 0.03;
            this.bouncingSpeed = 0.03;
            this.ambientColor = ambiColor;
            this.pointColor = pointColor;
            this.intensity = 0.5;
            this.distance = 0;
            this.exponent = 30;
            this.angle = 0.1;
            this.debug = false;
            this.castShadow = true;
            this.target = "Plane";

        };

        gui.addColor(controls, 'ambientColor').onChange(function (e) {
            ambientLight.color = new THREE.Color(e);
        });

        gui.addColor(controls, 'pointColor').onChange(function (e) {
            directionalLight.color = new THREE.Color(e);
        });

        gui.add(controls, 'intensity', 0, 5).onChange(function (e) {
            directionalLight.intensity = e;
        });

        gui.add(controls, 'debug').onChange(function (e) {
            directionalLightHelper.visible = e;
            debugCamera.visible = e;
        });

        gui.add(controls, 'castShadow').onChange(function (e) {
            directionalLight.castShadow = e;
        });


        gui.add(controls, 'target', ['Plane', 'Sphere', 'Cube']).onChange(function (e) {
            console.log(e);
            switch (e) {
                case "Plane":
                    directionalLight.target = plane;
                    break;
                case "Sphere":
                    directionalLight.target = sphere;
                    break;
                case "Cube":
                    directionalLight.target = cube;
                    break;
            }

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

            sphereLightMesh.position.z = -8;
            sphereLightMesh.position.y = +(27 * (Math.sin(step / 3)));
            sphereLightMesh.position.x = 10 + (26 * (Math.cos(step / 3)));

            directionalLight.position.copy(sphereLightMesh.position);
            directionalLightHelper.update();
            debugCamera.update();

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