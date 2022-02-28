import * as THREE from "three";
import React , { useRef, useEffect }from 'react';
import { InitStats} from '/src/components/initStats';
import { InitScene} from '/src/components/initScene';
import { InitGui } from '/src/components/initGui';
import { CameraHelper } from "three/src/helpers/CameraHelper";

export function Scene() {

    const ref = useRef(null);

    useEffect(()=>{

        const div = ref.current;

        var [scene, camera, renderer] = InitScene(div);
        var stats = InitStats('b');
        var gui = InitGui('b');

        camera.position.x = 120*1.5;
        camera.position.y = 60*1.5;
        camera.position.z = 180*1.5;

        //重新设置朝向
        camera.lookAt(scene.position);

         //正交投影照相机
        var camera2 = new THREE.PerspectiveCamera(45, div.clientWidth /  div.clientHeight, 10, 1000);
        camera2.position.set(120, 60, 180);
        camera2.lookAt(0,0,0);

        //照相机帮助线
        var cameraHelper = new CameraHelper(camera2);
        scene.add(cameraHelper);

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

        for (var j = 0; j < (planeGeometry.parameters.height / 5); j++) {
            for (var i = 0; i < planeGeometry.parameters.width / 5; i++) {
                var rnd = Math.random() * 0.75 + 0.25;
                var cubeMaterial = new THREE.MeshLambertMaterial();
                cubeMaterial.color = new THREE.Color(rnd, 0, 0);
                var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

                cube.position.z = -((planeGeometry.parameters.height) / 2) + 2 + (j * 5);
                cube.position.x = -((planeGeometry.parameters.width) / 2) + 2 + (i * 5);
                cube.position.y = 2;

                scene.add(cube);
            }
        }

        var directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
        directionalLight.position.set(-20, 40, 60);
        scene.add(directionalLight);

        // add subtle ambient lighting
        var ambientLight = new THREE.AmbientLight(0x292929);
        scene.add(ambientLight);

        var controls = new function () {
            this.perspective = "Perspective";
            this.switchCamera = function () {
                if (camera2 instanceof THREE.PerspectiveCamera) {
                    camera2 = new THREE.OrthographicCamera(div.clientWidth / -10, div.clientWidth / 10, div.clientHeight / 10, div.clientHeight / -10, -200, 500);
                    camera2.position.x = 120;
                    camera2.position.y = 60;
                    camera2.position.z = 180;
                    camera2.lookAt(scene.position);
                    cameraHelper.camera = camera2;


                    this.perspective = "Orthographic";
                } else {
                    camera2 = new THREE.PerspectiveCamera(45, div.clientWidth /  div.clientHeight, 0.1, 1000);
                    camera2.position.x = 120;
                    camera2.position.y = 60;
                    camera2.position.z = 180;

                    camera2.lookAt(scene.position);
                    this.perspective = "Perspective";
                    cameraHelper.camera = camera2;
                }

            };
            this.switchCamera2 = function () {
               var tempCamera = camera; 
               camera = camera2;
               camera2 = tempCamera; 
            };
        };

        gui.add(controls, 'switchCamera');
        gui.add(controls, 'perspective').listen();
        gui.add(controls, 'switchCamera2');


        render();

        function render() {

            stats.update();

            camera2.lookAt(0,0,0);
            cameraHelper.update();

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