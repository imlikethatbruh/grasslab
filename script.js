const revealItems = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.14 });

revealItems.forEach((item) => revealObserver.observe(item));

const bookingForm = document.querySelector('#booking-form');

bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const details = new FormData(bookingForm);
  const subject = `GrassLab booking request from ${details.get('name')}`;
  const body = [
    `Name: ${details.get('name')}`,
    `Phone: ${details.get('phone')}`,
    `Service: ${details.get('service')}`,
    `Preferred date: ${details.get('date') || 'Flexible'}`,
    '',
    `Message: ${details.get('message') || 'No extra details provided.'}`
  ].join('\n');

  window.location.href = `mailto:shanegibson432@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  document.querySelector('#form-note').textContent = 'Your email app should open with the booking request ready to send.';
});