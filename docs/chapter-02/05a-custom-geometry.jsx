import * as THREE from "three";
import { Geometry,Face3 } from 'three/examples/jsm/deprecated/Geometry'

import React , { useRef, useEffect }from 'react';
import { InitStats} from '/src/components/initStats';
import { InitScene} from '/src/components/initScene';
import { InitGui } from '/src/components/initGui';

import * as  SceneUtils from 'three/examples/jsm/utils/SceneUtils';


export function Scene() {

    const ref = useRef(null);

    useEffect(()=>{

        const div = ref.current;

        var [scene, camera, renderer] = InitScene(div);
        var stats = InitStats();
        var gui = InitGui();

        // create the ground plane
        var planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
        var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;

        // rotate and position the plane
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 0;
        plane.position.y = 0;
        plane.position.z = 0;

        // add the plane to the scene
        scene.add(plane);

        // add subtle ambient lighting
        //        var ambientLight = new THREE.AmbientLight(0x494949);
        //        scene.add(ambientLight);

        // add spotlight for the shadows
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-40, 60, 10);
        spotLight.castShadow = true;
        scene.add(spotLight);

        var vertices = [
            new THREE.Vector3(1, 3, 1),
            new THREE.Vector3(1, 3, -1),
            new THREE.Vector3(1, -1, 1),
            new THREE.Vector3(1, -1, -1),
            new THREE.Vector3(-1, 3, -1),
            new THREE.Vector3(-1, 3, 1),
            new THREE.Vector3(-1, -1, -1),
            new THREE.Vector3(-1, -1, 1)
        ];

        var faces = [
            new Face3(0, 2, 1),
            new Face3(2, 3, 1),
            new Face3(4, 6, 5),
            new Face3(6, 7, 5),
            new Face3(4, 5, 1),
            new Face3(5, 0, 1),
            new Face3(7, 6, 2),
            new Face3(6, 3, 2),
            new Face3(5, 7, 0),
            new Face3(7, 2, 0),
            new Face3(1, 3, 4),
            new Face3(3, 6, 4),
        ];

        var geom = new Geometry();
        geom.vertices = vertices;
        geom.faces = faces;
        geom.computeFaceNormals();
        var bufGeom = geom.toBufferGeometry();

        var materials = [
            new THREE.MeshLambertMaterial({opacity: 0.6, color: 0x44ff44, transparent: true}),
            new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true})
        ];

        var mesh = SceneUtils.createMultiMaterialObject(bufGeom, materials);
        mesh.children.forEach(function (e) {
            e.castShadow = true
        });
        //        mesh.children[0].translateX(0.5);
        //        mesh.children[0].translateZ(0.5);

        scene.add(mesh);

        function addControl(x, y, z) {
            var controls = new function () {
                this.x = x;
                this.y = y;
                this.z = z;
            };

            return controls;
        }

        var controlPoints = [];
        controlPoints.push(addControl(3, 5, 3));
        controlPoints.push(addControl(3, 5, 0));
        controlPoints.push(addControl(3, 0, 3));
        controlPoints.push(addControl(3, 0, 0));
        controlPoints.push(addControl(0, 5, 0));
        controlPoints.push(addControl(0, 5, 3));
        controlPoints.push(addControl(0, 0, 0));
        controlPoints.push(addControl(0, 0, 3));

        gui.add(new function () {
            this.clone = function () {

                var clonedGeometry = mesh.children[0].geometry.clone();
                var materials = [
                    new THREE.MeshLambertMaterial({opacity: 0.6, color: 0xff44ff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true})
                ];

                //var wireframe =  new THREE.WireframeGeometry(clonedGeometry);
                //var line = new THREE.Line(wireframe);
                //line.material.lineWidth = 2;
                //line.material.color = new THREE.Color( 0x000000);
                //line.translateX(5);
                //line.translateZ(5);
                //scene.add(line);

                var mesh2 = SceneUtils.createMultiMaterialObject(clonedGeometry, materials);
                mesh2.children.forEach(function (e) {
                    e.castShadow = true
                });

                mesh2.translateX(5);
                mesh2.translateZ(5);
                mesh2.name = "clone";
                scene.remove(scene.getObjectByName("clone"));
                scene.add(mesh2);


            }
        }, 'clone');

        for (var i = 0; i < 8; i++) {

            var f1 = gui.addFolder('Vertices ' + (i ));
            f1.add(controlPoints[i], 'x', -10, 10);
            f1.add(controlPoints[i], 'y', -10, 10);
            f1.add(controlPoints[i], 'z', -10, 10);

        }

        render();

        function render() {
            stats.update();

            var vertices = [];
            for (var i = 0; i < 8; i++) {
                vertices.push(new THREE.Vector3(controlPoints[i].x, controlPoints[i].y, controlPoints[i].z));
            }

            mesh.children.forEach(function (e) {
                
                var geom = new Geometry();
                geom.vertices = vertices;
                geom.faces = faces;
                geom.computeFaceNormals();
                
                e.geometry = geom.toBufferGeometry();
            });

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