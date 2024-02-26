import * as THREE from './build/three.module.js';
import { STLLoader } from './build/STLLoader.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-25, 20, 20);
camera.rotation.set(-0.8,-0.8,-0.8);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// *** задаю датчик ***
const material = new THREE.MeshPhysicalMaterial({
    color: 0xAf1100,
    metalness: 1,
    roughness: 1,
    opacity: 1,
    transparent: false,
    transmission: 0.99,
    clearcoat: 1.0,
    clearcoatRoughness: 0.25,
    emissive: 0x696969
})
let mesh;
const loader = new STLLoader();
loader.load('./models/model.stl', function (geometry){
    geometry.scale(0.1,0.1,0.1)
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.x = -5;
    mesh.position.y = 5;
});


// *** задаю кольцо ***
const materialKrug = new THREE.MeshPhysicalMaterial({
    color: 0xAf1100,
    metalness: 1,
    roughness: 1,
    opacity: 1,
    transparent: false,
    transmission: 0.99,
    clearcoat: 1.0,
    clearcoatRoughness: 0.25,
    emissive: 0xAf1100
})
let meshKrug;
const loaderKrug = new STLLoader();
loader.load('./models/krug.stl', function (geometry){
    meshKrug = new THREE.Mesh(geometry, materialKrug);
    geometry.scale(0.3,0.3,0.3)
    meshKrug.rotation.x = -Math.PI / 2;
    meshKrug.position.x = 25;
    scene.add(meshKrug);
});


// *** задаю стол ***
const materialStol = new THREE.MeshPhysicalMaterial({
    color: 0xAf1100,
    metalness: 1,
    roughness: 1,
    opacity: 1,
    transparent: false,
    transmission: 0.99,
    clearcoat: 1.0,
    clearcoatRoughness: 0.25,
    emissive: 0xFF8C00,
})

let meshStol;
const loaderStol = new STLLoader();
loader.load('./models/stol.stl', function (geometry){
    geometry.scale(0.4,0.4,0.4)
    meshStol = new THREE.Mesh(geometry, materialStol);
    scene.add(meshStol);
    meshStol.rotation.x = -Math.PI / 2;
    meshStol.position.y = -1;
    meshStol.position.x = 25;
})



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
        y: event.offsetY - prevMousePos.y
    };

    if (mouseDown) {
        mesh.position.z += deltaMove.x * 0.06;
        mesh.position.x += (deltaMove.y * 0.08) *-1;
    }

    else if (mousewheel) {
        mesh.rotation.z -= (deltaMove.x * 0.07) * -1;
    }
    prevMousePos = { x: event.offsetX, y: event.offsetY };
});
 
//доп от настюхи хз надо/нет

document.addEventListener('DOMContentLoaded', function () {
    var selectElement = document.getElementById('pvrt');

    selectElement.addEventListener('change', function() {
        var selectedValue = this.value;
        console.log('Выбранный вариант: ', selectedValue);
    });
});

// Функция анимации
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
