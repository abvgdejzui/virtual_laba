import * as THREE from "https://esm.sh/three"; // подключение библиотеки

const scene = new THREE.Scene(); // создание сцены
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // создание камеры

camera.position.set(3, 3, 7); // позиция камеры
camera.rotation.set(-0.3,0.3,0); // угол наклона камеры

const renderer = new THREE.WebGLRenderer(); // создание "отрисовщика"
renderer.setSize(window.innerWidth, window.innerHeight); // размер отрисовщика
document.body.appendChild(renderer.domElement); // добавление "отрисовщика"

const axesHelper = new THREE.AxesHelper(20); // создание осей
scene.add(axesHelper); // добавление их на сцену

const geometry = new THREE.SphereGeometry(0.5, 32, 16); // создание шара
const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true }); // создание материала
const sphere = new THREE.Mesh(geometry, material); // присваивание материала шару
scene.add(sphere); // добавление шара на сцену

let mouseDown = false; // проверка на зажатие левой кнопки мыши
let mousewheel = false; // проверка на зажатие колёсика мыши
let prevMousePos = { x: 0, y: 0 }; // коорд. пред. позиции мыши

document.addEventListener('mousedown', event => {
    if (event.button === 0) { // если левая кнопка мыщи сейчас зажата
        mouseDown = true; // то проверка на зажатие левой кнопки мыши становится верна
    }
    else if (event.button === 1) { // если колёсико мыши сейчас зажато
        mousewheel = true; // то проверка на зажатие колёсика мыши становится верна
    }
});

document.addEventListener('mouseup', event => {
    if (event.button === 0) { // если левая кнопка мыщи сейчас НЕ зажата
        mouseDown = false; // то проверка на зажатие левой кнопки мыши становится НЕверна
    }
    else if (event.button === 1) { // если колёсико мыши сейчас НЕ зажато
        mousewheel = false; // то проверка на зажатие колёсика мыши становится НЕверна
    }
});

document.addEventListener('mousemove', event => {
    const deltaMove = { // координаты перемещения мыши
        x: event.offsetX - prevMousePos.x,
        y: event.offsetY - prevMousePos.y
    };

    if (mouseDown) { // если выполняется проверка на зажатие левой кнопки мыши
        sphere.position.x += deltaMove.x * 0.01; // то сфера двигается по оси X
        sphere.position.z += deltaMove.y * 0.01; // то сфера двигается по оси X
    }

    else if (mousewheel) { // если выполняется проверка на зажатие колёсика мыши
        sphere.rotation.x -= deltaMove.y * 0.01; // то сфера вращается по оси X
        sphere.rotation.y -= deltaMove.x * 0.01; // то сфера вращается по оси Z
    }
    prevMousePos = { x: event.offsetX, y: event.offsetY }; // координаты мыши после отпускания левой кнопки или колёсика мыши
});

function animate() { // ф-ция анимации всего того что выше
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
