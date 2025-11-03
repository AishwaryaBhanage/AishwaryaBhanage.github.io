// Interactive Network Background
class NetworkBackground {
    constructor() {
        this.canvas = document.getElementById('network-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.particleCount = 80;
        this.maxDistance = 120;
        
        this.init();
        this.animate();
        this.bindEvents();
    }
    
    init() {
        this.resize();
        this.createParticles();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 1.2,
                vy: (Math.random() - 0.5) * 1.2,
                size: Math.random() * 2 + 1,
                baseVx: (Math.random() - 0.5) * 0.8,
                baseVy: (Math.random() - 0.5) * 0.8
            });
        }
    }
    
    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update particles
        this.particles.forEach(particle => {
            // Continuous base movement
            particle.vx += particle.baseVx * 0.02;
            particle.vy += particle.baseVy * 0.02;
            
            // Mouse attraction (optional enhancement)
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const force = (150 - distance) / 150;
                particle.vx += (dx / distance) * force * 0.015;
                particle.vy += (dy / distance) * force * 0.015;
            }
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Boundary check with bounce
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -0.8;
                particle.baseVx *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -0.8;
                particle.baseVy *= -1;
            }
            
            // Keep particles in bounds
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            
            // Gentle friction to prevent excessive speed
            particle.vx *= 0.98;
            particle.vy *= 0.98;
            
            // Maintain minimum movement
            if (Math.abs(particle.vx) < 0.1) particle.vx += particle.baseVx * 0.1;
            if (Math.abs(particle.vy) < 0.1) particle.vy += particle.baseVy * 0.1;
        });
        
        // Draw connections
        this.ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.maxDistance) {
                    const opacity = (this.maxDistance - distance) / this.maxDistance;
                    this.ctx.strokeStyle = `rgba(59, 130, 246, ${opacity * 0.3})`;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
        
        // Draw particles
        this.ctx.fillStyle = 'rgba(139, 92, 246, 0.8)';
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize network background when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NetworkBackground();
});

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');

        // Skip if href is just '#' or invalid
        if (!href || href === '#' || href.length <= 1) {
            return;
        }

        try {
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        } catch (error) {
            console.warn('Invalid selector:', href);
        }
    });
});

// Project filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        projectCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all sections for animations
document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
});

// Hero chart animation
function createHeroChart() {
    const ctx = document.getElementById('heroChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Data Insights',
                data: [65, 78, 90, 81, 95, 88],
                borderColor: '#fbbf24',
                backgroundColor: 'rgba(251, 191, 36, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#fbbf24',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    display: false
                },
                y: {
                    display: false
                }
            },
            elements: {
                point: {
                    hoverRadius: 8
                }
            }
        }
    });
}

// Contact form handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Simple validation
        if (!data.name || !data.email || !data.message) {
            alert('Please fill in all required fields.');
            return;
        }

        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            alert('Thank you for your message! I\'ll get back to you soon.');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = '#000000';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.5)';
    } else {
        navbar.style.background = '#000000';
        navbar.style.boxShadow = 'none';
    }
});

// Initialize chart when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(createHeroChart, 500);
});

// Typing animation for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Initialize typing animation
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 80);
        }, 1000);
    }
});

// Skills animation on scroll
const skillCategories = document.querySelectorAll('.skill-category');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 200);
        }
    });
}, { threshold: 0.3 });

skillCategories.forEach(category => {
    category.style.opacity = '0';
    category.style.transform = 'translateY(30px)';
    category.style.transition = 'all 0.6s ease';
    skillObserver.observe(category);
});

// Achievement cards animation
const achievementCards = document.querySelectorAll('.achievement-card');
const achievementObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
            }, index * 150);
        }
    });
}, { threshold: 0.3 });

achievementCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px) scale(0.9)';
    card.style.transition = 'all 0.6s ease';
    achievementObserver.observe(card);
});

// Interactive Timeline Animation - Sequential Pop-in Effect
const timelineEntries = document.querySelectorAll('.timeline-entry');

// Initialize all timeline entries as hidden
timelineEntries.forEach((entry, index) => {
    const side = entry.getAttribute('data-side');
    const card = entry.querySelector('.timeline-card');
    const icon = entry.querySelector('.timeline-icon');

    // Set initial hidden state
    entry.style.opacity = '0';
    entry.style.transform = 'translateY(60px)';

    // Set initial card position based on side
    if (side === 'left') {
        card.style.transform = 'translateX(-80px)';
    } else {
        card.style.transform = 'translateX(80px)';
    }

    // Set initial icon state
    icon.style.transform = 'translateX(-50%) scale(0.3)';
    icon.style.opacity = '0';
});

// Individual timeline entry observer for sequential animation
const timelineEntryObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const timelineEntry = entry.target;

            // Only animate if not already animated
            if (!timelineEntry.classList.contains('animate-in')) {
                animateTimelineEntry(timelineEntry);
            }
        }
    });
}, {
    threshold: 0.4,
    rootMargin: '0px 0px -100px 0px'
});

function animateTimelineEntry(entry) {
    const side = entry.getAttribute('data-side');
    const card = entry.querySelector('.timeline-card');
    const icon = entry.querySelector('.timeline-icon');

    // Add animate-in class
    entry.classList.add('animate-in');

    // Animate the entry container
    entry.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
    entry.style.opacity = '1';
    entry.style.transform = 'translateY(0)';

    // Animate the card with a slight delay
    setTimeout(() => {
        card.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        card.style.transform = 'translateX(0)';
    }, 200);

    // Animate the icon with bounce effect
    setTimeout(() => {
        icon.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        icon.style.transform = 'translateX(-50%) scale(1)';
        icon.style.opacity = '1';

        // Add a subtle pop effect
        setTimeout(() => {
            icon.style.transform = 'translateX(-50%) scale(1.1)';
            setTimeout(() => {
                icon.style.transform = 'translateX(-50%) scale(1)';
            }, 150);
        }, 300);
    }, 400);

    // Animate skill pills after card is in place
    setTimeout(() => {
        const skillPills = entry.querySelectorAll('.skill-pill');
        skillPills.forEach((pill, index) => {
            setTimeout(() => {
                pill.style.opacity = '1';
                pill.style.transform = 'translateY(0) scale(1)';
            }, index * 80);
        });
    }, 800);
}

// Observe each timeline entry individually
timelineEntries.forEach(entry => {
    timelineEntryObserver.observe(entry);
});

// Enhanced card hover effects
timelineEntries.forEach(entry => {
    const card = entry.querySelector('.timeline-card');
    const skillPills = entry.querySelectorAll('.skill-pill');

    card.addEventListener('mouseenter', () => {
        // Animate skill pills on card hover
        skillPills.forEach((pill, index) => {
            setTimeout(() => {
                pill.style.transform = 'translateY(-2px) scale(1.05)';
                pill.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.3)';
            }, index * 50);
        });
    });

    card.addEventListener('mouseleave', () => {
        skillPills.forEach(pill => {
            pill.style.transform = 'translateY(0) scale(1)';
            pill.style.boxShadow = '0 0 10px rgba(59, 130, 246, 0.1)';
        });
    });
});

// Education & Experience Animation - Simplified
const simpleCards = document.querySelectorAll('.simple-card');
const simpleObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, { threshold: 0.3 });

simpleCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.5s ease';
    simpleObserver.observe(card);
});



// Dynamic Typing Animation for Hero Subtitle
const roles = [
    "Data Scientist",
    "Machine Learning Engineer",
    "Data Analyst",
    "Tableau Developer",
    "AI Engineer",
    "Data Engineer"
];

let currentRoleIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
let typingSpeed = 100;
let isTypingActive = false;

function typeRole() {
    const typingElement = document.getElementById('typing-text');
    const cursorElement = document.querySelector('.typing-cursor');

    if (!typingElement || !cursorElement) return;

    const currentRole = roles[currentRoleIndex];

    // Remove blinking class during active typing/deleting
    cursorElement.classList.remove('blink');
    cursorElement.style.opacity = '1';

    if (isDeleting) {
        // Deleting characters
        const currentText = currentRole.substring(0, currentCharIndex - 1);
        typingElement.textContent = currentText;
        currentCharIndex--;
        typingSpeed = 50; // Faster deletion

        if (currentCharIndex === 0) {
            isDeleting = false;
            currentRoleIndex = (currentRoleIndex + 1) % roles.length;
            typingSpeed = 500; // Pause before typing next role
        }
    } else {
        // Typing characters
        const currentText = currentRole.substring(0, currentCharIndex + 1);
        typingElement.textContent = currentText;
        currentCharIndex++;
        typingSpeed = Math.random() * 100 + 80; // Vary typing speed for natural feel

        if (currentCharIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause when role is complete

            // Add blinking animation when paused
            cursorElement.classList.add('blink');
        }
    }

    setTimeout(typeRole, typingSpeed);
}

// Enhanced cursor positioning
function updateCursorPosition() {
    const typingElement = document.getElementById('typing-text');
    const cursorElement = document.querySelector('.typing-cursor');

    if (!typingElement || !cursorElement) return;

    // Ensure cursor appears right after the text
    const textWidth = typingElement.offsetWidth;
    cursorElement.style.marginLeft = '2px';
}

// Start typing animation when page loads
document.addEventListener('DOMContentLoaded', () => {
    const cursorElement = document.querySelector('.typing-cursor');

    if (cursorElement) {
        // Start with cursor visible and blinking
        cursorElement.style.opacity = '1';
        cursorElement.classList.add('blink');
    }

    setTimeout(() => {
        // Stop initial blinking and start typing
        if (cursorElement) {
            cursorElement.classList.remove('blink');
        }
        isTypingActive = true;
        typeRole();
    }, 1500); // Start after 1.5 seconds

    // Update cursor position on window resize
    window.addEventListener('resize', updateCursorPosition);
});

// Enhanced Timeline Interactions
document.addEventListener('DOMContentLoaded', () => {
    // Initialize skill pills as hidden for animation
    timelineEntries.forEach(entry => {
        const skillPills = entry.querySelectorAll('.skill-pill');
        skillPills.forEach((pill, index) => {
            pill.style.opacity = '0';
            pill.style.transform = 'translateY(15px) scale(0.8)';
            pill.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            pill.style.setProperty('--pill-index', index);
        });
    });

    // Add click handlers for timeline icons to add active state
    timelineEntries.forEach(entry => {
        const icon = entry.querySelector('.timeline-icon');
        const card = entry.querySelector('.timeline-card');

        icon.addEventListener('click', () => {
            // Remove active class from all icons
            document.querySelectorAll('.timeline-icon').forEach(i => i.classList.remove('active'));
            // Add active class to clicked icon
            icon.classList.add('active');

            // Scroll to the card smoothly
            card.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        });
    });

    // Add keyboard navigation for timeline
    timelineEntries.forEach((entry, index) => {
        const card = entry.querySelector('.timeline-card');
        card.setAttribute('tabindex', '0');

        card.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' && index < timelineEntries.length - 1) {
                timelineEntries[index + 1].querySelector('.timeline-card').focus();
            } else if (e.key === 'ArrowUp' && index > 0) {
                timelineEntries[index - 1].querySelector('.timeline-card').focus();
            }
        });
    });
});

// Parallax effect for timeline line
window.addEventListener('scroll', () => {
    const timelineSection = document.querySelector('.timeline-journey');
    const timelineLine = document.querySelector('.timeline-line');

    if (timelineSection && timelineLine) {
        const rect = timelineSection.getBoundingClientRect();
        const scrollProgress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));

        // Animate the timeline line height based on scroll progress
        timelineLine.style.transform = `translateX(-50%) scaleY(${scrollProgress})`;
        timelineLine.style.transformOrigin = 'top center';
    }
});

// Add smooth reveal animation for timeline entries as user scrolls
const revealTimelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const timelineEntry = entry.target;
            const icon = timelineEntry.querySelector('.timeline-icon');

            // Add reveal class with delay
            setTimeout(() => {
                timelineEntry.classList.add('revealed');
                if (icon) {
                    icon.classList.add('active');

                    // Remove active class after animation
                    setTimeout(() => {
                        icon.classList.remove('active');
                    }, 1500);
                }
            }, 200);
        }
    });
}, {
    threshold: 0.6,
    rootMargin: '0px 0px -20% 0px'
});

// Observe each timeline entry for reveal animations
timelineEntries.forEach(entry => {
    revealTimelineObserver.observe(entry);
});

// Skills Tab Functionality
document.addEventListener('DOMContentLoaded', () => {
    const skillTabs = document.querySelectorAll('.skill-tab');
    const skillContents = document.querySelectorAll('.skill-content');

    // Initialize skill items with animation delays
    skillContents.forEach(content => {
        const skillItems = content.querySelectorAll('.skill-item');
        skillItems.forEach((item, index) => {
            item.style.setProperty('--item-index', index);
        });
    });

    // Initialize first tab as active
    if (skillTabs.length > 0 && skillContents.length > 0) {
        skillTabs[0].classList.add('active');
        skillContents[0].classList.add('active');
        
        // Trigger initial animation
        setTimeout(() => {
            const firstContent = skillContents[0];
            const skillItems = firstContent.querySelectorAll('.skill-item');
            skillItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 300);
    }

    // Add click event listeners to skill tabs
    skillTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetCategory = tab.getAttribute('data-category');

            // Remove active class from all tabs and contents
            skillTabs.forEach(t => t.classList.remove('active'));
            skillContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab with haptic feedback
            tab.classList.add('active');
            
            // Add subtle vibration for mobile devices
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }

            // Show corresponding content with animation
            const targetContent = document.getElementById(targetCategory);
            if (targetContent) {
                targetContent.classList.add('active');
                
                // Animate skill items with staggered delay
                const skillItems = targetContent.querySelectorAll('.skill-item');
                skillItems.forEach((item, index) => {
                    // Reset animation
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    
                    // Trigger animation with delay
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 80 + 200);
                });
            }
        });
    });

    // Add keyboard navigation for accessibility
    skillTabs.forEach((tab, index) => {
        tab.setAttribute('tabindex', '0');
        tab.setAttribute('role', 'tab');
        
        tab.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' && index < skillTabs.length - 1) {
                e.preventDefault();
                skillTabs[index + 1].click();
                skillTabs[index + 1].focus();
            } else if (e.key === 'ArrowLeft' && index > 0) {
                e.preventDefault();
                skillTabs[index - 1].click();
                skillTabs[index - 1].focus();
            } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                tab.click();
            }
        });
    });

    // Add intersection observer for skills section animation
    const skillsSection = document.querySelector('#skills');
    if (skillsSection) {
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add entrance animation to tabs
                    skillTabs.forEach((tab, index) => {
                        setTimeout(() => {
                            tab.style.opacity = '1';
                            tab.style.transform = 'translateY(0) scale(1)';
                        }, index * 100);
                    });
                    
                    // Add entrance animation to content area
                    setTimeout(() => {
                        const contentArea = document.querySelector('.skill-content-area');
                        if (contentArea) {
                            contentArea.style.opacity = '1';
                            contentArea.style.transform = 'translateY(0)';
                        }
                    }, skillTabs.length * 100 + 200);
                }
            });
        }, { threshold: 0.3 });

        skillsObserver.observe(skillsSection);

        // Initialize hidden state for animation
        skillTabs.forEach(tab => {
            tab.style.opacity = '0';
            tab.style.transform = 'translateY(30px) scale(0.9)';
            tab.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });

        const contentArea = document.querySelector('.skill-content-area');
        if (contentArea) {
            contentArea.style.opacity = '0';
            contentArea.style.transform = 'translateY(40px)';
            contentArea.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }
    }
});