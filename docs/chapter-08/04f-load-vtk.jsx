
import * as THREE from 'three';
import React , { useRef, useEffect }from 'react';
import { InitStats} from '@site/src/components/initStats';
import { InitScene} from '@site/src/components/InitScene';
import { InitGui } from '@site/src/components/InitGui';

import { VTKLoader } from 'three/examples/jsm/loaders/VTKLoader';

export function Scene() {

    const ref = useRef(null);

    useEffect(()=>{

        const div = ref.current;
        var [scene, camera, renderer] = InitScene(div);
        var stats = InitStats('f');

        // position and point the camera to the center of the scene
        camera.position.x = 10;
        camera.position.y = 10;
        camera.position.z = 10;
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        // add spotlight for the shadows
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(20, 20, 20);
        scene.add(spotLight);

        // call the render function
        var step = 0;
        // setup the control gui
        var controls = new function () {
            // we need the first child, since it's a multimaterial
        };

        var group;
        var loader = new VTKLoader();
        var group = new THREE.Object3D();
        loader.load('/assets/models/moai_fixed.vtk', function (geometry) {
            var mat = new THREE.MeshLambertMaterial({color: 0xaaffaa});
            group = new THREE.Mesh(geometry, mat);
            group.scale.set(9, 9, 9);
            scene.add(group);
        });


        render();


        function render() {
            stats.update();

            if (group) {
                group.rotation.y += 0.006;
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
        <div id="Stats-output-f" >
        </div>
        <div id="Gui-output-f">
        </div>
        </div>
    );
}  
  