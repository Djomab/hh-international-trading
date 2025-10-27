// H&H International Trading - JavaScript corrigé
console.log('H&H Trading - Chargement du site');

// Afficher tous les éléments fade-in immédiatement (solution temporaire)
function showAllContentImmediately() {
    const fadeElements = document.querySelectorAll('.fade-in');
    console.log(`Affichage immédiat de ${fadeElements.length} éléments`);
    
    fadeElements.forEach(el => {
        el.classList.add('visible');
        el.style.opacity = '1';
        el.style.visibility = 'visible';
        el.style.transform = 'translateY(0)';
    });
}

// Smooth scroll sécurisé
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                target.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        });
    });
    
    console.log('Smooth scroll activé');
}

// Animation navbar au scroll
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    if (!navbar) {
        console.log('Navbar non trouvée');
        return;
    }
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    console.log('Animation navbar activée');
}

// Animation on scroll SIMPLIFIÉE (sans bloquer l'affichage)
function initScrollAnimations() {
    const fadeElems = document.querySelectorAll('.fade-in');
    
    if (fadeElems.length === 0) {
        console.log('Aucun élément .fade-in trouvé');
        return;
    }
    
    // Afficher immédiatement tous les éléments
    fadeElems.forEach(elem => {
        elem.classList.add('visible');
    });
    
    // Optionnel: ré-animer au scroll pour l'effet
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    fadeElems.forEach(elem => {
        observer.observe(elem);
    });
    
    console.log(`Animations scroll activées sur ${fadeElems.length} éléments`);
}

// Gestion des erreurs
function handleErrors() {
    window.addEventListener('error', (e) => {
        console.error('Erreur JavaScript:', e.error);
    });
    
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Promise rejetée:', e.reason);
    });
}

// Initialisation principale
function initSite() {
    console.log('Initialisation des fonctionnalités...');
    
    // AFFICHER LE CONTENU IMMÉDIATEMENT (CRITIQUE)
    showAllContentImmediately();
    
    // Puis initialiser les autres fonctionnalités
    initSmoothScroll();
    initNavbarScroll();
    initScrollAnimations();
    
    console.log('Site initialisé avec succès');
}

// Attendre que le DOM soit chargé
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        handleErrors();
        initSite();
    });
} else {
    handleErrors();
    initSite();
}

// Confirmation finale
setTimeout(() => {
    console.log('✅ H&H Trading - Site complètement chargé et visible');
}, 100);