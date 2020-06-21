$(document).ready(function () {
    let socket = io();
    let paramOne = $.deparam(window.location.pathname);

    let newParam = paramOne.split('.');

    swap(newParam, 0, 1);
    let param2 = newParam[0] + '.' + newParam[1];

    function swap(input, value_1, value_2) {
        let temp = input[value_1];
        input[value_1] = input[value_2];
        input[value_2] = temp;
    }
})