document.addEventListener('DOMContentLoaded', function () {

    const navbar = document.getElementById('mainNav');
    const scrollProgress = document.getElementById('scrollProgress');
    const scrollToTopBtn = document.getElementById('scrollToTop');
    const navLinks = document.querySelectorAll('#mainNav .nav-link');
    const sections = document.querySelectorAll('section[id]');

    // ===== NAV SCROLL STATE =====
    function updateNavbar() {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // ===== ACTIVE NAV LINK =====
    function updateActiveNav() {
        const scrollPos = window.scrollY + 120;
        let currentSection = '';

        sections.forEach(section => {
            if (scrollPos >= section.offsetTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    }

    // ===== SCROLL PROGRESS =====
    function updateScrollProgress() {
        if (!scrollProgress) return;
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = percent + '%';
    }

    // ===== SCROLL TO TOP =====
    function updateScrollToTop() {
        if (!scrollToTopBtn) return;
        if (window.scrollY > 400) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    }

    // Single scroll listener using requestAnimationFrame
    let ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(function () {
                updateNavbar();
                updateActiveNav();
                updateScrollProgress();
                updateScrollToTop();
                ticking = false;
            });
            ticking = true;
        }
    });

    updateNavbar();
    updateActiveNav();

    // ===== SMOOTH SCROLL NAV LINKS =====
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
            const collapse = document.querySelector('.navbar-collapse');
            if (collapse && collapse.classList.contains('show')) {
                collapse.classList.remove('show');
            }
        });
    });

    // ===== HERO SCROLL BUTTON =====
    const scrollDownBtn = document.querySelector('.scroll-down');
    if (scrollDownBtn) {
        scrollDownBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const about = document.querySelector('#about');
            if (about) {
                window.scrollTo({ top: about.offsetTop - 80, behavior: 'smooth' });
            }
        });
    }

    // ===== SCROLL TO TOP CLICK =====
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== SCROLL-TRIGGERED ANIMATIONS =====
    const animateElements = document.querySelectorAll('.animate-on-scroll');

    const animObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                animObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    animateElements.forEach(el => animObserver.observe(el));

    // ===== HERO ENTRANCE ANIMATION =====
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        const children = heroContent.children;
        Array.from(children).forEach((child, i) => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(25px)';
            child.style.transition = `opacity 0.7s cubic-bezier(0.4,0,0.2,1) ${i * 0.15 + 0.3}s, transform 0.7s cubic-bezier(0.4,0,0.2,1) ${i * 0.15 + 0.3}s`;
        });
        requestAnimationFrame(() => {
            Array.from(children).forEach(child => {
                child.style.opacity = '1';
                child.style.transform = 'translateY(0)';
            });
        });
    }

    // ===== STATS COUNTER ANIMATION =====
    const statNumbers = document.querySelectorAll('.stat-number');

    const statsObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => statsObserver.observe(stat));

    function animateCounter(el) {
        const text = el.textContent.trim();
        const target = parseInt(text);
        if (isNaN(target)) return;

        const suffix = text.replace(/\d/g, '');
        const duration = 1800;
        const start = performance.now();

        function step(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            el.textContent = current + suffix;
            if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    }
});
