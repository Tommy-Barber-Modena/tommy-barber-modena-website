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

    // --- LOGICA STYLE SWITCHER (Solo per la Demo) ---
    window.setTheme = function(themeName) {
        document.body.className = themeName;
        
        // Feedback visivo sul bottone cliccato
        const btn = event.currentTarget; // Usa currentTarget per sicurezza
        const originalText = btn.innerText;
        btn.innerText = "Attivato!";
        
        setTimeout(() => {
            btn.innerText = originalText;
        }, 1000);
    }
});