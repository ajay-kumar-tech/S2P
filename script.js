// Typing Animation with cursor effect
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    element.style.borderRight = '2px solid rgba(255, 255, 255, 0.8)';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Remove cursor after typing completes
            setTimeout(() => {
                element.style.borderRight = 'none';
            }, 500);
        }
    }
    
    type();
}

// Initialize typing animations when page loads
window.addEventListener('DOMContentLoaded', () => {
    const text1 = document.getElementById('typing-text-1');
    const text2 = document.getElementById('typing-text-2');
    
    // Start first typing animation after a short delay
    setTimeout(() => {
        typeWriter(text1, "Sry yrrr", 150);
    }, 1000);
    
    // Start second typing animation after first completes
    setTimeout(() => {
        typeWriter(text2, "Sch m duniya khtm hote huye nhi dekhna chahte hm", 100);
    }, 2500);
    
    // Handle background music - multiple attempts to autoplay
    const bgMusic = document.getElementById('bgMusic');
    if (bgMusic) {
        bgMusic.volume = 0.3; // Set volume to 30%
        bgMusic.loop = true;
        
        // Function to attempt playing music
        const attemptPlay = () => {
            if (musicPlayed) return; // Already playing
            
            const playPromise = bgMusic.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        musicPlayed = true;
                        console.log('Music started playing automatically');
                    })
                    .catch(error => {
                        console.log('Autoplay prevented. Will try again on user interaction.');
                    });
            }
        };
        
        // Try to play immediately
        attemptPlay();
        
        // Also try on window load (in case DOMContentLoaded was too early)
        if (document.readyState === 'loading') {
            window.addEventListener('load', () => {
                setTimeout(attemptPlay, 100);
            });
        } else {
            // Document already loaded, try immediately
            setTimeout(attemptPlay, 200);
        }
    }
    
    // Add parallax effect to particles
    initParallax();
});

// Parallax scrolling effect
function initParallax() {
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        sections.forEach((section, index) => {
            if (section.classList.contains('landing-section')) {
                const particles = section.querySelectorAll('.particle');
                particles.forEach((particle, i) => {
                    const speed = 0.5 + (i * 0.1);
                    const yPos = -(scrolled * speed);
                    particle.style.transform = `translateY(${yPos}px)`;
                });
            }
        });
    }, { passive: true });
}

// Enhanced Scroll Animation - Reveal sections on scroll
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Add staggered animation for child elements
            const children = entry.target.querySelectorAll('.video-wrapper, .final-text, .new-year-text');
            children.forEach((child, i) => {
                setTimeout(() => {
                    child.style.opacity = '1';
                    child.style.transform = 'translateY(0)';
                }, i * 200);
            });
        }
    });
}, observerOptions);

// Observe all sections for scroll animation
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.shayari-section, .message-section, .strength-section, .photo-section, .video-section, .final-section');
    
    sections.forEach(section => {
        observer.observe(section);
    });
});

// Smooth scroll for better user experience
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Handle music autoplay on user interaction (fallback if autoplay was blocked)
let musicPlayed = false;
const playMusic = () => {
    const bgMusic = document.getElementById('bgMusic');
    if (bgMusic) {
        // Check if music is already playing
        if (!bgMusic.paused && bgMusic.currentTime > 0) {
            musicPlayed = true;
            return;
        }
        
        if (!musicPlayed) {
            bgMusic.play().then(() => {
                musicPlayed = true;
                console.log('Music started via user interaction');
            }).catch(error => {
                console.log('Music play failed:', error);
            });
        }
    }
};

// Try to play music on various user interactions (fallback)
document.addEventListener('click', playMusic, { once: true });
document.addEventListener('scroll', playMusic, { once: true });
document.addEventListener('touchstart', playMusic, { once: true });
document.addEventListener('touchend', playMusic, { once: true });

// Add scroll-based animations
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add subtle parallax to sections
    const sections = document.querySelectorAll('section:not(.landing-section)');
    sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top < windowHeight && rect.bottom > 0) {
            const progress = (windowHeight - rect.top) / windowHeight;
            const parallaxValue = (progress - 0.5) * 20;
            section.style.transform = `translateY(${parallaxValue * 0.1}px)`;
        }
    });
    
    lastScrollTop = scrollTop;
}, { passive: true });

// Add floating animation to strength text on hover/touch
document.addEventListener('DOMContentLoaded', () => {
    const strengthTexts = document.querySelectorAll('.strength-text');
    
    strengthTexts.forEach(text => {
        // Desktop hover
        text.addEventListener('mouseenter', () => {
            text.style.animation = 'strengthFloat 0.6s ease forwards';
        });
        
        text.addEventListener('mouseleave', () => {
            text.style.animation = '';
        });
        
        // Mobile touch
        text.addEventListener('touchstart', () => {
            text.style.animation = 'strengthFloat 0.6s ease forwards';
        });
    });
});

// Add CSS animation for strength float
const style = document.createElement('style');
style.textContent = `
    @keyframes strengthFloat {
        0% { transform: scale(1) translateY(0); }
        50% { transform: scale(1.1) translateY(-10px); }
        100% { transform: scale(1.05) translateY(-5px); }
    }
`;
document.head.appendChild(style);

// Performance optimization: Use requestAnimationFrame for scroll events
let ticking = false;
function updateOnScroll() {
    // Scroll-based animations handled here
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateOnScroll);
        ticking = true;
    }
}, { passive: true });

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    
    // Add entrance animation to first section
    const landing = document.querySelector('.landing-section');
    if (landing) {
        landing.style.animation = 'fadeIn 1s ease-in';
    }
});

// Mobile-specific optimizations
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // Reduce animation complexity on mobile for better performance
    document.documentElement.style.setProperty('--animation-duration', '0.8s');
    
    // Disable hover effects on mobile
    document.addEventListener('touchstart', () => {}, { passive: true });
}
