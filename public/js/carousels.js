$(document).ready(function(){
    $('.home-carousel').slick({
        arrows: false,
        // autoplay: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1
    });

    $('#destinies-carousel').slick({
        arrows: false,
        dots: true,
        autoplay: true,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 4
    });

    $('#services-you-like-carousel').slick({
        arrows: false,
        dots: true,
        autoplay: true,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 4
    });

    $('#other-services-carousel').slick({
        arrows: false,
        dots: true,
        autoplay: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 3
    });
})