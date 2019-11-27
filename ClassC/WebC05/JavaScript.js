$(document).ready(function () {
    $('menu div img').mouseover(function () {
        var bind = $(this).data('bind');
        $(this).attr('src', bind);
    }).mouseout(function () {
        var show = $(this).data('show');
        $(this).attr('src', show);
    });
});