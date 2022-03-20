
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

        const points = [];

        for ( let i = 0; i < 10; i ++ ) {

            points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 10 + 5, ( i - 5 ) * 2 ) );

        }

        const data = {
            segments: 12,
            phiStart: 0,
            phiLength: twoPi
        };

        function generateGeometry() {

            const geometry = new THREE.LatheGeometry(
                points, data.segments, data.phiStart, data.phiLength
            );

            updateGroupGeometry( mesh, geometry );

        }

        const folder = gui.addFolder( 'THREE.LatheGeometry' );

        folder.add( data, 'segments', 1, 30 ).step( 1 ).onChange( generateGeometry );
        folder.add( data, 'phiStart', 0, twoPi ).onChange( generateGeometry );
        folder.add( data, 'phiLength', 0, twoPi ).onChange( generateGeometry );

        generateGeometry();


        render();

        function render() {
            stats.update();

            mesh.rotation.x = step += 0.01;

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
