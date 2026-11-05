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
      <div class="pricing-table-row">
        <div class="col-cell col-config">
          <span class="row-brand-eyebrow">${escapeHtml(price.brand || "GODREJ FLORENNE")}</span>
          <strong class="row-config-title">${escapeHtml(price.configuration)}</strong>
          <span class="row-price-sub">${escapeHtml(price.subLabel || "PRICE")}</span>
        </div>
        <div class="col-cell col-area">
          <span class="cell-mobile-label">Saleable Area:</span>
          <span class="row-area-val">${escapeHtml(price.area)}</span>
        </div>
        <div class="col-cell col-price">
          <span class="cell-mobile-label">Starting Price*:</span>
          <span class="row-price-val">${escapeHtml(price.startingPrice || price.starting)}</span>
        </div>
        <div class="col-cell col-cta">
          <button class="button-get-price" type="button" data-scroll-enquire aria-label="Get Price for ${escapeHtml(price.configuration)}">
            Get Price
          </button>
        </div>
      </div>
    `).join(""));
  }

  if (Array.isArray(data.floorPlans)) {
    const floorplanTabs = render("#floorplan-tabs", data.floorPlans.map((plan, index) => `
      <button class="floorplan-pill-tab${index === 0 ? " is-active" : ""}" id="floorplan-tab-${index}" type="button" role="tab" aria-selected="${index === 0}" aria-controls="floorplan-panel" tabindex="${index === 0 ? "0" : "-1"}" data-floorplan-index="${index}">${escapeHtml(plan.tabName || plan.name)}</button>
    `).join(""));

    const floorplanPanel = document.querySelector("#floorplan-panel");
    if (floorplanTabs && floorplanPanel) {
      const showFloorplan = (index) => {
        const plan = data.floorPlans[index];
        if (!plan) return;
        floorplanTabs.querySelectorAll('[role="tab"]').forEach((tab, tabIndex) => {
          const isActive = tabIndex === index;
          tab.setAttribute("aria-selected", String(isActive));
          tab.setAttribute("tabindex", isActive ? "0" : "-1");
          tab.classList.toggle("is-active", isActive);
        });
        floorplanPanel.setAttribute("aria-labelledby", `floorplan-tab-${index}`);
        floorplanPanel.innerHTML = `
          <div class="floorplan-stage-col">
            <div class="floorplan-stage-card">
              <img class="floorplan-stage-img" src="${escapeHtml(plan.image)}" alt="${escapeHtml(plan.headline || plan.name)} architectural plan" loading="lazy" decoding="async">
              <div class="floorplan-lock-shade">
                <div class="lock-circle-badge" aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <button class="button-download-plan-card" type="button" data-scroll-enquire>
                  Download ${escapeHtml(plan.tabName || plan.name)} Plan
                </button>
                <span class="lock-subnote">Full plan on WhatsApp within minutes</span>
              </div>
            </div>
          </div>

          <div class="floorplan-details-col">
            <h3 class="plan-details-title">${escapeHtml(plan.headline || plan.name)}</h3>
            <p class="plan-details-desc">${escapeHtml(plan.description)}</p>

            <div class="plan-metrics-grid">
              <div class="metric-box">
                <strong class="metric-val">${escapeHtml(plan.saleable || "3,725")}</strong>
                <span class="metric-lbl">SQ FT SALEABLE</span>
              </div>
              <div class="metric-box">
                <strong class="metric-val">${escapeHtml(plan.carpet || "2,417")}</strong>
                <span class="metric-lbl">SQ FT RERA CARPET</span>
              </div>
              <div class="metric-box">
                <strong class="metric-val">${escapeHtml(plan.price || "₹5.40 Cr*")}</strong>
                <span class="metric-lbl">ONWARDS</span>
              </div>
            </div>

            <div class="plan-bullets-list">
              ${(plan.bullets || []).map((bullet) => `
                <div class="plan-bullet-row">
                  <span class="plan-bullet-tick" aria-hidden="true">✓</span>
                  <span class="plan-bullet-text">${escapeHtml(bullet)}</span>
                </div>
              `).join("")}
            </div>

            <button class="button-download-plan-main" type="button" data-scroll-enquire>
              <span>Download ${escapeHtml(plan.tabName || plan.name)} Floor Plan</span>
              <span class="btn-download-arrow" aria-hidden="true">&darr;</span>
            </button>
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

  if (Array.isArray(data.amenityGroups)) {
    const amenityIcons = {
      landscape: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>`,
      sports: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
      clubhouse: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
    };
    render("#amenities-groups-grid", data.amenityGroups.map((group) => `
      <div class="amenity-pill-card">
        <div class="amenity-pill-card-header">
          <span class="amenity-pill-icon">${amenityIcons[group.icon] || amenityIcons.landscape}</span>
          <span class="amenity-pill-category">${escapeHtml(group.category)}</span>
        </div>
        <div class="amenity-pills-wrap">
          ${(group.pills || []).map((pill) => `
            <span class="amenity-pill-item">${escapeHtml(pill)}</span>
          `).join("")}
        </div>
      </div>
    `).join(""));
  }

  if (Array.isArray(data.projectGallery)) {
    render("#project-gallery-grid", data.projectGallery.map((photo) => `
      <div class="gallery-card reveal">
        <img src="${escapeHtml(photo.src)}" alt="${escapeHtml(photo.alt || photo.tag)}" loading="lazy" decoding="async">
        <div class="gallery-card-overlay"></div>
        <span class="gallery-card-tag">${escapeHtml(photo.tag)}</span>
        <span class="gallery-card-credit">${escapeHtml(photo.credit || "ARTIST'S IMPRESSION")}</span>
      </div>
    `).join(""));
  }

  if (Array.isArray(data.locationGroups)) {
    const iconSvgs = {
      nav: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>`,
      work: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
      health: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`
    };
    render("#location-cards", data.locationGroups.map((group) => `
      <div class="transit-card">
        <div class="transit-card-header">
          <span class="transit-icon" aria-hidden="true">${iconSvgs[group.icon] || iconSvgs.nav}</span>
          <span class="transit-category">${escapeHtml(group.category)}</span>
        </div>
        <div class="transit-card-body">
          ${group.items.map((item) => `
            <div class="transit-row">
              <span class="transit-name">${escapeHtml(item.name)}</span>
              <span class="transit-time">${escapeHtml(item.timeDistance)}</span>
            </div>
          `).join("")}
        </div>
      </div>
    `).join(""));
  }

  if (Array.isArray(data.locationHighlights)) {
    render("#location-highlights", data.locationHighlights.map((hl) => `
      <div class="location-check-item">
        <span class="location-check-tick" aria-hidden="true">✓</span>
        <div class="location-check-text">
          <strong>${escapeHtml(hl.title)}:</strong> ${escapeHtml(hl.text)}
        </div>
      </div>
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
    render("#approval-grid", data.approvals.map((item) => `
      <article class="approval-card">
        <strong class="approval-val">${escapeHtml(item.value)}</strong>
        <span class="approval-lbl">${escapeHtml(item.label)}</span>
      </article>
    `).join(""));
  }

  if (Array.isArray(data.masterplanNotes)) {
    render("#masterplan-points", data.masterplanNotes.map((note) => {
      if (typeof note === "string") {
        return `
          <div class="masterplan-point-item">
            <span class="plan-point-check" aria-hidden="true">&#10003;</span>
            <p class="plan-point-text">${escapeHtml(note)}</p>
          </div>
        `;
      }
      return `
        <div class="masterplan-point-item">
          <span class="plan-point-check" aria-hidden="true">&#10003;</span>
          <p class="plan-point-text"><strong>${escapeHtml(note.title)}</strong> ${escapeHtml(note.text)}</p>
        </div>
      `;
    }).join(""));
  }

  if (Array.isArray(data.specifications)) {
    render("#specification-grid", data.specifications.map((item) => `
      <div class="specification-card reveal">
        <span class="spec-card-kicker">${escapeHtml(item.category || item.title)}</span>
        <p class="spec-card-desc">${escapeHtml(item.text)}</p>
      </div>
    `).join(""));
  }

  if (data.developer) {
    const devDesc = document.querySelector("#developer-description");
    if (devDesc) {
      if (Array.isArray(data.developer.paragraphs)) {
        devDesc.innerHTML = data.developer.paragraphs.map((p) => `<p class="developer-p">${p}</p>`).join("");
      } else if (data.developer.description) {
        devDesc.innerHTML = `<p class="developer-p">${data.developer.description}</p>`;
      }
    }
    if (Array.isArray(data.developer.stats)) {
      render("#developer-stats", data.developer.stats.map((stat) => `
        <div class="developer-stat-card">
          <div class="stat-card-value">${stat.value}</div>
          <div class="stat-card-label">${escapeHtml(stat.label)}</div>
        </div>
      `).join(""));
    }
  }

  if (Array.isArray(data.faqs)) {
    render("#faq-list", data.faqs.map((item) => `
      <details class="faq-accordion-item">
        <summary class="faq-accordion-summary">
          <span class="faq-accordion-question">${escapeHtml(item.question)}</span>
          <span class="faq-accordion-toggle" aria-hidden="true">+</span>
        </summary>
        <div class="faq-accordion-body">
          <p class="faq-accordion-answer">${escapeHtml(item.answer)}</p>
        </div>
      </details>
    `).join(""));
  }

  // ==========================================================================
  // Interactive Project Overview Showcase Slider with Auto-Play (every 4.5s)
  // ==========================================================================
  const showcaseList = data.overviewShowcase || data.gallery || [];
  const galleryImage = document.querySelector("#gallery-image");
  const galleryCaption = document.querySelector("#gallery-caption");
  const showcaseStage = document.querySelector(".showcase-stage");
  let showcaseIndex = 0;
  let showcaseTimer = null;

  const showShowcaseImage = (index) => {
    if (!showcaseList.length) return;
    showcaseIndex = (index + showcaseList.length) % showcaseList.length;
    const item = showcaseList[showcaseIndex];
    if (galleryImage) {
      galleryImage.style.opacity = "0.25";
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

  const startShowcaseTimer = () => {
    stopShowcaseTimer();
    showcaseTimer = setInterval(() => {
      showShowcaseImage(showcaseIndex + 1);
    }, 4500);
  };

  const stopShowcaseTimer = () => {
    if (showcaseTimer) {
      clearInterval(showcaseTimer);
      showcaseTimer = null;
    }
  };

  const galleryPrev = document.querySelector("#gallery-prev");
  const galleryNext = document.querySelector("#gallery-next");
  if (galleryPrev) {
    galleryPrev.addEventListener("click", () => {
      showShowcaseImage(showcaseIndex - 1);
      startShowcaseTimer();
    });
  }
  if (galleryNext) {
    galleryNext.addEventListener("click", () => {
      showShowcaseImage(showcaseIndex + 1);
      startShowcaseTimer();
    });
  }

  // Touch Swipe for Project Overview Carousel
  if (showcaseStage) {
    let startX = 0;
    showcaseStage.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      stopShowcaseTimer();
    }, { passive: true });
    showcaseStage.addEventListener("touchend", (e) => {
      const diffX = e.changedTouches[0].clientX - startX;
      if (Math.abs(diffX) > 40) {
        if (diffX < 0) showShowcaseImage(showcaseIndex + 1);
        else showShowcaseImage(showcaseIndex - 1);
      }
      startShowcaseTimer();
    }, { passive: true });
    showcaseStage.addEventListener("mouseenter", stopShowcaseTimer);
    showcaseStage.addEventListener("mouseleave", startShowcaseTimer);
  }

  // Start auto-play
  startShowcaseTimer();

  // ==========================================================================
  // Interactive Amenities Carousel Showcase with Auto-Play (every 4.5s)
  // ==========================================================================
  const amenityList = data.amenitySlides || data.gallery || [];
  const amenityImage = document.querySelector("#amenity-image");
  const amenityCaption = document.querySelector("#amenity-caption");
  const amenityFrame = document.querySelector(".amenities-showcase-frame");
  let amenityIndex = 0;
  let amenityTimer = null;

  const showAmenityImage = (index) => {
    if (!amenityList.length) return;
    amenityIndex = (index + amenityList.length) % amenityList.length;
    const image = amenityList[amenityIndex];
    if (amenityImage) {
      amenityImage.style.opacity = "0.25";
      setTimeout(() => {
        amenityImage.src = image.src;
        amenityImage.alt = image.alt;
        amenityImage.style.opacity = "1";
      }, 150);
    }
    if (amenityCaption) amenityCaption.textContent = image.title || image.caption;
  };

  const startAmenityTimer = () => {
    stopAmenityTimer();
    amenityTimer = setInterval(() => {
      showAmenityImage(amenityIndex + 1);
    }, 4500);
  };

  const stopAmenityTimer = () => {
    if (amenityTimer) {
      clearInterval(amenityTimer);
      amenityTimer = null;
    }
  };

  const amenityPrev = document.querySelector("#amenity-prev");
  const amenityNext = document.querySelector("#amenity-next");
  if (amenityPrev) {
    amenityPrev.addEventListener("click", () => {
      showAmenityImage(amenityIndex - 1);
      startAmenityTimer();
    });
  }
  if (amenityNext) {
    amenityNext.addEventListener("click", () => {
      showAmenityImage(amenityIndex + 1);
      startAmenityTimer();
    });
  }

  if (amenityFrame) {
    let startX = 0;
    amenityFrame.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      stopAmenityTimer();
    }, { passive: true });
    amenityFrame.addEventListener("touchend", (e) => {
      const diffX = e.changedTouches[0].clientX - startX;
      if (Math.abs(diffX) > 40) {
        if (diffX < 0) showAmenityImage(amenityIndex + 1);
        else showAmenityImage(amenityIndex - 1);
      }
      startAmenityTimer();
    }, { passive: true });
    amenityFrame.addEventListener("mouseenter", stopAmenityTimer);
    amenityFrame.addEventListener("mouseleave", startAmenityTimer);
  }

  // Start auto-play
  startAmenityTimer();

  // Pause carousel auto-play when browser tab is inactive to preserve battery
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopShowcaseTimer();
      stopAmenityTimer();
    } else {
      startShowcaseTimer();
      startAmenityTimer();
    }
  });

  // Navigation Toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const primaryNav = document.querySelector("#primary-nav");
  if (menuToggle && primaryNav) {
    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
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

    document.addEventListener("click", (event) => {
      if (primaryNav.classList.contains("is-open") && !primaryNav.contains(event.target) && !menuToggle.contains(event.target)) {
        menuToggle.setAttribute("aria-expanded", "false");
        const srOnly = menuToggle.querySelector(".sr-only");
        if (srOnly) srOnly.textContent = "Open menu";
        primaryNav.classList.remove("is-open");
      }
    });
  }

  // ==========================================================================
  // Global Lead Capture Popup Modal (Dynamic Per-Button Content)
  // ==========================================================================
  const enquiryModal = document.querySelector("#enquiry-modal");
  const popupTitle = document.querySelector("#popup-modal-title");
  const popupSubtitle = document.querySelector("#popup-modal-subtitle");
  const popupSubmitLabel = document.querySelector("#popup-submit-label");
  const popupSourceContext = document.querySelector("#popup-source-context");
  const popupConfigSelect = document.querySelector("#popup-config");
  const popupForm = document.querySelector("#popup-enquiry-form");
  let previousFocusEl = null;

  function openEnquiryModal(opts = {}) {
    if (!enquiryModal) return;
    previousFocusEl = document.activeElement;

    const title = opts.title || "Get The Complete Price List";
    const subtitle = opts.subtitle || "The full master plan and unit pricing on WhatsApp within minutes.";
    const submitText = opts.submitText || "Download Details";
    const source = opts.source || "General Enquiry";
    const config = opts.config || "";

    if (popupTitle) popupTitle.textContent = title;
    if (popupSubtitle) popupSubtitle.textContent = subtitle;
    if (popupSubmitLabel) popupSubmitLabel.textContent = submitText;
    if (popupSourceContext) popupSourceContext.value = source;

    if (popupConfigSelect && config) {
      const matchOpt = Array.from(popupConfigSelect.options).find(
        (o) => o.value.toLowerCase().includes(config.toLowerCase()) || config.toLowerCase().includes(o.value.toLowerCase())
      );
      if (matchOpt) popupConfigSelect.value = matchOpt.value;
    }

    enquiryModal.hidden = false;
    document.body.style.overflow = "hidden";

    setTimeout(() => {
      const nameInput = enquiryModal.querySelector("#popup-name");
      if (nameInput) nameInput.focus();
    }, 100);
  }

  let videoPausedByCheckpoint = false;

  function closeEnquiryModal() {
    if (!enquiryModal) return;
    enquiryModal.hidden = true;
    document.body.style.overflow = "";

    // If playback was paused by a timed video checkpoint, resume automatically
    if (videoPausedByCheckpoint) {
      videoPausedByCheckpoint = false;
      const vTourVideo = document.querySelector("#virtual-tour-video");
      if (vTourVideo && !vTourVideo.ended) {
        vTourVideo.play().catch(() => {});
      }
    }
    if (popupForm) {
      const fb = popupForm.querySelector(".form-feedback");
      if (fb) {
        fb.textContent = "";
        fb.className = "form-feedback";
      }
    }
    if (previousFocusEl && typeof previousFocusEl.focus === "function") {
      previousFocusEl.focus();
    }
  }

  // Handle all CTA button clicks across the site
  document.addEventListener("click", (event) => {
    // 1. Close modal triggers
    if (event.target.closest("[data-close-enquiry-modal]")) {
      event.preventDefault();
      closeEnquiryModal();
      return;
    }

    // 2. Scroll to virtual tour if explicitly requested
    const tourScrollTrigger = event.target.closest("[data-scroll-virtual-tour]");
    if (tourScrollTrigger && !tourScrollTrigger.classList.contains("button-schedule-tour")) {
      event.preventDefault();
      const target = document.querySelector("#virtual-tour");
      if (target) target.scrollIntoView({ behavior: "smooth" });
      return;
    }

    // 3. CTA Buttons triggering the Popup Modal
    const btn = event.target.closest(
      "[data-scroll-enquire], [data-open-modal], .nav-cta, .mobile-bar-enquire, .floating-enquire-tab, .spec-quote-btn, .button-brochure-download, .button-complete-costing, .button-download-masterplan, .button-download-plan-card, .button-download-plan-main, .intro-pdf-download-btn, .button-get-price, .button-schedule-tour, .button-launch-details, .hero-site-visit-link"
    );

    if (btn) {
      event.preventDefault();

      let title = "Get The Complete Price List";
      let subtitle = "The full master plan and unit pricing on WhatsApp within minutes.";
      let submitText = "Get Price List";
      let source = "General Enquiry";
      let config = "";

      // Contextual detection based on button role & placement
      if (btn.classList.contains("button-download-masterplan") || btn.closest(".masterplan-section")) {
        title = "Get The Full Master Plan";
        subtitle = "The full master plan and row house numbering on WhatsApp within minutes.";
        submitText = "Download Master Plan";
        source = "Master Plan Download";
      } else if (btn.classList.contains("button-brochure-download") || btn.classList.contains("intro-pdf-download-btn") || btn.closest(".brochure-section")) {
        title = "Download Official Brochure";
        subtitle = "High-resolution architectural brochure by Hafeez Contractor on WhatsApp within minutes.";
        submitText = "Download Brochure PDF";
        source = "Brochure Download";
      } else if (btn.classList.contains("button-get-price") || btn.closest(".pricing-table-row")) {
        const row = btn.closest(".pricing-table-row");
        const cfgTitle = row ? row.querySelector(".row-config-title")?.textContent.trim() : "";
        config = cfgTitle || "";
        title = cfgTitle ? `Get Price For ${cfgTitle}` : "Get Official Price List";
        subtitle = "All-inclusive pricing, floor-rise options, and payment plans on WhatsApp within minutes.";
        submitText = cfgTitle ? `Get ${cfgTitle} Price` : "Get Price List";
        source = `Pricing Table - ${cfgTitle || "General"}`;
      } else if (btn.classList.contains("button-complete-costing")) {
        title = "Request Detailed Cost Sheet";
        subtitle = "All-inclusive breakdown with milestone payment schedule, GST, and stamp duty on WhatsApp.";
        submitText = "Get Complete Cost Sheet";
        source = "Cost Sheet Request";
      } else if (btn.classList.contains("button-download-plan-card") || btn.classList.contains("button-download-plan-main") || btn.closest(".floorplans-section")) {
        const activeTab = document.querySelector(".floorplan-pill-tab.is-active, .floorplan-pill-tab[aria-selected='true']");
        const cfgTitle = activeTab ? activeTab.textContent.trim() : "";
        config = cfgTitle || "";
        title = cfgTitle ? `Download ${cfgTitle} Floor Plan` : "Download Unit Floor Plans";
        subtitle = "Floor-by-floor blueprints, carpet area, and room dimensions on WhatsApp within minutes.";
        submitText = "Download Floor Plan";
        source = `Floor Plan - ${cfgTitle || "General"}`;
      } else if (btn.classList.contains("button-schedule-tour") || btn.closest(".virtual-tour-section")) {
        title = "Schedule a Virtual Tour";
        subtitle = "Book a 1-on-1 live video walkthrough of Godrej Florenne with our Bengaluru sales desk.";
        submitText = "Schedule Virtual Tour";
        source = "Virtual Tour Booking";
      } else if (btn.classList.contains("spec-quote-btn")) {
        title = "Get The Complete Price List";
        subtitle = "Current Godrej Florenne price breakdown starting from ₹5.40 Cr* on WhatsApp.";
        submitText = "Get Price List";
        source = "Specs Quote";
      } else if (btn.classList.contains("nav-cta")) {
        title = "Get The Complete Price List";
        subtitle = "Current launch price sheet, unit availability, and floor plans on WhatsApp within minutes.";
        submitText = "Get Price List";
        source = "Navbar CTA";
      } else if (btn.classList.contains("mobile-bar-enquire") || btn.classList.contains("floating-enquire-tab")) {
        title = "Enquire About Godrej Florenne";
        subtitle = "Share your details to receive current pricing, unit plans, and launch allocation on WhatsApp.";
        submitText = "Enquire Now";
        source = "Fixed Action Bar";
      } else if (btn.classList.contains("button-launch-details")) {
        title = "Request Launch Allocation Details";
        subtitle = "Phase 1 & Phase 2 launch availability and priority allotment on WhatsApp.";
        submitText = "Request Launch Details";
        source = "Launch Details";
      } else {
        const text = btn.textContent.trim().replace(/[→↗]/g, '').trim();
        title = text ? text : "Enquire About Godrej Florenne";
        subtitle = "Official project details, price sheet, and floor plans on WhatsApp within minutes.";
        submitText = text ? text : "Submit Request";
        source = text || "General Button Click";
      }

      openEnquiryModal({ title, subtitle, submitText, source, config });
    }
  });

  // Escape key closes enquiry modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && enquiryModal && !enquiryModal.hidden) {
      closeEnquiryModal();
    }
  });

  // Popup Form Submission with WhatsApp Handover
  if (popupForm) {
    popupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(popupForm);
      const name = formData.get("name") || "";
      const phone = formData.get("phone") || "";
      const code = formData.get("countryCode") || "+91";
      const email = formData.get("email") || "";
      const homeType = formData.get("homeType") || "4 BHK Optima";
      const source = formData.get("sourceContext") || "Popup Modal";

      const submitBtn = popupForm.querySelector("button[type='submit']");
      const feedback = popupForm.querySelector(".form-feedback");

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.7";
      }

      const msg = encodeURIComponent(
        `Hi, I am interested in Godrej Florenne. Name: ${name}, Phone: ${code} ${phone}${email ? `, Email: ${email}` : ""}, Looking For: ${homeType}, Request: ${source}`
      );

      if (feedback) {
        feedback.textContent = "Thank you! Opening WhatsApp to share your request...";
        feedback.className = "form-feedback is-visible form-success";
      }

      setTimeout(() => {
        window.open(`https://wa.me/919342333197?text=${msg}`, "_blank", "noopener,noreferrer");
        setTimeout(() => {
          closeEnquiryModal();
          popupForm.reset();
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.style.opacity = "";
          }
          if (feedback) {
            feedback.textContent = "";
            feedback.className = "form-feedback";
          }
        }, 1200);
      }, 600);
    });
  }

  // ==========================================================================
  // Direct In-Place Walkthrough Video Player with Timed Popups (0:15, 0:50, 1:52)
  // ==========================================================================
  const virtualTourVideo = document.querySelector("#virtual-tour-video");
  const tourFrame = document.querySelector("#tour-frame");
  const openTourBtn = document.querySelector("#open-tour");

  let videoTriggered15 = false;
  let videoTriggered50 = false;
  let videoTriggered112 = false;

  const startInlineTour = () => {
    if (!virtualTourVideo || !tourFrame) return;
    tourFrame.classList.add("is-playing");
    virtualTourVideo.controls = true;
    virtualTourVideo.play().catch(() => {});
  };

  if (openTourBtn) {
    openTourBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      startInlineTour();
    });
  }

  if (tourFrame) {
    tourFrame.addEventListener("click", (e) => {
      if (!tourFrame.classList.contains("is-playing")) {
        startInlineTour();
      }
    });
  }

  if (virtualTourVideo) {
    virtualTourVideo.addEventListener("timeupdate", () => {
      const ct = virtualTourVideo.currentTime;

      // Reset triggers if user rewinds/scrubs back before checkpoints
      if (ct < 14) videoTriggered15 = false;
      if (ct < 49) videoTriggered50 = false;
      if (ct < 111) videoTriggered112 = false;

      // Checkpoint 1: at 00:15 sec -> "Download Floor Plan" Popup
      if (ct >= 15 && !videoTriggered15) {
        videoTriggered15 = true;
        videoPausedByCheckpoint = true;
        virtualTourVideo.pause();
        openEnquiryModal({
          title: "Download Unit Floor Plans",
          subtitle: "Floor-by-floor blueprints, carpet areas and private elevator specs on WhatsApp within minutes.",
          submitText: "Download Floor Plan",
          source: "Video Checkpoint (00:15 - Floor Plans)",
          config: "4 BHK Optima"
        });
      }
      // Checkpoint 2: at 00:50 sec -> "Wanting Pricing Sheet / Price List" Popup
      else if (ct >= 50 && !videoTriggered50) {
        videoTriggered50 = true;
        videoPausedByCheckpoint = true;
        virtualTourVideo.pause();
        openEnquiryModal({
          title: "Get The Complete Price List",
          subtitle: "All-inclusive pricing sheet, payment plans and launch allocation on WhatsApp within minutes.",
          submitText: "Get Price List",
          source: "Video Checkpoint (00:50 - Pricing Sheet)",
          config: "4 BHK Premia"
        });
      }
      // Checkpoint 3: at 01:52 sec (112s) -> "Book Site Visit & Get Detailed Costing" Popup
      else if (ct >= 112 && !videoTriggered112) {
        videoTriggered112 = true;
        videoPausedByCheckpoint = true;
        virtualTourVideo.pause();
        openEnquiryModal({
          title: "Book a Private Site Visit",
          subtitle: "Schedule a personalized appointment with complimentary pickup option and direct developer pricing.",
          submitText: "Book Site Visit",
          source: "Video Checkpoint (01:52 - Site Visit)",
          config: "4 BHK Luxe"
        });
      }
    });
  }

  // Backup tour modal for secondary triggers if present
  const tourModal = document.querySelector("#tour-modal");
  const tourVideo = document.querySelector("#tour-video");
  let previousFocus = null;

  const closeTour = () => {
    if (!tourModal) return;
    tourModal.hidden = true;
    if (tourVideo) tourVideo.pause();
    previousFocus?.focus();
  };

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

      const isIntro = form.getAttribute("data-enquiry-form") === "intro";
      const name = form.elements.name ? form.elements.name.value.trim() : "Valued Guest";
      const phone = form.elements.phone ? form.elements.phone.value.trim() : "";
      const feedback = form.querySelector(".form-feedback");
      if (feedback) {
        feedback.textContent = `Thank you${name !== "Valued Guest" ? ", " + name : ""}. Your Godrej Florenne cost sheet & floor plans are on the way!`;
      }
      form.reset();

      if (toast) {
        toast.textContent = isIntro
          ? "Thank you! The Godrej Florenne cost sheet & unit plans have been dispatched to WhatsApp."
          : "Thank you! Your enquiry for Godrej Florenne has been registered.";
        toast.classList.add("is-visible");
        window.clearTimeout(toastTimeout);
        toastTimeout = window.setTimeout(() => toast.classList.remove("is-visible"), 5000);
      }

      if (isIntro && phone) {
        const msg = encodeURIComponent(`Hi, I am interested in Godrej Florenne and would like to receive the official cost sheet and floor plans. My mobile is ${phone}.`);
        window.open(`https://wa.me/919342333197?text=${msg}`, "_blank", "noopener,noreferrer");
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
