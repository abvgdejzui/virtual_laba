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
    // Создаем геометрию куба
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    // Создаем материал для куба
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // Создаем сам куб
    const cube = new THREE.Mesh(geometry, material);
    // Устанавливаем позицию куба на координатах точки
    cube.position.copy(point);
    // Добавляем куб на сцену
    scene.add(cube);
}

///////////////////////////////////////////////////////////////////////

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
function length(x, y, z) {
    return Math.sqrt(x * x + y * y + z * z);
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

function updatePointInFront(db) {
    db.ref('Ivitka').once('value').then(snapshot => {
        const Ivitka = snapshot.val();
        db.ref('Rvitka').once('value').then(snapshot => {
            const Rvitka = snapshot.val();
            const direction = new THREE.Vector3();
            mesh.getWorldDirection(direction.set());
            direction.multiplyScalar(2);
            var res1 = (Math.PI * 133 * Ivitka * 1000) / (Math.sqrt(2) * Math.pow(10, 8));
            const n = 1000;
            var s = [0, 0, 0];
            const point = mesh.position.clone().add(direction).multiplyScalar(Rvitka / 30);
            for (let i = 0; i < 2 * n; i++){
                const alpha = Math.PI * i / n;
                const alpha_next = Math.PI * (i + 1) / n;
                const m_x = Rvitka * Math.cos(alpha);
                const m_y = Rvitka * Math.sin(alpha);
                const m_z = 0;
                const m_next_x = Rvitka * Math.cos(alpha_next);
                const m_next_y = Rvitka * Math.sin(alpha_next);
                const m_next_z = 0;
                const dl = minus([m_next_x, m_next_y, m_next_z], [m_x, m_y, m_z]);
                const dr = minus([point.x, point.y, point.z], [m_x, m_y, m_z]);
                var prod = cross([dl[0], dl[1], dl[2]], [dr[0], dr[1], dr[2]]);
                prod[0] *= Math.pow(length(dr[0], dr[1], dr[2]), -3);
                prod[1] *= Math.pow(length(dr[0], dr[1], dr[2]), -3);
                prod[2] *= Math.pow(length(dr[0], dr[1], dr[2]), -3);
                s[0] += prod[0];
                s[1] += prod[1];  
                s[2] += prod[2];   
            }
            // var I = [s[0] * (1 / (2 * n)), s[1] * (1 / (2 * n)), s[2] * (1 / (2 * n))]
            var res2 = length(s[0], s[1], s[2]);
            console.log(res1 * res2 * 1000);
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
            camera.position.set(50, 14, 12);
            camera.rotation.set(-0.6,0.8,0.5);
            materialKrug.opacity = 0.9;
        } else {
            camera.position.set(30, 25, 0);
            camera.rotation.set(-Math.PI / 2, 0, 0);
            materialKrug.opacity = 0.5;
        }
        isCameraTransformed = !isCameraTransformed;
        materialKrug.needsUpdate = true; // Обновляем материал
    }
    
    else if (event.key === 'Enter') {
        const direction = new THREE.Vector3();
        const distance = 0.5;
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
    updatePointInFront(db);
    prevMousePos = { x: event.offsetX, y: event.offsetY };
});




const sphereElement = document.querySelector('.centered-script');

// Устанавливаем для элемента sphereElement стиль pointer-events: none;
sphereElement.style.pointerEvents = 'none';

// Добавляем прослушиватель событий mousemove к документу
document.addEventListener('mousemove', (event) => {
  // Проверяем, находится ли курсор мыши за пределами элемента sphereElement
  const rect = sphereElement.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
    // Отключаем выделение текста
    document.body.style.userSelect = 'none';

    // Отключаем взаимодействие со скриптом
    sphere.disableInteraction();

    // Устанавливаем курсор в значение по умолчанию
    document.body.style.cursor = 'default';
  } else {
    // Включаем выделение текста и взаимодействие со скриптом
    document.body.style.userSelect = 'auto';
    sphere.enableInteraction();

    // Устанавливаем курсор в значение по умолчанию
    document.body.style.cursor = 'auto';
  }
});

// Функция анимации
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
