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
        var stats = InitStats('d');
        var gui = InitGui('d');

        // add spotlight for the shadows
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-40, 60, -10);
        scene.add(spotLight);

        // call the render function
        var step = 0;

        let mesh = InitMesh();
        scene.add( mesh );

        const x = 0, y = 0;

        function drawShape() {

            // create a basic shape
            var shape = new THREE.Shape();

            // startpoint
            shape.moveTo(10, 10);

            // straight line upwards
            shape.lineTo(10, 40);

            // the top of the figure, curve to the right
            shape.bezierCurveTo(15, 25, 25, 25, 30, 40);

            // spline back down
            shape.splineThru(
                    [new THREE.Vector2(32, 30),
                        new THREE.Vector2(28, 20),
                        new THREE.Vector2(30, 10),
                    ]);

            // curve at the bottom
            shape.quadraticCurveTo(20, 15, 10, 10);

            // add 'eye' hole one
            var hole1 = new THREE.Path();
            hole1.absellipse(16, 24, 2, 3, 0, Math.PI * 2, true);
            shape.holes.push(hole1);

            // add 'eye hole 2'
            var hole2 = new THREE.Path();
            hole2.absellipse(23, 24, 2, 3, 0, Math.PI * 2, true);
            shape.holes.push(hole2);

            // add 'mouth'
            var hole3 = new THREE.Path();
            hole3.absarc(20, 16, 2, 0, Math.PI, true);
            shape.holes.push(hole3);

            // return the shape
            return shape;
        }

        const data = {
            segments: 12
        };

        function generateGeometry() {

            const geometry = new THREE.ShapeGeometry( drawShape(), data.segments );
            geometry.center();

            updateGroupGeometry( mesh, geometry );

        }

        const folder = gui.addFolder( 'THREE.ShapeGeometry' );
        folder.add( data, 'segments', 1, 100 ).step( 1 ).onChange( generateGeometry );

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
        <div id="Stats-output-d" >
        </div>
        <div id="Gui-output-d">
        </div>
        </div>
    );
}  



