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

        // the points group
        var spGroup;

        // setup the control gui
        var controls = new function () {

            this.numberOfPoints = 5;
            this.segments = 64;
            this.radius = 1;
            this.radiusSegments = 8;
            this.closed = false;
            this.points = [];
            // we need the first child, since it's a multimaterial

            this.newPoints = function () {
                var points = [];
                for (var i = 0; i < controls.numberOfPoints; i++) {
                    var randomX = -20 + Math.round(Math.random() * 50);
                    var randomY = -15 + Math.round(Math.random() * 40);
                    var randomZ = -20 + Math.round(Math.random() * 40);

                    points.push(new THREE.Vector3(randomX, randomY, randomZ));
                }
                controls.points = points;
                controls.redraw();
            };

            this.redraw = function () {
                scene.remove(spGroup);

                generatePoints(controls.points, controls.segments, controls.radius, controls.radiusSegments, controls.closed);
            };

        };

        gui.add(controls, 'newPoints');
        gui.add(controls, 'numberOfPoints', 2, 15).step(1).onChange(controls.newPoints);
        gui.add(controls, 'segments', 0, 200).step(1).onChange(controls.redraw);
        gui.add(controls, 'radius', 0, 10).onChange(controls.redraw);
        gui.add(controls, 'radiusSegments', 0, 100).step(1).onChange(controls.redraw);
        gui.add(controls, 'closed').onChange(controls.redraw);

        controls.newPoints();


        function generatePoints(points, segments, radius, radiusSegments, closed) {
            // add n random spheres
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
            var tubeGeometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), segments, radius, radiusSegments, closed);
            updateGroupGeometry(mesh,tubeGeometry);
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
        <div id="Stats-output-b" >
        </div>
        <div id="Gui-output-b">
        </div>
        </div>
    );
}  

