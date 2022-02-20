
import * as THREE from 'three';
import React , { useRef, useEffect }from 'react';
import { InitStats} from '@site/src/components/initStats';
import { InitScene} from '@site/src/components/InitScene';
import { InitGui } from '@site/src/components/InitGui';

export function Scene() {

    const ref = useRef(null);

    useEffect(()=>{

        const div = ref.current;
        var [scene, camera, renderer] = InitScene(div);
        var stats = InitStats();
        var gui = InitGui();

        var knot = createMesh(new THREE.TorusKnotGeometry(10, 1, 64, 8, 2, 3, 1));
        // add the sphere to the scene
        scene.add(knot);

        // call the render function
        var step = 0;
        var loadedMesh;

        // setup the control gui
        var controls = new function () {

            console.log(knot.geometry.parameters);
            // we need the first child, since it's a multimaterial
            this.radius = knot.geometry.parameters.radius;
            this.tube = knot.geometry.parameters.tube;
            this.radialSegments = knot.geometry.parameters.radialSegments;
            this.tubularSegments = knot.geometry.parameters.tubularSegments;
            this.p = knot.geometry.parameters.p;
            this.q = knot.geometry.parameters.q;

            this.redraw = function () {
                // remove the old plane
                scene.remove(knot);
                // create a new one
                knot = createMesh(new THREE.TorusKnotGeometry(
                    controls.radius, 
                    controls.tube, 
                    Math.round(controls.tubularSegments), 
                    Math.round(controls.radialSegments), 
                    Math.round(controls.p), 
                    Math.round(controls.q)
                    ));

                // add it to the scene.
                scene.add(knot);
            };

            this.save = function () {
                var result = knot.toJSON();
                localStorage.setItem("json", JSON.stringify(result));
            };

            this.load = function () {

                scene.remove(loadedMesh);

                var json = localStorage.getItem("json");

                if (json) {
                    var loadedGeometry = JSON.parse(json);
                    var loader = new THREE.ObjectLoader();

                    loadedMesh = loader.parse(loadedGeometry);
                    loadedMesh.position.x -= 50;
                    scene.add(loadedMesh);
                }
            }
        };

        var ioGui = gui.addFolder('Save & Load');
        ioGui.add(controls, 'save').onChange(controls.save);
        ioGui.add(controls, 'load').onChange(controls.load);
        var meshGui = gui.addFolder('mesh');
        meshGui.add(controls, 'radius', 0, 40).onChange(controls.redraw);
        meshGui.add(controls, 'tube', 0, 40).onChange(controls.redraw);
        meshGui.add(controls, 'radialSegments', 0, 400).step(1).onChange(controls.redraw);
        meshGui.add(controls, 'tubularSegments', 1, 20).step(1).onChange(controls.redraw);
        meshGui.add(controls, 'p', 1, 10).step(1).onChange(controls.redraw);
        meshGui.add(controls, 'q', 1, 15).step(1).onChange(controls.redraw);


        render();

        function createMesh(geom) {

            // assign two materials
            var meshMaterial = new THREE.MeshBasicMaterial({
                vertexColors: THREE.VertexColors,
                wireframe: true,
                wireframeLinewidth: 2,
                color: 0xaaaaaa
            });
            meshMaterial.side = THREE.DoubleSide;

            // create a multimaterial
            var mesh = new THREE.Mesh(geom, meshMaterial);

            return mesh;
        }

        function render() {
            stats.update();

            knot.rotation.y = step += 0.01;

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
