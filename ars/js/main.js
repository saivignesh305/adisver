
const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
const navbar = document.querySelector('#navbar');
const slider = document.querySelector('.slider');
const images = document.querySelectorAll('.slider img');


let index = 0;

setInterval(() => {
  index = (index + 1) % images.length;
  slider.style.transform = `translateX(${-index * 100}%)`;
}, 3000);


mobileNavToggle.addEventListener('click', () => {
    navbar.classList.toggle('active');
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        
            
            if (navbar.classList.contains('active')) {
                navbar.classList.remove('active');
            }
        }
    });
});


window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');
    
    let current = '';
     
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
         
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});


document.addEventListener('DOMContentLoaded', function() {

    emailjs.init("8L2Bpk7_VHG0Z5bXD");
    
    
    const contactForm = document.getElementById('contactForm');
    
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            
            const sendButton = document.getElementById('sendButton');
            const formStatus = document.getElementById('formStatus');
            
            sendButton.disabled = true;
            sendButton.textContent = 'Sending...';
            formStatus.textContent = '';
            
            
            const templateParams = {
                to_email: 'vaultarista@gmail.com',
                from_name: this.querySelector('input[name="name"]').value,
                from_email: this.querySelector('input[name="email"]').value,
                subject: this.querySelector('input[name="subject"]').value || 'Contact Form Message',
                message: this.querySelector('textarea[name="message"]').value
            };
            
            
            emailjs.send('service_v6dco15', 'template_48ltn9r', templateParams)
                .then(function() {
                    sendButton.disabled = false;
                    sendButton.textContent = 'Send Message';
                    formStatus.textContent = 'Your message has been sent successfully!';
                    formStatus.style.color = '#66cc00'; 
                    contactForm.reset();
                }, function(error) {
                    sendButton.disabled = false;
                    sendButton.textContent = 'Send Message';
                    formStatus.textContent = 'Error sending message. Please try again.';
                    formStatus.style.color = '#f8d7da';
                    console.error('EmailJS error:', error);
                });
        });
    }
});