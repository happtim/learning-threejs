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
        var stats = InitStats('e');
        var gui = InitGui('e');

        // create the ground plane
        var planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
        var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;

        // rotate and position the plane
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 0;
        plane.position.y = -2;
        plane.position.z = 0;

        // add the plane to the scene
        scene.add(plane);

        // add subtle ambient lighting
        //        var ambientLight = new THREE.AmbientLight(0x0c0c0c);
        //        scene.add(ambientLight);

        // add spotlight for the shadows
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-40, 60, -10);
        spotLight.castShadow = true;
        scene.add(spotLight);


        var group = new THREE.Mesh();
        // add all the rubik cube elements
        var mats = [];
        mats.push(new THREE.MeshBasicMaterial({color: 0x009e60}));
        mats.push(new THREE.MeshBasicMaterial({color: 0x0051ba}));
        mats.push(new THREE.MeshBasicMaterial({color: 0xffd500}));
        mats.push(new THREE.MeshBasicMaterial({color: 0xff5800}));
        mats.push(new THREE.MeshBasicMaterial({color: 0xC41E3A}));
        mats.push(new THREE.MeshBasicMaterial({color: 0xffffff}));

        //var faceMaterial = new THREE.MeshFaceMaterial(mats);

        for (var x = 0; x < 3; x++) {
            for (var y = 0; y < 3; y++) {
                for (var z = 0; z < 3; z++) {
                    var cubeGeom = new THREE.BoxGeometry(2.9, 2.9, 2.9);
                    var cube = new THREE.Mesh(cubeGeom, mats);
                    cube.position.set(x * 3 - 3, y * 3, z * 3 - 3);

                    group.add(cube);
                }
            }
        }


        // call the render function
        scene.add(group);
        var step = 0;

        var controls = new function () {
            this.rotationSpeed = 0.02;
            this.numberOfObjects = scene.children.length;
        };

        gui.add(controls, 'rotationSpeed', 0, 0.5);

        render();

        function render() {
            stats.update();


            group.rotation.y = step += controls.rotationSpeed;
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
