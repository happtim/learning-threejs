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


        const data = {
            radius: 15,
            widthSegments: 32,
            heightSegments: 16,
            phiStart: 0,
            phiLength: twoPi,
            thetaStart: 0,
            thetaLength: Math.PI
        };

        function generateGeometry() {

            updateGroupGeometry( mesh,
                new THREE.SphereGeometry(
                    data.radius, data.widthSegments, data.heightSegments, data.phiStart, data.phiLength, data.thetaStart, data.thetaLength
                )
            );

        }

        const folder = gui.addFolder( 'THREE.SphereGeometry' );

        folder.add( data, 'radius', 1, 30 ).onChange( generateGeometry );
        folder.add( data, 'widthSegments', 3, 64 ).step( 1 ).onChange( generateGeometry );
        folder.add( data, 'heightSegments', 2, 32 ).step( 1 ).onChange( generateGeometry );
        folder.add( data, 'phiStart', 0, twoPi ).onChange( generateGeometry );
        folder.add( data, 'phiLength', 0, twoPi ).onChange( generateGeometry );
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
        <div id="Stats-output-b" >
        </div>
        <div id="Gui-output-b">
        </div>
        </div>
    );
}  

