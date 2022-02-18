
import * as THREE from 'three';
import React , { useRef, useEffect }from 'react';
import { InitStats} from '@site/src/components/initStats';
import { InitScene} from '@site/src/components/InitScene';
import { InitGui } from '@site/src/components/InitGui';

import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';
import useBaseUrl from '@docusaurus/useBaseUrl';

export function Scene() {

    const ref = useRef(null);

    const TruckUrl = useBaseUrl('/assets/models/dae/Truck_dae.dae');

    useEffect(()=>{

        const div = ref.current;
        var [scene, camera, renderer] = InitScene(div);
        var stats = InitStats('d');

        // position and point the camera to the center of the scene
        camera.position.x = 150;
        camera.position.y = 150;
        camera.position.z = 150;
        camera.lookAt(new THREE.Vector3(0, 20, 0));

        // add spotlight for the shadows
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(150, 150, 150);
        spotLight.intensity = 2;
        scene.add(spotLight);

        // model from http://www.thingiverse.com/thing:69709
        var loader = new ColladaLoader();

        var mesh;
        loader.load(TruckUrl, function (result) {
            mesh = result.scene.children[0].children[0].clone();
            mesh.scale.set(4, 4, 4);
            scene.add(mesh);
        });


        render();


        function render() {
            stats.update();
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
        <div id="Stats-output-d" >
        </div>
        <div id="Gui-output-d">
        </div>
        </div>
    );
}  
  