import * as THREE from 'three';
import React , { useRef, useEffect }from 'react';
import { InitStats} from '@site/src/components/initStats';
import { InitScene} from '@site/src/components/InitScene';
import { InitGui } from '@site/src/components/InitGui';

import SpriteText from 'three-spritetext';
import { Object3D } from 'three/src/core/Object3D';

export function Scene() {

    const ref = useRef(null);

    useEffect(()=>{

        const div = ref.current;
        var [scene, camera, renderer] = InitScene(div);
        var stats = InitStats('c');
        var gui = InitGui('c');
        var group = new THREE.Group();

        // call the render function
        var step = 0;

        var cubeMaterial = new THREE.MeshNormalMaterial({ transparent: true, opacity: 0.5});
        var controls = new function () {
            this.cameraNear = camera.near;
            this.cameraFar = camera.far;
            this.rotationSpeed = 0.02;
            this.lod = false;


            this.numberOfObjects = 500;

            this.redraw = function () {
                var toRemove = [];
                scene.traverse(function (e) {
                    if (e instanceof SpriteText) toRemove.push(e);
                });
                toRemove.forEach(function (e) {
                    scene.remove(e)
                });
                scene.remove(group);
                group.clear();

                // add a large number of cubes
                if (controls.lod) {
                    for (var i = 0; i < controls.numberOfObjects; i++) {
                        var lod = new THREE.LOD();

                        var cube = addCube();
                        var sprite = addSprite(cube);

                        lod.addLevel(sprite, 1); //最小设置雄小于次小
                        lod.addLevel(cube, 50); // will be not visible from 100 and beyond
                        lod.addLevel(new Object3D(), 100); // will be not visible from 100 and beyond

                        lod.position.copy(cube.position);

                        group.add(lod);
                    }

                    scene.add(group);

                } else {
                    for (var i = 0; i < controls.numberOfObjects; i++) {
                        scene.add( addSprite(addCube()));
                    }
                }
            };

            this.outputObjects = function () {
                console.log(scene.children);
            }
        };

        gui.add(controls, 'numberOfObjects', 0, 20000);
        gui.add(controls, 'lod').onChange(controls.redraw);
        gui.add(controls, 'redraw');
        gui.add(controls, 'outputObjects');


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

        function addSprite(cube){
             const sprite = new SpriteText('Cube-Text',1,0x222222);
             sprite.position.copy(cube.position);
             return sprite;
        }

        function render() {

            rotation += 0.005;

            stats.update();

            group.children.forEach(function (child) {
                // LOD update
                child.update(camera);

                // opacity
                //var distance = camera.position.distanceTo(child.position);
                //var opacity = -1 / 400 * distance + 1;
                //if (opacity < 0) {
                //    opacity = 0;
                //}
                //child.getObjectForDistance(distance).material.opacity = opacity;

            });


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
        <div id="Stats-output-c" >
        </div>
        <div id="Gui-output-c">
        </div>
        </div>
    );
}  
