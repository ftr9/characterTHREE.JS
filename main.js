import * as THREE from 'three'
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from './node_modules/three/examples/jsm/loaders/DRACOLoader';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls'
import { Clock } from 'three';
////scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

////clock
const clock = new Clock();
let timerToUpdate = clock.getDelta();

////object
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/node_modules/three/examples/js/libs/draco/gltf/');
const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

////load model from blender
loader.load('/models/mineeve.glb', (gltf) => {
  gltf.scene.position.y = -0.5;
  scene.add(gltf.scene);

  //!animated object
  const animatedModel = new THREE.AnimationMixer(gltf.scene);

  //!action and clipping
  const death_Action = animatedModel.clipAction(gltf.animations[0]);
  const fireAndWalk_Action = animatedModel.clipAction(gltf.animations[1]);
  const firing_Action = animatedModel.clipAction(gltf.animations[2]);
  const idle_Action = animatedModel.clipAction(gltf.animations[3]);
  const walk_Action = animatedModel.clipAction(gltf.animations[4]);

  let currentAction = idle_Action;
  let prevAction = null;
  currentAction.play();
  ////setup EventListener
  window.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'd':
        changeAction(death_Action);
        break;
      case 'w':
        changeAction(fireAndWalk_Action);
        break;
      case 'f':
        changeAction(firing_Action);
        break;
      case 'l':
        changeAction(idle_Action);
        break;
      case 'e':
        changeAction(walk_Action);
        break;
      default: {
        changeAction(idle_Action);
      }
    }
  })

  //renderer.render(scene, camera);
  animate();
  const orbitControl = new OrbitControls(camera, renderer.domElement);
  ////begin the threejs loop
  //animate();
  function animate() {
    timerToUpdate = clock.getDelta();
    requestAnimationFrame(animate);
    animatedModel.update(timerToUpdate);
    //render the scene
    renderer.render(scene, camera);
  }

  //!changes the action of current PLayer
  function changeAction(selectedAction) {
    prevAction = currentAction;
    currentAction = selectedAction;
    prevAction.fadeOut(1);
    currentAction.reset();
    currentAction.fadeIn(1);
    currentAction.play();
  }

}, (xhr) => {
  console.log("Loading ..");
}, (err) => {
  console.log(err.message);
})




////Light
const directionalLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(directionalLight);

////camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100);
camera.position.z = 2;

////renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


