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
        var stats = InitStats();
        var gui = InitGui();

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
            width: 15,
            height: 15,
            depth: 15,
            widthSegments: 1,
            heightSegments: 1,
            depthSegments: 1
        };

        function generateGeometry() {

            updateGroupGeometry( mesh,
                new THREE.BoxGeometry(
                    data.width, data.height, data.depth, data.widthSegments, data.heightSegments, data.depthSegments
                )
            );

        }

        const folder = gui.addFolder( 'THREE.BoxGeometry' );

        folder.add( data, 'width', 1, 30 ).onChange( generateGeometry );
        folder.add( data, 'height', 1, 30 ).onChange( generateGeometry );
        folder.add( data, 'depth', 1, 30 ).onChange( generateGeometry );
        folder.add( data, 'widthSegments', 1, 10 ).step( 1 ).onChange( generateGeometry );
        folder.add( data, 'heightSegments', 1, 10 ).step( 1 ).onChange( generateGeometry );
        folder.add( data, 'depthSegments', 1, 10 ).step( 1 ).onChange( generateGeometry );

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
        <div id="Stats-output" >
        </div>
        <div id="Gui-output">
        </div>
        </div>
    );
}  
