var auth = firebase.auth();
var db = firebase.database();
function signIn() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            var user = userCredential.user;
            console.log("Signed in as:", user.email);
            window.location.href = 'main.html';
        })
        .catch((error) => {
            alert('Неверный пароль. Попробуйте еще раз.');
        });
}

function save_IR() {
    var Ivitka = document.getElementById('I_vitk').value; //получаем из формы
    var Rvitka = document.getElementById('R_vitk').value;
    db.ref('Ivitka').set(parseInt(Ivitka));
    db.ref('Rvitka').set(parseInt(Rvitka));

    res1 = (41783 * Ivitka / 1000) / (Math.sqrt(2) * Math.pow(10, 8));
    Ezonda = res1*10000 //домножила

    var Ik = document.getElementById('Ik');
    Ik.textContent = Ivitka

    var Uk = document.getElementById('Uk');
    Uk.textContent = Rvitka

    //var Ez = document.getElementById('Ez');
    //Ez.textContent = Ezonda.toFixed(2) //округл до двух символов
   
}

// качалка показаний
function downloadFile() {
    // Получаем элемент с ID 'pokazanieText'
    var olElement = document.getElementById('pokazanieText');
    // Получаем все элементы <li> внутри <ol>
    var liElements = olElement.getElementsByTagName('li');
    var data = '';
    for (var i = 0; i < liElements.length; i++) {
        // Добавляем нумерацию к каждому элементу списка
        data += (i + 1) + '. ' + liElements[i].innerText + "\n";
    }

    var blob = new Blob([data], {type: 'text/plain'});
    var url = window.URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = 'Показания.txt'; // Имя файла

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


function exit() {
    window.location.href = "index.html"; 
}

function getInfo() {
    document.getElementById('info-modal').style.display = 'block';
    document.getElementById('info-back').style.display = 'block';
}
function closeInfo(){
    document.getElementById('info-modal').style.display = 'none';  
    document.getElementById('info-back').style.display = 'none';
}   

document.addEventListener('DOMContentLoaded', function() {
	var infoBack = document.getElementById("info-back");
	console.log(infoBack);
	var infoModal = document.getElementById("info-modal");

	infoBack.onclick = function(event) {
		// Проверяем, было ли событие инициировано внутри модального окна
		if (event.target === infoModal) {
			// Если событие было инициировано внутри модального окна, не делаем ничего
			return;
		}
		// Если событие было инициировано вне модального окна, закрываем модальное окно и фон
		document.getElementById('info-back').style.display = 'none';  
		document.getElementById('info-modal').style.display = 'none';
	}
}, false);

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

// Записать показания //
function record() {

    if (document.getElementById('window').style.color == 'lawngreen') {
        var A = document.getElementById('Ik').textContent;
    var B = document.getElementById('Uk').textContent;
    var C = document.getElementById('Ez').textContent;
    var x = document.getElementById('X-coord').textContent;
    var y = document.getElementById('Y-coord').textContent;
    var fixedValues = document.getElementById('pokazanieText');
    var newRecord = document.createElement('li');
    newRecord.textContent = `Ik=${A} Uk=${B} Ez=${C}; Координаты по x:${x}, по y:${y}`;
    fixedValues.appendChild(newRecord);
    }
    else {
        alert ('Включите экран с показаниями! Откуда мне записывать?')
    }
}


window.addEventListener('message', function(event) {
    if (event.data.type === 'updateCoordinates') {
        // Обновляем элементы DOM
        document.getElementById('Ez').textContent = event.data.res;
        document.getElementById('X-coord').textContent = event.data.x;
        document.getElementById('Y-coord').textContent = event.data.z;
    }
});

