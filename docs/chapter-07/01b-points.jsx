import * as THREE from 'three';
import React , { useRef, useEffect }from 'react';
import { InitStats} from '/src/components/initStats';
import { InitScene} from '/src/components/initScene';
import { InitGui } from '/src/components/initGui';

export function Scene() {

    const ref = useRef(null);

    useEffect(()=>{

        const div = ref.current;
        var [scene, camera, renderer] = InitScene(div);
        var stats = InitStats('b');
        var gui = InitGui('b');

        renderer.setClearColor(new THREE.Color(0x000000));

         // position and point the camera to the center of the scene
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 150;

        camera.lookAt(scene.position);

        createParticles();

        function createParticles() {

            var geom = new THREE.BufferGeometry();
            var material = new THREE.PointsMaterial({size: 4, vertexColors: true, color: 0xffffff});

            var points  = [];
            var colors = [];
            for (var x = -5; x < 5; x++) {
                for (var y = -5; y < 5; y++) {
                    var particle = new THREE.Vector3(x * 10, y * 10, 0);
                    points.push(particle);
                    var color = new THREE.Color(Math.random() * 0x00ffff);
                    colors.push(color.r,color.g, color.b);
                }
            }

            geom.setFromPoints(points);
            geom.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

            var cloud = new THREE.Points(geom, material);
            scene.add(cloud);
        }

        render();

        function render() {
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
