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

        // show axes in the screen
        var axes = new THREE.AxisHelper(20);
        scene.add(axes);

        const data = {
            amount : 2,
            bevelThickness : 2,
            bevelSize : 0.5,
            bevelEnabled : true,
            bevelSegments : 3,
            bevelEnabled : true,
            curveSegments : 12,
            steps : 1,
        };

        function generateGeometry() {

            const geometry = new THREE.ExtrudeGeometry(drawShape(),data);
            geometry.applyMatrix(new THREE.Matrix4().makeTranslation(-20, -10, 0));
            updateGroupGeometry(mesh,geometry);
        }

        const folder = gui.addFolder( 'THREE.LatheGeometry' );

        folder.add(data, 'amount', 0, 20).onChange(generateGeometry);
        folder.add(data, 'bevelThickness', 0, 10).onChange(generateGeometry);
        folder.add(data, 'bevelSize', 0, 10).onChange(generateGeometry);
        folder.add(data, 'bevelSegments', 0, 30).step(1).onChange(generateGeometry);
        folder.add(data, 'bevelEnabled').onChange(generateGeometry);
        folder.add(data, 'curveSegments', 1, 30).step(1).onChange(generateGeometry);
        folder.add(data, 'steps', 1, 5).step(1).onChange(generateGeometry);

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

        generateGeometry();

        render();

        function render() {
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

