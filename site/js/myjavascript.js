$(document).ready(function(e){
    var pgNr = 'A'; 
    var lightMode = true ; 

    // --- 1. MENU & NAVIGATIE ---
    $('#wrapper').on('click', function (e) {
        if ( $('#Mnu2').css('display') == 'block'  ) {   
            $('#Mnu2').animate({height: 0}, 200 , function() { $('#Mnu2').css('display','none'); });
        }
    });

    $(window).on('resize', function (e) {
        if ( $('#Mnu2').css('display') == 'block'  ) {   
            $('#Mnu2').animate({height: 0}, 200 , function() { $('#Mnu2').css('display','none'); });
        }
    });

    $('div[id^="MnuItm"]').on('click', function(e) {
        if ($(this).attr('id').slice(-1) == 'I') {
            $.fn.setMode();
        } else {
            pgNr = $(this).attr('id').slice(-1);  
            pgNr == 'A' ? $.fn.startTimer() : $.fn.stopTimer();
            $('#actieveMnu').html($("label", this).html()); 
            $.fn.setPg();
        }
    });

    $.fn.setPg = function() {  
        $('#pgE video').trigger('pause');
        $('.pgContent').hide();
        $('#pg' + pgNr).show(); 
        $('#Mnu1 div label, #Mnu2 div label').css('font-weight','500');
        $('#MnuItm1' + pgNr + ' label, #MnuItm2' + pgNr + ' label').css('font-weight','bold');
    }; 

    $('#btnMnu').on('click', function(e) { 
        e.preventDefault(); e.stopPropagation();   
        if ($('#Mnu2').is(':visible')) {
            $('#Mnu2').animate({height: 0}, 800 , function() { $(this).hide(); });
        } else {
            $('#Mnu2').show();
            var dh = $('#MnuLst2').height();
            $('#Mnu2').height(0).animate({height: dh}, 800, function() { $(this).css('height','auto'); });
        }   
    });

    // --- 2. DARK / LIGHT MODE ---
    $.fn.setMode = function(e) { 
        lightMode = !lightMode ; 
        if ( lightMode ) {
            $('html').css('--pgBackColor','#ffffff'); $('html').css('--pgColor','#333'); 
            $('html').css('--colorRed','#ff0000'); $('html').css('--Mnu1BackColor','#ffffff');
            $('html').css('--Mnu1Color','#31493c'); $('html').css('--Mnu2BackColor','#e8f1f2');
            $('html').css('--Mnu2Color','#31493c'); $('html').css('--Mnu2IcoColor','#31493c'); 
            $('html').css('--linkColor','#0000ff'); $('#imgHasselt').attr('src','site/image/HasseltDark.png');  
            $('.LogoSize1, .LogoSize2').attr('src','site/image/LogoDLwt.png');
        } else {
            $('html').css('--pgBackColor','#31493c'); $('html').css('--pgColor','#ffffff');
            $('html').css('--colorRed','#ff7f50'); $('html').css('--Mnu1BackColor','#31493c');
            $('html').css('--Mnu1Color','#f0f0f0'); $('html').css('--Mnu2BackColor','#e8f1f2');
            $('html').css('--Mnu2Color','#31493c'); $('html').css('--Mnu2SelColor','#00dd00'); 
            $('html').css('--Mnu2IcoColor','#31493c'); $('html').css('--linkColor','#8080ff'); 
            $('#imgHasselt').attr('src','site/image/HasseltLight.png');  
            $('.LogoSize1, .LogoSize2').attr('src','site/image/LogoDLzw.png');
        }
    };

    // --- 3. TIMER / KLOK ---
    var myInterval;
    $.fn.startTimer = function() {  
        myInterval = setInterval(function() {
            var dt1 = new Date();
            var dt3 = new Date(dt1.getFullYear(), dt1.getMonth(), dt1.getDate(), 0, 0, 0);
            $('#dtJaar').html(dt1.getFullYear());
            var aantalDitJaar = parseInt((dt1.getTime() - new Date(dt1.getFullYear(), 0, 1).getTime()) / 1020000);
            var diff = (dt1.getTime() - dt3.getTime())/1000;
            var aantalVandaag = parseInt(diff / 1020);
            var cnt = 1020 - parseInt(diff % 1020);
            var m = (' ' + parseInt(cnt / 60)).slice(-2);
            var s = ('0' + parseInt(cnt % 60)).slice(-2);
            $('#diabetes-clock-wrapper div:nth-child(4)').html(aantalDitJaar);
            $('#diabetes-clock-wrapper div:nth-child(5) span').html(aantalVandaag);   
            $('#diabetes-clock-wrapper div:nth-child(6) span').html(m + ':' + s);
        }, 1000);
    };

    $.fn.stopTimer = function() { clearInterval(myInterval); };

    // --- 4. MYTHEN & FEITEN (KAARTEN) ---
    $('.card, .cardRotate').on('click', function() {
        var isAlGedraaid = $(this).hasClass('cardRotate');
        $('.cardRotate').removeClass('cardRotate').addClass('card');
        if (!isAlGedraaid) {
            $(this).removeClass('card').addClass('cardRotate');
        }
    });

    // --- 5. SLIDESHOW MOTOR (LIGHTBOX) ---
    var currentGallery = [];
    var currentIndex = 0;

    // Foto openen
    $(document).on('click', 'img[data-gallery]', function() {
        var group = $(this).attr('data-gallery');
        var src = $(this).attr('src');
        currentGallery = [];
        $('img[data-gallery="' + group + '"]').each(function() {
            var imgPath = $(this).attr('src');
            if (currentGallery.indexOf(imgPath) === -1) currentGallery.push(imgPath);
        });
        currentIndex = currentGallery.indexOf(src);
        updateLightboxDisplay();
        $('#customLightbox').css('display', 'flex').removeClass('is-zoomed');
        $('body').css('overflow', 'hidden');
    });

    function updateLightboxDisplay() {
        var newSrc = currentGallery[currentIndex];
        $('#lightboxImg').attr('src', newSrc);
        $('#downloadBtn').attr('href', newSrc);
        currentGallery.length <= 1 ? $('.lightbox-nav').hide() : $('.lightbox-nav').show();
    }

    function nextPhoto() { currentIndex = (currentIndex + 1) % currentGallery.length; updateLightboxDisplay(); }
    function prevPhoto() { currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length; updateLightboxDisplay(); }

    // Knoppen bediening
    $(document).on('click', '#nextBtn', function(e) { e.stopPropagation(); nextPhoto(); });
    $(document).on('click', '#prevBtn', function(e) { e.stopPropagation(); prevPhoto(); });
    $(document).on('click', '#closeBtn', function() { $('#customLightbox').hide().removeClass('is-zoomed'); $('body').css('overflow', 'auto'); });
    
    $(document).on('click', '#zoomBtn', function(e) { 
        e.stopPropagation(); $('#customLightbox').toggleClass('is-zoomed');
        var isZ = $('#customLightbox').hasClass('is-zoomed');
        $('#zoomBtn i').attr('class', isZ ? 'fa fa-search-minus' : 'fa fa-search-plus');
    });

    // Toetsenbord bediening
    $(document).on('keydown', function(e) {
        if (!$('#customLightbox').is(':visible')) return;
        if (e.key === "ArrowRight") nextPhoto();
        if (e.key === "ArrowLeft") prevPhoto();
        if (e.key === "Escape") $('#closeBtn').click();
    });

    // --- 6. SWIPE FUNCTIONALITEIT (GSM) ---
    var touchstartX = 0;
    var touchendX = 0;

    $('#customLightbox').on('touchstart', function(e) {
        touchstartX = e.changedTouches[0].screenX;
    });

    $('#customLightbox').on('touchend', function(e) {
        touchendX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        // NIEUW: Controleer of we zijn ingezoomd
        var isIngezoomd = $('#customLightbox').hasClass('is-zoomed');

        // Als we zijn ingezoomd, stoppen we hier. 
        // De vingerbeweging wordt dan gebruikt om te "rondfietsen" i.p.v. bladeren.
        if (isIngezoomd) {
            return; 
        }

        // Alleen als we NIET zijn ingezoomd, werkt het bladeren via swipe:
        var swipeDistance = 50; 
        if (touchendX < touchstartX - swipeDistance) nextPhoto(); // Swipe naar links
        if (touchendX > touchstartX + swipeDistance) prevPhoto(); // Swipe naar rechts
    }

    // --- 7. INITIALISATIE ---
    $.fn.startTimer();
    $.fn.setPg();
});