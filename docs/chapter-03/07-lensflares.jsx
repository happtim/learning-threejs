
import * as THREE from 'three';
import React , { useRef, useEffect }from 'react';
import { InitStats} from '@site/src/components/initStats';
import { InitScene} from '@site/src/components/InitScene';
import { InitGui } from '@site/src/components/InitGui';

import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare.js';
import  GrassImageUrl  from '@site/static/assets/textures/ground/grasslight-big.jpg';

import  Lensflare0 from '@site/static/assets/textures/lensflare/lensflare0.png';
import  Lensflare2 from '@site/static/assets/textures/lensflare/lensflare2.png';
import  Lensflare3 from '@site/static/assets/textures/lensflare/lensflare3.png';
import { Vector3 } from 'three/src/math/Vector3';

export function Scene() {

    const ref = useRef(null);

    useEffect(()=>{

        const div = ref.current;
        var [scene, camera, renderer] = InitScene(div);
        var stats = InitStats();
        var gui = InitGui();


        scene.fog = new THREE.Fog(0xaaaaaa, 0.010, 200);
        renderer.setClearColor(new THREE.Color(0xaaaaff));

        const textureLoader = new THREE.TextureLoader();

        // create the ground plane
        var textureGrass = textureLoader.load(GrassImageUrl);
        //var textureGrass = THREE.ImageUtils.loadTexture("../assets/textures/ground/grasslight-big.jpg");
        textureGrass.wrapS = THREE.RepeatWrapping;
        textureGrass.wrapT = THREE.RepeatWrapping;
        //textureGrass.repeat.set(4, 4);


        var planeGeometry = new THREE.PlaneGeometry(1000, 200, 20, 20);
        var planeMaterial = new THREE.MeshLambertMaterial({map: textureGrass});
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

        // add subtle ambient lighting
        var ambiColor = "#1c1c1c";
        var ambientLight = new THREE.AmbientLight(ambiColor);
        scene.add(ambientLight);

        // add spotlight for a bit of light
        var spotLight0 = new THREE.SpotLight(0xcccccc);
        spotLight0.position.set(-40, 60, -10);
        spotLight0.lookAt(plane);
        scene.add(spotLight0);

        var target = new THREE.Object3D();
        target.position .set(5, 0, 0);


        var pointColor = "#ffffff";
        //    var spotLight = new THREE.SpotLight( pointColor);
        var spotLight = new THREE.DirectionalLight(pointColor);
        spotLight.position.set(30, 10, -50);
        spotLight.castShadow = true;
        spotLight.shadowCameraNear = 0.1;
        spotLight.shadowCameraFar = 100;
        spotLight.shadowCameraFov = 50;
        spotLight.target = plane;
        spotLight.distance = 0;
        spotLight.shadowCameraNear = 2;
        spotLight.shadowCameraFar = 200;
        spotLight.shadowCameraLeft = -100;
        spotLight.shadowCameraRight = 100;
        spotLight.shadowCameraTop = 100;
        spotLight.shadowCameraBottom = -100;
        spotLight.shadowMapWidth = 2048;
        spotLight.shadowMapHeight = 2048;

        scene.add(spotLight);

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
            this.intensity = 0.1;
            this.distance = 0;
            this.exponent = 30;
            this.angle = 0.1;
            this.debug = false;
            this.castShadow = true;
            this.onlyShadow = false;
            this.target = "Plane";

        };

        gui.addColor(controls, 'ambientColor').onChange(function (e) {
            ambientLight.color = new THREE.Color(e);
        });

        gui.addColor(controls, 'pointColor').onChange(function (e) {
            spotLight.color = new THREE.Color(e);
        });

        gui.add(controls, 'intensity', 0, 5).onChange(function (e) {
            spotLight.intensity = e;
        });


        var textureFlare0 = textureLoader.load(Lensflare0);
        var textureFlare1 = textureLoader.load(Lensflare2);
        var textureFlare2 = textureLoader.load(Lensflare3);

        //var flareColor = new THREE.Color(0xffaacc);
        //var lensFlare = new Lensflare(textureFlare0, 350, 0.0, flareColor);

        //lensFlare.add(textureFlare3, 60, 0.6 );
        //lensFlare.add(textureFlare3, 70, 0.7 );
        //lensFlare.add(textureFlare3, 120, 0.9);
        //lensFlare.add(textureFlare3, 70, 1.0 );

        //lensFlare.position.copy(spotLight.position);
        //scene.add(lensFlare);

        const lensflare = new Lensflare();

        lensflare.addElement( new LensflareElement( textureFlare0, 512, 0 ) );
        lensflare.addElement( new LensflareElement( textureFlare1, 512, 0 ) );
        lensflare.addElement( new LensflareElement( textureFlare2, 60, 0.6 ) );

        spotLight.add(lensflare);


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

 