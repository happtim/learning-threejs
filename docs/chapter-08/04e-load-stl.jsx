


import * as THREE from 'three';
import React , { useRef, useEffect }from 'react';
import { InitStats} from '@site/src/components/initStats';
import { InitScene} from '@site/src/components/InitScene';
import { InitGui } from '@site/src/components/InitGui';

import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import useBaseUrl from '@docusaurus/useBaseUrl';

export function Scene() {

    const ref = useRef(null);

    const StlUrl = useBaseUrl('/assets/models/SolidHead_2_lowPoly_42k.stl');

    useEffect(()=>{

        const div = ref.current;
        var [scene, camera, renderer] = InitScene(div);
        var stats = InitStats('e');

        // position and point the camera to the center of the scene
        camera.position.x = 150;
        camera.position.y = 150;
        camera.position.z = 150;
        camera.lookAt(new THREE.Vector3(0, 40, 0));

        // add spotlight for the shadows
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(150, 150, 150);
        scene.add(spotLight);

        // call the render function
        var step = 0;

        // setup the control gui
        var controls = new function () {
            // we need the first child, since it's a multimaterial


        };

        var group;

        // model from http://www.thingiverse.com/thing:69709
        var loader = new STLLoader();
        var group = new THREE.Object3D();
        loader.load(StlUrl, function (geometry) {
            console.log(geometry);
            var mat = new THREE.MeshLambertMaterial({color: 0x7777ff});
            group = new THREE.Mesh(geometry, mat);
            group.rotation.x = -0.5 * Math.PI;
            group.scale.set(0.6, 0.6, 0.6);
            scene.add(group);
        });


        render();


        function render() {
            stats.update();

            if (group) {
                group.rotation.z += 0.006;
                // group.rotation.x+=0.006;
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
        <div id="Stats-output-e" >
        </div>
        <div id="Gui-output-e">
        </div>
        </div>
    );
}  
  