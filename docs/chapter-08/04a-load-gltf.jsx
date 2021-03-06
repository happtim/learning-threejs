
import * as THREE from 'three';
import React , { useRef, useEffect }from 'react';
import { InitStats} from '/src/components/initStats';
import { InitScene} from '/src/components/initScene';
import { InitGui } from '/src/components/initGui';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function Scene() {

    const ref = useRef(null);

    useEffect(()=>{

        const div = ref.current;
        var [scene, camera, renderer] = InitScene(div);
        var stats = InitStats();

        camera.position.x = -5;
        camera.position.y = 5;
        camera.position.z = 5;

        camera.lookAt(0,0,0);
    

        // add spotlight for the shadows
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(0, 50, 30);
        spotLight.intensity = 2;
        scene.add(spotLight);

        // call the render function
        var step = 0;

        // setup the control gui
        var controls = new function () {
            // we need the first child, since it's a multimaterial
        };

        var mesh;

        var loader = new GLTFLoader();
        loader.load('/assets/models/misc_chair01.gltf', function (gltf) {

            console.log(gltf);
            scene.add(gltf.scene);
            console.log(scene);
        });


        render();

        function render() {
            stats.update();

            if (mesh) {
                mesh.rotation.y += 0.02;
            }


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
