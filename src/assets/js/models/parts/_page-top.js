(function ($) {
    'use strict';

    $('.page-top__button').on('touchstart mousedown', function () {

        // topまでのスピード
        var speed = 1000;

        // top座標の位置
        var position = 0;
        $('html, body').animate({scrollTop: position}, speed, 'swing');
    })
})(jQuery);