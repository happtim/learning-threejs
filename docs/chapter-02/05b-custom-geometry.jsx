import * as THREE from "three";
import { Geometry,Face3 } from 'three/examples/jsm/deprecated/Geometry'

import React , { useRef, useEffect }from 'react';
import { InitStats} from '@site/src/components/initStats';
import { InitScene} from '@site/src/components/InitScene';
import { InitGui } from '@site/src/components/InitGui';

import * as  SceneUtils from 'three/examples/jsm/utils/SceneUtils';

export function Scene() {

    const ref = useRef(null);

    useEffect(()=>{

        const div = ref.current;

        var [scene, camera, renderer] = InitScene(div);
        var stats = InitStats('b');
        var gui = InitGui('b');

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

        //8个顶点
        var vertices = [
            // front
            {pos: [-1,  3,  1], norm: [ 0,  0,  1]},  // 顶点5
            {pos: [-1, -1,  1], norm: [ 0,  0,  1]},  // 顶点7
            {pos: [ 1,  3,  1], norm: [ 0,  0,  1]},  // 顶点0

            {pos: [ 1,  3,  1], norm: [ 0,  0,  1]},  // 0
            {pos: [-1, -1,  1], norm: [ 0,  0,  1]},  // 7
            {pos: [ 1, -1,  1], norm: [ 0,  0,  1]},  // 2

            // 将前面的三角换一个方向
            // {pos: [-1, -1,  1], norm: [ 0,  0,  1]},  // 顶点7
            // {pos: [ 1, -1,  1], norm: [ 0,  0,  1]},  // 顶点2
            // {pos: [-1,  3,  1], norm: [ 0,  0,  1]},  // 顶点5

           
            // //反方向可以观察
            // {pos: [ 1,  3,  1], norm: [ 0,  0,  1]},  // 0  
            // {pos: [ 1, -1,  1], norm: [ 0,  0,  1]},  // 2  
            // {pos: [-1,  3,  1], norm: [ 0,  0,  1]},  // 5  

            
            // right
            {pos: [ 1,  3,  1], norm: [ 1,  0,  0]},  // 0
            {pos: [ 1, -1,  1], norm: [ 1,  0,  0]},  // 2
            {pos: [ 1,  3, -1], norm: [ 1,  0,  0]},  // 1

            {pos: [ 1, -1,  1], norm: [ 1,  0,  0]},  // 2
            {pos: [ 1, -1, -1], norm: [ 1,  0,  0]},  // 3
            {pos: [ 1,  3, -1], norm: [ 1,  0,  0]},  // 1

            // back
            {pos: [ 1,  3, -1], norm: [ 0,  0, -1]},  // 1
            {pos: [ 1, -1, -1], norm: [ 0,  0, -1]},  // 3
            {pos: [-1,  3, -1], norm: [ 0,  0, -1]},  // 4

            {pos: [ 1, -1, -1], norm: [ 0,  0, -1]},  // 3
            {pos: [-1, -1, -1], norm: [ 0,  0, -1]},  // 6
            {pos: [-1,  3, -1], norm: [ 0,  0, -1]},  // 4

            // left
            {pos: [-1,  3, -1], norm: [-1,  0,  0]},  // 4
            {pos: [-1, -1, -1], norm: [-1,  0,  0]},  // 6
            {pos: [-1,  3,  1], norm: [-1,  0,  0]},  // 5

            {pos: [-1, -1, -1], norm: [-1,  0,  0]},  // 6
            {pos: [-1, -1,  1], norm: [-1,  0,  0]},  // 7
            {pos: [-1,  3,  1], norm: [-1,  0,  0]},  // 5

            // top
            {pos: [-1,  3, -1], norm: [ 0,  1,  0]},  // 4
            {pos: [-1,  3,  1], norm: [ 0,  1,  0]},  // 5
            {pos: [ 1,  3, -1], norm: [ 0,  1,  0]},  // 1

            {pos: [-1,  3,  1], norm: [ 0,  1,  0]},  // 5
            {pos: [ 1,  3,  1], norm: [ 0,  1,  0]},  // 0
            {pos: [ 1,  3, -1], norm: [ 0,  1,  0]},  // 1

            // bottom
            {pos: [-1, -1,  1], norm: [ 0, -1,  0]},  // 7
            {pos: [-1, -1, -1], norm: [ 0, -1,  0]},  // 6
            {pos: [ 1, -1,  1], norm: [ 0, -1,  0]},  // 2

            {pos: [-1, -1, -1], norm: [ 0, -1,  0]},  // 6
            {pos: [ 1, -1, -1], norm: [ 0, -1,  0]},  // 3
            {pos: [ 1, -1,  1], norm: [ 0, -1,  0]},  // 2
        ];

        // old faces indexes
        var faces = [
            //right
            new Face3(0, 2, 1),
            new Face3(2, 3, 1),
            //left
            new Face3(4, 6, 5),
            new Face3(6, 7, 5),
            //top
            new Face3(4, 5, 1),
            new Face3(5, 0, 1),
            //bottom
            new Face3(7, 6, 2),
            new Face3(6, 3, 2),
            //front
            new Face3(5, 7, 0),
            new Face3(7, 2, 0),
            //back
            new Face3(1, 3, 4),
            new Face3(3, 6, 4),
        ];


        const positions = [];
        const normals = [];

        var geom = new THREE.BufferGeometry();
        for(const vertex of vertices){
            positions.push(...vertex.pos);
            normals.push(...vertex.norm);
        }
        geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array( positions), 3));
        geom.setAttribute('normal',new THREE.BufferAttribute(new Float32Array(normals),3));

        var materials = [
            new THREE.MeshLambertMaterial({opacity: 0.6, color: 0x44ff44, transparent: true}),
            new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true})
        ];


        var mesh = SceneUtils.createMultiMaterialObject(geom, materials);
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

            var f1 = gui.addFolder('Vertices ' + (i));
            f1.add(controlPoints[i], 'x', -10, 10);
            f1.add(controlPoints[i], 'y', -10, 10);
            f1.add(controlPoints[i], 'z', -10, 10);

        }

        render();

        function render() {
            stats.update();

            var vertexPos = [];
            for (var i = 0; i < 8; i++) {
                vertexPos.push( { pos: [controlPoints[i].x, controlPoints[i].y, controlPoints[i].z]});
            }

            //8个顶点
            var vertices = [
                // front
                /* 0*/ ...vertexPos[5].pos,  // 顶点5
                /* 1*/ ...vertexPos[7].pos,  // 顶点7
                /* 2*/ ...vertexPos[0].pos,  // 顶点0

                              //-1, -1,  1,  // 7
                /* 3*/ ...vertexPos[2].pos,  // 2
                              // 1,  3,  1,  // 0
                
                // right
                /* 4*/ ...vertexPos[0].pos,  // 0
                /* 5*/ ...vertexPos[2].pos,  // 2
                /* 6*/ ...vertexPos[1].pos,  // 1

                               //1, -1,  1,  // 2
                /* 7*/ ...vertexPos[3].pos,  // 3
                               //1,  3, -1,  // 1

                // back
                /* 8*/ ...vertexPos[1].pos,  // 1
                /* 9*/ ...vertexPos[3].pos,  // 3
                /*10*/ ...vertexPos[4].pos,  // 4

                              // 1, -1, -1,  // 3
                /*12*/ ...vertexPos[6].pos,  // 6
                              //-1,  3, -1,  // 4

                // left
                /*12*/ ...vertexPos[4].pos,  // 4
                /*13*/ ...vertexPos[6].pos,  // 6
                /*14*/ ...vertexPos[5].pos,  // 5

                             // -1, -1, -1,  // 6
                /*15*/ ...vertexPos[7].pos,  // 7
                              //-1,  3,  1,  // 5

                // top
                /*16*/ ...vertexPos[4].pos,  // 4
                /*17*/ ...vertexPos[5].pos,  // 5
                /*18*/ ...vertexPos[1].pos,  // 1

                              //-1,  3,  1,  // 5
                /*19*/ ...vertexPos[0].pos,  // 0
                              // 1,  3, -1,  // 1

                // bottom
                /*20*/ ...vertexPos[7].pos,  // 7
                /*21*/ ...vertexPos[6].pos,  // 6
                /*22*/ ...vertexPos[2].pos,  // 2

                              //-1, -1, -1,  // 6
                /*23*/ ...vertexPos[3].pos,  // 3
                              // 1, -1,  1,  // 2
            ];

            var indexes = [
                0,  1,  2,   2,  1,  3,  // front
                4,  5,  6,   6,  5,  7,  // right
                8,  9, 10,  10,  9, 11,  // back
               12, 13, 14,  14, 13, 15,  // left
               16, 17, 18,  18, 17, 19,  // top
               20, 21, 22,  22, 21, 23,  // bottom
            ];
            
            mesh.children.forEach(function (e) {
                e.geometry.setAttribute('position', new THREE.BufferAttribute( new Float32Array( vertices), 3));
                e.geometry.setIndex(indexes);
                e.geometry.computeVertexNormals();

            // console.log(e.geometry);
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
        <div id="Stats-output-b" >
        </div>
        <div id="Gui-output-b">
        </div>
        </div>
    );
}