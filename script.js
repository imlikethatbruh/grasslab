const revealItems = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.14 });

revealItems.forEach((item) => revealObserver.observe(item));

const statNumbers = document.querySelectorAll('.stat-number');
const statObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const number = entry.target;
    const target = Number(number.dataset.target);
    const startTime = performance.now();
    const duration = 900;

    const count = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      number.textContent = Math.round(progress * target);
      if (progress < 1) window.requestAnimationFrame(count);
    };

    window.requestAnimationFrame(count);
    observer.unobserve(number);
  });
}, { threshold: 0.7 });

statNumbers.forEach((number) => statObserver.observe(number));

const comparisonSlider = document.querySelector('#comparison-slider');
const comparisonRange = document.querySelector('#comparison-range');
const beforeImageWrap = comparisonSlider.querySelector('.before-image-wrap');
const beforeImage = beforeImageWrap.querySelector('.comparison-image');
const comparisonHandle = comparisonSlider.querySelector('.comparison-handle');

const updateComparison = (value) => {
  beforeImage.style.width = `${comparisonSlider.clientWidth}px`;
  beforeImageWrap.style.width = `${value}%`;
  comparisonHandle.style.left = `${value}%`;
};

comparisonRange.addEventListener('input', (event) => updateComparison(event.target.value));
comparisonSlider.addEventListener('click', (event) => {
  if (event.target === comparisonRange) return;
  const bounds = comparisonSlider.getBoundingClientRect();
  const value = ((event.clientX - bounds.left) / bounds.width) * 100;
  comparisonRange.value = Math.max(0, Math.min(100, value));
  updateComparison(comparisonRange.value);
});

window.addEventListener('resize', () => updateComparison(comparisonRange.value));
updateComparison(comparisonRange.value);

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
