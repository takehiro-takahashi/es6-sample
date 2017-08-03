(function ($) {
    'use strict';

    // headerの高さ
    var headerHeight = $('.header-component').outerHeight(); //ヘッダの高さ
    console.log(headerHeight);


    // $(document).on('click', 'a[href^="#"]', function () {
    //     console.log('hello');
    //     var href= $(this).attr("href");
    //     var target = $(href == "#" || href == "" ? 'html' : href);
    //     var position = target.offset().top-headerHeight; //ヘッダの高さ分位置をずらす
    //     $("html, body").animate({scrollTop:position}, 550, "swing");
    //     return false;
    // });

    // $(function () {
    //     var headerHeight = 68; //ヘッダの高さ
    //     $('a[href^="#"]').click(function(){
    //         var href= $(this).attr("href");
    //         var target = $(href == "#" || href == "" ? 'html' : href);
    //         var position = target.offset().top-headerHeight; //ヘッダの高さ分位置をずらす
    //         $("html, body").animate({scrollTop:position}, 550, "swing");
    //         return false;
    //     });
    // });
})(jQuery);