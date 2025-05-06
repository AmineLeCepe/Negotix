document.addEventListener('DOMContentLoaded', function() {
  function updateCountdowns() {
    const timers = document.querySelectorAll('.auction-card__timer');
    timers.forEach(function(timer) {
      const deadline = parseInt(timer.getAttribute('data-deadline'), 10);
      const now = Date.now();
      let diff = deadline - now;
      if (diff < 0) diff = 0;
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      timer.textContent = `${hours}h ${minutes}m ${seconds}s`;
      if (diff === 0) {
        timer.textContent = 'Ended';
      }
    });
  }
  updateCountdowns();
  setInterval(updateCountdowns, 1000);
});
