document.addEventListener('DOMContentLoaded', function () {
    var selectElement = document.getElementById('pvrt');

    selectElement.addEventListener('change', function() {
        var selectedValue = this.value;
        console.log('Выбранный вариант: ', selectedValue);
    });
});