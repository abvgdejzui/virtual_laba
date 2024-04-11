import * as THREE from './build/three.module.js';
import { STLLoader } from './build/STLLoader.js';

const loader = new STLLoader();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(50, 14, 12);
camera.rotation.set(-0.6,0.8,0.5);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/////////////////////////////////////////////////////////////

// *** задаю кольцо ***
var materialKrug = new THREE.MeshPhysicalMaterial({
    color: 0xAf1100,
    metalness: 1,
    roughness: 1,
    opacity: 0.9,
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
    meshKrug.position.z = 0.75;
    meshKrug.renderOrder = 1;
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
loader.load('./models/stol.stl', function (geometry){
    geometry.scale(0.4,0.4,0.4)
    meshStol = new THREE.Mesh(geometry, materialStol);
    scene.add(meshStol);
    meshStol.rotation.x = -Math.PI / 2;
    meshStol.position.y = -1;
    meshStol.position.x = 0;
    meshStol.geometry.computeBoundingBox();

})

// *** задаю оси y ***
const materialOsiY = new THREE.MeshPhysicalMaterial({
    color: 0xFF0000,
    metalness: 1,
    roughness: 1,
    opacity: 1,
    transparent: false,
    transmission: 0.99,
    clearcoat: 1.0,
    clearcoatRoughness: 0.25,
    emissive: 0x0000CD,            //тут оси у красятся
})
let meshOsiY;
loader.load('./models/osi.stl', function (geometry){
    geometry.scale(0.3,0.3,0.3)
    meshOsiY = new THREE.Mesh(geometry, materialOsiY);
    scene.add(meshOsiY);
    meshOsiY.rotation.x = -Math.PI / 2;
    meshOsiY.position.y = 0.01;
})

// *** задаю ось х ***
const materialOsiX = new THREE.MeshPhysicalMaterial({
    color: 0xFF0000,
    metalness: 1,
    roughness: 1,
    opacity: 1,
    transparent: false,
    transmission: 0.99,
    clearcoat: 1.0,
    clearcoatRoughness: 0.25,
    emissive: 0xFF0000,              //тут ось х красятся
})
let meshOsiX;
loader.load('./models/osi_sr.stl', function (geometry){
    geometry.scale(0.3,0.3,0.3)
    meshOsiX = new THREE.Mesh(geometry, materialOsiX);
    scene.add(meshOsiX);
    meshOsiX.rotation.x = -Math.PI / 2;
    meshOsiX.position.y = 0.012;
})


// *** задаю датчик ***
const material = new THREE.MeshPhysicalMaterial({
    color: 0xAf1100,
    metalness: 1,
    roughness: 1,
    transparent: false,
    transmission: 0.99,
    clearcoat: 1.0,
    clearcoatRoughness: 0.25,
    emissive: 0x696969
})
let mesh;
loader.load('./models/model.stl', function (geometry){
    geometry.scale(0.1,0.1,0.1)
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = 35;
    mesh.position.z = -4;
    scene.add(mesh);
});

function createCubeAtPoint(point) {
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.copy(point);
    scene.add(cube);
}

///////////////////////////////////////////////////////////////////////

// Constants
const mu_priv = 1e-7; // Coefficient equal to mu0/4pi
const pi = Math.PI;
const NP = 360; // Number of points dividing the circle

const V1 = 400; // Number of turns in the big "coil"
const V2 = 1900; // Number of turns in the sensor coil
const S = 0.7 * 1e-4; // Area of the sensor coil section (0.7 cm^2 -> in m^2)
const f = 1000; // Frequency of the current in the big "coil"

// Vector structure
function Vector3(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

// Vector addition
function add(v, w) {
    return new Vector3(v.x + w.x, v.y + w.y, v.z + w.z);
}

// Vector subtraction
function subtract(v, w) {
    return new Vector3(v.x - w.x, v.y - w.y, v.z - w.z);
}

// Scalar multiplication
function multiply(v, a) {
    return new Vector3(v.x * a, v.y * a, v.z * a);
}

// Dot product
function dot(v, w) {
    return v.x * w.x + v.y * w.y + v.z * w.z;
}

// Cross product
function cross(v, w) {
    return new Vector3(v.y * w.z - v.z * w.y, -v.x * w.z + v.z * w.x, v.x * w.y - v.y * w.x);
}

// Vector length
function len(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}

// Function to calculate B in point D
// Ring in the x-y plane with radius R0 and current I
function getB(R0, I, D) {
    let res = new Vector3(0, 0, 0);
    let phi1 = 2 * pi / NP;

    for (let k = 0; k < NP; k++) {
        let phi = k * phi1;
        let P = new Vector3(R0 * Math.cos(phi), R0 * Math.sin(phi), 0);
        let dl = new Vector3(R0 * (Math.cos(phi + phi1) - Math.cos(phi)), R0 * (Math.sin(phi + phi1) - Math.sin(phi)), 0);
        let r = subtract(D, P);
        let vp = cross(dl, r);
        let t = len(r);
        res = add(res, multiply(vp, 1 / (t * t * t)));
    }

    res = multiply(res, mu_priv * I * V1);

    return res;
}

// Function to calculate U in the sensor
// With center D and probe D1
function getU(R0, I, D, D1) {
    let B = getB(R0, I, D);
    let n = subtract(D1, D);
    n = multiply(n, 1 / len(n));
    let Bpr = Math.abs(dot(B, n));
    return Math.sqrt(2) * pi * f * V2 * S * Bpr;
}

// // Main function
// function main() {
//     let R0 = 0.13;
//     let I = 0.05; // Total current through all turns
//     let Bzt = mu_priv * 2 * pi * I * V1 / R0;
//     let U, alpha;
//     let B = new Vector3(0, 0, 0);
//     let D = new Vector3(0, 0, 0);
//     let D1 = new Vector3(0, 0, 0);

//     B = getB(R0, I, D);
//     console.log("In the center of the ring:");
//     console.log("B_z (calc) = " + B.z);
//     console.log("B_z (theor) = " + Bzt);
//     console.log("Ratio: " + Bzt / B.z);

//     D = new Vector3(0, 0, 0);
//     D1 = new Vector3(0, 0, 0.01);
//     console.log("Along the diameter of the ring, DD1 directed along the z-axis:");
//     for (D.x = -R0 + 0.01; D.x < R0; D.x += 0.01) {
//         D1.x = D.x;
//         U = getU(R0, I, D, D1);
//         console.log("x = " + D.x + ", U (mV) = " + U * 1000);
//     }

//     D = new Vector3(0, 0, 0);
//     D1 = new Vector3(0, 0, 0);
//     console.log("In the center of the ring, in different directions of DD1:");
//     for (let k = 0; k < 12; k++) {
//         alpha = 2 * pi * k / 12;
//         D1.x = Math.cos(alpha);
//         D1.z = Math.sin(alpha);
//         U = getU(R0, I, D, D1);
//         console.log("alpha = " + alpha / pi + "*pi, U (mV) = " + U * 1000);
//     }
// }

// // Run the main function
// main();



function updatePointInFront(db) {
    db.ref('Ivitka').once('value').then(snapshot => {
        const Ivitka = snapshot.val();
        db.ref('Rvitka').once('value').then(snapshot => {
            const Rvitka = snapshot.val();
            const direction = new THREE.Vector3();
            mesh.getWorldDirection(direction.set());
            direction.multiplyScalar(1.5);
            const point = mesh.position.clone().add(direction);
            var res = getU(Rvitka, Ivitka / 1000, new Vector3(Rvitka * (mesh.position.x / 30), mesh.position.y, mesh.position.z), new Vector3(Rvitka * (point.x / 30), point.y, point.z)) * 1000 * 100;
            console.log("U:", res);
            
            // Отправляем сообщение в родительское окно
            window.parent.postMessage({
                type: 'updateCoordinates',
                res: res.toFixed(0),
                x: (Rvitka * (mesh.position.x / 30)).toFixed(3),
                z: (Rvitka * (mesh.position.z / 30)).toFixed(3)            
            }, '*');
                    });
                });
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Создаем сегменты
var geometrySetka = new THREE.BufferGeometry();
const points = [];

// Делим верхнюю и нижнюю сетки на 50 сегментов
const numSegments = 50;
const segmentLength = 50 / numSegments;
for (let i = 0; i <= numSegments; i++) {
    points.push(new THREE.Vector3(50 - (i * segmentLength), 0, -25));
    points.push(new THREE.Vector3(50 - (i * segmentLength), 0, 25));
    points.push(new THREE.Vector3(-50 + (i * segmentLength), 0, 25));
    points.push(new THREE.Vector3(-50 + (i * segmentLength), 0, -25));
    points.push(new THREE.Vector3(50 - (i * segmentLength), 0, -25));
}

// Создаем вертикальные сегменты
const numVertSegments = 50;
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

/////////////////////////////////////////////////////////////////////////////////////////////////

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

// Инициализация переменной cameraMode
let cameraMode = 0;

document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft'){ 
        cameraMode = (event.key === 'ArrowRight') ? (cameraMode + 1) : (cameraMode - 1);
        cameraMode = (cameraMode + 3) % 3; // 3 - количество режимов

        // Устанавливаем параметры камеры в зависимости от текущего режима
        switch (cameraMode) {
            case 0:
                camera.position.set(50, 14, 12);
                camera.rotation.set(-0.6,0.8,0.5);
                materialKrug.opacity = 0.9;
                break;
            case 1:
                camera.position.set(0, 25, 0);
                camera.rotation.set(-Math.PI / 2, 0, 0);
                materialKrug.opacity = 0.5;
                break;
            case 2:
                camera.position.set(30, 25, 0);
                camera.rotation.set(-Math.PI / 2, 0, 0);
                materialKrug.opacity = 0.5;
                break;
        }

        materialKrug.needsUpdate = true; // Обновляем материал
    }
    
    else if (event.key === 'Enter') {
        const direction = new THREE.Vector3();
        mesh.getWorldDirection(direction.set());
        direction.multiplyScalar(1.5);
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
    document.body.style.userSelect = 'none';
    const deltaMove = {
        x: event.offsetX - prevMousePos.x,
        y: event.offsetY - prevMousePos.y
    };

    if (mouseDown) {
        switch (cameraMode) {
            case 0:
                mesh.position.z += (deltaMove.x * 0.03) * -1;
                mesh.position.x += (deltaMove.y * 0.03) * 1;
                break;
            case 1:
                mesh.position.x += deltaMove.x * 0.03;
                mesh.position.z += (deltaMove.y * 0.03);
                break;
            case 2:
                 mesh.position.x += deltaMove.x * 0.03;
                 mesh.position.z += (deltaMove.y * 0.03);
                 break;
        }
    }

    if (mousewheel) {
        mesh.rotation.y -= (deltaMove.x * 0.01) * -1;
    }

    updatePointInFront(db);
    prevMousePos = { x: event.offsetX, y: event.offsetY };
});

// Функция анимации
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
