//import { GUI  } from 'three/examples/jsm/libs/dat.gui.module'
import GUI from 'lil-gui';

export function InitGui(index=''){

    var gui = new GUI({autoPlace:false});
    // Align top-left
    gui.domElement.style.position = 'absolute';
    gui.domElement.style.right = '0px';
    gui.domElement.style.top = '0px';

    if(index){
        index  = '-' + index;
    }

    document.getElementById("Gui-output" + index).appendChild(gui.domElement);

    return gui;
}
