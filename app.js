window.Ivitka = 10; 
window.Rvitka = 10;
window.res1 = (41783 * Ivitka / 1000) / (Math.sqrt(2) * Math.pow(10, 8));

function save_IR() {
    var Ivitka = document.getElementById('I_vitk').value; //получаем из формы
    var Rvitka = document.getElementById('R_vitk').value;

    res1 = (41783 * Ivitka / 1000) / (Math.sqrt(2) * Math.pow(10, 8));
    Ezonda = res1*10000 //домножила

    var Ik = document.getElementById('Ik');
    Ik.textContent = Ivitka

    var Uk = document.getElementById('Uk');
    Uk.textContent = Rvitka

    var Ez = document.getElementById('Ez');
    Ez.textContent = Ezonda.toFixed(2) //округл до двух симв
   
}

/*function find_Ez() {
    var Ivitka = document.getElementById('I_vitk').value; //получаем из формы
    var Rvitka = document.getElementById('R_vitk').value;

    res1 = (41783 * Ivitka / 1000) / (Math.sqrt(2) * Math.pow(10, 8));
    Ezonda = res1*10000 //домножила

    ///////ВЫВОД//////
    //var Ik = document.getElementById('Ik');
    document.getElementById('Ik').textContent = Ivitka

    //var Uk = document.getElementById('Uk');
    document.getElementById('Uk').textContent = Rvitka

    //var Ez = document.getElementById('Ez');
    document.getElementById('Ez').textContent = Ezonda.toFixed(2)
}

document.getElementById('I_vitk').addEventListener('input', find_Ez);
document.getElementById('R_vitk').addEventListener('input', find_Ez);
*/


// качалка показаний
function downloadFile() {
    var data = document.querySelector('ol').innerText;
    var blob = new Blob([data], {type: 'text/plain'});
    var url = window.URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = 'Показания.txt'; // Имя файла

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/*exit
function gotovoExit() {
    window.location.href = "exit.html"; //переход
}
var btn = document.getElementById("gotovo");
var span = document.getElementsByClassName("close")[0];

span.onclick = function() {
 window.location.href = "index.html"; //переход
} */

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
           switchImage.src = 'css/pics/on.jpg'; // Переключаем на изображение включенного состояния
           document.getElementById('window').style.color = 'lawngreen'; // Исправлено на 'color'
          
        } else {
           switchImage.src = 'css/pics/off.jpg'; // Переключаем на изображение выключенного состояния
           document.getElementById('window').style.color = 'black'; // Исправлено на 'color'
           

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
    var fixedValues = document.getElementById('pokazanieText');
    var newRecord = document.createElement('p');
    newRecord.textContent = `Ik=${A} Uk=${B} Ez=${C}`;
    fixedValues.appendChild(newRecord);
    }
    else {
        alert ('Включите экран с показаниями! Откуда мне записывать?')
    }
}
