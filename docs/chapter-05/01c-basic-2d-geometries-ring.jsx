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
            innerRadius: 5,
            outerRadius: 10,
            thetaSegments: 8,
            phiSegments: 8,
            thetaStart: 0,
            thetaLength: twoPi
        };

        function generateGeometry() {

            updateGroupGeometry( mesh,
                new THREE.RingGeometry(
                    data.innerRadius, data.outerRadius, data.thetaSegments, data.phiSegments, data.thetaStart, data.thetaLength
                )
            );

        }

        const folder = gui.addFolder( 'THREE.RingGeometry' );

        folder.add( data, 'innerRadius', 1, 30 ).onChange( generateGeometry );
        folder.add( data, 'outerRadius', 1, 30 ).onChange( generateGeometry );
        folder.add( data, 'thetaSegments', 1, 30 ).step( 1 ).onChange( generateGeometry );
        folder.add( data, 'phiSegments', 1, 30 ).step( 1 ).onChange( generateGeometry );
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




