import * as THREE from "three";
import React , { useRef, useEffect }from 'react';
import { InitStats} from '/src/components/initStats';
import { InitScene} from '/src/components/initScene';

export function Scene() {

    const ref = useRef(null);

    useEffect(()=>{

        const div = ref.current;
        var width = div.clientWidth;
        var height = div.clientHeight;

        var [scene, camera, renderer] = InitScene(div);
        var stats = InitStats();

        // 防止在下一次render时，自动清屏, 此处关键否则,画布会被重新擦拭
        renderer.autoClear = false;

        camera.position.x = 120;
        camera.position.y = 60;
        camera.position.z = 180;

        camera.lookAt(scene.position);

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
        var cameraHUD = new THREE.OrthographicCamera(-width/2, width/2, height/2, -height/2, 0, 30 );

        // We will use 2D canvas element to render our HUD.  
        var hudCanvas = document.createElement('canvas');
    
        // Again, set dimensions to fit the screen.
        hudCanvas.width = width;
        hudCanvas.height = height;

        // Get 2D context and draw something supercool.
        var hudBitmap = hudCanvas.getContext('2d');
        hudBitmap.font = "Normal 40px Arial";
        hudBitmap.textAlign = 'center';
        hudBitmap.fillStyle = "rgba(245,245,245,0.75)";
        hudBitmap.fillText('Initializing...', width / 2, height / 2);

        // Create texture from rendered graphics.
        var hudTexture = new THREE.Texture(hudCanvas) 
        hudTexture.needsUpdate = true;

         // Create plane to render the HUD. This plane fill the whole screen.
        var planeGeometry = new THREE.PlaneGeometry( width , height);
        var planeMaterial = new THREE.MeshBasicMaterial({ map: hudTexture, transparent:true, opacity: 0.7,side: THREE.DoubleSide});
        var plane = new THREE.Mesh( planeGeometry, planeMaterial);
        sceneHUD.add( plane );

        render();

        function render() {

            stats.update();
            // Rotate cube.
            cube.rotation.x += 0.01;
            cube.rotation.y -= 0.01;
            cube.rotation.z += 0.03;

            // render using requestAnimationFrame
            requestAnimationFrame(render);

            renderer.clear();

            // Update HUD graphics.
            hudBitmap.clearRect(0, 0, width, height);
            hudBitmap.fillText("RAD [x:"+(cube.rotation.x % (2 * Math.PI)).toFixed(1)+", y:"+(cube.rotation.y % (2 * Math.PI)).toFixed(1)+", z:"+(cube.rotation.z % (2 * Math.PI)).toFixed(1)+"]" , width / 2, height / 2);
            hudTexture.needsUpdate = true;

            renderer.render(scene, camera);

            // Render HUD on top of the scene.
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