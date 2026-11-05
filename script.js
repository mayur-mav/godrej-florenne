(() => {
  "use strict";

  const data = window.florenneData;
  if (!data) {
    console.error("Florenne page data could not be loaded.");
    return;
  }

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);

  const render = (selector, markup) => {
    const element = document.querySelector(selector);
    if (!element) return null;
    element.innerHTML = markup;
    return element;
  };

  if (Array.isArray(data.facts)) {
    render("#quick-facts", data.facts.map((fact) => `
      <div class="fact-item">
        <span class="fact-value">${escapeHtml(fact.value)}</span>
        <span class="fact-label">${escapeHtml(fact.label)}</span>
      </div>
    `).join(""));
  }

  if (Array.isArray(data.projectDetails)) {
    render("#project-details", data.projectDetails.map((detail) => `
      <div class="project-table-row"><strong>${escapeHtml(detail.label)}</strong><span>${escapeHtml(detail.value)}</span></div>
    `).join(""));
  }

  if (Array.isArray(data.highlights)) {
    render("#overview-highlights", data.highlights.map((highlight) => `
      <p><span aria-hidden="true">✓</span>${escapeHtml(highlight)}</p>
    `).join(""));
  }

  if (Array.isArray(data.brochureItems)) {
    render("#brochure-items", data.brochureItems.map((item) => `
      <div class="brochure-bullet-item">
        <span class="brochure-check" aria-hidden="true">✓</span>
        <span>${escapeHtml(item)}</span>
      </div>
    `).join(""));
  }

  if (Array.isArray(data.prices)) {
    render("#price-rows", data.prices.map((price) => `
      <div class="price-table-row">
        <div class="price-col-typo">
          <div class="price-typo-header">
            <strong class="price-typo-name">${escapeHtml(price.configuration)}</strong>
            ${price.badge ? `<span class="price-tag-badge">${escapeHtml(price.badge)}</span>` : ""}
          </div>
          <span class="price-typo-sub">${escapeHtml(price.typologyDesc || "Four-Level Private Row House")}</span>
        </div>
        <div class="price-col-sba">
          <span class="price-cell-mobile-label">Super Built-Up:</span>
          <span class="price-val-area">${escapeHtml(price.area)}</span>
          <small class="price-val-plot">Plot: ${escapeHtml(price.plot)}</small>
        </div>
        <div class="price-col-carpet">
          <span class="price-cell-mobile-label">RERA Carpet:</span>
          <span class="price-val-carpet">${escapeHtml(price.carpet)}</span>
        </div>
        <div class="price-col-price">
          <span class="price-cell-mobile-label">Starting From:</span>
          <strong class="price-val-gold">${escapeHtml(price.starting)}</strong>
          <small class="price-val-note">Onwards + Taxes</small>
        </div>
        <div class="price-col-cta">
          <button class="button-table-enquire" type="button" data-scroll-enquire aria-label="Unlock Cost Sheet for ${escapeHtml(price.configuration)}">
            <span>Unlock Cost Sheet</span>
            <span class="table-cta-arrow" aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </div>
    `).join(""));
  }

  if (Array.isArray(data.floorPlans)) {
    const floorplanTabs = render("#floorplan-tabs", data.floorPlans.map((plan, index) => `
      <button class="floorplan-tab" id="floorplan-tab-${index}" type="button" role="tab" aria-selected="${index === 0}" aria-controls="floorplan-panel" tabindex="${index === 0 ? "0" : "-1"}" data-floorplan-index="${index}">${escapeHtml(plan.name)}</button>
    `).join(""));

    const floorplanPanel = document.querySelector("#floorplan-panel");
    if (floorplanTabs && floorplanPanel) {
      const showFloorplan = (index) => {
        const plan = data.floorPlans[index];
        if (!plan) return;
        floorplanTabs.querySelectorAll('[role="tab"]').forEach((tab, tabIndex) => {
          tab.setAttribute("aria-selected", String(tabIndex === index));
          tab.setAttribute("tabindex", tabIndex === index ? "0" : "-1");
        });
        floorplanPanel.setAttribute("aria-labelledby", `floorplan-tab-${index}`);
        floorplanPanel.innerHTML = `
          <div class="floorplan-art">
            <img src="${escapeHtml(plan.image)}" alt="Illustrative ${escapeHtml(plan.name)} floor plan, not to scale" loading="lazy" decoding="async">
            <span>Illustrative plan · not to scale</span>
          </div>
          <div class="floorplan-copy">
            <p class="eyebrow">${escapeHtml(plan.label)}</p>
            <h4>${escapeHtml(plan.name)}</h4>
            <p>${escapeHtml(plan.description)}</p>
            <div class="floorplan-area"><strong>${escapeHtml(plan.area)}</strong><span>Area details on request</span></div>
            <ul>${plan.points.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul>
            <button class="button button-primary" type="button" data-scroll-enquire>Request this floor plan <span aria-hidden="true">↗</span></button>
          </div>
        `;
      };

      showFloorplan(0);

      floorplanTabs.addEventListener("click", (event) => {
        const tab = event.target.closest("[data-floorplan-index]");
        if (tab) showFloorplan(Number(tab.dataset.floorplanIndex));
      });

      floorplanTabs.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const current = Number(document.activeElement.dataset.floorplanIndex);
        const last = data.floorPlans.length - 1;
        const next = event.key === "Home" ? 0 : event.key === "End" ? last : (current + (event.key === "ArrowRight" ? 1 : -1) + data.floorPlans.length) % data.floorPlans.length;
        const target = floorplanTabs.querySelector(`[data-floorplan-index="${next}"]`);
        if (target) {
          target.focus();
          showFloorplan(next);
        }
      });
    }
  }

  if (Array.isArray(data.residences)) {
    render("#residence-cards", data.residences.map((home, index) => `
      <article class="residence-card reveal">
        <div class="residence-image">
          <img src="${escapeHtml(home.image)}" alt="${escapeHtml(home.imageAlt)}" loading="lazy" decoding="async">
          <span>${escapeHtml(home.tag)}</span>
          <span class="residence-index">0${index + 1}</span>
        </div>
        <div class="residence-info">
          <p class="eyebrow">${escapeHtml(home.label)}</p>
          <h3>${escapeHtml(home.name)}</h3>
          <p>${escapeHtml(home.description)}</p>
          <div class="residence-foot">
            <span>${escapeHtml(home.size)}</span>
            <button class="text-link" type="button" data-scroll-enquire aria-label="Enquire about ${escapeHtml(home.name)}">Ask us <span aria-hidden="true">↗</span></button>
          </div>
        </div>
      </article>
    `).join(""));
  }

  if (Array.isArray(data.amenities)) {
    render("#amenity-grid", data.amenities.map((amenity, index) => `
      <article class="amenity-card reveal">
        <span class="amenity-number">0${index + 1}</span>
        <span class="amenity-icon" aria-hidden="true">${escapeHtml(amenity.icon)}</span>
        <h3>${escapeHtml(amenity.name)}</h3>
        <p>${escapeHtml(amenity.note)}</p>
      </article>
    `).join(""));
  }

  if (Array.isArray(data.amenityGroups)) {
    render("#amenity-groups", data.amenityGroups.map((group) => `
      <article class="amenity-group reveal">
        <h3>${escapeHtml(group.title)}</h3>
        <div>${group.items.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>
      </article>
    `).join(""));
  }

  if (Array.isArray(data.projectGallery)) {
    render("#project-gallery-grid", data.projectGallery.map((photo) => `
      <figure class="project-gallery-item reveal">
        <img src="${escapeHtml(photo.src)}" alt="${escapeHtml(photo.alt)}" loading="lazy" decoding="async">
        <figcaption>${escapeHtml(photo.label)}</figcaption>
      </figure>
    `).join(""));
  }

  if (Array.isArray(data.locations)) {
    render("#location-list", data.locations.map((location, index) => `
      <div class="location-row">
        <span class="location-index">0${index + 1}</span>
        <span><strong>${escapeHtml(location.name)}</strong><small>${escapeHtml(location.detail)}</small></span>
        <span class="location-arrow" aria-hidden="true">↗</span>
      </div>
    `).join(""));
  }

  if (Array.isArray(data.details)) {
    render("#detail-grid", data.details.map((item) => `
      <article class="detail-card reveal">
        <span>${escapeHtml(item.icon)}</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.text)}</p>
      </article>
    `).join(""));
  }

  if (Array.isArray(data.approvals)) {
    render("#approval-grid", data.approvals.map((item, index) => `
      <article class="approval-card"><span>0${index + 1}</span><strong>${escapeHtml(item.value)}</strong><p>${escapeHtml(item.label)}</p></article>
    `).join(""));
  }

  if (Array.isArray(data.masterplanNotes)) {
    render("#masterplan-points", data.masterplanNotes.map((note) => `
      <p><span aria-hidden="true">✳</span>${escapeHtml(note)}</p>
    `).join(""));
  }

  if (Array.isArray(data.specifications)) {
    render("#specification-grid", data.specifications.map((specification, index) => `
      <article class="specification-card reveal"><span>0${index + 1}</span><h3>${escapeHtml(specification.title)}</h3><p>${escapeHtml(specification.text)}</p></article>
    `).join(""));
  }

  if (data.developer) {
    const devDesc = document.querySelector("#developer-description");
    if (devDesc) devDesc.textContent = data.developer.description;
    if (Array.isArray(data.developer.stats)) {
      render("#developer-stats", data.developer.stats.map((stat) => `
        <div><strong>${escapeHtml(stat.value)}</strong><span>${escapeHtml(stat.label)}</span></div>
      `).join(""));
    }
  }

  if (Array.isArray(data.faqs)) {
    render("#faq-list", data.faqs.map((item, index) => `
      <details class="faq-item"${index === 0 ? " open" : ""}>
        <summary><span>${escapeHtml(item.question)}</span><i aria-hidden="true"></i></summary>
        <p>${escapeHtml(item.answer)}</p>
      </details>
    `).join(""));
  }

  // Interactive Project Overview Showcase Slider
  const showcaseList = data.overviewShowcase || data.gallery || [];
  const galleryImage = document.querySelector("#gallery-image");
  const galleryCaption = document.querySelector("#gallery-caption");
  let showcaseIndex = 0;

  const showShowcaseImage = (index) => {
    if (!showcaseList.length) return;
    showcaseIndex = (index + showcaseList.length) % showcaseList.length;
    const item = showcaseList[showcaseIndex];
    if (galleryImage) {
      galleryImage.style.opacity = "0.4";
      setTimeout(() => {
        galleryImage.src = item.src;
        galleryImage.alt = item.alt;
        galleryImage.style.opacity = "1";
      }, 150);
    }
    if (galleryCaption) {
      galleryCaption.textContent = item.caption;
    }
  };

  const galleryPrev = document.querySelector("#gallery-prev");
  const galleryNext = document.querySelector("#gallery-next");
  if (galleryPrev) galleryPrev.addEventListener("click", () => showShowcaseImage(showcaseIndex - 1));
  if (galleryNext) galleryNext.addEventListener("click", () => showShowcaseImage(showcaseIndex + 1));

  // Touch Swipe for Project Overview Carousel
  const showcaseStage = document.querySelector(".showcase-stage");
  if (showcaseStage) {
    let startX = 0;
    showcaseStage.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });
    showcaseStage.addEventListener("touchend", (e) => {
      const diffX = e.changedTouches[0].clientX - startX;
      if (Math.abs(diffX) > 40) {
        if (diffX < 0) showShowcaseImage(showcaseIndex + 1);
        else showShowcaseImage(showcaseIndex - 1);
      }
    }, { passive: true });
  }

  // Secondary Amenities Carousel
  const amenityList = data.gallery || [];
  const amenityImage = document.querySelector("#amenity-image");
  const amenityCaption = document.querySelector("#amenity-caption");
  const amenityCount = document.querySelector("#amenity-count");
  let amenityIndex = 0;

  const showAmenityImage = (index) => {
    if (!amenityList.length) return;
    amenityIndex = (index + amenityList.length) % amenityList.length;
    const image = amenityList[amenityIndex];
    if (amenityImage) {
      amenityImage.src = image.src;
      amenityImage.alt = image.alt;
    }
    if (amenityCaption) amenityCaption.textContent = image.caption;
    if (amenityCount) amenityCount.textContent = `${String(amenityIndex + 1).padStart(2, "0")} / ${String(amenityList.length).padStart(2, "0")}`;
  };

  const amenityPrev = document.querySelector("#amenity-prev");
  const amenityNext = document.querySelector("#amenity-next");
  if (amenityPrev) amenityPrev.addEventListener("click", () => showAmenityImage(amenityIndex - 1));
  if (amenityNext) amenityNext.addEventListener("click", () => showAmenityImage(amenityIndex + 1));

  // Navigation Toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const primaryNav = document.querySelector("#primary-nav");
  if (menuToggle && primaryNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      const srOnly = menuToggle.querySelector(".sr-only");
      if (srOnly) srOnly.textContent = isOpen ? "Open menu" : "Close menu";
      primaryNav.classList.toggle("is-open", !isOpen);
    });

    primaryNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.setAttribute("aria-expanded", "false");
        const srOnly = menuToggle.querySelector(".sr-only");
        if (srOnly) srOnly.textContent = "Open menu";
        primaryNav.classList.remove("is-open");
      });
    });
  }

  // Smooth Scroll & CTAs
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-scroll-enquire]");
    if (trigger) {
      const target = document.querySelector("#site-visit") || document.querySelector("#hero-enquiry");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        const firstInput = target.querySelector("input");
        if (firstInput) setTimeout(() => firstInput.focus(), 400);
      }
    }

    const heroEnquireTrigger = event.target.closest(".floating-enquire-tab, .nav-cta");
    if (heroEnquireTrigger) {
      const heroForm = document.querySelector("#hero-enquiry");
      if (heroForm) {
        event.preventDefault();
        heroForm.scrollIntoView({ behavior: "smooth" });
        const nameInput = heroForm.querySelector("#hero-name");
        if (nameInput) setTimeout(() => nameInput.focus(), 400);
      }
    }
  });

  // Virtual Tour Modal
  const tourModal = document.querySelector("#tour-modal");
  const tourVideo = document.querySelector("#tour-video");
  let previousFocus = null;

  const closeTour = () => {
    if (!tourModal) return;
    tourModal.hidden = true;
    if (tourVideo) tourVideo.pause();
    previousFocus?.focus();
  };

  const openTourBtn = document.querySelector("#open-tour");
  if (openTourBtn && tourModal) {
    openTourBtn.addEventListener("click", () => {
      previousFocus = document.activeElement;
      tourModal.hidden = false;
      const closeBtn = tourModal.querySelector(".modal-close");
      if (closeBtn) closeBtn.focus();
    });
  }

  if (tourModal) {
    tourModal.querySelectorAll("[data-close-modal]").forEach((button) => {
      button.addEventListener("click", closeTour);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !tourModal.hidden) {
        closeTour();
      }
    });
  }

  // Forms & Feedback
  const toast = document.querySelector("#site-toast");
  let toastTimeout;
  document.querySelectorAll("[data-enquiry-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const name = form.elements.name ? form.elements.name.value.trim() : "Valued Guest";
      const feedback = form.querySelector(".form-feedback");
      if (feedback) {
        feedback.textContent = `Thank you, ${name}. Our Godrej Florenne advisory team will contact you shortly with the official price list & brochure.`;
      }
      form.reset();

      if (toast) {
        toast.textContent = "Thank you! Your enquiry for Godrej Florenne has been registered.";
        toast.classList.add("is-visible");
        window.clearTimeout(toastTimeout);
        toastTimeout = window.setTimeout(() => toast.classList.remove("is-visible"), 5000);
      }
    });
  });

  const yearEl = document.querySelector("#current-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Scroll Reveal Animations
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll(".reveal, .amenity-card, .detail-card, .overview-card-item").forEach((el) => observer.observe(el));
  } else {
    document.querySelectorAll(".reveal, .amenity-card, .detail-card, .overview-card-item").forEach((el) => el.classList.add("is-visible"));
  }

  // Fixed Navbar Scroll Effect
  const siteHeader = document.querySelector(".site-header");
  if (siteHeader) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        siteHeader.classList.add("is-scrolled");
      } else {
        siteHeader.classList.remove("is-scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
  }
})();
