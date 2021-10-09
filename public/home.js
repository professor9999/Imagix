$(document).ready(function() {

    var images = Array("https://images.unsplash.com/photo-1516283182395-4b90237bff2e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2072&q=80",
        "https://images2.alphacoders.com/915/thumb-1920-915220.jpg",
        "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1171&q=80",
        "https://images4.alphacoders.com/797/thumb-1920-797952.jpg");
    var currimg = 0;

    $("body").css("background-image", "url(https://images.unsplash.com/photo-1516283182395-4b90237bff2e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2072&q=80)");

    function loadimg() {
        $('body').animate({ opacity: 1 }, 1000, function() {

            //finished animating, minifade out and fade new back in           
            $('body').fadeOut(1000, function() {

                currimg++;

                if (currimg > images.length - 1) {

                    currimg = 0;

                }

                var newimage = images[currimg];

                //swap out bg src                
                $('body').css("background-image", "url(" + newimage + ")");

                //animate fully back in
                $('body').fadeIn(1000, function() {

                    //set timer for next
                    setTimeout(loadimg, 1000);

                });

            });

        });

    }
    setTimeout(loadimg, 1000);

});

setTimeout(function() {
    $('.alert').fadeOut('fast');
}, 1000);