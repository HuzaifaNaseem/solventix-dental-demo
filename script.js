/* ===================================================
   LUMINA DENTAL — script.js
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Hamburger / Mobile Menu ----
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            hamburger.classList.toggle('open', isOpen);
            hamburger.setAttribute('aria-expanded', isOpen);
        });

        // Close on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                hamburger.classList.remove('open');
            });
        });
    }

    // ---- Navbar Scroll Effect ----
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255,255,255,0.97)';
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
        } else {
            navbar.style.background = 'rgba(255,255,255,0.88)';
            navbar.style.boxShadow = 'none';
        }
    }, { passive: true });

    // ---- Smooth Scroll ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const offset = 70;
            const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    // ---- Scroll Reveal ----
    const revealElements = document.querySelectorAll(
        '.hero-body, .stats-bar, .gallery-grid, .sec-head, .result-frame, .services-list li, .doctor-grid, .testimonial-inner, .book-grid, .visit-grid'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });

    // ---- Hero parallax ----
    const heroImg = document.querySelector('.hero-img');
    if (heroImg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroImg.style.transform = `translate3d(0, ${scrolled * 0.15}px, 0) scale(1.02)`;
            }
        }, { passive: true });
    }

    // ---- Booking Form ----
    const bookForm = document.getElementById('bookForm');
    if (bookForm) {
        bookForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = this.querySelector('button[type="submit"]');
            btn.textContent = 'Sending…';
            btn.disabled = true;

            setTimeout(() => {
                bookForm.innerHTML = `
                    <div style="text-align:center; padding:60px 20px;">
                        <div style="font-size:48px; margin-bottom:20px;">✓</div>
                        <h3 style="font-family:'Cormorant Garamond',serif; font-size:32px; margin-bottom:12px;">Thank you.</h3>
                        <p style="color:#64748b; font-size:16px;">Your request has been received. We will reply within one business day.</p>
                    </div>
                `;
            }, 1200);
        });
    }

});
