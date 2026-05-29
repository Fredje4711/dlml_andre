// --- DEZE FUNCTIES MOETEN HELEMAAL BOVENAAN, BUITEN DE READY FUNCTIE ---
function doClose(e) {
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    $('#customLightbox').hide().removeClass('is-zoomed');
    $('body').css('overflow', 'auto');
}

function doZoom(e) {
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    $('#customLightbox').toggleClass('is-zoomed');
    var isZ = $('#customLightbox').hasClass('is-zoomed');
    $('#zoomBtn i').attr('class', isZ ? 'fas fa-search-minus' : 'fas fa-search-plus');
}

function doDownload(e) {
    // 1. STOP ELKE ANDERE ACTIE (Blokkade voor André)
    if (e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
    }

    var imgSrc = $('#lightboxImg').attr('src');
    var fileName = imgSrc.split('/').pop();

    // 2. VOER DE DOWNLOAD UIT
    // We proberen de browser te dwingen het bestand op te halen
    fetch(imgSrc)
    .then(response => {
        if (!response.ok) throw new Error('Netwerk reageert niet');
        return response.blob();
    })
    .then(blob => {
        // Maak een tijdelijke link in het geheugen
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName; // De dwingende opdracht om op te slaan
        document.body.appendChild(a);
        a.click(); // Klik op de onzichtbare link
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    })
    .catch(err => {
        // FALLBACK: Als fetch wordt geblokkeerd (zoals nu op je laptop)
        // Dan openen we de foto in een nieuw tabblad. 
        // Dit is GEEN fout in de code, maar een beveiliging van je browser.
        console.log("Download geblokkeerd door browser-beveiliging (CORS).");
        var win = window.open(imgSrc, '_blank');
        win.focus();
    });
}

$(document).ready(function(e){
    var pgNr = 'A'; 
    var lightMode = true; 

    // --- 1. OUDE CODE VAN ANDRÉ STOPPEN ---
    $('.fotoImg').off('click'); 
    $(document).off('click', '.fotoImg');

    // --- 2. MENU & NAVIGATIE ---
    $('div[id^="MnuItm"]').on('click', function(e) {
        pgNr = $(this).attr('id').slice(-1);  
        if (pgNr !== 'I') {
            $('#actieveMnu').html($("label", this).html()); 
            $.fn.setPg();
        } else { $.fn.setMode(); }
    });

    $.fn.setPg = function() {  
        $('.pgContent').hide();
        $('#pg' + pgNr).show(); 
    }; 

    $('#btnMnu').on('click', function(e) { e.stopPropagation(); $('#Mnu2').toggle().height('auto'); });

    // --- 3. SLIDESHOW MOTOR ---
    var currentGallery = [];
    var currentIndex = 0;

    $(document).on('click', 'img[data-gallery]', function(e) {
        // Stop de oude fullscreen van André
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        var group = $(this).attr('data-gallery');
        var src = $(this).attr('src');
        var container = $(this).closest('.fotoGroupPerActiviteit');
        var deTitel = container.find('.titelFotoGrp label').text().trim();
        var deDatum = container.find('.fotoDatum').first().text().trim();

        currentGallery = [];
        $('img[data-gallery="' + group + '"]').each(function() {
            currentGallery.push({ src: $(this).attr('src'), title: deTitel, date: deDatum });
        });

        currentIndex = currentGallery.findIndex(img => img.src === src);
        updateLightboxDisplay();
        $('#customLightbox').css('display', 'flex').removeClass('is-zoomed');
        $('body').css('overflow', 'hidden');
    });

    function updateLightboxDisplay() {
        var data = currentGallery[currentIndex];
        $('#lightboxImg').attr('src', data.src);
        $('#lightboxInfo').text(data.title + (data.date ? " (" + data.date + ")" : ""));
        currentGallery.length <= 1 ? $('.lightbox-nav').hide() : $('.lightbox-nav').show();
    }

    function nextPhoto() { currentIndex = (currentIndex + 1) % currentGallery.length; updateLightboxDisplay(); }
    function prevPhoto() { currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length; updateLightboxDisplay(); }

    $(document).on('click', '#nextBtn', function(e) { e.stopPropagation(); nextPhoto(); });
    $(document).on('click', '#prevBtn', function(e) { e.stopPropagation(); prevPhoto(); });

    // Pijltjestoetsen
    $(document).on('keydown', function(e) {
        if (!$('#customLightbox').is(':visible')) return;
        if (e.key === "ArrowRight") nextPhoto();
        if (e.key === "ArrowLeft") prevPhoto();
        if (e.key === "Escape") doClose(e);
    });

    $.fn.setPg();
});