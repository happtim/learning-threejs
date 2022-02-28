import * as THREE from "three";
import React , { useRef, useEffect }from 'react';

import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry'
import { ParametricGeometries } from 'three/examples/jsm/geometries/ParametricGeometries.js'

import { InitStats} from '/src/components/initStats';
import { InitScene} from '/src/components/initScene';

import * as  SceneUtils from 'three/examples/jsm/utils/SceneUtils';

export function Scene() {

    const ref = useRef(null);

    useEffect(()=>{

        const div = ref.current;

        var [scene, camera, renderer] = InitScene(div);
        var stats = InitStats();

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
        var ambientLight = new THREE.AmbientLight(0x090909);
        scene.add(ambientLight);

        // add spotlight for the shadows
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-40, 40, 50);
        spotLight.castShadow = true;
        scene.add(spotLight);

        // add geometries
        addGeometries(scene);

        function addGeometries(scene) {
            var geoms = [];

            //圆柱体 气缸
            geoms.push(new THREE.CylinderGeometry(1, 4, 4));

            //立方体
            geoms.push(new THREE.BoxGeometry(2, 2, 2));

            //球体
            geoms.push(new THREE.SphereGeometry(2));

            //12面体
            geoms.push(new THREE.IcosahedronGeometry(4));

            // create a convex shape (a shape without dents)
            // using a couple of points
            // for instance a cube
            var points = [
                new THREE.Vector3(2, 2, 2),
                new THREE.Vector3(2, 2, -2),
                new THREE.Vector3(-2, 2, -2),
                new THREE.Vector3(-2, 2, 2),
                new THREE.Vector3(2, -2, 2),
                new THREE.Vector3(2, -2, -2),
                new THREE.Vector3(-2, -2, -2),
                new THREE.Vector3(-2, -2, 2)
            ];

            //凸面体
            geoms.push(new ConvexGeometry(points));

            // create a lathgeometry
            //http://en.wikipedia.org/wiki/Lathe_(graphics)
            var pts = [];//points array - the path profile points will be stored here
            var detail = .1;//half-circle detail - how many angle increments will be used to generate points
            var radius = 3;//radius for half_sphere
            for (var angle = 0.0; angle < Math.PI; angle += detail)//loop from 0.0 radians to PI (0 - 180 degrees)
            {
                pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));//angle/radius to x,z
            }
            
            //车床
            geoms.push(new THREE.LatheGeometry(pts, 12));

            //8面体
            geoms.push(new THREE.OctahedronGeometry(3));

            // create a geometry based on a function
            geoms.push(new THREE.ParametricGeometry(ParametricGeometries.mobius3d, 20, 10));

            //四面体
            geoms.push(new THREE.TetrahedronGeometry(3));

            //圆环体
            geoms.push(new THREE.TorusGeometry(3, 1, 10, 10));

            //圆环结
            geoms.push(new THREE.TorusKnotGeometry(3, 0.5, 50, 20));

            var j = 0;
            for (var i = 0; i < geoms.length; i++) {

                var materials = [
                    new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff, shading: THREE.FlatShading}),
                    new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true})
                ];

                var mesh = SceneUtils.createMultiMaterialObject(geoms[i], materials);
                
                mesh.traverse(function (e) {
                    e.castShadow = true
                });

                // var mesh = new THREE.Mesh(geoms[i],materials[1]);
                // mesh.castShadow=true;
                mesh.position.x = -24 + ((i % 4) * 12);
                mesh.position.y = 4;
                mesh.position.z = -8 + (j * 12);

                if ((i + 1) % 4 == 0) j++;
                scene.add(mesh);
            }

        }

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