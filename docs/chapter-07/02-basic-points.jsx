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
        var stats = InitStats();
        var gui = InitGui();

        renderer.setClearColor(new THREE.Color(0x000000));
        // position and point the camera to the center of the scene
        camera.position.x = 20;
        camera.position.y = 0;
        camera.position.z = 150;
        camera.lookAt(scene.position);

        var cloud;

        var controls = new function () {
            this.size = 4;
            this.transparent = true;
            this.opacity = 0.6;
            this.vertexColors = true;
            this.color = 0xffffff;
            this.sizeAttenuation = true;
            this.rotateSystem = true;

            this.redraw = function () {
                if (scene.getObjectByName("particles")) {
                    scene.remove(scene.getObjectByName("particles"));
                }
                createParticles(controls.size, controls.transparent, controls.opacity, controls.vertexColors, controls.sizeAttenuation, controls.color);
            };
        };

        gui.add(controls, 'size', 0, 10).onChange(controls.redraw);
        gui.add(controls, 'transparent').onChange(controls.redraw);
        gui.add(controls, 'opacity', 0, 1).onChange(controls.redraw);
        gui.add(controls, 'vertexColors').onChange(controls.redraw);
        gui.addColor(controls, 'color').onChange(controls.redraw);
        gui.add(controls, 'sizeAttenuation').onChange(controls.redraw);
        gui.add(controls, 'rotateSystem');

        controls.redraw();

        function createParticles(size, transparent, opacity, vertexColors, sizeAttenuation, color) {

            var geom = new THREE.BufferGeometry();
            var material = new THREE.PointsMaterial({
                size: size,
                transparent: transparent,
                opacity: opacity,
                vertexColors: vertexColors,

                sizeAttenuation: sizeAttenuation,
                color: color
            });

            var points = [];
            var colors = [];
            var range = 500;
            for (var i = 0; i < 15000; i++) {
                var particle = new THREE.Vector3(Math.random() * range - range / 2, Math.random() * range - range / 2, Math.random() * range - range / 2);
                points.push(particle);

                let targetColor = new THREE.Color();
                var color = new THREE.Color(0x00ff00).getHSL(targetColor);
                color.setHSL(targetColor.h, targetColor.s, Math.random() * targetColor.l);

                colors.push(color.r, color.g, color.b);
                //geom.colors.push(color);
            }

            geom.setFromPoints(points);
            geom.setAttribute('color', new THREE.Float32BufferAttribute(colors ,3) )

            cloud = new THREE.Points(geom, material);
            cloud.name = "particles";
            scene.add(cloud);
        }

        let step = 0;

        render();

        function render() {

            if (controls.rotateSystem) {
                step += 0.01;

                cloud.rotation.x = step;
                cloud.rotation.z = step;
            }


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
