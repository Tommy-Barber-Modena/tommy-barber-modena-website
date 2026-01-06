// Aspetta che il documento sia caricato
document.addEventListener('DOMContentLoaded', () => {
    
    // --- GESTIONE MENU MOBILE ---
    const menuButton = document.querySelector('button[onclick="toggleMenu()"]');
    const mobileMenu = document.getElementById('mobile-menu');
    
    // Funzione globale per il toggle (richiamata dall'HTML)
    window.toggleMenu = function() {
        if (mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.remove('hidden');
        } else {
            mobileMenu.classList.add('hidden');
        }
    };

    // Chiudi il menu quando si clicca un link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    // --- SMOOTH SCROLL (Scorrimento fluido) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement){
                // Calcola l'offset per la navbar fissa
                const headerOffset = 80; 
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });


    const jsonUrl = 'static/data/reviews.json';
    fetch(jsonUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore nel caricamento del file JSON');
            }
            return response.json();
        })
        .then(data => {
            // Qui abbiamo i dati caricati (data)
            generaRecensioni(data.recensioni);
        })
        .catch(error => {
            console.error('Si è verificato un problema:', error);
            // Opzionale: Mostra un messaggio di errore all'utente o nascondi la sezione
            document.getElementById('reviews-container').innerHTML = '<p class="text-center text-red-500">Impossibile caricare le recensioni al momento.</p>';
        });

    function generaRecensioni(reviews) {
        // 1. Filtra recensioni vuote
        const validReviews = reviews.filter(r => r.testo && r.testo.trim().length > 0);

        // 2. Mescola (Shuffle casuale)
        const shuffled = validReviews.sort(() => 0.5 - Math.random());

        // 3. Prendi le prime 3
        const selectedReviews = shuffled.slice(0, 3);

        const container = document.getElementById('reviews-container');
        let htmlContent = '';

        selectedReviews.forEach(review => {
            // Generazione Stelle
            let starsHtml = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= review.voto) {
                    starsHtml += '<i class="fas fa-star"></i>'; 
                } else {
                    starsHtml += '<i class="far fa-star"></i>';
                }
            }

            // Troncamento testo
            let cleanText = review.testo.replace(/<br\s*\/?>/gi, ' ');
            if (cleanText.length > 300) {
                cleanText = cleanText.substring(0, 300) + '...';
            }

            // Iniziale Autore
            const initial = review.autore.charAt(0).toUpperCase();

            // Generazione HTML Card
            htmlContent += `
            <div class="card p-6 rounded-xl bg-custom-primary shadow-sm flex flex-col justify-between h-full">
                <div>
                    <div class="flex text-yellow-400 mb-2">
                        ${starsHtml}
                    </div>
                    <p class="mb-4 italic opacity-80">"${cleanText}"</p>
                </div>
                <div class="flex items-center gap-3 mt-auto">
                    <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center font-bold text-black text-xs">
                        ${initial}
                    </div>
                    <span class="text-sm font-bold">${review.autore}</span>
                </div>
            </div>
            `;
        });
        container.innerHTML = htmlContent;
    };

    // --- GESTIONE GALLERY DINAMICA ---
    
    // 1. CONFIGURAZIONE DATI
    // Aggiungi qui le tue immagini e video. L'ordine nell'array è l'ordine di visualizzazione.
    // type: 'image' oppure 'video'
    // src: Link all'immagine grande o al file video mp4
    // thumb: Immagine di anteprima (per i video è la copertina)
    const galleryData = [
        {
            type: 'video',
            src: 'static/gallery/1.mp4',
            thumb: 'static/gallery/1.jpg',
            alt: 'Video Taglio Classico'
        },
        {
            type: 'image',
            src: 'static/gallery/2.webp',
            thumb: 'static/gallery/2.webp',
            alt: 'Strumenti del mestiere'
        },
        {
            type: 'image',
            src: 'static/gallery/3.webp',
            thumb: 'static/gallery/3.webp',
            alt: 'Strumenti del mestiere'
        },
        {
            type: 'image',
            src: 'static/gallery/4.webp',
            thumb: 'static/gallery/4.webp',
            alt: 'Strumenti del mestiere'
        },
        {
            type: 'image',
            src: 'static/gallery/5.webp',
            thumb: 'static/gallery/5.webp',
            alt: 'Strumenti del mestiere'
        },
        {
            type: 'video',
            src: 'static/gallery/6.mp4',
            thumb: 'static/gallery/6.jpg',
            alt: 'Video Sfumatura Laterale'
        },
    ];
    
    // Variabili di stato
    let currentGalleryIndex = 0;
    const galleryGrid = document.getElementById('gallery-grid');
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = document.getElementById('lightbox-content');
    const lightboxBg = document.getElementById('lightbox-bg');

    // Pulsanti
    const btnClose = document.getElementById('lightbox-close');
    const btnPrev = document.getElementById('lightbox-prev');
    const btnNext = document.getElementById('lightbox-next');

    // 2. GENERAZIONE GRIGLIA HTML
    if (galleryGrid) {
        galleryGrid.innerHTML = galleryData.map((item, index) => {
            const iconClass = item.type === 'video' ? 'fa-play' : 'fa-search-plus';
            const videoBadge = item.type === 'video' ? `<div class="video-indicator"><i class="fas fa-video"></i></div>` : '';
            
            return `
                <div class="gallery-item group" data-index="${index}">
                    ${videoBadge}
                    <img src="${item.thumb}" alt="${item.alt}" loading="lazy">
                    <div class="gallery-overlay">
                        <i class="fas ${iconClass} gallery-icon"></i>
                    </div>
                </div>
            `;
        }).join('');

        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                openLightbox(index);
            });
        });
    }

    // 3. FUNZIONI LOGICHE
    function openLightbox(index) {
        currentGalleryIndex = index;
        updateLightboxContent();

        lightbox.classList.remove('hidden');
        // Timeout minimo per attivare la transizione CSS opacity
        setTimeout(() => lightbox.classList.remove('opacity-0'), 10);
        document.body.style.overflow = 'hidden'; // Blocca lo scroll pagina
    }

    function closeLightbox() {
        lightbox.classList.add('opacity-0');
        setTimeout(() => {
            lightbox.classList.add('hidden');
            lightboxContent.innerHTML = ''; // Ferma eventuali video
            document.body.style.overflow = ''; // Riattiva scroll
        }, 300);
    }

    function updateLightboxContent() {
        const item = galleryData[currentGalleryIndex];
        let html = '';

        // Fade out rapido per transizione più fluida (opzionale)
        lightboxContent.style.opacity = '0.5';

        setTimeout(() => {
            if (item.type === 'video') {
                html = `
                    <video controls autoplay class="w-full h-full max-h-[85vh] object-contain focus:outline-none">
                        <source src="${item.src}" type="video/mp4">
                        Il tuo browser non supporta il video.
                    </video>`;
            } else {
                html = `
                    <img src="${item.src}" alt="${item.alt}" class="w-full h-full object-contain max-h-[85vh]">
                `;
            }
            
            lightboxContent.innerHTML = html;
            lightboxContent.style.opacity = '1';
        }, 150);
    }

    // Navigazione Successiva (Loop infinito)
    function nextImage() {
        currentGalleryIndex = (currentGalleryIndex + 1) % galleryData.length;
        updateLightboxContent();
    }

    // Navigazione Precedente (Loop infinito)
    function prevImage() {
        currentGalleryIndex = (currentGalleryIndex - 1 + galleryData.length) % galleryData.length;
        updateLightboxContent();
    }

    // 4. EVENT LISTENERS CONTROLLI
    if (btnClose) btnClose.addEventListener('click', closeLightbox);
    if (lightboxBg) lightboxBg.addEventListener('click', closeLightbox);
    
    // Click sulle frecce
    if (btnNext) btnNext.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita che il click chiuda la modale (se clicchi bg)
        nextImage();
    });
    
    if (btnPrev) btnPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        prevImage();
    });
    
    // Navigazione da tastiera
    document.addEventListener('keydown', (e) => {
        // Funziona solo se la lightbox è visibile
        if (!lightbox.classList.contains('hidden')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        }
    });

});