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
        var stats = InitStats('c');
        var gui = InitGui('c');

        // add spotlight for the shadows
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-40, 60, -10);
        scene.add(spotLight);

        // call the render function
        var step = 0;

        let mesh = InitMesh();
        scene.add( mesh );

        const twoPi = Math.PI * 2;

        const data = {
            radiusTop: 5,
            radiusBottom: 5,
            height: 10,
            radialSegments: 8,
            heightSegments: 1,
            openEnded: false,
            thetaStart: 0,
            thetaLength: twoPi
        };

        function generateGeometry() {

            updateGroupGeometry( mesh,
                new THREE.CylinderGeometry(
                    data.radiusTop,
                    data.radiusBottom,
                    data.height,
                    data.radialSegments,
                    data.heightSegments,
                    data.openEnded,
                    data.thetaStart,
                    data.thetaLength
                )
            );

        }

        const folder = gui.addFolder( 'THREE.CylinderGeometry' );

        folder.add( data, 'radiusTop', -10, 30 ).onChange( generateGeometry );
        folder.add( data, 'radiusBottom', -10, 30 ).onChange( generateGeometry );
        folder.add( data, 'height', 1, 50 ).onChange( generateGeometry );
        folder.add( data, 'radialSegments', 3, 64 ).step( 1 ).onChange( generateGeometry );
        folder.add( data, 'heightSegments', 1, 64 ).step( 1 ).onChange( generateGeometry );
        folder.add( data, 'openEnded' ).onChange( generateGeometry );
        folder.add( data, 'thetaStart', 0, twoPi ).onChange( generateGeometry );
        folder.add( data, 'thetaLength', 0, twoPi ).onChange( generateGeometry );


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
        <div id="Stats-output-c" >
        </div>
        <div id="Gui-output-c">
        </div>
        </div>
    );
}  
