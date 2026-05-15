// --- LENIS SMOOTH SCROLL ---
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// --- GSAP ANIMATIONS ---
gsap.registerPlugin(ScrollTrigger);

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
        navbar.style.padding = '15px 0';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.85)';
        navbar.style.boxShadow = 'none';
        navbar.style.padding = '20px 0';
    }
});

// Smooth Scroll for Nav Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            lenis.scrollTo(target);
        }
    });
});

// Hero Entrance
const heroTl = gsap.timeline();
heroTl.from('.eyebrow', { opacity: 0, y: 20, duration: 0.8, delay: 0.5 })
      .from('h1', { opacity: 0, y: 30, duration: 1, ease: 'power3.out' }, '-=0.5')
      .from('.hero-text p', { opacity: 0, y: 20, duration: 0.8 }, '-=0.7')
      .from('.hero-actions', { opacity: 0, y: 20, duration: 0.8 }, '-=0.7');

// Section Reveal Animations
const reveals = ['.gallery-grid', '.section-head', '.results-card', '.why-container', '.experience-container', '.cta-card'];
reveals.forEach(selector => {
    gsap.from(selector, {
        scrollTrigger: {
            trigger: selector,
            start: 'top 85%',
        },
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: 'power3.out'
    });
});

// Parallax for Hero Image
gsap.to('.hero-img', {
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    },
    y: '15%',
    ease: 'none'
});

// --- MOBILE NAV TOGGLE ---
(function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navMenu   = document.getElementById('navMenu');
    if (!navToggle || !navMenu) return;

    // Create backdrop element once
    const backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);

    const openMenu = () => {
        navMenu.classList.add('open');
        navToggle.classList.add('open');
        backdrop.classList.add('open');
        navToggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('menu-open');
    };

    const closeMenu = () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        backdrop.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
    };

    navToggle.addEventListener('click', () => {
        navMenu.classList.contains('open') ? closeMenu() : openMenu();
    });

    backdrop.addEventListener('click', closeMenu);

    // Close on link click
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close with Esc
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && navMenu.classList.contains('open')) closeMenu();
    });

    // Auto-close if viewport grows past mobile breakpoint
    window.addEventListener('resize', () => {
        if (window.innerWidth > 880 && navMenu.classList.contains('open')) closeMenu();
    });
})();
