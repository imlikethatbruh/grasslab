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

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=shanegibson432@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.open(gmailUrl, '_blank', 'noopener');
  document.querySelector('#form-note').textContent = 'Gmail should open in a new tab with the booking request ready to send.';
});