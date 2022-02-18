

import * as THREE from 'three';
import React , { useRef, useEffect }from 'react';
import { InitStats} from '@site/src/components/initStats';
import { InitScene} from '@site/src/components/InitScene';
import { InitGui } from '@site/src/components/InitGui';

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';

export function Scene() {

    const ref = useRef(null);

    useEffect(()=>{

        const div = ref.current;
        var [scene, camera, renderer] = InitScene(div);
        var stats = InitStats('c');

        // position and point the camera to the center of the scene
        camera.position.x = -30;
        camera.position.y = 40;
        camera.position.z = 50;
        camera.lookAt(new THREE.Vector3(0, 10, 0));


        // add spotlight for the shadows
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(0, 40, 30);
        spotLight.intensity = 2;
        scene.add(spotLight);


        // call the render function
        var step = 0;

        // setup the control gui
        var controls = new function () {
            // we need the first child, since it's a multimaterial

        };

        var mesh;

        new MTLLoader()
            .load('/assets/models/butterfly.mtl' , function (materials ) {

            console.log(materials);

            new OBJLoader()
                .setMaterials(materials)
                .load('/assets/models/butterfly.obj',function(object){

                    console.log(object);
                    // configure the wings
                    var wing2 = object.children[5];
                    var wing1 = object.children[4];

                    wing1.material.opacity = 0.6;
                    wing1.material.transparent = true;
                    wing1.material.depthTest = false;
                    wing1.material.side = THREE.DoubleSide;

                    wing2.material.opacity = 0.6;
                    wing2.material.transparent = true;
                    wing2.material.depthTest = false;
                    wing2.material.side = THREE.DoubleSide;

                    object.scale.set(140, 140, 140);
                    mesh = object;
                    scene.add(mesh);

                    object.rotation.x = 0.2;
                    object.rotation.y = -1.3;
                });
        });

        render();

        function render() {
            stats.update();

            if (mesh) {
                mesh.rotation.y += 0.006;
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
        <div id="Stats-output-c" >
        </div>
        <div id="Gui-output-c">
        </div>
        </div>
    );
}  
 