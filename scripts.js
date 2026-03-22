// Futuristic animations & particle effects without external js frameworks

// 1. Initialization
document.addEventListener('DOMContentLoaded', () => {
    initScrollSpy();
    initIntersectionObservers();
    initParticles();
    initCustomCursor();
    animateProgressBars();
});

// 2. Smooth Scrolling & Active State
function initScrollSpy() {
    const navLinks = document.querySelectorAll('.js-scroll-trigger');
    
    // Collapse navbar on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const navbarToggler = document.querySelector('.navbar-toggler');
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });
}

// 3. Intersection Observer for FadeIns
function initIntersectionObservers() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const animateOnScrollElements = document.querySelectorAll('.animate__animated');
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // If it already has fadeup or fadein defined via data attribute, apply it, else default
                const animation = entry.target.dataset.animation || 'animate__fadeIn';
                entry.target.classList.add(animation);
                entry.target.style.opacity = 1; // Unhide
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateOnScrollElements.forEach(el => {
        el.style.opacity = 0; // Hide initially
        observer.observe(el);
    });
}

// 4. Progress Bar Animation
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute('aria-valuenow') + '%';
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.transition = 'width 1.5s cubic-bezier(0.18, 0.89, 0.32, 1.28)';
                    bar.style.width = width;
                }, 200);
                obs.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => {
        bar.style.width = '0%';
        observer.observe(bar);
    });
}

// 5. Custom Futuristic Cursor
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });

    // Add pulse effect when hovering over interactive elements
    const interactives = document.querySelectorAll('a, button, input, textarea');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.backgroundColor = 'rgba(0, 243, 255, 0.2)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.backgroundColor = 'transparent';
        });
    });
}

// 6. Futuristic Particle Background using Canvas
function initParticles() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-bg';
    document.body.prepend(canvas);
    
    const ctx = canvas.getContext('2d');
    let width, height, particles;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 1;
            this.vy = (Math.random() - 0.5) * 1;
            this.radius = Math.random() * 2 + 0.5;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx = -this.vx;
            if (this.y < 0 || this.y > height) this.vy = -this.vy;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 243, 255, 0.3)';
            ctx.fill();
        }
    }

    function init() {
        resize();
        particles = [];
        const count = Math.min(window.innerWidth / 15, 100);
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
        window.addEventListener('resize', resize);
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => p.update());
        
        // Draw lines between nearby particles
        for(let i = 0; i < particles.length; i++) {
            for(let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 243, 255, ${0.2 - dist/600})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        particles.forEach(p => p.draw());
        requestAnimationFrame(animate);
    }

    init();
    animate();
}
