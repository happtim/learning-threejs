import * as THREE from 'three';
import React , { useRef, useEffect }from 'react';
import { InitStats} from '/src/components/initStats';
import { InitScene} from '/src/components/initScene';
import { InitGui } from '/src/components/initGui';
import  {InitMesh, updateGroupGeometry} from './InitMesh';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader'

export function Scene() 
{
    const ref = useRef(null);

    useEffect(()=> {

        const div = ref.current;
        var [scene, camera, renderer] = InitScene(div);
        var stats = InitStats('c');
        var gui = InitGui('c');

        // add spotlight for the shadows
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-40, 60, -10);
        scene.add(spotLight);

        // call the render function
        var step = 0;

        let batman = `
        <svg version="1.0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="1152px" height="1152px" xml:space="preserve">
            <g>
                <path  id="batman-path" style="fill:rgb(0,0,0);" d="M 261.135 114.535 C 254.906 116.662 247.491 118.825 244.659 119.344 C 229.433 122.131 177.907 142.565 151.973 156.101 C 111.417 177.269 78.9808 203.399 49.2992 238.815 C 41.0479 248.66 26.5057 277.248 21.0148 294.418 C 14.873 313.624 15.3588 357.341 21.9304 376.806 C 29.244 398.469 39.6107 416.935 52.0865 430.524 C 58.2431 437.23 63.3085 443.321 63.3431 444.06 C 63.4748 446.883 102.278 479.707 120.51 492.418 C 131.003 499.734 148.168 509.93 158.654 515.075 C 169.139 520.22 179.431 525.34 181.524 526.454 C 187.725 529.754 187.304 527.547 179.472 515.713 C 164.806 493.553 158.448 464.659 164.322 446.861 C 169.457 431.303 192.013 421.501 214.324 425.132 C 234.042 428.341 252.142 439.186 270.958 459.064 C 286.677 475.67 292.133 482.967 295.31 491.634 C 297.466 497.514 298.948 495.91 304.862 481.293 C 313.673 459.519 329.808 445.735 346.35 445.851 C 367.654 446 399.679 478.239 412.801 512.745 C 414.093 516.144 416.593 522.632 418.355 527.163 C 420.118 531.695 423.604 542.319 426.103 550.773 C 430.848 566.832 432.355 566.851 434.872 550.88 C 436.395 541.215 451.403 502.522 455.655 497.298 C 457.038 495.599 460.63 489.896 463.636 484.625 C 471.696 470.498 492.318 452.688 505.387 448.568 C 514.602 445.663 517.533 445.549 525.51 447.782 C 539.676 451.749 553.43 467.773 560.706 488.788 L 563.242 496.114 L 567.096 490.012 C 577.709 473.208 593.665 453.899 602.47 447.206 C 607.884 443.09 613.378 438.825 614.679 437.729 C 615.98 436.632 622.927 433.259 630.118 430.233 C 655.159 419.693 681.195 423.407 693.273 439.241 C 697.957 445.382 698.932 448.971 699.538 462.294 C 700.174 476.284 699.51 479.864 693.686 493.854 C 690.073 502.533 684.912 512.883 682.217 516.854 C 679.523 520.825 678.172 524.074 679.215 524.074 C 681.932 524.074 718.787 504.481 732.525 495.734 C 760.018 478.228 788.909 452.599 803.9 432.418 C 807.266 427.886 810.569 423.715 811.239 423.149 C 814.498 420.395 828.253 393.099 833.17 379.627 C 838.223 365.782 838.713 361.822 838.741 334.582 C 838.776 300.425 836.431 291.124 820.154 260.873 C 810.649 243.207 807.498 239.005 788.417 218.543 C 751.511 178.968 688.147 142.549 621.582 122.654 C 581.7 110.734 580.388 110.465 580.388 114.195 C 580.388 115.328 581.302 116.255 582.418 116.255 C 584.279 116.255 587.705 122.106 603.399 152.085 C 613.977 172.29 618.077 189.427 618.264 214.21 C 618.42 234.928 617.88 238.368 612.285 252.269 C 604.327 272.04 590.066 286.889 572.829 293.352 C 558.526 298.714 549.193 297.86 535.704 289.955 C 526.777 284.723 512.304 267.644 509.816 259.404 C 509.132 257.138 507.129 251.358 505.366 246.558 C 503.602 241.759 501.646 231.564 501.018 223.902 C 500.39 216.24 498.491 198.402 496.797 184.261 C 495.104 170.121 493.307 152.047 492.803 144.097 C 492.299 136.147 491.292 125.625 490.565 120.715 L 489.242 111.787 L 483.323 118.267 C 480.067 121.832 477.404 125.618 477.404 126.681 C 477.404 127.744 476.603 128.613 475.624 128.613 C 474.645 128.613 471.275 132.321 468.135 136.852 L 462.426 145.091 L 431.038 145.091 L 399.65 145.091 L 386.811 128.494 C 379.749 119.365 373.509 112.36 372.943 112.926 C 372.377 113.491 371.57 118.875 371.15 124.888 C 370.73 130.902 368.94 147.744 367.172 162.315 C 365.405 176.887 363.523 195.424 362.99 203.509 C 360.283 244.622 352.784 266.044 335.323 282.544 C 326.456 290.923 312.488 297.497 303.508 297.518 C 294.864 297.539 278.732 290.063 269.473 281.748 C 246.952 261.521 238.846 229.614 245.481 187.314 C 247.894 171.928 266.562 131.612 275.927 121.56 C 277.987 119.348 279.673 116.786 279.673 115.867 C 279.673 114.947 279.905 113.593 280.188 112.856 C 281.28 110.017 271.977 110.837 261.136 114.536 L 261.135 114.535 "/>
            </g>
        </svg>
        `;
        let mesh = InitMesh();
        scene.add( mesh );

        const twoPi = Math.PI * 2;

        const data = {
            depth : 2,
            bevelThickness : 2,
            bevelSize : 0.5,
            bevelEnabled : true,
            bevelSegments : 3,
            bevelEnabled : true,
            curveSegments : 12,
            steps : 1,
        };

        const folder = gui.addFolder( 'THREE.LatheGeometry' );

        folder.add(data, 'depth', 0, 20).onChange(generateGeometry);
        folder.add(data, 'bevelThickness', 0, 10).onChange(generateGeometry);
        folder.add(data, 'bevelSize', 0, 10).onChange(generateGeometry);
        folder.add(data, 'bevelSegments', 0, 30).step(1).onChange(generateGeometry);
        folder.add(data, 'bevelEnabled').onChange(generateGeometry);
        folder.add(data, 'curveSegments', 1, 30).step(1).onChange(generateGeometry);
        folder.add(data, 'steps', 1, 5).step(1).onChange(generateGeometry);

        function generateGeometry() {

            const geometry = new THREE.ExtrudeGeometry(drawShape(),data);
            geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-390, -74, 0));
            updateGroupGeometry(mesh,geometry);
            mesh.scale.x = 0.05;
            mesh.scale.y = 0.05;

            mesh.rotation.z = Math.PI;
            mesh.rotation.x = -1.1;
        }

        function drawShape() {

            const loader = new SVGLoader();
            var data = loader.parse(batman);
            console.log(data);
            const paths = data.paths;

            for ( let i = 0; i < paths.length; i ++ ) {
                const path = paths[ i ];

                const shapes = SVGLoader.createShapes( path );

                for ( let j = 0; j < shapes.length; j ++ ) {
                    const shape = shapes[ j ];
                    return shape;
                }
            }

        }

        generateGeometry();

        render();

        function render() {
            stats.update();

            mesh.rotation.y = step += 0.005;

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
        <div id="Stats-output-c" >
        </div>
        <div id="Gui-output-c">
        </div>
        </div>
    );
}  