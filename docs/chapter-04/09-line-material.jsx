

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

        // add subtle ambient lighting
        var ambientLight = new THREE.AmbientLight(0x0c0c0c);
        scene.add(ambientLight);

        // add spotlight for the shadows
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-40, 60, -10);
        spotLight.castShadow = true;
        scene.add(spotLight);

        // get the turtle
        var points = gosper(4, 60);

        var lines = [];
        var colors = [];
        var i = 0;
        points.forEach(function (e) {
            lines.push(e.x, e.z, e.y);
            let color = new THREE.Color(0xffffff);
            color.setHSL(e.x / 100 + 0.5, (  e.y * 20 ) / 300, 0.8);
            colors.push(color.r,color.g,color.b);
            i++;
        });

        var material = new THREE.LineBasicMaterial({
            opacity: 1.0,
            color: 0xffffff,
            linewidth: 1,
            vertexColors: true 
        });

        var geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position',new THREE.Float32BufferAttribute(lines,3));
        geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));

        var line = new THREE.Line(geometry, material);
        line.position.set(25, -30, -60);
        scene.add(line);

        // call the render function
        var step = 0;
        render();

        function render() {
            stats.update();
            line.rotation.z = step += 0.01;

            requestAnimationFrame(render);
            renderer.render(scene, camera);
        }

        function gosper(a, b) {

            var turtle = [0, 0, 0];
            var points = [];
            var count = 0;

            rg(a, b, turtle);


            return points;

            function rt(x) {
                turtle[2] += x;
            }

            function lt(x) {
                turtle[2] -= x;
            }

            function fd(dist) {
        //                ctx.beginPath();
                points.push({x: turtle[0], y: turtle[1], z: Math.sin(count) * 5});
        //                ctx.moveTo(turtle[0], turtle[1]);

                var dir = turtle[2] * (Math.PI / 180);
                turtle[0] += Math.cos(dir) * dist;
                turtle[1] += Math.sin(dir) * dist;

                points.push({x: turtle[0], y: turtle[1], z: Math.sin(count) * 5});
        //                ctx.lineTo(turtle[0], turtle[1]);
        //                ctx.stroke();

            }

            function rg(st, ln, turtle) {

                st--;
                ln = ln / 2.6457;
                if (st > 0) {
        //                    ctx.strokeStyle = '#111';
                    rg(st, ln, turtle);
                    rt(60);
                    gl(st, ln, turtle);
                    rt(120);
                    gl(st, ln, turtle);
                    lt(60);
                    rg(st, ln, turtle);
                    lt(120);
                    rg(st, ln, turtle);
                    rg(st, ln, turtle);
                    lt(60);
                    gl(st, ln, turtle);
                    rt(60);
                }
                if (st == 0) {
                    fd(ln);
                    rt(60);
                    fd(ln);
                    rt(120);
                    fd(ln);
                    lt(60);
                    fd(ln);
                    lt(120);
                    fd(ln);
                    fd(ln);
                    lt(60);
                    fd(ln);
                    rt(60)
                }
            }

            function gl(st, ln, turtle) {
                st--;
                ln = ln / 2.6457;
                if (st > 0) {
        //                    ctx.strokeStyle = '#555';
                    lt(60);
                    rg(st, ln, turtle);
                    rt(60);
                    gl(st, ln, turtle);
                    gl(st, ln, turtle);
                    rt(120);
                    gl(st, ln, turtle);
                    rt(60);
                    rg(st, ln, turtle);
                    lt(120);
                    rg(st, ln, turtle);
                    lt(60);
                    gl(st, ln, turtle);
                }
                if (st == 0) {
                    lt(60);
                    fd(ln);
                    rt(60);
                    fd(ln);
                    fd(ln);
                    rt(120);
                    fd(ln);
                    rt(60);
                    fd(ln);
                    lt(120);
                    fd(ln);
                    lt(60);
                    fd(ln);
                }
            }
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
