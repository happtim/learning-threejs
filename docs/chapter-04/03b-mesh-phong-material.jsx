import * as THREE from 'three';
import React , { useRef, useEffect }from 'react';
import { InitStats} from '/src/components/initStats';
import { InitScene} from '/src/components/initScene';
import { InitGui } from '/src/components/initGui';

export function Scene() {

    const ref = useRef(null);

    useEffect(()=>{

        const div = ref.current;
        var [scene, camera, renderer] = InitScene(div);
        var stats = InitStats('b');
        var gui = InitGui('b');

        var groundGeom = new THREE.PlaneGeometry(100, 100, 4, 4);
        var groundMesh = new THREE.Mesh(groundGeom, new THREE.MeshBasicMaterial({color: 0x555555}));
        groundMesh.rotation.x = -Math.PI / 2;
        groundMesh.position.y = -20;
        scene.add(groundMesh);

        var sphereGeometry = new THREE.SphereGeometry(14, 20, 20);
        var cubeGeometry = new THREE.BoxGeometry(15, 15, 15);
        var planeGeometry = new THREE.PlaneGeometry(14, 14, 4, 4);


        var meshMaterial = new THREE.MeshPhongMaterial({color: 0x7777ff});
        var sphere = new THREE.Mesh(sphereGeometry, meshMaterial);
        var cube = new THREE.Mesh(cubeGeometry, meshMaterial);
        var plane = new THREE.Mesh(planeGeometry, meshMaterial);

        // position the sphere
        sphere.position.x = 0;
        sphere.position.y = 3;
        sphere.position.z = 2;

        cube.position .copy( sphere.position);
        plane.position .copy( sphere.position);

        // add the sphere to the scene
        scene.add(cube);

        // add spotlight for the shadows
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-0, 30, 60);
        spotLight.castShadow = true;
        spotLight.intensity = 0.6;
        scene.add(spotLight);

        // call the render function
        var step = 0;

        var controls = new function () {
            this.rotationSpeed = 0.02;
            this.bouncingSpeed = 0.03;

            this.opacity = meshMaterial.opacity;
            this.transparent = meshMaterial.transparent;
            this.visible = meshMaterial.visible;
            this.emissive = meshMaterial.emissive.getHex();
            this.specular = meshMaterial.specular.getHex();
            this.shininess = meshMaterial.shininess;
            this.side = "front";

            this.color = meshMaterial.color.getStyle();

            this.selectedMesh = "cube";

        };

        var spGui = gui.addFolder("Mesh");
        spGui.add(controls, 'opacity', 0, 1).onChange(function (e) {
            meshMaterial.opacity = e
        });
        spGui.add(controls, 'transparent').onChange(function (e) {
            meshMaterial.transparent = e
        });
        spGui.add(controls, 'visible').onChange(function (e) {
            meshMaterial.visible = e
        });

        spGui.addColor(controls, 'emissive').onChange(function (e) {
            meshMaterial.emissive = new THREE.Color(e)
        });
        spGui.addColor(controls, 'specular').onChange(function (e) {
            meshMaterial.specular = new THREE.Color(e)
        });
        spGui.add(controls, 'shininess', 0, 200).onChange(function (e) {
            meshMaterial.shininess = e
        });
        spGui.add(controls, 'side', ["front", "back", "double"]).onChange(function (e) {
            console.log(e);
            switch (e) {
                case "front":
                    meshMaterial.side = THREE.FrontSide;
                    break;
                case "back":
                    meshMaterial.side = THREE.BackSide;
                    break;
                case "double":
                    meshMaterial.side = THREE.DoubleSide;
                    break;
            }
            meshMaterial.needsUpdate = true;
            console.log(meshMaterial);
        });
        spGui.addColor(controls, 'color').onChange(function (e) {
            meshMaterial.color.setStyle(e)
        });
        spGui.add(controls, 'selectedMesh', ["cube", "sphere", "plane"]).onChange(function (e) {

            scene.remove(plane);
            scene.remove(cube);
            scene.remove(sphere);

            switch (e) {
                case "cube":
                    scene.add(cube);
                    break;
                case "sphere":
                    scene.add(sphere);
                    break;
                case "plane":
                    scene.add(plane);
                    break;
            }
        });

        render();

        function render() {
            stats.update();

            cube.rotation.y = step += 0.01;
            plane.rotation.y = step;
            sphere.rotation.y = step;

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
        <div id="Stats-output-b" >
        </div>
        <div id="Gui-output-b">
        </div>
        </div>
    );
}  

