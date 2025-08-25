(function () {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d', { alpha: true });
  let width = 0, height = 0, stars = [];
  
  // Bouncing text setup
  let spinEl, containerEl, velocityX = 180, velocityY = 140; // px/s
  let lastTs = 0;
  let posX = 0, posY = 0; // top-left position in px within container
  let textRect = { w: 0, h: 0 };
  const safetyMargin = 20; // px cushion to avoid clipping on right/bottom during tilt/scale

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initStars();
    // Update bounds for bouncing text
    // Bounce within the chrome body area
    containerEl = document.querySelector('.chrome-body');
    if (!spinEl) spinEl = document.querySelector('.headline .spin');
    if (spinEl) {
      textRect = { w: spinEl.offsetWidth, h: spinEl.offsetHeight };
      const hostW = containerEl.clientWidth;
      const hostH = containerEl.clientHeight;
      if (posX === 0 && posY === 0) {
        posX = Math.max(safetyMargin, (hostW - textRect.w) * 0.5);
        posY = Math.max(safetyMargin, (hostH - textRect.h) * 0.5);
      }
    }
  }

  function initStars() {
    const area = width * height;
    const density = 0.00012; // stars per px
    const target = Math.min(600, Math.max(120, Math.floor(area * density)));
    stars = new Array(target).fill(null).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 0.8 + 0.2,
      tw: Math.random() * 0.8 + 0.2,
    }));
  }

  function step(t) {
    // delta time
    if (!lastTs) lastTs = t;
    const dt = Math.min(0.05, (t - lastTs) / 1000);
    lastTs = t;

    // Starfield
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const size = s.z * 1.8;
      const alpha = 0.6 + Math.sin((t / 800) * s.tw + i) * 0.35;
      ctx.globalAlpha = Math.max(0.05, Math.min(1, alpha));
      ctx.fillStyle = '#bfe4ff';
      ctx.beginPath();
      ctx.arc(s.x, s.y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Bouncing text motion inside .chrome-body
    if (spinEl && containerEl) {
      const hostW = containerEl.clientWidth;
      const hostH = containerEl.clientHeight;
      // Recalculate occasionally in case fonts/layout shift
      textRect = { w: spinEl.offsetWidth, h: spinEl.offsetHeight };

      posX += velocityX * dt;
      posY += velocityY * dt;

      let bounced = false;
      if (posX <= safetyMargin || posX + textRect.w + safetyMargin >= hostW) {
        velocityX *= -1;
        posX = Math.max(safetyMargin, Math.min(hostW - textRect.w - safetyMargin, posX));
        bounced = true;
      }
      if (posY <= safetyMargin || posY + textRect.h + safetyMargin >= hostH) {
        velocityY *= -1;
        posY = Math.max(safetyMargin, Math.min(hostH - textRect.h - safetyMargin, posY));
        bounced = true;
      }

      const speed = Math.hypot(velocityX, velocityY);
      const tiltX = (velocityX / speed) * 12;
      const tiltY = (velocityY / speed) * -12;
      const squash = bounced ? 1.15 : 1.0;

      // Position via left/top so clamping matches visual edges precisely
      spinEl.style.left = `${posX}px`;
      spinEl.style.top = `${posY}px`;
      spinEl.style.transform = `perspective(600px) rotateX(${tiltY}deg) rotateY(${tiltX}deg) scale(${squash}, ${1 / squash})`;
    }

    requestAnimationFrame(step);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(step);

  // Button fun: small flash effect
  const btn = document.querySelector('.btn');
  if (btn) {
    btn.addEventListener('click', () => {
      btn.classList.add('flash');
      setTimeout(() => btn.classList.remove('flash'), 400);
    });
  }
})();


