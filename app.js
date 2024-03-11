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

var infoBack = document.getElementById("info-back");
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