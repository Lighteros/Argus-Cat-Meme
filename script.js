(() => {
  const field = document.getElementById("field");
  const glow = document.querySelector(".cursor-glow");
  const nav = document.querySelector(".nav");
  const menuBtn = document.getElementById("menu-btn");
  const links = document.getElementById("nav-links");

  const ctx = field.getContext("2d");
  const motes = [];
  const watchers = [];

  const resize = () => {
    field.width = window.innerWidth;
    field.height = window.innerHeight;
  };

  const seed = () => {
    motes.length = 0;
    watchers.length = 0;
    const count = Math.min(90, Math.floor((field.width * field.height) / 18000));
    for (let i = 0; i < count; i += 1) {
      motes.push({
        x: Math.random() * field.width,
        y: Math.random() * field.height,
        r: Math.random() * 1.6 + 0.3,
        a: Math.random() * 0.45 + 0.08,
        s: Math.random() * 0.25 + 0.05,
        hue: Math.random() > 0.82 ? "240,161,90" : "201,184,255",
      });
    }
    for (let i = 0; i < 7; i += 1) {
      watchers.push({
        x: Math.random() * field.width,
        y: Math.random() * field.height,
        r: Math.random() * 7 + 5,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        blink: Math.random() * Math.PI * 2,
      });
    }
  };

  const draw = () => {
    ctx.clearRect(0, 0, field.width, field.height);
    motes.forEach((mote) => {
      mote.y -= mote.s;
      if (mote.y < -4) {
        mote.y = field.height + 4;
        mote.x = Math.random() * field.width;
      }
      ctx.beginPath();
      ctx.fillStyle = `rgba(${mote.hue},${mote.a})`;
      ctx.arc(mote.x, mote.y, mote.r, 0, Math.PI * 2);
      ctx.fill();
    });

    watchers.forEach((orb) => {
      orb.x += orb.vx;
      orb.y += orb.vy;
      orb.blink += 0.02;
      if (orb.x < 20 || orb.x > field.width - 20) orb.vx *= -1;
      if (orb.y < 20 || orb.y > field.height - 20) orb.vy *= -1;
      const lid = 0.35 + Math.abs(Math.sin(orb.blink)) * 0.65;
      const gradient = ctx.createRadialGradient(orb.x - 2, orb.y - 2, 1, orb.x, orb.y, orb.r);
      gradient.addColorStop(0, "rgba(255,255,255,0.95)");
      gradient.addColorStop(0.35, "rgba(139,116,242,0.9)");
      gradient.addColorStop(1, "rgba(20,16,48,0.1)");
      ctx.save();
      ctx.translate(orb.x, orb.y);
      ctx.scale(1, lid);
      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.arc(0, 0, orb.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(draw);
  };

  resize();
  seed();
  draw();
  window.addEventListener("resize", () => {
    resize();
    seed();
  });

  window.addEventListener("pointermove", (event) => {
    glow.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
  });

  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("open"));
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-in");
      });
    },
    { threshold: 0.16 }
  );
  document.querySelectorAll(".reveal").forEach((node) => io.observe(node));
})();
