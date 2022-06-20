import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";


const loader = new FBXLoader();
// loader.load('.', function ( object ) {
//
//     mixer = new THREE.AnimationMixer( object );
//
//     const action = mixer.clipAction( object.animations[ 0 ] );
//     action.play();
//
//     object.traverse( function ( child ) {
//
//         if ( child.isMesh ) {
//
//             child.castShadow = true;
//             child.receiveShadow = true;
//
//         }
//
//     } );
//
//     scene.add( object );
//
// } );