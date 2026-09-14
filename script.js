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

  const mailtoUrl = `mailto:shanegibson432@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=shanegibson432@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const fallbackTimer = window.setTimeout(() => window.open(gmailUrl, '_blank', 'noopener'), 900);
  window.location.href = mailtoUrl;
  document.querySelector('#form-note').textContent = 'Opening your email app. Gmail will open in a new tab if no app is connected.';
  window.addEventListener('pagehide', () => window.clearTimeout(fallbackTimer), { once: true });
});