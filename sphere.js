// Импорт библиотек Three.js и STLLoader
import * as THREE from './build/three.module.js';
import { STLLoader } from './build/STLLoader.js';

// Создание загрузчика STL-файлов, сцены, камеры и рендера
const loader = new STLLoader();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(50, 14, 12); // Установка позиции камеры
camera.rotation.set(-0.6, 0.8, 0.5); // Установка вращения камеры

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight); // Установка размера рендера
document.body.appendChild(renderer.domElement); // Добавление канваса рендера в документ

// Создание материала для модели "Krug"
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
loader.load('./models/krug.stl', function (geometry) {
    meshKrug = new THREE.Mesh(geometry, materialKrug);
    geometry.scale(0.3, 0.3, 0.3); // Масштабирование геометрии
    meshKrug.rotation.x = -Math.PI / 2; // Вращение модели
    meshKrug.position.z = 0.75; // Установка позиции модели
    meshKrug.renderOrder = 1; // Установка порядка рендера
    scene.add(meshKrug); // Добавление модели в сцену
});

// Создание материала для модели "Stol"
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
loader.load('./models/stol.stl', function (geometry) {
    geometry.scale(0.4, 0.4, 0.4); // Масштабирование геометрии
    meshStol = new THREE.Mesh(geometry, materialStol);
    scene.add(meshStol); // Добавление модели в сцену
    meshStol.rotation.x = -Math.PI / 2; // Вращение модели
    meshStol.position.y = -1; // Установка позиции модели
    meshStol.position.x = 0; // Установка позиции модели
    meshStol.geometry.computeBoundingBox(); // Вычисление ограничивающего блока
})

// Создание материала для оси Y
const materialOsiY = new THREE.MeshPhysicalMaterial({
    color: 0xFF0000,
    metalness: 1,
    roughness: 1,
    opacity: 1,
    transparent: false,
    transmission: 0.99,
    clearcoat: 1.0,
    clearcoatRoughness: 0.25,
    emissive: 0x0000CD,
})

let meshOsiY;
loader.load('./models/osi.stl', function (geometry) {
    geometry.scale(0.3, 0.3, 0.3); // Масштабирование геометрии
    meshOsiY = new THREE.Mesh(geometry, materialOsiY);
    scene.add(meshOsiY); // Добавление модели в сцену
    meshOsiY.rotation.x = -Math.PI / 2; // Вращение модели
    meshOsiY.position.y = 0.01; // Установка позиции модели
})

// Создание материала для оси X
const materialOsiX = new THREE.MeshPhysicalMaterial({
    color: 0xFF0000,
    metalness: 1,
    roughness: 1,
    opacity: 1,
    transparent: false,
    transmission: 0.99,
    clearcoat: 1.0,
    clearcoatRoughness: 0.25,
    emissive: 0xFF0000,
})

let meshOsiX;
loader.load('./models/osi_sr.stl', function (geometry) {
    geometry.scale(0.3, 0.3, 0.3); // Масштабирование геометрии
    meshOsiX = new THREE.Mesh(geometry, materialOsiX);
    scene.add(meshOsiX); // Добавление модели в сцену
    meshOsiX.rotation.x = -Math.PI / 2; // Вращение модели
    meshOsiX.position.y = 0.012; // Установка позиции модели
})

// Создание материала для основной модели
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
loader.load('./models/model.stl', function (geometry) {
    geometry.scale(0.1, 0.1, 0.1); // Масштабирование геометрии
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = 35; // Установка позиции модели
    mesh.position.z = -4; // Установка позиции модели
    scene.add(mesh); // Добавление модели в сцену
});

// Константы и функции для вычислений индукции магнитного поля и напряжения
const mu_priv = 1e-7;
const pi = Math.PI;
const NP = 360;
const V1 = 400;
const V2 = 1900;
const S = 0.7 * 1e-4;
const f = 1000;

function Vector3(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

function add(v, w) {
    return new Vector3(v.x + w.x, v.y + w.y, v.z + w.z);
}

function subtract(v, w) {
    return new Vector3(v.x - w.x, v.y - w.y, v.z - w.z);
}

function multiply(v, a) {
    return new Vector3(v.x * a, v.y * a, v.z * a);
}

function dot(v, w) {
    return v.x * w.x + v.y * w.y + v.z * w.z;
}

function cross(v, w) {
    return new Vector3(v.y * w.z - v.z * w.y, -v.x * w.z + v.z * w.x, v.x * w.y - v.y * w.x);
}

function len(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}

// Функция для вычисления индукции магнитного поля
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

// Функция для вычисления напряжения
function getU(R0, I, D, D1) {
    let B = getB(R0, I, D);
    let n = subtract(D1, D);
    n = multiply(n, 1 / len(n));
    let Bpr = Math.abs(dot(B, n));
    return Math.sqrt(2) * pi * f * V2 * S * Bpr;
}

// Функция обновления точки перед моделью
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

            window.parent.postMessage({
                type: 'updateCoordinates',
                res: res.toFixed(0),
                x: (Rvitka * (mesh.position.x / 30)).toFixed(3),
                z: (mesh.position.z).toFixed(3),
                delenie: (Rvitka / 30).toFixed(3),
                Iv: Ivitka,
                Rv: Rvitka
            }, '*');
        });
    });
}

// Создание сетки для сцены
var geometrySetka = new THREE.BufferGeometry();
const points = [];

const numSegments = 50;
const segmentLength = 50 / numSegments;
for (let i = 0; i <= numSegments; i++) {
    points.push(new THREE.Vector3(50 - (i * segmentLength), 0, -25));
    points.push(new THREE.Vector3(50 - (i * segmentLength), 0, 25));
    points.push(new THREE.Vector3(-50 + (i * segmentLength), 0, 25));
    points.push(new THREE.Vector3(-50 + (i * segmentLength), 0, -25));
    points.push(new THREE.Vector3(50 - (i * segmentLength), 0, -25));
}

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

// Обработка событий мыши и клавиатуры для управления камерой и объектами
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

let cameraMode = 0;

document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        cameraMode = (event.key === 'ArrowRight') ? (cameraMode + 1) : (cameraMode - 1);
        cameraMode = (cameraMode + 3) % 3;

        switch (cameraMode) {
            case 0:
                camera.position.set(50, 14, 12);
                camera.rotation.set(-0.6, 0.8, 0.5);
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

        materialKrug.needsUpdate = true;
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

// Функция анимации для обновления сцены
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate(); // Запуск анимации