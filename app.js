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
function exit() {
    window.location.href = "main.html"; // Замените на URL вашей страницы
}
function redirectPrepod() {
    window.location.href = "index.html"; // Замените на URL вашей страницы
}
function redirectStudent() {
    window.location.href = "index.html"; // Замените на URL вашей страницы
}


