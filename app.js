// Инициализация аутентификации и базы данных Firebase
var auth = firebase.auth();
var db = firebase.database();

// Функция входа в систему
function signIn() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            var user = userCredential.user;
            console.log("Signed in as:", user.email);
            window.location.href = 'frontir.html';
        })
        .catch((error) => {
            alert('Неверный пароль. Попробуйте еще раз.');
        });
}

// Получение данных о витке из базы данных и их отображение
db.ref('Ivitka').once('value').then(snapshot => {
    const Ivitka = snapshot.val();
    db.ref('Rvitka').once('value').then(snapshot => {
        const Rvitka = snapshot.val();
        document.getElementById('I_vitk').value = Ivitka; 
        document.getElementById('R_vitk').value = Rvitka;
        console.log(document.getElementById('I_vitk').value);
    });
});

// Функция сохранения данных о витке в базу данных
function save_IR() {
    var Ivitka = document.getElementById('I_vitk').value; 
    var Rvitka = document.getElementById('R_vitk').value;
    db.ref('Ivitka').set(parseInt(Ivitka));
    db.ref('Rvitka').set(parseInt(Rvitka));

    // Вычисление значений Ezonda и их отображение
    res1 = (41783 * Ivitka / 1000) / (Math.sqrt(2) * Math.pow(10, 8));
    Ezonda = res1*10000;

    var Rv = document.getElementById('Rv');
    Rv.textContent = Rvitka;
}

// Функция загрузки файла с данными
function downloadFile() {
    // Формирование текстовых данных для загрузки
    var pokazanieBlock = document.getElementById('pokazanieBlock');
    var FkElement = pokazanieBlock.querySelector('#Fk');
    var IkElement = pokazanieBlock.querySelector('#Ik');
    var RvElement = pokazanieBlock.querySelector('#Rv');
    var UkElement = pokazanieBlock.querySelector('#Uk');
    var liElements = pokazanieBlock.querySelectorAll('ol#pokazanieText li');
    var data = '';      
    data += 'fk = ' + FkElement.innerText + ' кГц;\n';
    data += 'Ik = ' + IkElement.innerText + ' мА;\n';
    data += 'Uk = ' + UkElement.innerText + ' В;\n';
    data += 'R витка = ' + RvElement.innerText + ' см;\n';

    for (var i = 0; i < liElements.length; i++) {
        data += (i + 1) + '. ' + liElements[i].innerText + "\n";
    }

    // Создание и загрузка файла
    var blob = new Blob([data], {type: 'text/plain'});
    var url = window.URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = 'Показания.txt';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Функция выхода из системы
function exit() {
    window.location.href = "index.html"; 
}

// Функции для отображения информационного модального окна
function getInfo() {
    document.getElementById('info-modal').style.display = 'block';
    document.getElementById('info-back').style.display = 'block';
}

function closeInfo(){
    document.getElementById('info-modal').style.display = 'none';  
    document.getElementById('info-back').style.display = 'none';
}   

// Обработка события клика вне модального окна
document.addEventListener('DOMContentLoaded', function() {
    var infoBack = document.getElementById("info-back");
    console.log(infoBack);
    var infoModal = document.getElementById("info-modal");

    infoBack.onclick = function(event) {
        if (event.target === infoModal) {
            return;
        }
        document.getElementById('info-back').style.display = 'none';  
        document.getElementById('info-modal').style.display = 'none';
    }
}, false);

// Обработка события клика по переключателю
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('switch').addEventListener('click', function() {
        var switchImage = document.getElementById('switch');
        if (switchImage.src.endsWith('css/pics/off.jpg')) {
            switchImage.src = 'css/pics/on.jpg';
            document.getElementById('window').style.color = 'lawngreen';          
        } else {
            switchImage.src = 'css/pics/off.jpg';
            document.getElementById('window').style.color = 'black'; 
        }
    });
}, false);

// Функции для отображения различных информационных блоков
function infoInstruction(){
    document.getElementById('info-instruction').style.display = 'block';  
    document.getElementById('info-laba').style.display = 'none';
    document.getElementById('info-contact').style.display = 'none';  
}  

function infoLaba(){
    document.getElementById('info-instruction').style.display = 'none';  
    document.getElementById('info-laba').style.display = 'block';
    document.getElementById('info-contact').style.display = 'none';  
}  

function infoContact(){
    document.getElementById('info-instruction').style.display = 'none';  
    document.getElementById('info-laba').style.display = 'none';
    document.getElementById('info-contact').style.display = 'block';  
}  

// Функция записи данных о положении
function record() {
    if (document.getElementById('window').style.color == 'lawngreen') {
        var C = document.getElementById('Ez').textContent;
        var x = document.getElementById('X-coord').textContent;
        var y = document.getElementById('Y-coord').textContent;
        var fixedValues = document.getElementById('pokazanieText');
        var newRecord = document.createElement('li');
        newRecord.textContent = `Ez=${C}; \nx:${x},  y:${y}`;
        fixedValues.appendChild(newRecord);
    }
    else {
        alert ('Включите экран с показаниями! Откуда мне записывать?')
    }
}

// Обработка события получения сообщения
window.addEventListener('message', function(event) {
    if (event.data.type === 'updateCoordinates') {
        document.getElementById('Ez').textContent = event.data.res;
        document.getElementById('X-coord').textContent = event.data.x;
        document.getElementById('Y-coord').textContent = event.data.z;
        document.getElementById('delenie').textContent = event.data.delenie;
        document.getElementById('Ik2').textContent = event.data.Iv;
        document.getElementById('Ik').textContent = event.data.Iv;
        document.getElementById('I_vitk').textContent = event.data.Iv;
        document.getElementById('R_vitk').textContent = event.data.Rv;
        document.getElementById('Rv').textContent = event.data.Rv;
    }
});

