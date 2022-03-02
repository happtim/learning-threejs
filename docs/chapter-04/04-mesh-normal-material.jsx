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
        var stats = InitStats('d');
        var gui = InitGui('d');

        var groundGeom = new THREE.PlaneGeometry(100, 100, 4, 4);
        var groundMesh = new THREE.Mesh(groundGeom, new THREE.MeshBasicMaterial({color: 0x777777}));
        groundMesh.rotation.x = -Math.PI / 2;
        groundMesh.position.y = -20;
        scene.add(groundMesh);

        var sphereGeometry = new THREE.SphereGeometry(14, 20, 20);
        var cubeGeometry = new THREE.BoxGeometry(15, 15, 15);
        var planeGeometry = new THREE.PlaneGeometry(14, 14, 4, 4);


        var meshMaterial = new THREE.MeshNormalMaterial();
        var sphere = new THREE.Mesh(sphereGeometry, meshMaterial);
        var cube = new THREE.Mesh(cubeGeometry, meshMaterial);
        var plane = new THREE.Mesh(planeGeometry, meshMaterial);

        // position the sphere
        sphere.position.x = 0;
        sphere.position.y = 3;
        sphere.position.z = 2;

        let position = sphere.geometry.getAttribute('position');
        let index = sphere.geometry.index;

        let tri = new THREE.Triangle(); // for re-use
        let a = new THREE.Vector3(), 
            b = new THREE.Vector3(), 
            c = new THREE.Vector3(); // for re-use


        for( let f = 0; f < index.count / 3; f++ ){
            let idxBase = f * 3;
            a.fromBufferAttribute( position, index.getX( idxBase + 0 ) );
            b.fromBufferAttribute( position, index.getX( idxBase + 1 ) );
            c.fromBufferAttribute( position, index.getX( idxBase + 2 ) );
            tri.set( a, b, c );

            let dir = new THREE.Vector3();
            let origin = new THREE.Vector3();

            tri.getNormal(dir);
            tri.getMidpoint(origin);

            var arrow = new THREE.ArrowHelper(
                    dir,
                    origin,
                    2,
                    0x3333FF,
                    0.5,
                    0.5);

            sphere.add(arrow);

        }

        cube.position.copy( sphere.position );
        plane.position.copy( sphere.position);
        // add the sphere to the scene
        scene.add(cube);

        // add subtle ambient lighting
        var ambientLight = new THREE.AmbientLight(0x0c0c0c);
        scene.add(ambientLight);

        // add spotlight for the shadows
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-40, 60, -10);
        spotLight.castShadow = true;
        scene.add(spotLight);

        // call the render function
        var step = 0;
        var oldContext = null;

        var controls = new function () {
            this.rotationSpeed = 0.02;
            this.bouncingSpeed = 0.03;

            this.opacity = meshMaterial.opacity;
            this.transparent = meshMaterial.transparent;

            this.visible = meshMaterial.visible;
            this.side = "front";

            this.wireframe = meshMaterial.wireframe;
            this.wireframeLinewidth = meshMaterial.wireframeLinewidth;

            this.selectedMesh = "cube";

            this.shadow = "flat";
            this.flatShading = false;

        };


        var spGui = gui.addFolder("Mesh");
        spGui.add(controls, 'opacity', 0, 1).onChange(function (e) {
            meshMaterial.opacity = e
        });
        spGui.add(controls, 'transparent').onChange(function (e) {
            meshMaterial.transparent = e
        });
        spGui.add(controls, 'wireframe').onChange(function (e) {
            meshMaterial.wireframe = e
        });
        spGui.add(controls, 'wireframeLinewidth', 0, 20).onChange(function (e) {
            meshMaterial.wireframeLinewidth = e
        });
        spGui.add(controls, 'visible').onChange(function (e) {
            meshMaterial.visible = e
        });
        spGui.add(controls, 'side', ["front", "back", "double"]).onChange(function (e) {
            console.log(e);
            switch (e) {
                case "front":
                    meshMaterial.side = THREE.FrontSide;
                    break;
                case "back":
                    meshMaterial.side = THREE.BackSide;
                    break;
                case "double":
                    meshMaterial.side = THREE.DoubleSide;
                    break;
            }
            meshMaterial.needsUpdate = true;

        });
        spGui.add(controls, 'flatShading').onChange(function (e) {

            meshMaterial.flatShading= e;
            meshMaterial.needsUpdate = true;

            //var oldPos = sphere.position.clone();
            //scene.remove(sphere);
            //scene.remove(plane);
            //scene.remove(cube);
            //sphere = new THREE.Mesh(sphere.geometry.clone(), meshMaterial);
            //cube = new THREE.Mesh(cube.geometry.clone(), meshMaterial);
            //plane = new THREE.Mesh(plane.geometry.clone(), meshMaterial);

            //sphere.position.copy( oldPos);
            //cube.position .copy( oldPos);
            //plane.position.copy( oldPos);

            //switch (controls.selectedMesh) {
            //    case "cube":
            //        scene.add(cube);

            //        break;
            //    case "sphere":
            //        scene.add(sphere);

            //        break;
            //    case "plane":
            //        scene.add(plane);
            //        break;

            //}

            //meshMaterial.needsUpdate = true;
            console.log(meshMaterial);
        });

        spGui.add(controls, 'selectedMesh', ["cube", "sphere", "plane"]).onChange(function (e) {

            scene.remove(plane);
            scene.remove(cube);
            scene.remove(sphere);


            switch (e) {
                case "cube":
                    scene.add(cube);

                    break;
                case "sphere":
                    scene.add(sphere);

                    break;
                case "plane":
                    scene.add(plane);
                    break;

            }

        });

        render();

        function render() {
            stats.update();

            cube.rotation.y = step += 0.01;
            plane.rotation.y = step;
            sphere.rotation.y = step;


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
        <div id="Stats-output-d" >
        </div>
        <div id="Gui-output-d">
        </div>
        </div>
    );
}  
