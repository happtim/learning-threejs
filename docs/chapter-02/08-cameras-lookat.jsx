import * as THREE from "three";
import React , { useRef, useEffect }from 'react';
import { InitStats} from '/src/components/initStats';
import { InitScene} from '/src/components/InitScene';
import { InitGui } from '/src/components/InitGui';


export function Scene() {

    const ref = useRef(null);

    useEffect(()=>{

        const div = ref.current;

        var [scene, camera, renderer] = InitScene(div);
        var stats = InitStats();
        var gui = InitGui();

        camera.position.x = 120;
        camera.position.y = 60;
        camera.position.z = 180;

        // create the ground plane
        var planeGeometry = new THREE.PlaneGeometry(180, 180);
        var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);

        // rotate and position the plane
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 0;
        plane.position.y = 0;
        plane.position.z = 0;

        // add the plane to the scene
        scene.add(plane);

        var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
        var cubeMaterial = new THREE.MeshLambertMaterial({color: 0x00ee22});
        for (var j = 0; j < (planeGeometry.parameters.height / 5); j++) {
            for (var i = 0; i < planeGeometry.parameters.width / 5; i++) {
                var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

                cube.position.z = -((planeGeometry.parameters.height) / 2) + 2 + (j * 5);
                cube.position.x = -((planeGeometry.parameters.width) / 2) + 2 + (i * 5);
                cube.position.y = 2;

                scene.add(cube);
            }
        }

        var lookAtGeom = new THREE.SphereGeometry(2);
        var lookAtMesh = new THREE.Mesh(lookAtGeom, new THREE.MeshLambertMaterial({color: 0xff0000}));
        scene.add(lookAtMesh);


        var directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
        directionalLight.position.set(-20, 40, 60);
        scene.add(directionalLight);


        // add subtle ambient lighting
        var ambientLight = new THREE.AmbientLight(0x292929);
        scene.add(ambientLight);

        // call the render function
        var step = 0;

        var controls = new function () {
            this.perspective = "Perspective";
            this.switchCamera = function () {
                if (camera instanceof THREE.PerspectiveCamera) {
                    camera = new THREE.OrthographicCamera(window.innerWidth / -16, window.innerWidth / 16, window.innerHeight / 16, window.innerHeight / -16, -200, 500);
                    camera.position.x = 120;
                    camera.position.y = 60;
                    camera.position.z = 180;

                    camera.lookAt(scene.position);
                    this.perspective = "Orthographic";
                } else {
                    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
                    camera.position.x = 120;
                    camera.position.y = 60;
                    camera.position.z = 180;

                    camera.lookAt(scene.position);
                    this.perspective = "Perspective";
                }
            };
        };

        gui.add(controls, 'switchCamera');
        gui.add(controls, 'perspective').listen();

        // make sure that for the first time, the
        // camera is looking at the scene
        //   camera.lookAt(scene.position);
        render();

        function render() {

            stats.update();
            // render using requestAnimationFrame
            step += 0.02;
            if (camera instanceof THREE.Camera) {
                var x = 10 + ( 100 * (Math.sin(step)));
                camera.lookAt(new THREE.Vector3(x, 10, 0));
                lookAtMesh.position.copy(new THREE.Vector3(x, 10, 0));
            }

        //        .position.x = 20+( 10*(Math.cos(step)));
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