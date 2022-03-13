
import * as THREE from 'three';

export let group = new THREE.Group();

const geometry = new THREE.BufferGeometry();
geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [], 3 ) );

const lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff, transparent: true, opacity: 0.5 } );
const meshMaterial = new THREE.MeshPhongMaterial( { color: 0x156289, emissive: 0x072534, side: THREE.DoubleSide, flatShading: true } );

group.add( new THREE.LineSegments( geometry, lineMaterial ) );
group.add( new THREE.Mesh( geometry, meshMaterial ) );

export function updateGroupGeometry( mesh, geometry ) {

    mesh.children[ 0 ].geometry.dispose();
    mesh.children[ 1 ].geometry.dispose();

    mesh.children[ 0 ].geometry = new THREE.WireframeGeometry( geometry );
    mesh.children[ 1 ].geometry = geometry;

    // these do not update nicely together if shared

}