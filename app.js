window.Ivitka = 10; 
window.Rvitka = 10;
window.res1 = (41783 * Ivitka / 1000) / (Math.sqrt(2) * Math.pow(10, 8));

function save_IR() {
    Ivitka = document.getElementById('I_vitk').value;
    res1 = (41783 * Ivitka / 1000) / (Math.sqrt(2) * Math.pow(10, 8));
    var Rvitka = document.getElementById('R_vitk').value;
    var contentElement1 = document.getElementById('window1');
        contentElement1.textContent = 'f_k = '+ 1 + ' кГц, I_k = ' + Ivitka +' мА'
    var contentElement2 = document.getElementById('window2');
    contentElement2.textContent = 'E_з = '+ Rvitka + ' мВ, U_k = ' + 10 +' В'
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

//exit
function gotovoExit() {
    window.location.href = "exit.html"; //переход
}
var btn = document.getElementById("gotovo");
var span = document.getElementsByClassName("close")[0];

span.onclick = function() {
 window.location.href = "main.html"; //переход
}

function exit() {
    window.location.href = "main.html"; // Замените на URL вашей страницы
}
function redirectPrepod() {
    var modal = document.getElementById('login');
    modal.style.display = 'block';
    modal.classList.remove('fadeOut');
    
    
}
function closeLogin(){
    document.getElementById('login').style.display = 'none';
}  

function redirectStudent() {
    window.location.href = "index.html"; // Замените на URL вашей страницы
}


