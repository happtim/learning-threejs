import * as THREE from 'three';
import React , { useRef, useEffect }from 'react';
import { InitStats} from '/src/components/initStats';
import { InitScene} from '/src/components/initScene';
import { InitGui } from '/src/components/initGui';
import  {InitMesh, updateGroupGeometry} from './InitMesh';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry'

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

        // the points group
        var spGroup;

        generatePoints();

        // setup the control gui
        var controls = new function () {
            // we need the first child, since it's a multimaterial

            this.redraw = function () {
                scene.remove(spGroup);
                generatePoints();

            };

        };

        gui.add(controls, 'redraw');

        function generatePoints() {
            // add 10 random spheres
            var points = [];
            for (var i = 0; i < 20; i++) {
                var randomX = -15 + Math.round(Math.random() * 30);
                var randomY = -15 + Math.round(Math.random() * 30);
                var randomZ = -15 + Math.round(Math.random() * 30);

                points.push(new THREE.Vector3(randomX, randomY, randomZ));
            }

            spGroup = new THREE.Group();
            var material = new THREE.MeshBasicMaterial({color: 0xff0000, transparent: false});
            points.forEach(function (point) {

                var spGeom = new THREE.SphereGeometry(0.2);
                var spMesh = new THREE.Mesh(spGeom, material);
                spMesh.position.copy(point);
                spGroup.add(spMesh);
            });
            // add the points as a group to the scene
            scene.add(spGroup);

            // use the same points to create a convexgeometry
            updateGroupGeometry(mesh,new ConvexGeometry(points));
        }

        render();

        function render() {
            stats.update();

            spGroup.rotation.y = step;
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
