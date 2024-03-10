import * as THREE from './build/three.module.js';
import { STLLoader } from './build/STLLoader.js';

const loader = new STLLoader();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(71, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(46, 17, 15);
camera.rotation.set(-0.6,0.8,0.5);

function cross(a, b) {
    const ax = a[0],
      ay = a[1],
      az = a[2],
      bx = b[0],
      by = b[1],
      bz = b[2];
  
    const rx = ay * bz - az * by;
    const ry = az * bx - ax * bz;
    const rz = ax * by - ay * bx;
    return [rx, ry, rz];
} 

function minus(a, b) {
    const ax = a[0],
      ay = a[1],
      az = a[2],
      bx = b[0],
      by = b[1],
      bz = b[2];
  
    const rx = ax - bx;
    const ry = ay - by;
    const rz = az - bz;
    return [rx, ry, rz];
} 

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const axesHelper = new THREE.AxesHelper(40);
scene.add(axesHelper);

// *** задаю кольцо ***
const materialKrug = new THREE.MeshPhysicalMaterial({
    color: 0xAf1100,
    metalness: 1,
    roughness: 1,
    opacity: 0.6,
    transparent: true,
    transmission: 0.99,
    clearcoat: 0.5,
    clearcoatRoughness: 0.25,
    emissive: 0xAf1100
})
let meshKrug;
loader.load('./models/krug.stl', function (geometry){
    meshKrug = new THREE.Mesh(geometry, materialKrug);
    geometry.scale(0.3,0.3,0.3)
    meshKrug.rotation.x = -Math.PI / 2;
    meshKrug.position.x = 0;
    meshKrug.position.z = 0.75;
    scene.add(meshKrug);
});


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
    var res2 = (cross([30, 0, 0], minus([point.x, point.y, point.z], minus([point.x, point.y, point.z], [30, 0, 0])))) 
    console.log("Обновленные координаты точки впереди mesh:", point, direction, mesh.position, res1, res2);
}

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
loader.load('./models/stol.stl', function (geometry){
    geometry.scale(0.4,0.4,0.4)
    meshStol = new THREE.Mesh(geometry, materialStol);
    scene.add(meshStol);
    meshStol.rotation.x = -Math.PI / 2;
    meshStol.position.y = -1;
    meshStol.position.x = 0;
    meshStol.geometry.computeBoundingBox();

})

// *** задаю оси ***
const materialOsi = new THREE.MeshPhysicalMaterial({
    color: 0xFFFFFF,
    metalness: 1,
    roughness: 1,
    opacity: 1,
    transparent: false,
    transmission: 0.99,
    clearcoat: 1.0,
    clearcoatRoughness: 0.25,
    emissive: 0xFFFFFF,
})
let meshOsi;
loader.load('./models/osi.stl', function (geometry){
    geometry.scale(0.3,0.3,0.3)
    meshOsi = new THREE.Mesh(geometry, materialOsi);
    scene.add(meshOsi);
    meshOsi.rotation.x = -Math.PI / 2;
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



// Создаем верхние вершины
var topVertices = [    new THREE.Vector3(50, 0, -25),    new THREE.Vector3(50, 0, 25)];

// Создаем нижние вершины
var bottomVertices = [    new THREE.Vector3(-50, 0, 25),    new THREE.Vector3(-50, 0, -25)];

// Создаем сегменты
var geometrySetka = new THREE.BufferGeometry();
const points = [];

// Делим верхнюю и нижнюю сетки на 50 сегментов
const numSegments = 25;
const segmentLength = 50 / numSegments;
for (let i = 0; i <= numSegments; i++) {
    points.push(new THREE.Vector3(50 - (i * segmentLength), 0, -25));
    points.push(new THREE.Vector3(50 - (i * segmentLength), 0, 25));
    points.push(new THREE.Vector3(-50 + (i * segmentLength), 0, 25));
    points.push(new THREE.Vector3(-50 + (i * segmentLength), 0, -25));
    points.push(new THREE.Vector3(50 - (i * segmentLength), 0, -25));
}

// Создаем вертикальные сегменты
const numVertSegments = 30;
const vertSegmentLength = 50 / numVertSegments;
for (let i = 0; i < numVertSegments; i++) {
    points.push(new THREE.Vector3(50, 0, 25 - (i * vertSegmentLength)));
    points.push(new THREE.Vector3(-50, 0, 25 - (i * vertSegmentLength)));
    points.push(new THREE.Vector3(50, 0, 25 - (i * vertSegmentLength)));
}

geometrySetka.setFromPoints(points);

var materialSetka = new THREE.LineBasicMaterial({ color: 0x8B4513 });
var line = new THREE.Line(geometrySetka, materialSetka);
scene.add(line);



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
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft'){ 
        if (isCameraTransformed) {
            camera.position.set(46, 17, 15);
            camera.rotation.set(-0.6,0.8,0.5);
        } else {
            camera.position.set(30, 20, 0);
            camera.rotation.set(-Math.PI / 2, 0, 0);
        }
        isCameraTransformed = !isCameraTransformed;
    }
    
    else if (event.key === 'Enter') {
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
