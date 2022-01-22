import * as THREE from "three";
import React , { useRef, useEffect }from 'react';
import { InitStats} from '@site/src/components/initStats';
import { InitScene} from '@site/src/components/InitScene';


export function Scene() {

    const ref = useRef(null);

    useEffect(()=>{

        const div = ref.current;
        var width = div.clientWidth;
        var height = div.clientHeight;

        var [scene, camera, renderer] = InitScene(div);
        var stats = InitStats();
        //var gui = InitGui();

        camera.position.x = 120;
        camera.position.y = 60;
        camera.position.z = 180;

        camera.lookAt(scene.position);

        // create the ground plane
        //var planeGeometry = new THREE.PlaneGeometry(180, 180);
        //var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
        //var plane = new THREE.Mesh(planeGeometry, planeMaterial);

        // rotate and position the plane
        //plane.rotation.x = -0.5 * Math.PI;
        //plane.position.x = 0;
        //plane.position.y = 0;
        //plane.position.z = 0;

        // add the plane to the scene
        //scene.add(plane);

        var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
        var cubeMaterial = new THREE.MeshLambertMaterial({color: 0x00ee22});
        for (var j = 0; j < ( 180 / 5); j++) {
            for (var i = 0; i < 180 / 5; i++) {
                var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

                cube.position.z = -((180) / 2) + 2 + (j * 5);
                cube.position.x = -((180) / 2) + 2 + (i * 5);
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

        var sceneHUD = new THREE.Scene();
        // Create the camera and set the viewport to match the screen dimensions.
        var cameraHUD = new THREE.OrthographicCamera(-width/20, width/20, height/2, -height/4, 0, 30 );
        cameraHUD.position.set(0,0,0);

         // Create plane to render the HUD. This plane fill the whole screen.
        var planeGeometry = new THREE.PlaneGeometry( width/20, height/4 );
        var planeMaterial = new THREE.MeshBasicMaterial({color: 0xffffff,transparent:true,opacity:0.7});
        var plane = new THREE.Mesh( planeGeometry, planeMaterial);

        sceneHUD.add( plane );

        // 防止在下一次render时，自动清屏, 此处关键否则,画布会被重新擦拭
        renderer.autoClear = false;
        render();

        function render() {

            stats.update();

            // render using requestAnimationFrame
            requestAnimationFrame(render);

            renderer.clear();
            renderer.render(scene, camera);

            renderer.render(sceneHUD,cameraHUD);
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