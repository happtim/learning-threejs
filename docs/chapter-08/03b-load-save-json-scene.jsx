import * as THREE from 'three';
import React , { useRef, useEffect }from 'react';
import { InitStats} from '@site/src/components/initStats';
import { InitScene} from '@site/src/components/InitScene';
import { InitGui } from '@site/src/components/InitGui';

import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter'

export function Scene() {

    const ref = useRef(null);

    useEffect(()=>{

        const div = ref.current;
        var [scene, camera, renderer] = InitScene(div);
        var stats = InitStats('b');
        var gui = InitGui('b');

        var planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1);
        var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        //  plane.receiveShadow  = true;

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
        cube.name = 'Cube';
        // cube.castShadow = true;

        // position the cube
        cube.position.x = -4;
        cube.position.y = 3;
        cube.position.z = 0;

        // add the cube to the scene
        scene.add(cube);

        var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
        var sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff});
        var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.name = 'Sphere';

        // position the sphere
        sphere.position.x = 20;
        sphere.position.y = 0;
        sphere.position.z = 2;
        //  sphere.castShadow=true;

        // add the sphere to the scene
        scene.add(sphere);

        // add subtle ambient lighting
        var ambientLight = new THREE.AmbientLight(0x0c0c0c);
        scene.add(ambientLight);

        // add spotlight for the shadows
        var spotLight = new THREE.PointLight(0xffffff);
        spotLight.position.set(-40, 60, -10);
        //  spotLight.castShadow = true;
        scene.add(spotLight);

        // call the render function
        var step = 0;

        var controls = new function () {
            this.exportScene = function () {
                var sceneJson = JSON.stringify(scene.toJSON());
                localStorage.setItem('scene', sceneJson);
            };

            this.clearScene = function () {
                scene = new THREE.Scene();
            };

            this.importScene = function () {
                var json = (localStorage.getItem('scene'));

                if(json){
                    var sceneLoader = new THREE.ObjectLoader();
                    scene = sceneLoader.parse(JSON.parse(json));

                    console.log(scene.children);

                    for(var i = 0 ; i< scene.children.length; i++)
                    {
                        var item = scene.children[i];
                         if(item.name == 'Cube'){
                            cube = item;
                        }

                        if(item.name == 'Sphere'){
                            sphere = item;
                        }
                    }
                }
            }
        };

        gui.add(controls, "exportScene");
        gui.add(controls, "clearScene");
        gui.add(controls, "importScene");


        render();

        function render() {
            stats.update();
            // rotate the cube around its axes

               // rotate the cube around its axes
            cube.rotation.x += 0.02;
            cube.rotation.y += 0.02;
            cube.rotation.z += 0.02;

            // bounce the sphere up and down
            step += 0.02;
            sphere.position.x = 20 + ( 10 * (Math.cos(step)));
            sphere.position.y = 4 + ( 10 * Math.abs(Math.sin(step)));

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
