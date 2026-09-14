const revealItems = document.querySelectorAll('.reveal');

const serviceSelect = document.querySelector('select[name="service"]');
const stoneOption = document.createElement('option');
stoneOption.value = 'Stone laying';
stoneOption.textContent = 'Stone laying';
serviceSelect.append(stoneOption);

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

const wheelForm = document.querySelector('#wheel-form');
const prizeWheel = document.querySelector('#prize-wheel');
const wheelButton = document.querySelector('#wheel-button');
const wheelMessage = document.querySelector('#wheel-message');
const wheelResult = document.querySelector('#wheel-result');
const cooldownKey = 'grasslab-slot-last-spin';
const cooldownLength = 24 * 60 * 60 * 1000;
const reelValues = [5, 7, 9];
const wheelHeading = document.querySelector('.wheel-section h2');
const wheelIntro = document.querySelector('.wheel-layout > div > p');
wheelHeading.innerHTML = 'Try the<br><em>7s slot.</em>';
wheelIntro.textContent = 'Match three 7s for a free grass cut. You get one spin every 24 hours.';
prizeWheel.innerHTML = '<div class="slot-reel" data-reel="0">5</div><div class="slot-reel" data-reel="1">7</div><div class="slot-reel" data-reel="2">9</div>';

const winnerPopup = document.createElement('div');
winnerPopup.className = 'winner-popup';
        winnerPopup.innerHTML = '<div class="winner-card"><span class="winner-kicker">GrassLab jackpot</span><strong>7 7 7</strong><h3>CONGRATULATIONS!</h3><p>You won a free grass cut! Your details have been sent to GrassLab.</p><button type="button" class="button button-primary winner-close">Thank you <span>✓</span></button></div><div class="confetti" aria-hidden="true"></div>';
document.body.append(winnerPopup);
winnerPopup.querySelector('.winner-close').addEventListener('click', () => winnerPopup.classList.remove('show'));

const playBellSound = () => {
  const bellContext = new AudioContext();
  [880, 1320, 1760].forEach((frequency, index) => {
    const oscillator = bellContext.createOscillator();
    const gain = bellContext.createGain();
    const start = bellContext.currentTime + (index * 0.08);
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.18, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.1);
    oscillator.connect(gain);
    gain.connect(bellContext.destination);
    oscillator.start(start);
    oscillator.stop(start + 1.15);
  });
};

const confetti = winnerPopup.querySelector('.confetti');
for (let index = 0; index < 36; index += 1) {
  const piece = document.createElement('i');
  piece.style.setProperty('--x', `${Math.random() * 100}%`);
  piece.style.setProperty('--delay', `${Math.random() * 0.45}s`);
  piece.style.setProperty('--drift', `${(Math.random() - 0.5) * 180}px`);
  piece.style.setProperty('--spin', `${Math.random() * 720 - 360}deg`);
  confetti.append(piece);
}

const formatCountdown = (remaining) => {
  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const updateCooldown = () => {
  const lastSpin = Number(localStorage.getItem(cooldownKey));
  const remaining = cooldownLength - (Date.now() - lastSpin);
  if (lastSpin && remaining > 0) {
    wheelButton.disabled = true;
    wheelMessage.textContent = `Next spin available in ${formatCountdown(remaining)}`;
    return true;
  }
  wheelButton.disabled = false;
  wheelMessage.textContent = 'Your details are required to play.';
  return false;
};

updateCooldown();
window.setInterval(updateCooldown, 1000);

wheelForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (wheelButton.disabled) return;

  wheelButton.disabled = true;
  localStorage.setItem(cooldownKey, Date.now().toString());
  wheelMessage.textContent = 'Spinning... good luck.';
  const won = Math.floor(Math.random() * 1000) === 0;
  const results = won ? [7, 7, 7] : Array.from({ length: 3 }, () => reelValues[Math.floor(Math.random() * reelValues.length)]);
  if (!won && results.every((value) => value === 7)) results[2] = 5;
  prizeWheel.classList.remove('spinning');
  void prizeWheel.offsetWidth;
  prizeWheel.classList.add('spinning');

  window.setTimeout(() => {
    prizeWheel.querySelectorAll('.slot-reel').forEach((reel, index) => {
      reel.textContent = results[index];
    });
    if (won) {
      wheelResult.value = 'WINNER - free grass cut';
      wheelMessage.textContent = '777! You won a free grass cut.';
      wheelMessage.classList.add('winner');
      playBellSound();
      winnerPopup.classList.add('show');
      HTMLFormElement.prototype.submit.call(wheelForm);
      return;
    }

    wheelMessage.textContent = `Result: ${results.join(' ')}. Next spin available in 24:00:00.`;
  }, 2200);
});

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
const oneStarReaction = document.createElement('div');
oneStarReaction.className = 'one-star-reaction';
oneStarReaction.textContent = '🖕';
oneStarReaction.setAttribute('aria-label', 'One star reaction');
ratingLabel.after(oneStarReaction);
let ratingAudioContext;

const playRatingSound = (rating) => {
  ratingAudioContext ||= new AudioContext();
  const oscillator = ratingAudioContext.createOscillator();
  const gain = ratingAudioContext.createGain();
  const now = ratingAudioContext.currentTime;
  const pitch = 360 + (rating * 110);

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(pitch, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.12, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
  oscillator.connect(gain);
  gain.connect(ratingAudioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.3);
};

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
    playRatingSound(selectedRating);
    const celebration = document.querySelector('.rating-celebration');
    celebration.classList.toggle('show', selectedRating === 5);
    oneStarReaction.classList.toggle('show', selectedRating === 1);
    if (selectedRating === 5) {
      celebration.classList.remove('replay');
      void celebration.offsetWidth;
      celebration.classList.add('replay');
    }
  });
});

document.querySelector('.star-picker').addEventListener('mouseleave', () => {
  const selectedRating = Number(ratingValue.value);
  stars.forEach((item) => item.classList.toggle('active', Number(item.dataset.rating) <= selectedRating));
});
