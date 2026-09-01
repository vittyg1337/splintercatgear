(function () {
  "use strict";

  const menuButton = document.querySelector("[data-menu-button]");
  const navigation = document.querySelector("[data-navigation]");

  if (menuButton && navigation) {
    const closeMenu = (restoreFocus = false) => {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
      navigation.dataset.open = "false";
      document.body.classList.remove("menu-open");
      if (restoreFocus) menuButton.focus();
    };

    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
      navigation.dataset.open = String(!isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });

    navigation.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") closeMenu(true);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 920) closeMenu();
    });
  }

  const year = document.querySelector("[data-current-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  const cinematicHero = document.querySelector("[data-cinematic-hero]");
  const heroDepth = cinematicHero?.querySelector("[data-hero-depth]");
  const heroCanvas = cinematicHero?.querySelector("[data-hero-particles]");

  if (cinematicHero && heroDepth && heroCanvas instanceof HTMLCanvasElement) {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");
    const saveData = navigator.connection?.saveData === true;
    let pointerFrame = 0;
    let particleFrame = 0;
    let particles = [];
    let heroIsVisible = true;
    let lastParticleTime = 0;

    const resetDepth = () => {
      heroDepth.style.setProperty("--hero-shift-x", "0px");
      heroDepth.style.setProperty("--hero-shift-y", "0px");
    };

    const updateDepth = (event) => {
      if (reducedMotion.matches || !finePointer.matches) return;
      const bounds = cinematicHero.getBoundingClientRect();
      const horizontal = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      const vertical = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;

      cancelAnimationFrame(pointerFrame);
      pointerFrame = requestAnimationFrame(() => {
        heroDepth.style.setProperty("--hero-shift-x", `${(horizontal * -10).toFixed(2)}px`);
        heroDepth.style.setProperty("--hero-shift-y", `${(vertical * -7).toFixed(2)}px`);
      });
    };

    cinematicHero.addEventListener("pointermove", updateDepth, { passive: true });
    cinematicHero.addEventListener("pointerleave", resetDepth);

    const context = heroCanvas.getContext("2d", { alpha: true });

    const sizeParticleCanvas = () => {
      if (!context) return;
      const bounds = cinematicHero.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      heroCanvas.width = Math.max(1, Math.round(bounds.width * pixelRatio));
      heroCanvas.height = Math.max(1, Math.round(bounds.height * pixelRatio));
      heroCanvas.style.width = `${bounds.width}px`;
      heroCanvas.style.height = `${bounds.height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const count = Math.max(20, Math.min(46, Math.round(bounds.width / 34)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * bounds.width,
        y: Math.random() * bounds.height,
        radius: 0.35 + Math.random() * 1.25,
        speed: 2 + Math.random() * 7,
        drift: -3 + Math.random() * 6,
        alpha: 0.08 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2
      }));
    };

    const drawParticles = (time) => {
      if (!context || reducedMotion.matches || !heroIsVisible) return;
      const bounds = cinematicHero.getBoundingClientRect();
      const elapsed = Math.min((time - lastParticleTime) / 1000 || 0, 0.05);
      lastParticleTime = time;
      context.clearRect(0, 0, bounds.width, bounds.height);
      context.globalCompositeOperation = "screen";

      for (const particle of particles) {
        particle.y -= particle.speed * elapsed;
        particle.x += Math.sin(time * 0.00035 + particle.phase) * particle.drift * elapsed;

        if (particle.y < -4) {
          particle.y = bounds.height + 4;
          particle.x = Math.random() * bounds.width;
        }

        const shimmer = 0.55 + Math.sin(time * 0.0012 + particle.phase) * 0.45;
        context.beginPath();
        context.fillStyle = `rgba(255, 210, 139, ${particle.alpha * shimmer})`;
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      }

      particleFrame = requestAnimationFrame(drawParticles);
    };

    const startParticles = () => {
      cancelAnimationFrame(particleFrame);
      lastParticleTime = performance.now();
      if (!reducedMotion.matches && !saveData && heroIsVisible && !document.hidden) {
        particleFrame = requestAnimationFrame(drawParticles);
      }
    };

    const stopParticles = () => {
      cancelAnimationFrame(particleFrame);
      if (context) context.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
      resetDepth();
    };

    const visibilityObserver = "IntersectionObserver" in window
      ? new IntersectionObserver(([entry]) => {
          heroIsVisible = entry.isIntersecting;
          if (heroIsVisible) startParticles();
          else stopParticles();
        }, { threshold: 0.04 })
      : null;

    if (visibilityObserver) visibilityObserver.observe(cinematicHero);
    sizeParticleCanvas();
    startParticles();

    const resizeObserver = "ResizeObserver" in window
      ? new ResizeObserver(() => {
          sizeParticleCanvas();
          startParticles();
        })
      : null;

    if (resizeObserver) resizeObserver.observe(cinematicHero);
    else window.addEventListener("resize", sizeParticleCanvas, { passive: true });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopParticles();
      else if (heroIsVisible) startParticles();
    });

    const handleMotionPreference = () => {
      cinematicHero.dataset.motion = reducedMotion.matches || saveData ? "reduced" : "active";
      if (reducedMotion.matches || saveData) stopParticles();
      else startParticles();
    };

    reducedMotion.addEventListener?.("change", handleMotionPreference);
    handleMotionPreference();
  }

  const emitCommerceEvent = (eventName, detail) => {
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: eventName, ...detail });
    }

    window.dispatchEvent(new CustomEvent(`splintercat:${eventName.replaceAll("_", "-")}`, { detail }));
  };

  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const link = target?.closest("[data-commerce-link]");
    if (!link) return;

    let destinationHost = "";
    try {
      destinationHost = new URL(link.href, window.location.href).hostname;
    } catch {
      destinationHost = "invalid-destination";
    }

    const detail = {
      content_id: link.dataset.product || "unknown",
      product_category: link.dataset.productCategory || "unknown",
      product_name: link.dataset.productName || "unknown",
      product_id: link.dataset.offerId || link.dataset.product || "unknown",
      retailer: destinationHost,
      destination_market: link.dataset.market || "unknown",
      affiliate_status: link.relList.contains("sponsored") ? "active" : "none",
      destination_type: link.dataset.destinationType || "unknown",
      link_version: link.dataset.linkVersion || "unknown",
      link_position: "product-record",
      source_page: window.location.pathname
    };

    emitCommerceEvent("retailer_outbound_click", detail);
  });

  const commerceModules = document.querySelectorAll("[data-commerce-module]");
  if (commerceModules.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const module = entry.target;
        const links = [...module.querySelectorAll("[data-commerce-link]")];
        emitCommerceEvent("retailer_module_view", {
          content_id: module.dataset.commerceModule || "unknown",
          product_category: links[0]?.dataset.productCategory || "unknown",
          source_page: window.location.pathname,
          destination_markets: links.map((link) => link.dataset.market).filter(Boolean).join(","),
          link_version: links[0]?.dataset.linkVersion || "unknown",
          affiliate_status: links.some((link) => link.relList.contains("sponsored")) ? "active" : "none"
        });
        observer.unobserve(module);
      }
    }, { threshold: 0.25 });

    commerceModules.forEach((module) => observer.observe(module));
  }
})();
