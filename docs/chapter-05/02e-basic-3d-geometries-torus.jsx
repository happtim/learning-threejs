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
        var stats = InitStats('e');
        var gui = InitGui('e');

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
            radius: 10,
            tube: 3,
            radialSegments: 16,
            tubularSegments: 100,
            arc: twoPi
        };

        function generateGeometry() {

            updateGroupGeometry( mesh,
                new THREE.TorusGeometry(
                    data.radius, data.tube, data.radialSegments, data.tubularSegments, data.arc
                )
            );

        }

        const folder = gui.addFolder( 'THREE.TorusGeometry' );

        folder.add( data, 'radius', 1, 20 ).onChange( generateGeometry );
        folder.add( data, 'tube', 0.1, 10 ).onChange( generateGeometry );
        folder.add( data, 'radialSegments', 2, 30 ).step( 1 ).onChange( generateGeometry );
        folder.add( data, 'tubularSegments', 3, 200 ).step( 1 ).onChange( generateGeometry );
        folder.add( data, 'arc', 0.1, twoPi ).onChange( generateGeometry );

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
        <div id="Stats-output-e" >
        </div>
        <div id="Gui-output-e">
        </div>
        </div>
    );
}  

