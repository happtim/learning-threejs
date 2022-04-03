import * as THREE from 'three';
import React , { useRef, useEffect }from 'react';
import { InitStats} from '/src/components/initStats';
import { InitScene} from '/src/components/initScene';
import { InitGui } from '/src/components/initGui';

export function Scene() {

    const ref = useRef(null);

    useEffect(()=>{

        const div = ref.current;
        var [scene, camera, renderer] = InitScene(div);
        var stats = InitStats();
        var gui = InitGui();

        renderer.setClearColor(new THREE.Color(0x000000));

         // position and point the camera to the center of the scene
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 150;

        camera.lookAt(scene.position);

        createSprites();

        function createSprites() {
            var material = new THREE.SpriteMaterial();


            for (var x = -5; x < 5; x++) {
                for (var y = -5; y < 5; y++) {
                    var sprite = new THREE.Sprite(material);
                    sprite.position.set(x * 10, y * 10, 0);
                    scene.add(sprite);
                }
            }
        }

        render();

        function render() {
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
