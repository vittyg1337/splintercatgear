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
