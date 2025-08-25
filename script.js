(function () {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d', { alpha: true });
  let width = 0, height = 0, stars = [];
  
  // Bouncing text setup
  let spinEl, containerEl, velocityX = 180, velocityY = 140; // px/s
  let lastTs = 0;
  let posX = 0, posY = 0; // top-left position in px within container
  let textRect = { w: 0, h: 0 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initStars();
    // Update bounds for bouncing text
    // Bounce across the viewport
    containerEl = document.documentElement;
    if (!spinEl) spinEl = document.querySelector('.headline .spin');
    if (spinEl) {
      textRect = { w: spinEl.offsetWidth, h: spinEl.offsetHeight };
      const hostW = window.innerWidth;
      const hostH = window.innerHeight;
      if (posX === 0 && posY === 0) {
        posX = (hostW - textRect.w) * 0.5;
        posY = (hostH - textRect.h) * 0.5;
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
      const hostW = window.innerWidth;
      const hostH = window.innerHeight;
      if (textRect.w === 0 || textRect.h === 0) {
        textRect = { w: spinEl.offsetWidth, h: spinEl.offsetHeight };
      }

      posX += velocityX * dt;
      posY += velocityY * dt;

      let bounced = false;
      if (posX <= 0 || posX + textRect.w >= hostW) {
        velocityX *= -1;
        posX = Math.max(0, Math.min(hostW - textRect.w, posX));
        bounced = true;
      }
      if (posY <= 0 || posY + textRect.h >= hostH) {
        velocityY *= -1;
        posY = Math.max(0, Math.min(hostH - textRect.h, posY));
        bounced = true;
      }

      const speed = Math.hypot(velocityX, velocityY);
      const tiltX = (velocityX / speed) * 12;
      const tiltY = (velocityY / speed) * -12;
      const squash = bounced ? 1.15 : 1.0;

      spinEl.style.transform = `translate(${posX}px, ${posY}px) perspective(600px) rotateX(${tiltY}deg) rotateY(${tiltX}deg) scale(${squash}, ${1 / squash})`;
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


