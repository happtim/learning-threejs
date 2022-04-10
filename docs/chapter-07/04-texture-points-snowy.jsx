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
        var stats = InitStats('b');
        var gui = InitGui('b');

        renderer.setClearColor(new THREE.Color(0x000000));

        // position and point the camera to the center of the scene
        camera.position.x = 20;
        camera.position.y = 40;
        camera.position.z = 110;
        camera.lookAt(new THREE.Vector3(20, 30, 0));

        var controls = new function () {
            this.size = 10;
            this.transparent = true;
            this.opacity = 0.6;
            this.color = 0xffffff;

            this.sizeAttenuation = true;

            this.redraw = function () {
                var toRemove = [];
                scene.children.forEach(function (child) {
                    if (child instanceof THREE.Points) {
                        toRemove.push(child);
                    }
                });
                toRemove.forEach(function (child) {
                    scene.remove(child)
                });
                createPointClouds(controls.size, controls.transparent, controls.opacity, controls.sizeAttenuation, controls.color);
            };
        };

        gui.add(controls, 'size', 0, 20).onChange(controls.redraw);
        gui.add(controls, 'transparent').onChange(controls.redraw);
        gui.add(controls, 'opacity', 0, 1).onChange(controls.redraw);
        gui.addColor(controls, 'color').onChange(controls.redraw);
        gui.add(controls, 'sizeAttenuation').onChange(controls.redraw);

        controls.redraw();

        function createPointCloud(name, texture, size, transparent, opacity, sizeAttenuation, color) {

            var targetColor = new THREE.Color();
            var color = new THREE.Color(color).getHSL(targetColor);
            color.setHSL(targetColor.h, targetColor.s, (Math.random()) * targetColor.l);

            var material = new THREE.PointsMaterial({
                size: size,
                transparent: transparent,
                opacity: opacity,
                map: texture,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                sizeAttenuation: sizeAttenuation,
                color: color
            });

            let vertices = [];
            var range = 40;
            for (var i = 0; i < 50; i++) {
                var particle = new THREE.Vector3(
                        Math.random() * range - range / 2,
                        Math.random() * range * 1.5,
                        Math.random() * range - range / 2);
                particle.velocityY = 0.1 + Math.random() / 5;
                particle.velocityX = (Math.random() - 0.5) / 3;
                particle.velocityZ = (Math.random() - 0.5) / 3;
                vertices.push(particle);
            }

            var geom = new THREE.BufferGeometry();
            geom.setFromPoints(vertices);
            geom.userData = vertices;

            var system = new THREE.Points(geom, material);
            system.name = name;

            return system;
        }

        function createPointClouds(size, transparent, opacity, sizeAttenuation, color) {

            var texture1 = new THREE.TextureLoader().load("/assets/textures/particles/snowflake1.png");
            var texture2 = new THREE.TextureLoader().load("/assets/textures/particles/snowflake2.png");
            var texture3 = new THREE.TextureLoader().load("/assets/textures/particles/snowflake3.png");
            var texture4 = new THREE.TextureLoader().load("/assets/textures/particles/snowflake5.png");

            scene.add(createPointCloud("system1", texture1, size, transparent, opacity, sizeAttenuation, color));
            scene.add(createPointCloud("system2", texture2, size, transparent, opacity, sizeAttenuation, color));
            scene.add(createPointCloud("system3", texture3, size, transparent, opacity, sizeAttenuation, color));
            scene.add(createPointCloud("system4", texture4, size, transparent, opacity, sizeAttenuation, color));
        }

        render();

        function render() {

            stats.update();

            scene.children.forEach(function (child) {
                if (child instanceof THREE.Points) {
                    var vertices = child.geometry.userData;
                    vertices.forEach(function (v) {
                        v.y = v.y - (v.velocityY);
                        v.x = v.x - (v.velocityX);
                        v.z = v.z - (v.velocityZ);

                        if (v.y <= 0) v.y = 60;
                        if (v.x <= -20 || v.x >= 20) v.velocityX = v.velocityX * -1;
                        if (v.z <= -20 || v.z >= 20) v.velocityZ = v.velocityZ * -1;
                    });

                    child.geometry.setFromPoints(vertices);
                }
            });

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


