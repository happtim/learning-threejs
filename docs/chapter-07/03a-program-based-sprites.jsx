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

        var getTexture = function () {

            var canvas = document.createElement('canvas');
            canvas.width = 32;
            canvas.height = 32;

            var ctx = canvas.getContext('2d');
            // the body
            ctx.translate(-81, -84);

            ctx.fillStyle = "orange";
            ctx.beginPath();
            ctx.moveTo(83, 116);
            ctx.lineTo(83, 102);
            ctx.bezierCurveTo(83, 94, 89, 88, 97, 88);
            ctx.bezierCurveTo(105, 88, 111, 94, 111, 102);
            ctx.lineTo(111, 116);
            ctx.lineTo(106.333, 111.333);
            ctx.lineTo(101.666, 116);
            ctx.lineTo(97, 111.333);
            ctx.lineTo(92.333, 116);
            ctx.lineTo(87.666, 111.333);
            ctx.lineTo(83, 116);
            ctx.fill();

            // the eyes
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.moveTo(91, 96);
            ctx.bezierCurveTo(88, 96, 87, 99, 87, 101);
            ctx.bezierCurveTo(87, 103, 88, 106, 91, 106);
            ctx.bezierCurveTo(94, 106, 95, 103, 95, 101);
            ctx.bezierCurveTo(95, 99, 94, 96, 91, 96);
            ctx.moveTo(103, 96);
            ctx.bezierCurveTo(100, 96, 99, 99, 99, 101);
            ctx.bezierCurveTo(99, 103, 100, 106, 103, 106);
            ctx.bezierCurveTo(106, 106, 107, 103, 107, 101);
            ctx.bezierCurveTo(107, 99, 106, 96, 103, 96);
            ctx.fill();

            // the pupils
            ctx.fillStyle = "blue";
            ctx.beginPath();
            ctx.arc(101, 102, 2, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(89, 102, 2, 0, Math.PI * 2, true);
            ctx.fill();

            var texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;
            return texture;

        };

        createSprites();

        function createSprites() {
            var material = new THREE.SpriteMaterial({
                map: getTexture(),
                color: 0xffffff
            });

            var range = 500;
            for (var i = 0; i < 1500; i++) {
                var sprite = new THREE.Sprite(material);
                sprite.position.set(Math.random() * range - range / 2, Math.random() * range - range / 2, Math.random() * range - range / 2);
                sprite.scale.set(4, 4, 4);
                scene.add(sprite);
            }
        }


        var step = 0;

        render();

        function render() {

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
