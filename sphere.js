import * as THREE from './build/three.module.js';
import { STLLoader } from './build/STLLoader.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(71, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(44, 17, 15);
camera.rotation.set(-0.6,0.8,0.5);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const axesHelper = new THREE.AxesHelper(40);
scene.add(axesHelper);

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
    geometry.scale(0.13,0.13,0.13)
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = 36;
    mesh.position.z = 5;
    scene.add(mesh);
});

function updatePointInFront() {
    const direction = new THREE.Vector3();
    const distance = 0.5;
    mesh.getWorldDirection(direction.set());
    direction.multiplyScalar(2.5);
    const point = mesh.position.clone().add(direction);
    console.log("Обновленные координаты точки впереди mesh:", point, direction, mesh.position);
}


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
    meshKrug.position.x = 0;
    meshKrug.position.z = 0.5;
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
    meshStol.position.x = 0;
})

function createCubeAtPoint(point) {
    // Создаем геометрию куба
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    // Создаем материал для куба
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // Создаем сам куб
    const cube = new THREE.Mesh(geometry, material);
    // Устанавливаем позицию куба на координатах точки
    cube.position.copy(point);
    // Добавляем куб на сцену
    scene.add(cube);
}

let mouseDown = false;
let isCameraTransformed = false;
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

document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowRight') { 
        if (isCameraTransformed) {
            camera.position.set(44, 17, 15);
            camera.rotation.set(-0.6,0.8,0.5);
        } else {
            camera.position.set(30, 27, 0);
            camera.rotation.set(-Math.PI / 2, 0, 0);
        }
        isCameraTransformed = !isCameraTransformed;
    }
    else if (event.key === 'ArrowLeft') {
        const direction = new THREE.Vector3();
        const distance = 0.5;
        mesh.getWorldDirection(direction.set());
        direction.multiplyScalar(2.5);
        const point = mesh.position.clone().add(direction);

        // Создаем куб на координатах точки
        createCubeAtPoint(point);
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

    if (mouseDown && !isCameraTransformed) {
        mesh.position.z += (deltaMove.x * 0.06) * -1;
        mesh.position.x += (deltaMove.y * 0.08) * 1;
    }

    else if (mouseDown && isCameraTransformed){
        mesh.position.x += deltaMove.x * 0.06;
        mesh.position.z += (deltaMove.y * 0.08);
    }

    else if (mousewheel) {
        mesh.rotation.y -= (deltaMove.x * 0.07) * -1;
    }
    updatePointInFront();
    prevMousePos = { x: event.offsetX, y: event.offsetY };
});

// Функция анимации
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
