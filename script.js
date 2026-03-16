// ===== 3D PORTFOLIO — MAIN SCRIPT =====
// Interactive 3D particles, cursor effects, smooth scrolling, and animations

(function () {
    'use strict';

    // ===== CUSTOM CURSOR =====
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    const cursorGlow = document.getElementById('cursorGlow');
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
        cursorGlow.style.left = mouseX + 'px';
        cursorGlow.style.top = mouseY + 'px';
    });

    function animateCursor() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Cursor hover effects
    const hoverTargets = document.querySelectorAll('a, button, .project-card, .skill-card, .floating-card, .contact-card, input, textarea');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.classList.add('hover');
            cursorRing.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('hover');
            cursorRing.classList.remove('hover');
        });
    });

    // ===== 3D CANVAS PARTICLE SYSTEM =====
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let geometricShapes = [];
    const PARTICLE_COUNT = 80;
    const SHAPE_COUNT = 12;

    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.z = Math.random() * 1000;
            this.baseX = this.x;
            this.baseY = this.y;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.speedZ = (Math.random() - 0.5) * 2;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.hue = Math.random() * 60 + 230; // Purple-blue range
        }

        update() {
            this.z += this.speedZ;
            if (this.z < 1 || this.z > 1000) this.speedZ *= -1;

            const perspective = 800 / (800 + this.z);
            const dx = mouseX - width / 2;
            const dy = mouseY - height / 2;
            
            this.x += this.speedX + dx * 0.0003 * perspective;
            this.y += this.speedY + dy * 0.0003 * perspective;

            // Wrap around
            if (this.x < -50) this.x = width + 50;
            if (this.x > width + 50) this.x = -50;
            if (this.y < -50) this.y = height + 50;
            if (this.y > height + 50) this.y = -50;

            this.screenSize = this.size * perspective;
            this.screenOpacity = this.opacity * perspective;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.screenSize, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 70%, 65%, ${this.screenOpacity})`;
            ctx.fill();
        }
    }

    // Geometric Shape class (floating 3D shapes)
    class GeometricShape {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.z = Math.random() * 600 + 200;
            this.rotationX = Math.random() * Math.PI * 2;
            this.rotationY = Math.random() * Math.PI * 2;
            this.rotationZ = Math.random() * Math.PI * 2;
            this.rotSpeedX = (Math.random() - 0.5) * 0.01;
            this.rotSpeedY = (Math.random() - 0.5) * 0.01;
            this.rotSpeedZ = (Math.random() - 0.5) * 0.008;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.size = Math.random() * 30 + 15;
            this.type = Math.floor(Math.random() * 4); // 0: triangle, 1: square, 2: pentagon, 3: hexagon
            this.hue = [250, 340, 170, 30][Math.floor(Math.random() * 4)];
            this.opacity = Math.random() * 0.08 + 0.03;
        }

        update() {
            this.rotationX += this.rotSpeedX;
            this.rotationY += this.rotSpeedY;
            this.rotationZ += this.rotSpeedZ;

            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            this.x += this.speedX + dx * 0.0002;
            this.y += this.speedY + dy * 0.0002;

            // Wrap around
            if (this.x < -100) this.x = width + 100;
            if (this.x > width + 100) this.x = -100;
            if (this.y < -100) this.y = height + 100;
            if (this.y > height + 100) this.y = -100;
        }

        draw() {
            const perspective = 800 / (800 + this.z);
            const size = this.size * perspective;
            const sides = this.type + 3; // 3 to 6 sides

            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotationZ);
            ctx.scale(
                Math.cos(this.rotationX) * perspective,
                Math.cos(this.rotationY) * perspective
            );

            ctx.beginPath();
            for (let i = 0; i < sides; i++) {
                const angle = (Math.PI * 2 / sides) * i - Math.PI / 2;
                const px = Math.cos(angle) * size;
                const py = Math.sin(angle) * size;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();

            ctx.strokeStyle = `hsla(${this.hue}, 60%, 60%, ${this.opacity * 2})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ctx.fillStyle = `hsla(${this.hue}, 60%, 70%, ${this.opacity * 0.5})`;
            ctx.fill();

            ctx.restore();
        }
    }

    // Connection lines between nearby particles
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 150) {
                    const opacity = (1 - dist / 150) * 0.12;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(108, 99, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    // Mouse attraction lines
    function drawMouseConnections() {
        for (let i = 0; i < particles.length; i++) {
            const dx = mouseX - particles[i].x;
            const dy = mouseY - particles[i].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 200) {
                const opacity = (1 - dist / 200) * 0.15;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouseX, mouseY);
                ctx.strokeStyle = `rgba(255, 107, 157, ${opacity})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }
        }
    }

    // Initialize particles and shapes
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }
    for (let i = 0; i < SHAPE_COUNT; i++) {
        geometricShapes.push(new GeometricShape());
    }

    // Main animation loop
    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw geometric shapes (behind particles)
        geometricShapes.forEach(shape => {
            shape.update();
            shape.draw();
        });

        // Draw particles
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        drawConnections();
        drawMouseConnections();

        requestAnimationFrame(animate);
    }
    animate();

    // ===== NAVBAR SCROLL EFFECT =====
    const navbar = document.getElementById('navbar');
    let lastScrollY = 0;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
    });

    // ===== ACTIVE NAV LINK ON SCROLL =====
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveLink() {
        const scrollY = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);

    // ===== SMOOTH SCROLL FOR NAV LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }

            // Close mobile menu if open
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ===== HAMBURGER MENU =====
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // ===== 3D TILT EFFECT ON CARDS =====
    const tiltElements = document.querySelectorAll('[data-tilt]');

    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / centerY * -8;
            const rotateY = (x - centerX) / centerX * 8;

            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            el.style.transition = 'transform 0.1s ease';

            // Add dynamic highlight
            const shine = `radial-gradient(circle at ${x}px ${y}px, rgba(108, 99, 255, 0.08) 0%, transparent 60%)`;
            el.style.background = el.style.background || '';
            el.style.setProperty('--shine', shine);
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
            el.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });
    });

    // ===== COUNTER ANIMATION =====
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease out cubic
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(easeOut * target);
                
                counter.textContent = current;
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            }
            
            requestAnimationFrame(updateCounter);
        });
    }

    // ===== SKILL BAR ANIMATION =====
    function animateSkillBars() {
        const bars = document.querySelectorAll('.skill-progress');
        bars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width + '%';
        });
    }

    // ===== SCROLL REVEAL ANIMATION =====
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger specific animations
                if (entry.target.classList.contains('skills')) {
                    setTimeout(animateSkillBars, 300);
                }
                
                if (entry.target.classList.contains('hero')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);

    // Observe sections for reveal
    document.querySelectorAll('.section, .timeline-item').forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // Observe hero for counter animation
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        revealObserver.observe(heroSection);
        heroSection.classList.add('visible'); // Hero is immediately visible
    }

    // Trigger counter animation on load
    setTimeout(animateCounters, 1500);

    // ===== TIMELINE ANIMATION =====
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 200);
            }
        });
    }, { threshold: 0.3 });

    timelineItems.forEach(item => timelineObserver.observe(item));

    // ===== CONTACT FORM =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = contactForm.querySelector('.btn-primary');
            const originalHTML = btn.innerHTML;
            
            // Animate button
            btn.innerHTML = `<span>Sending...</span>`;
            btn.style.opacity = '0.7';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = `
                    <span>Message Sent! ✨</span>
                `;
                btn.style.opacity = '1';
                btn.style.background = 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)';

                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.style.background = '';
                    btn.disabled = false;
                    contactForm.reset();
                }, 3000);
            }, 1500);
        });
    }

    // ===== MAGNETIC BUTTONS =====
    document.querySelectorAll('.btn, .nav-cta').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // ===== PARALLAX ON MOUSE MOVE (Hero floating cards) =====
    const floatingCards = document.querySelectorAll('.floating-card');
    
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / width - 0.5) * 2;
        const y = (e.clientY / height - 0.5) * 2;

        floatingCards.forEach((card, index) => {
            const speed = (index + 1) * 8;
            const rotateAmount = (index + 1) * 2;
            card.style.transform = `translate(${x * speed}px, ${y * speed}px) rotate(${x * rotateAmount}deg)`;
        });
    });

    // ===== RIPPLE EFFECT ON BUTTONS =====
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                left: ${e.clientX - rect.left - size / 2}px;
                top: ${e.clientY - rect.top - size / 2}px;
                transform: scale(0);
                animation: rippleEffect 0.6s ease-out forwards;
                pointer-events: none;
            `;

            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple keyframe
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rippleEffect {
            to {
                transform: scale(2.5);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // ===== TEXT SCRAMBLE EFFECT ON HOVER =====
    const scrambleChars = '!<>-_\\/[]{}—=+*^?#________';
    
    document.querySelectorAll('.project-title').forEach(el => {
        const original = el.textContent;
        
        el.addEventListener('mouseenter', () => {
            let iteration = 0;
            const interval = setInterval(() => {
                el.textContent = original
                    .split('')
                    .map((char, index) => {
                        if (index < iteration) return original[index];
                        return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
                    })
                    .join('');
                
                iteration += 1 / 2;
                if (iteration >= original.length) {
                    clearInterval(interval);
                    el.textContent = original;
                }
            }, 30);
        });
    });

    // ===== SMOOTH PAGE LOAD =====
    window.addEventListener('load', () => {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        requestAnimationFrame(() => {
            document.body.style.opacity = '1';
        });
    });

    console.log('🚀 Portfolio loaded — Built with ❤️ by Ankit');

})();
