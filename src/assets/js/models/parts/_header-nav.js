/**
 * ----------------------------------------------------------------------------------------
 * @module ヘッダーメニューの開閉
 * ----------------------------------------------------------------------------------------
 */
(function ($) {
    'use strict';

    //TODO: リンクをクリックした際にもクラスが外れるようにする
    var $nav_ul = $('.header-component > .contents >.nav-open');
    var $nav_body = $('.nav-component > ul');
    var scrollPosition;
    var navStatus = false;
    $nav_ul.on('touchstart mousedown', function () {
        event.preventDefault(); // ページの動きや反応を停止
        if ($nav_body.hasClass('opened')) {
            $nav_body.removeClass('opened');
            console.log('タッチ');
        } else {
            $nav_body.addClass('opened');
        }

        // TODO: ナビゲーションスクロール時に、bodyがスクロールされないようにする
        if(navStatus === false) {
            scrollPosition = $(window).scrollTop();
            $('body').addClass('fixed').css({top: -scrollPosition});
            navStatus = true;
        } else {
            $('body').removeClass('fixed').css({top: 0});
            window.scrollTo(0, scrollPosition);
            navStatus = false;
        }
    });

})(jQuery);