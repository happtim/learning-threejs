
import * as THREE from 'three';
import React , { useRef, useEffect }from 'react';
import { InitStats} from '/src/components/initStats';
import { InitScene} from '/src/components/initScene';
import { InitGui } from '/src/components/initGui';
import {InitMesh, updateGroupGeometry} from './InitMesh';
import { CSG } from 'three-csg-ts';

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

        var sphere1 = createMesh(new THREE.SphereGeometry(5, 20, 30));
        sphere1.position.x = -2;

        var sphere2 = createMesh(new THREE.SphereGeometry(5, 20, 30));
        sphere2.position.set(3, 0, 0);

        var cube = createMesh(new THREE.BoxGeometry(5, 5, 5));
        cube.position.x = -7;

        // add the sphere to the scene
        scene.add(sphere1);
        scene.add(sphere2);
        scene.add(cube);

        // setup the control gui
        var controls = new function () {

            this.sphere1PosX = sphere1.position.x;
            this.sphere1PosY = sphere1.position.y;
            this.sphere1PosZ = sphere1.position.z;
            this.sphere1Scale = 1;

            this.sphere2PosX = sphere2.position.x;
            this.sphere2PosY = sphere2.position.y;
            this.sphere2PosZ = sphere2.position.z;
            this.sphere2Scale = 1;

            this.cubePosX = cube.position.x;
            this.cubePosY = cube.position.y;
            this.cubePosZ = cube.position.z;
            this.scaleX = 1;
            this.scaleY = 1;
            this.scaleZ = 1;

            this.actionCube = "subtract"; // add, substract, intersect
            this.actionSphere = "subtract";

            this.showResult = function () {
                redrawResult();
            };

            this.hideWireframes = false;
            this.rotateResult = false;

        };

        var guiSphere1 = gui.addFolder("Sphere1");
        guiSphere1.add(controls, "sphere1PosX", -15, 15).onChange(function () {
            sphere1.position.set(controls.sphere1PosX, controls.sphere1PosY, controls.sphere1PosZ)
        });
        guiSphere1.add(controls, "sphere1PosY", -15, 15).onChange(function () {
            sphere1.position.set(controls.sphere1PosX, controls.sphere1PosY, controls.sphere1PosZ)
        });
        guiSphere1.add(controls, "sphere1PosZ", -15, 15).onChange(function () {
            sphere1.position.set(controls.sphere1PosX, controls.sphere1PosY, controls.sphere1PosZ)
        });
        guiSphere1.add(controls, "sphere1Scale", 0, 10).onChange(function (e) {
            sphere1.scale.set(e, e, e)
        });

        var guiSphere2 = gui.addFolder("Sphere2");
        guiSphere2.add(controls, "sphere2PosX", -15, 15).onChange(function () {
            sphere2.position.set(controls.sphere2PosX, controls.sphere2PosY, controls.sphere2PosZ)
        });
        guiSphere2.add(controls, "sphere2PosY", -15, 15).onChange(function () {
            sphere2.position.set(controls.sphere2PosX, controls.sphere2PosY, controls.sphere2PosZ)
        });
        guiSphere2.add(controls, "sphere2PosZ", -15, 15).onChange(function () {
            sphere2.position.set(controls.sphere2PosX, controls.sphere2PosY, controls.sphere2PosZ)
        });
        guiSphere2.add(controls, "sphere2Scale", 0, 10).onChange(function (e) {
            sphere2.scale.set(e, e, e)
        });
        guiSphere2.add(controls, "actionSphere", ["subtract", "intersect", "union", "none"]);

        var guiCube = gui.addFolder("cube");
        guiCube.add(controls, "cubePosX", -15, 15).onChange(function () {
            cube.position.set(controls.cubePosX, controls.cubePosY, controls.cubePosZ)
        });
        guiCube.add(controls, "cubePosY", -15, 15).onChange(function () {
            cube.position.set(controls.cubePosX, controls.cubePosY, controls.cubePosZ)
        });
        guiCube.add(controls, "cubePosZ", -15, 15).onChange(function () {
            cube.position.set(controls.cubePosX, controls.cubePosY, controls.cubePosZ)
        });
        guiCube.add(controls, "scaleX", 0, 10).onChange(function (e) {
            cube.scale.x = e
        });
        guiCube.add(controls, "scaleY", 0, 10).onChange(function (e) {
            cube.scale.y = e
        });
        guiCube.add(controls, "scaleZ", 0, 10).onChange(function (e) {
            cube.scale.z = e
        });
        guiCube.add(controls, "actionCube", ["subtract", "intersect", "union", "none"]);

        gui.add(controls, "showResult");
        gui.add(controls, "rotateResult");
        gui.add(controls, "hideWireframes").onChange(function () {
            if (controls.hideWireframes) {
                sphere1.material.visible = false;
                sphere2.material.visible = false;
                cube.material.visible = false;
            } else {
                sphere1.material.visible = true;
                sphere2.material.visible = true;
                cube.material.visible = true;
            }
        });


        var spinner;

        function redrawResult() {

            var result;
            //showSpinner();

            // make the call async to avoid blocking the thread. Need
            // to set timeout > 1, if not executed immediately.
            setTimeout(function () {

                // first do the sphere
                switch (controls.actionSphere) {
                    case "subtract":
                        result = CSG.subtract(sphere1,sphere2);
                        break;
                    case "intersect":
                        result= CSG.intersect(sphere1,sphere2);
                        break;
                    case "union":
                        result= CSG.union(sphere1,sphere2);
                        break;
                    case "none": // noop;
                }

                // next do the cube
                if (!result) result= sphere1;
                switch (controls.actionCube) {
                    case "subtract":
                        result= CSG.subtract(cube,result);
                        break;
                    case "intersect":
                        result= CSG.intersect(cube,result);
                        break;
                    case "union":
                        result= CSG.union(cube,result);
                        break;
                    case "none": // noop;
                }

                if (controls.actionCube === "none" && controls.actionSphere === "none") {
                    // do nothing
                } else {
                    console.log(result);
                    updateGroupGeometry(mesh,result.geometry);
                    mesh.position.copy(result.position);
                }

                //hideSpinner(spinner);
            }, 200);
        }

        function createMesh(geom) {

            // assign two materials
            var meshMaterial = new THREE.MeshNormalMaterial();
            meshMaterial.side = THREE.DoubleSide;
            var wireFrameMat = new THREE.MeshBasicMaterial({ opacity: 0.5, wireframeLinewidth: 0.5});
            wireFrameMat.wireframe = true;

            // create a multimaterial
            var mesh = new THREE.Mesh(geom, wireFrameMat);

            return mesh;
        }


        function showSpinner() {

            var opts = {
                lines: 13, // The number of lines to draw
                length: 20, // The length of each line
                width: 10, // The line thickness
                radius: 30, // The radius of the inner circle
                corners: 1, // Corner roundness (0..1)
                rotate: 0, // The rotation offset
                direction: 1, // 1: clockwise, -1: counterclockwise
                color: '#000', // #rgb or #rrggbb or array of colors
                speed: 1, // Rounds per second
                trail: 60, // Afterglow percentage
                shadow: false, // Whether to render a shadow
                hwaccel: false, // Whether to use hardware acceleration
                className: 'spinner', // The CSS class to assign to the spinner
                zIndex: 2e9, // The z-index (defaults to 2000000000)
                top: 'auto', // Top position relative to parent in px
                left: 'auto' // Left position relative to parent in px
            };
            var target = document.getElementById('WebGL-output');
            spinner = new Spinner(opts).spin(target);
            return spinner;
        }

        function hideSpinner(spinner) {
            spinner.stop();
        }

        render();

        function render() {
            stats.update();


        //            sphere.rotation.y=step+=0.01;

        //            if (typeof  ThreeBSP!='undefined') {console.log(ThreeBSP)};
        //            console.log(ThreeBSP);

            if (controls.rotateResult) {
                mesh.rotation.y += 0.04;
                //      result.rotation.x+=0.04;
                mesh.rotation.z -= 0.005;
            }

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
