"use strict";
$(document).ready(function() {

    $(document).on("click", '.js--triggerAnimation', function(e) {
        e.preventDefault();
        var anim = $('.js--animations').val();
        testAnim(anim);
    });

    $(document).on("change", '.js--animations', function() {
        var anim = $(this).val();
        testAnim(anim);
    });

    function testAnim(x) {
        $('#animationSandbox').removeClass().addClass(x + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $(this).removeClass();
        });
    };
});