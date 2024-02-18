import * as THREE from 'node_modules/three/build/three.module.min.js';
import { STLLoader } from './STLLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(3, 6, 21);
camera.rotation.set(0,0,0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const axesHelper = new THREE.AxesHelper(40);
scene.add(axesHelper);

const material = new THREE.MeshPhysicalMaterial({
    color: 0xff0000,
    metalness: 0,
    roughness: 0,
    opacity: 1,
    transparent: false,
    transmission: 0.99,
    clearcoat: 1.0,
    clearcoatRoughness: 0.25,
    emissive: 0xff0000
})

let mesh;

const loader = new STLLoader();
loader.load('model.stl', function (geometry){
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
});
    
let mouseDown = false;
let mousewheel = false;
let prevMousePos = { x: 0, y: 0 };

document.addEventListener('mousedown', event => {
    if (event.button === 0) {
        mouseDown = true;
    }
    else if (event.button === 1) {
        mousewheel = true;
    }
});

document.addEventListener('mouseup', event => {
    if (event.button === 0) {
        mouseDown = false;
    }
    else if (event.button === 1) {
        mousewheel = false;
    }
});

document.addEventListener('mousemove', event => {
    const deltaMove = {
        x: event.offsetX - prevMousePos.x,
        y: (event.offsetY - prevMousePos.y) * 1
    };

    if (mouseDown) {
        mesh.position.x += deltaMove.x * 0.05;
        mesh.position.z += deltaMove.y * 0.05;
    }

    else if (mousewheel) {
        mesh.rotation.x -= (deltaMove.y * 0.05) * -1;
        mesh.rotation.y -= (deltaMove.x * 0.05) * -1;
    }
    prevMousePos = { x: event.offsetX, y: event.offsetY };
});

// Функция анимации
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
