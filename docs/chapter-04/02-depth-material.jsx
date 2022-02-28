import * as THREE from 'three';
import React , { useRef, useEffect }from 'react';
import { InitStats} from '/src/components/initStats';
import { InitScene} from '/src/components/InitScene';
import { InitGui } from '/src/components/InitGui';

export function Scene() {

    const ref = useRef(null);

    useEffect(()=>{

        const div = ref.current;
        var [scene, camera, renderer] = InitScene(div);
        var stats = InitStats('b');
        var gui = InitGui('b');

        renderer.setClearColor(new THREE.Color(0x000000));
        scene.overrideMaterial = new THREE.MeshDepthMaterial();

        // position and point the camera to the center of the scene
        camera.position.x = -50;
        camera.position.y = 40;
        camera.position.z = 50;
        camera.near = 20;
        camera.far = 139;
        camera.lookAt(scene.position);
        camera.lookAt(scene.position);

        // call the render function
        var step = 0;

        var controls = new function () {
            this.cameraNear = camera.near;
            this.cameraFar = camera.far;
            this.rotationSpeed = 0.02;
            this.numberOfObjects = scene.children.length;

            this.removeCube = function () {
                var allChildren = scene.children;
                var lastObject = allChildren[allChildren.length - 1];
                if (lastObject instanceof THREE.Mesh) {
                    scene.remove(lastObject);
                    this.numberOfObjects = scene.children.length;
                }
            };

            this.addCube = function () {

                var cubeSize = Math.ceil(3 + (Math.random() * 3));
                var cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
                var cubeMaterial = new THREE.MeshDepthMaterial();
                var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
                cube.castShadow = true;

                // position the cube randomly in the scene
                cube.position.x = -60 + Math.round((Math.random() * 100));
                cube.position.y = Math.round((Math.random() * 10));
                cube.position.z = -100 + Math.round((Math.random() * 150));

                // add the cube to the scene
                scene.add(cube);
                this.numberOfObjects = scene.children.length;
            };

            this.outputObjects = function () {
                console.log(scene.children);
            }
        };

        gui.add(controls, 'rotationSpeed', 0, 0.5);
        gui.add(controls, 'addCube');
        gui.add(controls, 'removeCube');
        gui.add(controls, 'cameraNear', 0, 50).onChange(function (e) {
            camera.near = e;
        });
        gui.add(controls, 'cameraFar', 50, 200).onChange(function (e) {
            camera.far = e;
        });

        var i = 0;
        while (i < 30) {
            controls.addCube();
            i++;
        }


        render();

        function render() {
            stats.update();

            camera.updateProjectionMatrix();

            // rotate the cubes around its axes
            scene.traverse(function (e) {
                if (e instanceof THREE.Mesh) {

                    e.rotation.x += controls.rotationSpeed;
                    e.rotation.y += controls.rotationSpeed;
                    e.rotation.z += controls.rotationSpeed;
                }
            });

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

