var Ivitka = 10; var Rvitka = 10

function save_IR() {
    var Ivitka = document.getElementById('I_vitk').value;
    var Rvitka = document.getElementById('R_vitk').value;
    var contentElement1 = document.getElementById('window1');
        contentElement1.textContent = 'f_k = '+ 1 + ' кГц, I_k = ' + Ivitka +' мА'
    var contentElement2 = document.getElementById('window2');
    contentElement2.textContent = 'E_з = '+ Rvitka + ' мВ, U_k = ' + 10 +' В'
}
window.global_I = Ivitka;
window.global_R = Rvitka;
function exit() {
    window.location.href = "main.html"; // Замените на URL вашей страницы
}
function redirectPrepod() {
    window.location.href = "index.html"; // Замените на URL вашей страницы
}
function redirectStudent() {
    window.location.href = "index.html"; // Замените на URL вашей страницы
}


