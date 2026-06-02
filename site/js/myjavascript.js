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
        $('#pgE video, #pgA video').trigger('pause');
        $('.pgContent').hide();
        $('#pg' + pgNr).show();

        // Zorg dat elke nieuw geopende pagina bovenaan start.
        // Dit voorkomt dat korte pagina's zoals Downloads of Contact leeg lijken
        // wanneer men eerst lager op een lange pagina stond.
        $(window).scrollTop(0);
        $('html, body').scrollTop(0);
        $('#allPages').scrollTop(0);
        $('#pg' + pgNr).scrollTop(0);

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
    var lastKnownTotalCount = 0;

    function updateHomeDiabetesClock() {
        var counterElement = document.getElementById('diabetes-counter');
        var countdownElement = document.getElementById('countdown-timer');
        var todayCounterElement = document.getElementById('diagnoses-today-counter');

        if (!counterElement || !countdownElement || !todayCounterElement) {
            return;
        }

        var INITIAL_COUNT = 0;
        var COUNT_FIXED_TIMESTAMP = new Date(2026, 0, 1, 0, 0, 0);
        var intervalMillis = 17 * 60 * 1000;

        var now = new Date();
        var diffSinceFix = now - COUNT_FIXED_TIMESTAMP;

        if (diffSinceFix < 0) {
            counterElement.textContent = INITIAL_COUNT.toLocaleString('nl-BE');
            todayCounterElement.innerHTML = 'Nieuwe diagnoses vandaag: <span class="today-count-number">0</span>';
            countdownElement.textContent = 'Volgende diagnose over: --:--';
            return;
        }

        var additionalIntervals = Math.floor(diffSinceFix / intervalMillis);
        var totalCount = INITIAL_COUNT + additionalIntervals;

        if (totalCount !== lastKnownTotalCount && lastKnownTotalCount !== 0) {
            counterElement.textContent = totalCount.toLocaleString('nl-BE');
            counterElement.classList.add('updated');

            setTimeout(function() {
                counterElement.classList.remove('updated');
                counterElement.style.transform = 'scale(1)';
            }, 200);
        } else if (lastKnownTotalCount === 0) {
            counterElement.textContent = totalCount.toLocaleString('nl-BE');
        }

        lastKnownTotalCount = totalCount;

        var todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        var diffSinceMidnight = now - todayStart;
        var diagnosesToday = Math.floor(diffSinceMidnight / intervalMillis);

        todayCounterElement.innerHTML = 'Nieuwe diagnoses vandaag: <span class="today-count-number">' + diagnosesToday + '</span>';

        var millisIntoCurrentInterval = diffSinceFix % intervalMillis;
        var remainingMillis = intervalMillis - millisIntoCurrentInterval;
        var remainingSecondsTotal = Math.floor(remainingMillis / 1000);
        var minutes = Math.floor(remainingSecondsTotal / 60);
        var seconds = remainingSecondsTotal % 60;
        var formattedSeconds = String(seconds).padStart(2, '0');

        countdownElement.textContent = 'Volgende diagnose over: ' + minutes + ':' + formattedSeconds;
    }

    $.fn.startTimer = function() {
        clearInterval(myInterval);
        updateHomeDiabetesClock();
        myInterval = setInterval(updateHomeDiabetesClock, 1000);
    };

    $.fn.stopTimer = function() {
        clearInterval(myInterval);
    };

    // Intro-video op de Home-pagina starten na klik
    $(document).on('click', '#customHomeVideoPlayer', function() {
        if ($(this).data('video-loaded')) {
            return;
        }

        $(this).data('video-loaded', true);
        $(this).html(
            '<video controls autoplay playsinline style="width:100%; height:auto; display:block; border-radius:10px;">' +
            '<source src="https://fredje4711.github.io/nieuwsbrief/Presentatie_DLML_stem_achtergrondmuziek.mp4" type="video/mp4">' +
            'Je browser ondersteunt deze video niet.' +
            '</video>'
        );
    });

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
    $(document).on('click', '#pgD img[data-gallery]', function() {
        var clickedImage = this;

        currentGallery = [];

        // Bouw één doorlopende fotolijst van alle foto's binnen "Foto's vorige activiteiten"
        $('#pgD img[data-gallery]').each(function() {
            var imgPath = $(this).attr('src');
            var activityBlock = $(this).closest('.fotoGroupPerActiviteit');

            var activityTitle = cleanLightboxText(
                activityBlock.find('.titelFotoGrp label').first().clone().children().remove().end().text()
            );

            var activityDate = '';
            activityBlock.find('.fotoDatum').each(function() {
                var gevondenDatum = cleanLightboxText($(this).text());

                // Neem de eerste ingevulde datumtekst binnen deze activiteit.
                // Lege waarden worden genegeerd.
                if (gevondenDatum && gevondenDatum !== '&nbsp;' && !activityDate) {
                    activityDate = gevondenDatum;
                }
            });

            currentGallery.push({
                element: this,
                src: imgPath,
                title: activityTitle,
                date: activityDate
            });
        });

        currentIndex = currentGallery.findIndex(function(item) {
            return item.element === clickedImage;
        });

        if (currentIndex < 0) {
            currentIndex = 0;
        }

        updateLightboxDisplay();
        $('#customLightbox').css('display', 'flex').removeClass('is-zoomed');
        $('body').css('overflow', 'hidden');
    });

    function updateLightboxDisplay() {
        var currentPhoto = currentGallery[currentIndex];
        if (!currentPhoto) return;

        var titleText = currentPhoto.title;

        if (currentPhoto.date) {
            titleText += ' (' + currentPhoto.date + ')';
        }

        $('#lightboxImg').attr('src', currentPhoto.src);
        $('#downloadBtn').attr('href', currentPhoto.src);
        $('#lightboxTitle').text(titleText);

        currentGallery.length <= 1 ? $('.lightbox-nav').hide() : $('.lightbox-nav').show();
    }

    function cleanLightboxText(txt) {
        return (txt || '').replace(/\s+/g, ' ').trim();
    }

    function nextPhoto() { 
        currentIndex = (currentIndex + 1) % currentGallery.length; 
        updateLightboxDisplay(); 
    }

    function prevPhoto() { 
        currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length; 
        updateLightboxDisplay(); 
    }

    // Knoppen bediening
    $(document).on('click', '#nextBtn', function(e) { 
        e.stopPropagation(); 
        nextPhoto(); 
    });

    $(document).on('click', '#prevBtn', function(e) { 
        e.stopPropagation(); 
        prevPhoto(); 
    });

    $(document).on('click', '#closeBtn', function() { 
        $('#customLightbox').hide().removeClass('is-zoomed'); 
        $('body').css('overflow', 'auto'); 
    });
    
    function toggleLightboxZoom() {
    $('#customLightbox').toggleClass('is-zoomed');
    var isZ = $('#customLightbox').hasClass('is-zoomed');
    $('#zoomBtn i').attr('class', isZ ? 'fa fa-search-minus' : 'fa fa-search-plus');
}

$(document).on('click', '#zoomBtn', function(e) { 
    e.preventDefault();
    e.stopPropagation(); 
    toggleLightboxZoom();
});

/* Desktop/laptop: dubbelklikken op de afbeelding vergroot/verkleint */
$(document).on('dblclick', '#lightboxImg', function(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleLightboxZoom();
});

/* GSM/tablet: dubbel tikken op de afbeelding vergroot/verkleint */
var lastImageTap = 0;

$('#lightboxImg').on('touchend', function(e) {
    var now = new Date().getTime();
    var timeSinceLastTap = now - lastImageTap;

    if (timeSinceLastTap > 0 && timeSinceLastTap < 350) {
        e.preventDefault();
        e.stopPropagation();
        toggleLightboxZoom();
        lastImageTap = 0;
    } else {
        lastImageTap = now;
    }
});

    // Downloadknop: download de foto die op dat moment in de lightbox openstaat.
    // Belangrijk: dit werkt alleen wanneer de foto van hetzelfde domein komt als de website.
    // Op GitHub Pages met foto's vanaf www.dlml.be blokkeert de browser dit door CORS.
    $(document).on('click', '#downloadBtn', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var imageUrl = $('#lightboxImg').attr('src');
        if (!imageUrl) return false;

        var absoluteUrl = new URL(imageUrl, window.location.href);
        var fileName = getImageFileName(absoluteUrl.href);

        if (absoluteUrl.origin !== window.location.origin) {
            alert("Deze foto kan vanaf deze testlocatie niet rechtstreeks worden gedownload, omdat ze op een ander domein staat. Test dit op www.dlml.be of plaats de foto's ook in deze GitHub-site.");
            return false;
        }

        fetch(absoluteUrl.href)
            .then(function(response) {
                if (!response.ok) throw new Error('Afbeelding kon niet opgehaald worden.');
                return response.blob();
            })
            .then(function(blob) {
                var blobUrl = window.URL.createObjectURL(blob);
                var tempLink = document.createElement('a');

                tempLink.href = blobUrl;
                tempLink.download = fileName;
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);
                window.URL.revokeObjectURL(blobUrl);
            })
            .catch(function() {
                alert("De foto kon niet automatisch worden gedownload. Probeer de website online op hetzelfde domein als de foto's te testen.");
            });

        return false;
    });

    function getImageFileName(imageUrl) {
        try {
            var url = new URL(imageUrl, window.location.href);
            var name = url.pathname.substring(url.pathname.lastIndexOf('/') + 1);
            return decodeURIComponent(name || 'foto.jpg');
        } catch (err) {
            var cleanUrl = imageUrl.split('?')[0].split('#')[0];
            return cleanUrl.substring(cleanUrl.lastIndexOf('/') + 1) || 'foto.jpg';
        }
    }

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
        // Controleer of we zijn ingezoomd.
        var isIngezoomd = $('#customLightbox').hasClass('is-zoomed');

        // Als we zijn ingezoomd, stoppen we hier.
        // De vingerbeweging wordt dan gebruikt om te "rondfietsen" i.p.v. bladeren.
        if (isIngezoomd) {
            return; 
        }

        // Alleen als we NIET zijn ingezoomd, werkt het bladeren via swipe.
        var swipeDistance = 50; 
        if (touchendX < touchstartX - swipeDistance) nextPhoto();
        if (touchendX > touchstartX + swipeDistance) prevPhoto();
    }

    // --- 7. INITIALISATIE ---
    $.fn.startTimer();
    $.fn.setPg();
});
// Video's
$('.pgContent#pgE').on('click', '.video-wrapper', function () {
  const videoId = $(this).data('video-id');
  if (!videoId) return;
  const iframe = $('<iframe>', {
      src: 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0',
      title: $(this).find('img').attr('alt') || 'Video',
      allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
      allowfullscreen: true,
      frameborder: 0,
      css: { width: '100%', height: '100%', display: 'block', border: 'none' }
  });
  $(this).find('img, .play-button').remove();
  $(this).append(iframe);
});