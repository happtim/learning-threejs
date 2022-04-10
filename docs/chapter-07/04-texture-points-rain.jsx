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
        camera.position.y = 40;
        camera.position.z = 110;
        camera.lookAt(new THREE.Vector3(20, 30, 0));

        var cloud;
        var vertices = [];

        var controls = new function () {
            this.size = 3;
            this.transparent = true;
            this.opacity = 0.6;
            this.color = 0xffffff;

            this.sizeAttenuation = true;

            this.redraw = function () {
                scene.remove(scene.getObjectByName("pointcloud"));

                createPointCloud(controls.size, controls.transparent, controls.opacity, controls.sizeAttenuation, controls.color);
            };
        };

        gui.add(controls, 'size', 0, 20).onChange(controls.redraw);
        gui.add(controls, 'transparent').onChange(controls.redraw);
        gui.add(controls, 'opacity', 0, 1).onChange(controls.redraw);
        gui.addColor(controls, 'color').onChange(controls.redraw);
        gui.add(controls, 'sizeAttenuation').onChange(controls.redraw);

        controls.redraw();

        function createPointCloud(size, transparent, opacity, sizeAttenuation, color) {

            var texture = new THREE.TextureLoader().load("/assets/textures/particles/raindrop-3.png");

            var material = new THREE.PointsMaterial({
                size: size,
                transparent: transparent,
                opacity: opacity,
                map: texture,
                blending: THREE.AdditiveBlending,
                sizeAttenuation: sizeAttenuation,
                color: color
            });

            var range = 40;
            vertices = [];
            for (var i = 0; i < 1500; i++) {
                var point = new THREE.Vector3(
                        Math.random() * range - range / 2,
                        Math.random() * range * 1.5,
                        Math.random() * range - range / 2);
                        //1 + (i/100));
                point.velocityY = 0.1 + Math.random() / 5;
                point.velocityX = (Math.random() - 0.5) / 3;
                vertices.push(point);
            }

            var geometry = new THREE.BufferGeometry();
            geometry.setFromPoints(vertices);

            cloud = new THREE.Points(geometry, material);
            cloud.name = 'pointcloud'

            scene.add(cloud);
        }

        render();

        function render() 
        {
            stats.update();

            let positions = [];
            vertices.forEach(function (v) {
                v.y = v.y - (v.velocityY);
                v.x = v.x - (v.velocityX);

                if (v.y <= 0) v.y = 60;
                if (v.x <= -20 || v.x >= 20) v.velocityX = v.velocityX * -1;
                positions.push(v.x,v.y,v.z);
            });

            cloud.geometry.setAttribute('position',new THREE.BufferAttribute(new Float32Array(positions),3));

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


