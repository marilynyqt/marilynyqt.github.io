$(document) .ready function() {
    var altura = $('header-content').offset.top;
    $(window).on('scroll'),function(){
        if ($(window).scrollTop() > altura ){
            $('header-content').addClass('navbar-fixed-top');
        }else {
            $('header-content').removeClass('navbar-fixed-top')
        }
    }
}
