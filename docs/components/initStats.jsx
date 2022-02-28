import  Stats  from 'three/examples/jsm/libs/stats.module'

export default function InitStats(index='') {

    let stats = new Stats();

    stats.setMode(0); // 0: fps, 1: ms

    // Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    if(index){
        index  = '-' + index;
    }

    document.getElementById("Stats-output" + index).appendChild(stats.domElement);

    return stats;
}