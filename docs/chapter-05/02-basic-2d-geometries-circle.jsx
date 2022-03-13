import * as THREE from 'three';
import React , { useRef, useEffect }from 'react';
import { InitStats} from '/src/components/initStats';
import { InitScene} from '/src/components/initScene';
import { InitGui } from '/src/components/initGui';
import { group as mesh, updateGroupGeometry } from './InitMesh';

export function Scene() {


    const ref = useRef(null);

    useEffect(()=>{

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

        scene.add( mesh );


        const data = {
            radius: 10,
            segments: 32,
            thetaStart: 0,
            thetaLength:  Math.PI*2,
        };

        function generateGeometry() {

            updateGroupGeometry( mesh,
                new THREE.CircleGeometry(
                    data.radius, data.segments, data.thetaStart, data.thetaLength
                )
            );

        }

        const folder = gui.addFolder( 'THREE.CircleGeometry' );

        folder.add( data, 'radius', 1, 20 ).onChange( generateGeometry );
        folder.add( data, 'segments', 0, 128 ).step( 1 ).onChange( generateGeometry );
        folder.add( data, 'thetaStart', 0, Math.PI*2 ).onChange( generateGeometry );
        folder.add( data, 'thetaLength', 0, Math.PI*2 ).onChange( generateGeometry );

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


