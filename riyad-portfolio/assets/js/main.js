(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
  const body = document.body;
  body.classList.add("js");

  // A short loader never blocks the non-JavaScript page.
  const loader = $("#loader");
  if (loader && !reduced.matches && document.readyState !== "complete") {
    loader.hidden = false;
    const removeLoader = () => { loader.hidden = true; };
    window.addEventListener("load", removeLoader, { once: true });
    setTimeout(removeLoader, 1800);
  }

  // Mobile navigation.
  const toggle = $("#menuToggle");
  const navigation = $("#navigation");
  const setMenu = (open) => {
    if (!toggle || !navigation) return;
    navigation.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  };
  toggle?.addEventListener("click", () => {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });
  navigation?.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle?.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      toggle.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest("#header")) setMenu(false);
  });
  matchMedia("(min-width: 721px)").addEventListener("change", () => setMenu(false));

  // Scroll progress and sticky header.
  let scheduled = false;
  function updateScroll() {
    const top = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    $("#header")?.classList.toggle("scrolled", top > 24);
    const progress = $("#progress");
    if (progress) progress.style.transform = `scaleX(${max > 0 ? top / max : 0})`;
    const back = $("#backToTop");
    if (back) back.hidden = top < 500;
    scheduled = false;
  }
  window.addEventListener("scroll", () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(updateScroll);
    }
  }, { passive: true });
  window.addEventListener("resize", updateScroll);
  updateScroll();

  // Active navigation observes the home-page sections only.
  const sections = $$("main > section[id]").filter((section) => section.id !== "home");
  if ("IntersectionObserver" in window && sections.length) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      $$("#navigation a").forEach((link) => {
        if (new URL(link.href).hash === `#${visible.target.id}`) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    }, { rootMargin: "-15% 0px -45% 0px", threshold: [0, .1, .3] });
    sections.forEach((section) => observer.observe(section));
  }

  // Progressive enhancement: content stays visible if observers are unavailable.
  if (!reduced.matches && "IntersectionObserver" in window) {
    body.classList.add("motion");
    const reveal = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          reveal.unobserve(entry.target);
        }
      });
    }, { threshold: .08 });
    $$(".fade-in").forEach((element) => reveal.observe(element));

    const counters = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const element = entry.target;
        const target = Number(element.dataset.target);
        const start = performance.now();
        function tick(time) {
          const progress = Math.min((time - start) / 1100, 1);
          element.textContent = Math.round(target * (1 - (1 - progress) ** 3));
          if (progress < 1 && !reduced.matches) requestAnimationFrame(tick);
          else element.textContent = target;
        }
        requestAnimationFrame(tick);
        counters.unobserve(element);
      });
    }, { threshold: .5 });
    $$("[data-target]").forEach((element) => counters.observe(element));
  }

  // Typewriter uses the roles from Hugo's configuration.
  const typewriter = $("#typewriter");
  let typeTimer;
  let roles = [];
  try { roles = JSON.parse(body.dataset.roles || "[]"); } catch {}
  let roleIndex = 0;
  let character = 0;
  let deleting = false;
  function type() {
    if (!typewriter || !roles.length || reduced.matches) return;
    const role = roles[roleIndex];
    character += deleting ? -1 : 1;
    typewriter.textContent = role.slice(0, character);
    let delay = deleting ? 35 : 70;
    if (!deleting && character === role.length) {
      deleting = true;
      delay = 1700;
    } else if (deleting && character === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 350;
    }
    typeTimer = setTimeout(type, delay);
  }
  if (typewriter && roles.length && !reduced.matches) type();

  // Decorative pointer, magnetic buttons, and project tilt.
  const dot = $("#cursorDot");
  const outline = $("#cursorOutline");
  let pointerX = -100;
  let pointerY = -100;
  let outlineX = -100;
  let outlineY = -100;
  let cursorFrame;
  function cursorTick() {
    outlineX += (pointerX - outlineX) * .16;
    outlineY += (pointerY - outlineY) * .16;
    if (outline) {
      outline.style.left = `${outlineX}px`;
      outline.style.top = `${outlineY}px`;
    }
    cursorFrame = requestAnimationFrame(cursorTick);
  }
  if (finePointer.matches && !reduced.matches && dot && outline) {
    cursorTick();
    window.addEventListener("pointermove", (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      dot.hidden = outline.hidden = false;
      dot.style.left = `${pointerX}px`;
      dot.style.top = `${pointerY}px`;
    }, { passive: true });
    document.documentElement.addEventListener("pointerleave", () => {
      dot.hidden = outline.hidden = true;
    });
  }
  $$(".magnetic, .project-card").forEach((element) => {
    element.addEventListener("pointermove", (event) => {
      if (!finePointer.matches || reduced.matches) return;
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (event.clientY - rect.top - rect.height / 2) / rect.height;
      element.style.transform = element.classList.contains("magnetic")
        ? `translate(${x * 12}px, ${y * 12}px)`
        : `perspective(900px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    });
    element.addEventListener("pointerleave", () => { element.style.transform = ""; });
  });

  // Lightweight background; pauses when the tab is hidden.
  const canvas = $("#heroCanvas");
  const context = canvas?.getContext("2d");
  let particles = [];
  let canvasFrame;
  let width = 0;
  let height = 0;
  function resizeCanvas() {
    if (!canvas || !context) return;
    width = window.innerWidth;
    height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    particles = Array.from({ length: width < 720 ? 20 : 42 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - .5) * .2,
      vy: (Math.random() - .5) * .2
    }));
  }
  function drawCanvas() {
    if (!context || reduced.matches || document.hidden) return;
    context.clearRect(0, 0, width, height);
    particles.forEach((point, index) => {
      point.x = (point.x + point.vx + width) % width;
      point.y = (point.y + point.vy + height) % height;
      context.fillStyle = "rgba(116,225,187,.25)";
      context.beginPath();
      context.arc(point.x, point.y, 1.3, 0, Math.PI * 2);
      context.fill();
      particles.slice(index + 1).forEach((other) => {
        const distance = Math.hypot(point.x - other.x, point.y - other.y);
        if (distance < 120) {
          context.strokeStyle = `rgba(116,225,187,${(1 - distance / 120) * .07})`;
          context.beginPath();
          context.moveTo(point.x, point.y);
          context.lineTo(other.x, other.y);
          context.stroke();
        }
      });
    });
    canvasFrame = requestAnimationFrame(drawCanvas);
  }
  if (context && !reduced.matches) {
    resizeCanvas();
    drawCanvas();
    window.addEventListener("resize", resizeCanvas);
    document.addEventListener("visibilitychange", () => {
      cancelAnimationFrame(canvasFrame);
      if (!document.hidden) drawCanvas();
    });
  }
  reduced.addEventListener("change", () => {
    if (reduced.matches) {
      clearTimeout(typeTimer);
      cancelAnimationFrame(cursorFrame);
      cancelAnimationFrame(canvasFrame);
      body.classList.remove("motion");
      if (dot) dot.hidden = true;
      if (outline) outline.hidden = true;
      if (loader) loader.hidden = true;
      if (typewriter && roles.length) typewriter.textContent = roles[0];
      $$(".magnetic, .project-card").forEach((element) => { element.style.transform = ""; });
    }
  });

  // AJAX enhancement; normal POST remains available without JavaScript.
  const form = $("#contactForm");
  let toastTimer;
  function notify(message) {
    const toast = $("#toast");
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.hidden = false;
    toastTimer = setTimeout(() => { toast.hidden = true; }, 7000);
  }
  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (location.protocol === "file:" ||
        ["localhost", "127.0.0.1"].includes(location.hostname)) {
      notify("The contact form works after deployment. Please use the email link locally.");
      return;
    }
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    button.setAttribute("aria-busy", "true");
    const netlify = form.dataset.provider === "netlify";
    try {
      const response = await fetch(netlify ? body.dataset.home : form.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          ...(netlify ? {} : { Accept: "application/json" })
        },
        body: new URLSearchParams(new FormData(form)).toString()
      });
      if (!response.ok) throw new Error("Submission failed");
      form.reset();
      notify("Thank you! Your message has been sent.");
    } catch {
      notify("Your message could not be sent. Please try again or use the email link.");
    } finally {
      button.disabled = false;
      button.removeAttribute("aria-busy");
    }
  });
})();