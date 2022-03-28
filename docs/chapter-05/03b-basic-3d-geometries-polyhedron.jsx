import * as THREE from 'three';
import React , { useRef, useEffect }from 'react';
import { InitStats} from '/src/components/initStats';
import { InitScene} from '/src/components/initScene';
import { InitGui } from '/src/components/initGui';
import  {InitMesh, updateGroupGeometry} from './InitMesh';

export function Scene() 
{

    const ref = useRef(null);

    useEffect(()=> {

        const div = ref.current;
        var [scene, camera, renderer] = InitScene(div);
        var stats = InitStats('b');
        var gui = InitGui('b');

        // add spotlight for the shadows
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-40, 60, -10);
        scene.add(spotLight);

        // call the render function
        var step = 0;

        let mesh = InitMesh();
        scene.add( mesh );

        const twoPi = Math.PI * 2;

        const verticesOfCube = [
            1, 1, 1,
            -1,-1,1,
            -1,1,-1,
            1,-1,-1
        ];

        const indicesOfFaces = [
            2, 1, 0,
            0, 3, 2,
            1, 3, 0,
            2, 3, 1
        ];


         const data = {
            radius: 6,
            detail:4
        };

        function generateGeometry() {

            updateGroupGeometry( mesh,
                new THREE.PolyhedronGeometry( verticesOfCube, indicesOfFaces, data.radius, data.detail )
            );

        }

        const folder = gui.addFolder( 'THREE.PolyhedronGeometry' );

        folder.add( data, 'radius', 1, 20 ).onChange( generateGeometry );
        folder.add( data, 'detail', 0, 20 ).step(1).onChange( generateGeometry );

        generateGeometry();

        render();

        function render() 
        {

            stats.update();

            mesh.rotation.y = step += 0.01;

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


