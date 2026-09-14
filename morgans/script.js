const animatedSections = document.querySelectorAll('.hero-content, .welcome, .section-heading, .service-list article, .reviews, .contact-grid');

const observer = new IntersectionObserver((entries, currentObserver) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    currentObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });

animatedSections.forEach((section) => {
  section.classList.add('reveal');
  observer.observe(section);
});
const enquiryForm = document.querySelector('.enquiry-form');
enquiryForm.addEventListener('submit', (event) => {
  event.preventDefault();
  window.location.href = 'tel:01259723991';
});
