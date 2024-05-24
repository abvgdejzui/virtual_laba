// Функция для перенаправления преподавателя на форму входа
function redirectPrepod() { 
    document.getElementById('login').style.display = 'block';
    document.getElementById('modalBackground').style.display = 'block';
}

// Функция для закрытия окна входа
function closeLogin(){
    document.getElementById('login').style.display = 'none';  
    document.getElementById('modalBackground').style.display = 'none';
}   

// Обработчик клика на задний фон модального окна
var modalBackground = document.getElementById("modalBackground");
var modal = document.getElementById("login");

modalBackground.onclick = function()  {
    document.getElementById('login').style.display = 'none';  
    document.getElementById('modalBackground').style.display = 'none';
}

// Предотвращение закрытия окна входа при клике внутри него
document.getElementById('login').addEventListener('click', function(event) {
    event.stopPropagation(); 
});

// Функция для перенаправления студента на главную страницу
function redirectStudent() {
    window.location.href = "main-stud.html"; 
}