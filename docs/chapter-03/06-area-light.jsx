import * as THREE from 'three';
import React , { useRef, useEffect }from 'react';
import { InitStats} from '/src/components/initStats';
import { InitScene} from '/src/components/InitScene';
import { InitGui } from '/src/components/InitGui';

import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';

export function Scene() {

    const ref = useRef(null);

    useEffect(()=>{

        const div = ref.current;
        var [scene, camera, renderer] = InitScene(div);
        var stats = InitStats();
        var gui = InitGui();

        renderer.outputEncoding = THREE.sRGBEncoding;

        RectAreaLightUniformsLib.init();

        // create the ground plane
        var planeGeometry = new THREE.PlaneGeometry(70, 70, 1, 1);
        var planeMaterial = new THREE.MeshStandardMaterial({color: 0xffffff, specular: 0xffffff, shininess: 200});
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        // plane.receiveShadow  = true;

        // rotate and position the plane
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 0;
        plane.position.y = 0;
        plane.position.z = 0;

        // add the plane to the scene
        scene.add(plane);

        // call the render function
        var step = 0;

        var spotLight0 = new THREE.SpotLight(0xcccccc);
        spotLight0.position.set(-40, 60, -10);
        spotLight0.intensity = 0.1;
        spotLight0.lookAt(plane);
        //scene.add(spotLight0);


        var areaLight1 = new THREE.RectAreaLight(0xff0000, 3);
        areaLight1.position.set(-5, 5, -35);
        areaLight1.rotation.set(-Math.PI , 0, 0);
        areaLight1.width = 4;
        areaLight1.height = 9.9;
        scene.add(areaLight1);

        var areaLight2 = new THREE.RectAreaLight(0x00ff00, 3);
        areaLight2.position.set(0, 5, -35);
        areaLight2.rotation.set(-Math.PI , 0, 0);
        areaLight2.width = 4;
        areaLight2.height = 9.9;
        scene.add(areaLight2);

        var areaLight3 = new THREE.RectAreaLight(0x0000ff, 3);
        areaLight3.position.set(5, 5, -35);
        areaLight3.rotation.set(-Math.PI , 0, 0);
        areaLight3.width = 4;
        areaLight3.height = 9.9;
        scene.add(areaLight3);

        var areaLightHelper1 = new RectAreaLightHelper( areaLight1 );
        areaLightHelper1.rotation.set(-Math.PI /2 , 0  ,0);

        var areaLightHelper2 = new RectAreaLightHelper( areaLight2 );
        areaLightHelper2.rotation.set(-Math.PI /2 , 0  ,0);

        var areaLightHelper3 = new RectAreaLightHelper( areaLight3 );
        areaLightHelper3.rotation.set(-Math.PI /2 , 0  ,0);

        scene.add( areaLightHelper1 );
        scene.add( areaLightHelper2 );
        scene.add( areaLightHelper3 );

        var controls = new function () {
            this.rotationSpeed = 0.02;
            this.color1 = 0xff0000;
            this.intensity1 = 2;
            this.color2 = 0x00ff00;
            this.intensity2 = 2;
            this.color3 = 0x0000ff;
            this.intensity3 = 2;
        };

        gui.addColor(controls, 'color1').onChange(function (e) {
            areaLight1.color = new THREE.Color(e);

        });
        gui.add(controls, 'intensity1', 0, 5).onChange(function (e) {
            areaLight1.intensity = e;
        });
        gui.addColor(controls, 'color2').onChange(function (e) {
            areaLight2.color = new THREE.Color(e);
        });
        gui.add(controls, 'intensity2', 0, 5).onChange(function (e) {
            areaLight2.intensity = e;
        });
        gui.addColor(controls, 'color3').onChange(function (e) {
            areaLight3.color = new THREE.Color(e);
        });
        gui.add(controls, 'intensity3', 0, 5).onChange(function (e) {
            areaLight3.intensity = e;
        });

        render();

        function render() {
            stats.update();

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

