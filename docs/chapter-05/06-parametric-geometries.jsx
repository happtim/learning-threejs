import * as THREE from 'three';
import React , { useRef, useEffect }from 'react';
import { InitStats} from '/src/components/initStats';
import { InitScene} from '/src/components/initScene';
import { InitGui } from '/src/components/initGui';
import  {InitMesh, updateGroupGeometry} from './InitMesh';
import {ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry'
import { ParametricGeometries } from 'three/examples/jsm/geometries/ParametricGeometries';

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

        
        const data = {
            slices : 120,
            stacks : 120,
            func : 'radiaWave',
        }

        const folder = gui.addFolder( 'THREE.ParametricGeometry' );

        folder.add(data, 'slices', 10, 120).step(1).onChange(generateGeometry);
        folder.add(data, 'stacks', 10, 120).step(1).onChange(generateGeometry);
        folder.add(data, 'func', ['radiaWave','klein','mobius','mobius3d','plane']).onChange(generateGeometry);


        function generateGeometry() {

            let func = radialWave;
            switch(data.func){
                case 'radiaWave':
                    func  = radialWave;
                break;
                
                case 'klein':
                    func = ParametricGeometries.klein;
                break;

                case 'mobius':
                    func = ParametricGeometries.mobius;
                break;

                case 'plane':
                    func = ParametricGeometries.plane(50,50);
                break;

                case 'mobius3d':
                    func = ParametricGeometries.mobius3d;
                break;


            }

            const geometry = new ParametricGeometry(func, data.slices, data.stacks);
            geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-25, 0, -25));
            updateGroupGeometry(mesh,geometry);
        }

        var radialWave = function (u, v, target) {
            var r = 50;

            var x = Math.sin(u) * r;
            var z = Math.sin(v / 2) * 2 * r;
            var y = (Math.sin(u * 4 * Math.PI) + Math.cos(v * 2 * Math.PI)) * 2.8;

            return target.set (x, y, z);
        };

        generateGeometry();

        render();

        function render() {

            mesh.rotation.y = step += 0.01;
            mesh.rotation.x = step;
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
