
import * as THREE from 'three';
import React , { useRef, useEffect }from 'react';
import { InitStats} from '@site/src/components/initStats';
import { InitScene} from '@site/src/components/InitScene';
import { InitGui } from '@site/src/components/InitGui';

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'

export function Scene() {

    const ref = useRef(null);

    useEffect(()=>{

        const div = ref.current;
        var [scene, camera, renderer] = InitScene(div);
        var stats = InitStats('b');

        // position and point the camera to the center of the scene
        camera.position.x = 130;
        camera.position.y = 40;
        camera.position.z = 50;
        camera.lookAt(scene.position);

        // add spotlight for the shadows
        var spotLight = new THREE.DirectionalLight(0xffffff);
        spotLight.position.set(30, 40, 50);
        spotLight.intensity = 1;
        scene.add(spotLight);

        // call the render function
        var step = 0;


        // setup the control gui
        var controls = new function () {
            // we need the first child, since it's a multimaterial
        };

        var mesh;

        var loader = new OBJLoader();
        loader.load('/assets/models/pinecone.obj' , function (loadedMesh) {
            var material = new THREE.MeshLambertMaterial({color: 0x5C3A21});
            // loadedMesh is a group of meshes. For
            // each mesh set the material, and compute the information
            // three.js needs for rendering.
            loadedMesh.children.forEach(function (child) {
                child.material = material;
            });

            mesh = loadedMesh;
            loadedMesh.scale.set(100, 100, 100);
            loadedMesh.rotation.x = -0.3;
            scene.add(loadedMesh);
        });

        render();

        function render() {
            stats.update();

            if (mesh) {
                mesh.rotation.y += 0.006;
                mesh.rotation.x += 0.006;
//                mesh.rotation.y+=0.006;
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
        <div id="Stats-output-b" >
        </div>
        <div id="Gui-output-b">
        </div>
        </div>
    );
}  
 