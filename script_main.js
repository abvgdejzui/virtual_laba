function redirectPrepod() { //виджет по кнопке
    document.getElementById('login').style.display = 'block';
    document.getElementById('modalBackground').style.display = 'block';
}
function closeLogin(){
    document.getElementById('login').style.display = 'none';  
    document.getElementById('modalBackground').style.display = 'none';
}   

var modalBackground = document.getElementById("modalBackground");
var modal = document.getElementById("login");

modalBackground.onclick = function()  {
    document.getElementById('login').style.display = 'none';  
    document.getElementById('modalBackground').style.display = 'none';
}

document.getElementById('login').addEventListener('click', function(event) {
    event.stopPropagation(); // Предотвращает всплытие события
});


function redirectStudent() {
    window.location.href = "main.html"; // Замените на URL вашей страницы
}