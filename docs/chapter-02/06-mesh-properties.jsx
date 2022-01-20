import * as THREE from "three";
import React , { useRef, useEffect } from 'react';
import { InitScene, InitStats,InitGui } from '../init'

export function Scene() {

    const ref = useRef(null);

    useEffect(()=>{

        const div = ref.current;

        var [scene, camera, renderer] = InitScene(div);
        var stats = InitStats();
        var gui = InitGui();

        // create the ground plane
        var planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
        var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;

        // rotate and position the plane
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 0;
        plane.position.y = 0;
        plane.position.z = 0;

        // add the plane to the scene
        scene.add(plane);

        // add subtle ambient lighting
        var ambientLight = new THREE.AmbientLight(0x0c0c0c);
        scene.add(ambientLight);

        // add spotlight for the shadows
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-40, 60, 20);
        spotLight.castShadow = true;
        scene.add(spotLight);

        var controls = new function () {
            this.scaleX = 1;
            this.scaleY = 1;
            this.scaleZ = 1;

            this.positionX = 0;
            this.positionY = 4;
            this.positionZ = 0;

            this.rotationX = 0;
            this.rotationY = 0;
            this.rotationZ = 0;
            this.scale = 1;

            this.translateX = 0;
            this.translateY = 0;
            this.translateZ = 0;

            this.visible = true;

            this.translate = function () {

                cube.translateX(controls.translateX);
                cube.translateY(controls.translateY);
                cube.translateZ(controls.translateZ);

                controls.positionX = cube.position.x;
                controls.positionY = cube.position.y;
                controls.positionZ = cube.position.z;
            }
        };

        var material = new THREE.MeshLambertMaterial({color: 0x44ff44});
        var geom = new THREE.BoxGeometry(5, 8, 3);
        var cube = new THREE.Mesh(geom, material);
        cube.position.y = 4;
        cube.castShadow = true;
        scene.add(cube);

        var guiScale = gui.addFolder('scale');
        guiScale.add(controls, 'scaleX', 0, 5);
        guiScale.add(controls, 'scaleY', 0, 5);
        guiScale.add(controls, 'scaleZ', 0, 5);

        var guiPosition = gui.addFolder('position');
        var contX = guiPosition.add(controls, 'positionX', -10, 10);
        var contY = guiPosition.add(controls, 'positionY', -4, 20);
        var contZ = guiPosition.add(controls, 'positionZ', -10, 10);

        contX.listen();//当绑定变量发生变化,同时在空间上显示
        contX.onChange(function (value) {
            cube.position.x = controls.positionX;
        });

        contY.listen();
        contY.onChange(function (value) {
            cube.position.y = controls.positionY;
        });

        contZ.listen();
        contZ.onChange(function (value) {
            cube.position.z = controls.positionZ;
        });


        var guiRotation = gui.addFolder('rotation');
        guiRotation.add(controls, 'rotationX', -4, 4);
        guiRotation.add(controls, 'rotationY', -4, 4);
        guiRotation.add(controls, 'rotationZ', -4, 4);

        var guiTranslate = gui.addFolder('translate');

        guiTranslate.add(controls, 'translateX', -10, 10);
        guiTranslate.add(controls, 'translateY', -10, 10);
        guiTranslate.add(controls, 'translateZ', -10, 10);
        guiTranslate.add(controls, 'translate');

        gui.add(controls, 'visible');

        render();

        function render() {
            stats.update();

            // render using requestAnimationFrame
            cube.visible = controls.visible;

            cube.rotation.x = controls.rotationX;
            cube.rotation.y = controls.rotationY;
            cube.rotation.z = controls.rotationZ;

            cube.scale.set(controls.scaleX, controls.scaleY, controls.scaleZ);

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