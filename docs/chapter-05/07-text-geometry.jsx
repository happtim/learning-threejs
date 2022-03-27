
import * as THREE from 'three';
import React , { useRef, useEffect }from 'react';
import { InitStats} from '/src/components/initStats';
import { InitScene} from '/src/components/initScene';
import { InitGui } from '/src/components/initGui';
import {InitMesh, updateGroupGeometry} from './InitMesh';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import HelvetikerFont  from 'three/examples/fonts/helvetiker_regular.typeface.json';

export function Scene() 
{
    const ref = useRef(null);

    useEffect(()=> {

        const div = ref.current;
        var [scene, camera, renderer] = InitScene(div);
        var stats = InitStats();
        var gui = InitGui();

        camera.position.set(70,30,60);
        camera.lookAt(scene.position);

        // add spotlight for the shadows
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-40, 60, -10);
        scene.add(spotLight);

        // call the render function
        var step = 0;

        let mesh = InitMesh();
        scene.add( mesh );

        const loader = new FontLoader();
        let helvetiker_regular_font = loader.parse(HelvetikerFont);

        let gentilis_font;
        loader.load( '/assets/fonts/gentilis_regular.typeface.json' ,function(font){

            gentilis_font = font;
            generateGeometry();
            render();
        });

        const data = {
            size : 90,
            height : 10,
            bevelThickness : 2,
            bevelSize : 0.5,
            bevelEnabled : true,
            bevelSegments : 3,
            bevelEnabled : true,
            curveSegments : 12,
            steps : 1,
            fontSelect : "helvetiker",
            weight : "normal",
        };

        function generateGeometry() {

            switch (data.fontSelect){
                case 'helvetiker':
                    data.font = helvetiker_regular_font;
                    break;
                case 'gentilis':
                    data.font = gentilis_font;
                    break;
            }
            const geometry = new TextGeometry('Three.js', data);
            mesh.scale.x = 0.1;
            mesh.scale.y = 0.1;
            updateGroupGeometry(mesh,geometry);
        }

        const folder = gui.addFolder( 'THREE.TextGeometry' );

        folder.add(data, 'size', 0, 200).onChange(generateGeometry);
        folder.add(data, 'height', 0, 200).onChange(generateGeometry);
        folder.add(data, 'fontSelect', ['gentilis', 'helvetiker']).onChange(generateGeometry);
        folder.add(data, 'bevelThickness', 0, 10).onChange(generateGeometry);
        folder.add(data, 'bevelSize', 0, 10).onChange(generateGeometry);
        folder.add(data, 'bevelSegments', 0, 30).step(1).onChange(generateGeometry);
        folder.add(data, 'bevelEnabled').onChange(generateGeometry);
        folder.add(data, 'curveSegments', 1, 30).step(1).onChange(generateGeometry);
        folder.add(data, 'steps', 1, 5).step(1).onChange(generateGeometry);

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
