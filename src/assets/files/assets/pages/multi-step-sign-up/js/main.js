//jQuery time
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches
var sig_step = false;
var validate_18 = false;



var countdownTimer;
var segundos_c = 60;
var seconds = segundos_c; //número de segundos a contar
function secondPassed() {

    var minutes = Math.trunc(seconds / 60); //calcula el número de minutos
    var remainingSeconds = seconds % 60; //calcula los segundos restantes
    //si los segundos usan sólo un dígito, añadimos un cero a la izq
    if (remainingSeconds < 10) {
        remainingSeconds = "0" + remainingSeconds;
    }
    document.getElementById('countdown').innerHTML = minutes + ":" + remainingSeconds;
    if (seconds == 0) {
        clearInterval(countdownTimer);
        $("#NextOne").show();
        $("#text_bloqueo").hide();
        $("#NextOne").prop('disabled', false);
        seconds = segundos_c;
    } else {
        seconds--;
    }
}


$(".next").on('click', function() {
    if (animating) return false;
    animating = true;

    current_fs = $(this).parent();
    next_fs = $(this).parent().next();

    //activate next step on progressbar using the index of next_fs
    $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

    //show the next fieldset
    next_fs.show();
    //hide the current fieldset with style
    current_fs.animate({ opacity: 0 }, {
        step: function(now, mx) {
            //as the opacity of current_fs reduces to 0 - stored in "now"
            //1. scale current_fs down to 80%
            scale = 1 - (1 - now) * 0.2;
            //2. bring next_fs from the right(50%)
            left = (now * 50) + "%";
            //3. increase opacity of next_fs to 1 as it moves in
            opacity = 1 - now;
            current_fs.css({
                'transform': 'scale(' + scale + ')',
                'position': 'absolute'
            });
            next_fs.css({ 'left': left, 'opacity': opacity });
        },
        duration: 800,
        complete: function() {
            current_fs.hide();
            animating = false;
        },
        //this comes from the custom easing plugin
        easing: 'easeInOutBack'
    });
});

$(".previous").on('click', function() {
    if (animating) return false;
    animating = true;

    current_fs = $(this).parent();
    previous_fs = $(this).parent().prev();

    //de-activate current step on progressbar
    $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

    //show the previous fieldset
    previous_fs.show();
    //hide the current fieldset with style
    current_fs.animate({ opacity: 0 }, {
        step: function(now, mx) {
            //as the opacity of current_fs reduces to 0 - stored in "now"
            //1. scale previous_fs from 80% to 100%
            scale = 0.8 + (1 - now) * 0.2;
            //2. take current_fs to the right(50%) - from 0%
            left = ((1 - now) * 50) + "%";
            //3. increase opacity of previous_fs to 1 as it moves in
            opacity = 1 - now;
            current_fs.css({ 'left': left });
            previous_fs.css({ 'transform': 'scale(' + scale + ')', 'opacity': opacity });
        },
        duration: 800,
        complete: function() {
            current_fs.hide();
            animating = false;
        },
        //this comes from the custom easing plugin
        easing: 'easeInOutBack'
    });
});


var global_clik1 = 0;
var global_clik2 = 0;
var global_clik3 = 0;

$("#NextOne").on('click', function() {

    sig_step = false;
    global_clik1 = 1;
    var aprobacion = validateStep1();
    if (aprobacion) {
        $("#NextOne").prop('disabled', true);
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: '/Validate/StepOne',
            data: $("#msform").serialize(),
            headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
            beforeSend: function(x) {
                $("#loader_form").show();
            },
            success: function(data) {
                $("#NextOne").hide();
                $("#text_bloqueo").show();


                if (data.status == 200) {
                    countdownTimer = setInterval(secondPassed, 1000);
                    new PNotify({
                        title: 'Validación exitosa',
                        text: data.message,
                        icon: 'icofont icofont-info-circle',
                        type: 'success'
                    });
                    $('#SegurityKey').modal('show');
                    // toastr.success(data.message, "succes");
                    // sig_step = true;
                    $("#loader_form").hide();

                } else if (data.status == 403) {
                    $.each(data.errors, function(index, value) {
                        // toastr.error(value, 'Error!', { timeOut: 5e3 });
                        new PNotify({
                            title: 'Error',
                            text: value,
                            icon: 'icofont icofont-info-circle',
                            type: 'error'
                        });
                    });
                    $("#loader_form").hide();
                    return false;
                } else {
                    new PNotify({
                        title: 'Error',
                        text: data.message,
                        icon: 'icofont icofont-info-circle',
                        type: 'error'
                    });
                    $("#loader_form").hide();
                    return false;
                }

            }
        });
    }


});
$('.grupoOne').keyup(function() {
    if (global_clik1 == 1) {
        validateStep1();
    }
});
$('.grupoTwo').keyup(function() {

    if (global_clik2 == 1) {
        validateStep2();
    }
});
$("#NextTwo").on('click', function() {
    global_clik2 = 1;
    var aprob = validateStep2();
    if (aprob) {
        if (validate_18) {
            $("#real_sig2").trigger("click");
        }

    }

});

$("#country").change(function() {
    var country = $('#country').val();
    if (country.length <= 0) {
        $('#country').after('<div id="error_country" class="error"> Please select your Country</div>');
    } else {
        $('#error_country').hide();
    }
});

$("#t_doc").change(function() {
    var t_doc = $('#t_doc').val();
    if (t_doc.length <= 0) {
        $('#t_doc').after('<div id="error_t_doc" class="error"> Please select your Document type</div>');
    } else {
        $('#error_t_doc').hide();
    }
});

$("#birthdate").change(function() {
    var birthdate = $('#birthdate').val();
    if (birthdate.length <= 0) {
        $('#birthdate').after('<div id="error_birthdate"  class="error"> Please enter your birthdate</div>');
    } else {
        $('#error_birthdate').hide();
    }
});

$("#package").change(function() {
    validateStep3();
});

$("#birthdate").blur(function() {
    var fecha = $("#birthdate").val();
    if (fecha.length > 0) {
        var edad = validar_edad(fecha);
        if (edad < 18) {
            validate_18 = false;
            new PNotify({
                title: 'Error',
                text: 'Debes tener más de 18 años para poder registrarte',
                icon: 'icofont icofont-info-circle',
                type: 'error'
            });
            $("#birthdate").focus();
        } else {
            validate_18 = true;
        }
    }
});





function validateStep3() {
    var package = $('#package').val();
    var aprobacion3 = true;
    if (package.length <= 0) {
        aprobacion3 = false;
        $('#package').after('<div class="error">Debe selecionar una membrecia</div>');
    }
    return aprobacion3;

}

function validateStep2() {

    var nameReg = /^[A-Za-z]+$/;
    var numberReg = /^[0-9]+$/;
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    var firstname = $('#firstname').val();
    var lastname = $('#lastname').val();
    // var t_doc = $('#t_doc').val();
    // var n_doc = $('#n_doc').val();
    var country = $('#country').val();
    // var city = $('#city').val();
    // var address = $('#address').val();
    var phone = $('#phone').val();
    var birthdate = $('#birthdate').val();
    $('.error').hide();
    var aprobacion2 = true;
    if (firstname.length <= 0) {
        aprobacion2 = false;
        $('#firstname').after('<div class="error"> Please enter your firstname</div>');
    }
    if (lastname.length <= 0) {
        aprobacion2 = false;
        $('#lastname').after('<div class="error"> Please enter your lastname</div>');
    }

    // if (t_doc.length <= 0) {
    //     aprobacion2 = false;
    //     $('#t_doc').after('<div class="error" id="error_t_doc"> Please select your Document type</div>');
    // }

    // if (n_doc.length <= 0) {
    //     aprobacion2 = false;
    //     $('#n_doc').after('<div class="error"> Please enter your numero de documento</div>');
    // }
    if (country.length <= 0) {
        aprobacion2 = false;
        $('#country').after('<div id="error_country" class="error"> Please select your Country</div>');
    }

    // if (city.length <= 0) {
    //     aprobacion2 = false;
    //     $('#city').after('<div class="error"> Please enter your city</div>');
    // }


    // if (address.length <= 0) {
    //     aprobacion2 = false;
    //     $('#address').after('<div class="error"> Please enter your address</div>');
    // }

    if (phone.length <= 0) {
        aprobacion2 = false;
        $('#phone').after('<div class="error"> Please enter your phone</div>');
    }

    if (birthdate.length <= 0) {
        aprobacion2 = false;
        $('#birthdate').after('<div id="error_birthdate" class="error"> Please enter your birthdate</div>');
    }


    return aprobacion2;

}
$("#terms_check").click(function() {
    if ($('#terms_check').attr('checked')) {} else {
        $('.error_d').hide();
        $('.error_check').hide();
    }
});

function validateStep1() {
    $('.error').hide();
    var nameReg = /^[A-Za-z]+$/;
    var numberReg = /^[0-9]+$/;
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

    var sponsor_code = $('#sponsor_code').val();
    var username = $('#username').val();
    var email = $('#email').val();
    var password = $('#password').val();
    var password_confirmation = $('#password_confirmation').val();

    var aprobacion = true;
    if (!$('#terms_check').attr('checked')) {
        aprobacion = false;
        $('.error_d').after('<div class="error error_check"> Accept terms and conditions to continue</div>');
    }
    if (sponsor_code.length <= 0) {
        aprobacion = false;
        $('#sponsor_code').after('<div class="error"> Please enter your Sponsor</div>');
    }

    if (username.length <= 0) {
        aprobacion = false;
        $('#username').after('<div class="error"> Please enter your Username</div>');
    }

    if (email.length <= 0) {
        aprobacion = false;
        $('#email').after('<div class="error"> Please enter your email</div>');
    } else if (!emailReg.test(email)) {
        aprobacion = false;
        $('#email').after('<div class="error"> Please enter a valid email address</div>');
    }

    if (password.length <= 0) {
        aprobacion = false;
        $('#password').after('<div class="error"> Please enter your password</div>');
    }

    if (password_confirmation.length <= 0) {
        aprobacion = false;
        $('#password_confirmation').after('<div class="error"> Please enter your Confirm password</div>');
    }

    if ((password_confirmation.length > 0) && (password.length > 0)) {

        if (password_confirmation != password) {
            aprobacion = false;
            $('#password').after('<div class="error"> Las contraseñas no coinciden</div>');
        }

    }
    sig_step = false;
    return aprobacion;
}