
import * as THREE from 'three';
import React , { useRef, useEffect }from 'react';
import { InitStats} from '@site/src/components/initStats';
import { InitScene} from '@site/src/components/InitScene';
import { InitGui } from '@site/src/components/InitGui';

import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils'
import { BufferGeometry } from 'three';
import { BoxGeometry } from 'three';


export function Scene() {

    const ref = useRef(null);

    useEffect(()=>{

        const div = ref.current;
        var [scene, camera, renderer] = InitScene(div);
        var stats = InitStats('b');
        var gui = InitGui('b');

        // call the render function
        var step = 0;

        var cubeMaterial = new THREE.MeshNormalMaterial({ transparent: true, opacity: 0.5});
        var controls = new function () {
            this.cameraNear = camera.near;
            this.cameraFar = camera.far;
            this.rotationSpeed = 0.02;
            this.combined = false;


            this.numberOfObjects = 500;

            this.redraw = function () {
                var toRemove = [];
                scene.traverse(function (e) {
                    if (e instanceof THREE.Mesh) toRemove.push(e);
                });
                toRemove.forEach(function (e) {
                    scene.remove(e)
                });

                // add a large number of cubes
                if (controls.combined) {
                    var geometries = [];
                    for (var i = 0; i < controls.numberOfObjects; i++) {
                        var cubeMesh = addCube();
                        //cubeMesh.updateMatrix();
                        cubeMesh.geometry.translate(cubeMesh.position.x,cubeMesh.position.y,cubeMesh.position.z);
                        geometries.push(cubeMesh.geometry);
                    }

                    var geometry = BufferGeometryUtils.mergeBufferGeometries(geometries,false);

                    scene.add(new THREE.Mesh(geometry, cubeMaterial));

                } else {
                    for (var i = 0; i < controls.numberOfObjects; i++) {
                        scene.add(addCube());
                    }
                }
            };

            this.outputObjects = function () {
                console.log(scene.children);
            }
        };

        gui.add(controls, 'numberOfObjects', 0, 20000);
        gui.add(controls, 'combined').onChange(controls.redraw);
        gui.add(controls, 'redraw');


        controls.redraw();

        render();

        var rotation = 0;

        function addCube() {

            var cubeSize = 1.0;
            var cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

            var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.castShadow = true;

            // position the cube randomly in the scene
            cube.position.x = -60 + Math.round((Math.random() * 100));
            cube.position.y = Math.round((Math.random() * 10));
            cube.position.z = -150 + Math.round((Math.random() * 175));

            // add the cube to the scene
            return cube;
        }

        function render() {

            rotation += 0.005;

            stats.update();

//            scene.rotation.x+=0.02;

            // rotate the cubes around its axes
//            scene.traverse(function(e) {
//                if (e instanceof THREE.Mesh ) {
//
//                    e.rotation.x+=controls.rotationSpeed;
//                    e.rotation.y+=controls.rotationSpeed;
//                    e.rotation.z+=controls.rotationSpeed;
//                }
//            });

            camera.position.x = Math.sin(rotation) * 50;
            // camera.position.y = Math.sin(rotation) * 40;
            camera.position.z = Math.cos(rotation) * 50;
            camera.lookAt(scene.position);

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
