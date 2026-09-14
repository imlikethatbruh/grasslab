const revealItems = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.14 });

revealItems.forEach((item) => revealObserver.observe(item));

const stars = document.querySelectorAll('.star');
const ratingValue = document.querySelector('#rating-value');
const ratingLabel = document.querySelector('#rating-label');

stars.forEach((star) => {
  star.addEventListener('mouseenter', () => {
    const previewRating = Number(star.dataset.rating);
    stars.forEach((item) => item.classList.toggle('active', Number(item.dataset.rating) <= previewRating));
  });

  star.addEventListener('click', () => {
    const selectedRating = Number(star.dataset.rating);
    ratingValue.value = selectedRating;
    ratingLabel.textContent = `${selectedRating} out of 5`;
    stars.forEach((item) => item.classList.toggle('active', Number(item.dataset.rating) <= selectedRating));
  });
});

document.querySelector('.star-picker').addEventListener('mouseleave', () => {
  const selectedRating = Number(ratingValue.value);
  stars.forEach((item) => item.classList.toggle('active', Number(item.dataset.rating) <= selectedRating));
});
