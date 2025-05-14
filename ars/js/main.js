

document.addEventListener('DOMContentLoaded', function() {
    
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navbar = document.querySelector('#navbar');
    
    if (mobileNavToggle && navbar) {
        mobileNavToggle.addEventListener('click', () => {
            navbar.classList.toggle('active');
           
            const icon = mobileNavToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }
    
    
    const slider = document.querySelector('.slider');
    const images = document.querySelectorAll('.slider img');
    
    if (slider && images.length > 0) {
        let index = 0;
        let startX, moveX;
        let isSliding = false;
        
        
        const startAutoSlide = () => {
            return setInterval(() => {
                if (!isSliding) {
                    index = (index + 1) % images.length;
                    updateSliderPosition();
                }
            }, 3000);
        };
        
        let autoSlideInterval = startAutoSlide();
        
        const updateSliderPosition = () => {
            slider.style.transform = `translateX(${-index * 100}%)`;
        };
        
        
        slider.addEventListener('touchstart', (e) => {
            isSliding = true;
            startX = e.touches[0].clientX;
            clearInterval(autoSlideInterval);
        }, {passive: true});
        
        slider.addEventListener('touchmove', (e) => {
            if (isSliding) {
                moveX = e.touches[0].clientX;
                const diff = (startX - moveX) / slider.offsetWidth * 100;
                const transform = -index * 100 - diff;
                
                
                if (Math.abs(diff) < 100) {
                    slider.style.transform = `translateX(${transform}%)`;
                }
            }
        }, {passive: true});
        
        slider.addEventListener('touchend', (e) => {
            if (isSliding && startX && moveX) {
                const diff = startX - moveX;
                
                if (diff > 50 && index < images.length - 1) {
                    
                    index++;
                } else if (diff < -50 && index > 0) {
                    
                    index--;
                }
                
                updateSliderPosition();
                startX = null;
                moveX = null;
                isSliding = false;
                
                
                autoSlideInterval = startAutoSlide();
            }
        }, {passive: true});
    }
    
    
    const headerHeight = document.querySelector('header')?.offsetHeight || 80;
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Skip if it's just a hash
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Calculate position accounting for header height and some padding
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                if (navbar && navbar.classList.contains('active')) {
                    navbar.classList.remove('active');
                    
                    const icon = mobileNavToggle?.querySelector('i');
                    if (icon) {
                        icon.classList.add('fa-bars');
                        icon.classList.remove('fa-times');
                    }
                }
            }
        });
    });
    
    // Active navigation highlighting based on scroll position
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav ul li a');
        
        if (sections.length === 0 || navLinks.length === 0) return;
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - (headerHeight + 50);
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // EmailJS contact form handling with improved error handling and validation
    if (typeof emailjs !== 'undefined') {
        emailjs.init("8L2Bpk7_VHG0Z5bXD");
        
        const contactForm = document.getElementById('contactForm');
        
        if (contactForm) {
            // Simple form validation
            const validateForm = (form) => {
                const email = form.querySelector('input[name="email"]').value;
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                
                if (!emailRegex.test(email)) {
                    return "Please enter a valid email address";
                }
                
                const message = form.querySelector('textarea[name="message"]').value;
                if (message.trim().length < 10) {
                    return "Message is too short. Please provide more details.";
                }
                
                return null; // No errors
            };
            
            contactForm.addEventListener('submit', function(event) {
                event.preventDefault();
                
                const sendButton = document.getElementById('sendButton');
                const formStatus = document.getElementById('formStatus');
                
                // Clear previous status
                formStatus.textContent = '';
                
                // Validate form
                const validationError = validateForm(this);
                if (validationError) {
                    formStatus.textContent = validationError;
                    formStatus.style.color = '#f8d7da';
                    return;
                }
                
                // Update button state
                sendButton.disabled = true;
                sendButton.textContent = 'Sending...';
                
                // Prepare email parameters
                const templateParams = {
                    to_email: 'vaultarista@gmail.com',
                    from_name: this.querySelector('input[name="name"]').value,
                    from_email: this.querySelector('input[name="email"]').value,
                    subject: this.querySelector('input[name="subject"]').value || 'Contact Form Message',
                    message: this.querySelector('textarea[name="message"]').value
                };
                
                // Send the email
                emailjs.send('service_v6dco15', 'template_48ltn9r', templateParams)
                    .then(function() {
                        sendButton.disabled = false;
                        sendButton.textContent = 'Send Message';
                        formStatus.textContent = 'Your message has been sent successfully!';
                        formStatus.style.color = '#66cc00';
                        contactForm.reset();
                    })
                    .catch(function(error) {
                        sendButton.disabled = false;
                        sendButton.textContent = 'Send Message';
                        formStatus.textContent = 'Error sending message. Please try again.';
                        formStatus.style.color = '#f8d7da';
                        console.error('EmailJS error:', error);
                    });
            });
        }
    }
    
    
    const lazyLoadImages = () => {
        
        if (slider) {
            const viewportWidth = window.innerWidth;
            if (viewportWidth < 768) {
                
                slider.style.height = '289px';
            } else {
                slider.style.height = 'auto';
            }
        }
    };
    
    // Initial call and window resize event
    lazyLoadImages();
    window.addEventListener('resize', lazyLoadImages);
    
    // Fix for product cards on small screens
    const adjustProductCards = () => {
        const productCards = document.querySelectorAll('.product-card');
        const viewportWidth = window.innerWidth;
        
        productCards.forEach(card => {
            const image = card.querySelector('.product-image');
            if (image) {
                if (viewportWidth < 480) {
                    image.style.height = '200px';
                } else if (viewportWidth < 768) {
                    image.style.height = '250px';
                } else {
                    image.style.height = '350px';
                }
            }
        });
    };
    
    // Initial call and window resize event
    adjustProductCards();
    window.addEventListener('resize', adjustProductCards);
});