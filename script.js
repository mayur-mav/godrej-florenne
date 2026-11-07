(() => {
  "use strict";

  const data = window.florenneData;
  const salesWhatsappNumber = "917411662228";
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
              <div class="floorplan-plans-grid">
                <figure class="floorplan-plan-preview">
                  <figcaption class="floorplan-plan-label">Ground &amp; First Floor</figcaption>
                  <div class="floorplan-image-wrap">
                    <img class="floorplan-stage-img" src="${escapeHtml(plan.image)}" alt="${escapeHtml(plan.tabName || plan.name)} ground and first floor plan" loading="lazy" decoding="async" draggable="false">
                    <span class="floorplan-image-fade" aria-hidden="true"></span>
                  </div>
                </figure>
                <figure class="floorplan-plan-preview">
                  <figcaption class="floorplan-plan-label">Second &amp; Third Floor</figcaption>
                  <div class="floorplan-image-wrap">
                    <img class="floorplan-stage-img" src="${escapeHtml(plan.secondImage)}" alt="${escapeHtml(plan.tabName || plan.name)} second and third floor plan" loading="lazy" decoding="async" draggable="false">
                    <span class="floorplan-image-fade" aria-hidden="true"></span>
                  </div>
                </figure>
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
          <img src="${escapeHtml(home.image)}" alt="${escapeHtml(home.imageAlt)}" loading="lazy" decoding="async" draggable="false">
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
        <img src="${escapeHtml(photo.src)}" alt="${escapeHtml(photo.alt || photo.tag)}" loading="lazy" decoding="async" draggable="false">
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

  const locationMapElement = document.querySelector("#location-leaflet-map");
  if (locationMapElement) {
    let locationMapInitialized = false;
    let locationMapObserver = null;

    const initializeLocationMap = () => {
      if (locationMapInitialized) return;

      if (!window.L) {
        const leafletScript = document.querySelector('script[src*="leaflet"]');
        if (leafletScript && !leafletScript.dataset.loaded && !leafletScript.dataset.failed) {
          leafletScript.addEventListener("load", () => {
            leafletScript.dataset.loaded = "true";
            initializeLocationMap();
          }, { once: true });
          leafletScript.addEventListener("error", () => {
            leafletScript.dataset.failed = "true";
            locationMapInitialized = true;
            locationMapElement.innerHTML = '<p class="location-map-error" role="alert">The interactive map could not be loaded. Please refresh the page to try again.</p>';
          }, { once: true });
          return;
        }

        locationMapInitialized = true;
        locationMapElement.innerHTML = '<p class="location-map-error" role="alert">The interactive map could not be loaded. Please refresh the page to try again.</p>';
        return;
      }

      locationMapInitialized = true;

      const location = [12.9924594, 77.8068603];
      const map = window.L.map(locationMapElement, { scrollWheelZoom: false }).setView(location, 15);

      window.L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      window.L.marker(location, {
        title: "Godrej Florenne",
        alt: "Godrej Florenne, Hemmandahalli, Bengaluru"
      }).addTo(map).bindPopup("<strong>Godrej Florenne</strong><br>Hemmandahalli, Bengaluru").openPopup();
    };

    if ("IntersectionObserver" in window) {
      const locationMapObserver = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          locationMapObserver.disconnect();
          initializeLocationMap();
        }
      }, { rootMargin: "300px" });
      locationMapObserver.observe(locationMapElement);
    } else {
      setTimeout(initializeLocationMap, 2000);
    }
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
    const leftFaqs = [];
    const rightFaqs = [];
    data.faqs.forEach((item, index) => {
      const isLeft = index % 2 === 0;
      const cardHtml = `
      <details class="faq-accordion-item" name="${isLeft ? 'faq-col-left' : 'faq-col-right'}" style="order: ${index};">
        <summary class="faq-accordion-summary">
          <span class="faq-accordion-question">${escapeHtml(item.question)}</span>
          <span class="faq-accordion-toggle" aria-hidden="true">+</span>
        </summary>
        <div class="faq-accordion-body">
          <p class="faq-accordion-answer">${escapeHtml(item.answer)}</p>
        </div>
      </details>`;
      if (isLeft) {
        leftFaqs.push(cardHtml);
      } else {
        rightFaqs.push(cardHtml);
      }
    });

    render(
      "#faq-list",
      `<div class="faq-column faq-column-left">${leftFaqs.join("")}</div>` +
      `<div class="faq-column faq-column-right">${rightFaqs.join("")}</div>`
    );

    const faqContainer = document.querySelector("#faq-list");
    if (faqContainer && !faqContainer.dataset.boundAccordion) {
      faqContainer.dataset.boundAccordion = "true";
      faqContainer.addEventListener("toggle", (event) => {
        const target = event.target;
        if (!target.open || !target.classList.contains("faq-accordion-item")) return;
        const col = target.closest(".faq-column");
        if (!col) return;
        col.querySelectorAll(".faq-accordion-item[open]").forEach((item) => {
          if (item !== target) {
            item.removeAttribute("open");
          }
        });
      }, true);
    }
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
  const phoneLengthsByCountry = {
    "+1": { min: 10, max: 10 },
    "+44": { min: 10, max: 10 },
    "+49": { min: 10, max: 11 },
    "+60": { min: 9, max: 10 },
    "+61": { min: 9, max: 9 },
    "+64": { min: 9, max: 9 },
    "+65": { min: 8, max: 8 },
    "+852": { min: 8, max: 8 },
    "+91": { min: 10, max: 10 },
    "+965": { min: 8, max: 8 },
    "+966": { min: 9, max: 9 },
    "+968": { min: 8, max: 8 },
    "+971": { min: 9, max: 9 },
    "+973": { min: 8, max: 8 },
    "+974": { min: 8, max: 8 }
  };
  const leadForms = document.querySelectorAll("form[data-enquiry-form], #video-lead-form");
  const getFieldError = (control) => {
    const wrapper = control.closest(".phone-field-group, .visit-phone-row, .popup-phone-row, .intro-tel-group, .video-lead-phone-field, .custom-select-wrap, .visit-select-box, .popup-select-box") || control;
    const error = wrapper.parentElement.querySelector(`.field-error[data-for="${control.id || control.name}"]`);
    if (error && error.dataset.control === (control.id || control.name)) return error;
    const message = document.createElement("span");
    message.className = "field-error";
    message.dataset.for = control.id || control.name;
    message.dataset.control = control.id || control.name;
    message.id = `${control.id || control.name}-error`;
    message.setAttribute("role", "alert");
    message.setAttribute("aria-live", "polite");
    message.hidden = true;
    wrapper.insertAdjacentElement("afterend", message);
    control.setAttribute("aria-describedby", [...new Set([...(control.getAttribute("aria-describedby") || "").split(/\s+/), message.id].filter(Boolean))].join(" "));
    return message;
  };

  const getPhoneError = (input) => {
    const form = input.form;
    const wrapper = input.closest(".intro-input-row") ||
      input.closest(".phone-field-group, .visit-phone-row, .popup-phone-row, .intro-tel-group, .video-lead-phone-field");
    const parent = wrapper || input.parentElement;
    const key = input.id || input.name;
    let error = parent.parentElement.querySelector(`.field-error[data-for="${key}"]`);
    if (!error) {
      error = document.createElement("span");
      error.className = "field-error";
      error.dataset.for = key;
      error.dataset.control = key;
      error.id = `${key}-error`;
      error.setAttribute("role", "alert");
      error.setAttribute("aria-live", "polite");
      error.hidden = true;
      parent.insertAdjacentElement("afterend", error);
    }
    input.setAttribute("aria-describedby", [...new Set([...(input.getAttribute("aria-describedby") || "").split(/\s+/), error.id].filter(Boolean))].join(" "));
    if (form) {
      const countrySelect = form.querySelector('select[name="countryCode"]');
      const countryCode = countrySelect ? countrySelect.value : "+91";
      const lengths = phoneLengthsByCountry[countryCode] || { min: 10, max: 10 };
      input.maxLength = lengths.max;
      input.placeholder = lengths.min === lengths.max
        ? `${lengths.max}-digit mobile number`
        : `${lengths.min}-${lengths.max}-digit mobile number`;
      input.inputMode = "numeric";
      input.dataset.phoneMinLength = String(lengths.min);
      input.dataset.phoneMaxLength = String(lengths.max);
    }
    return error;
  };

  const getFieldLabel = (control) => {
    const label = control.labels?.[0]?.textContent.trim()
      || control.getAttribute("aria-label")
      || control.placeholder
      || control.name
      || "this field";
    return label.replace(/\s+/g, " ").replace(/:$/, "").toLowerCase();
  };

  const getValidationMessage = (control) => {
    const value = control.value.trim();
    if (control.type === "tel" || control.name === "phone") {
      const minLength = Number(control.dataset.phoneMinLength) || 10;
      const maxLength = Number(control.dataset.phoneMaxLength) || minLength;
      if (!value) return "Please enter your phone number.";
      if (!new RegExp(`^\\d{${minLength},${maxLength}}$`).test(value)) {
        return minLength === maxLength
          ? `Enter a valid ${minLength}-digit phone number.`
          : `Enter a valid ${minLength}-${maxLength}-digit phone number.`;
      }
      return "";
    }
    if (control.type === "email") {
      if (control.required && !value) return "Please enter your email address.";
      if (value && control.validity.typeMismatch) return "Enter a valid email address.";
      return "";
    }
    if (control.required && !value) {
      if (control.tagName === "SELECT") {
        const label = getFieldLabel(control);
        return `Please select ${label === "looking for" ? "a home type" : `your ${label}`}.`;
      }
      return `Please enter your ${getFieldLabel(control)}.`;
    }
    if (control.name === "name" && value && value.length < 2) {
      return "Enter at least 2 characters.";
    }
    return "";
  };

  const validateControl = (control) => {
    const isPhone = control.type === "tel" || control.name === "phone";
    const error = isPhone ? getPhoneError(control) : getFieldError(control);
    const message = getValidationMessage(control);
    error.textContent = message;
    error.hidden = !message;
    control.classList.toggle("is-invalid", Boolean(message));
    control.setAttribute("aria-invalid", message ? "true" : "false");
    if (control.tagName === "SELECT") {
      const shell = control.closest(".custom-dropdown-shell");
      const trigger = shell?.querySelector(".custom-dropdown-trigger");
      if (trigger) {
        trigger.classList.toggle("is-invalid", Boolean(message));
        trigger.setAttribute("aria-invalid", message ? "true" : "false");
        const errorId = error.id;
        trigger.setAttribute("aria-describedby", errorId);
      }
    }
    return !message;
  };

  const validateForm = (form) => {
    let valid = true;
    let firstInvalid = null;
    form.querySelectorAll("input:not([type='hidden']), select, textarea").forEach((control) => {
      if (!validateControl(control)) {
        valid = false;
        if (!firstInvalid) firstInvalid = control;
      }
    });
    if (!valid) {
      const shell = firstInvalid.closest(".custom-dropdown-shell");
      (shell?.querySelector(".custom-dropdown-trigger") || firstInvalid).focus();
    }
    return valid;
  };

  const syncCustomSelect = (select, trigger) => {
    const selectedOption = select.options[select.selectedIndex];
    trigger.textContent = selectedOption ? selectedOption.textContent.trim() : "Select an option";
    trigger.setAttribute("aria-label", select.getAttribute("aria-label") || select.labels?.[0]?.textContent.trim() || "Choose an option");
    trigger.dataset.value = select.value;
    select.closest(".custom-dropdown-shell")?.querySelectorAll('[role="option"]').forEach((option) => {
      const selected = option.dataset.value === select.value;
      option.setAttribute("aria-selected", selected ? "true" : "false");
      option.classList.toggle("is-selected", selected);
    });
  };

  const closeCustomDropdowns = (except) => {
    document.querySelectorAll(".custom-dropdown-shell.is-open").forEach((shell) => {
      if (shell === except) return;
      shell.classList.remove("is-open");
      shell.querySelector(".custom-dropdown-trigger")?.setAttribute("aria-expanded", "false");
      shell.querySelector(".custom-dropdown-list")?.setAttribute("hidden", "");
    });
  };

  document.querySelectorAll("form[data-enquiry-form], #video-lead-form").forEach((form) => {
    form.noValidate = true;
    form.querySelectorAll("input[type='tel'], input[name='phone']").forEach((input) => {
      getPhoneError(input);
      input.addEventListener("input", () => {
        const code = form.querySelector('select[name="countryCode"]')?.value || "+91";
        const lengths = phoneLengthsByCountry[code] || { min: 10, max: 10 };
        let digits = input.value.replace(/\D/g, "");
        const dialDigits = code.slice(1);
        if (digits.startsWith(dialDigits) && digits.length > lengths.max) digits = digits.slice(dialDigits.length);
        input.value = digits.slice(0, lengths.max);
        if (input.getAttribute("aria-invalid") === "true") validateControl(input);
      });
    });
    form.querySelectorAll("input:not([type='hidden']), select, textarea").forEach((control) => {
      control.addEventListener("input", () => {
        if (control.getAttribute("aria-invalid") === "true") validateControl(control);
      });
      control.addEventListener("change", () => {
        if (control.getAttribute("aria-invalid") === "true") validateControl(control);
      });
    });
    form.addEventListener("reset", () => {
      window.setTimeout(() => {
        form.querySelectorAll(".field-error").forEach((error) => {
          error.textContent = "";
          error.hidden = true;
        });
        form.querySelectorAll(".is-invalid").forEach((control) => {
          control.classList.remove("is-invalid");
          control.removeAttribute("aria-invalid");
        });
        form.querySelectorAll("select").forEach((select) => {
          const shell = select.closest(".custom-dropdown-shell");
          const trigger = shell?.querySelector(".custom-dropdown-trigger");
          if (trigger) syncCustomSelect(select, trigger);
        });
        form.querySelectorAll("input[type='tel'], input[name='phone']").forEach(getPhoneError);
      }, 0);
    });
  });

  document.addEventListener("submit", (event) => {
    const form = event.target;
    if (!form.matches("form[data-enquiry-form], #video-lead-form")) return;
    closeCustomDropdowns();
    if (!validateForm(form)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);

  document.querySelectorAll("select").forEach((select, selectIndex) => {
    const shell = document.createElement("div");
    const countryVariant = select.classList.contains("phone-country-select")
      ? " is-hero-country"
      : select.classList.contains("visit-country-select")
        ? " is-visit-country"
        : select.classList.contains("popup-country-select")
          ? " is-popup-country"
          : "";
    shell.className = `custom-dropdown-shell${select.name === "countryCode" ? " is-country" : ""}${countryVariant}`;
    const parent = select.parentElement;
    parent.insertBefore(shell, select);
    shell.appendChild(select);
    select.classList.add("custom-dropdown-native");
    select.tabIndex = -1;
    select.setAttribute("aria-hidden", "true");
    parent.querySelectorAll(":scope > .country-arrow-icon, :scope > .popup-select-arrow, :scope > .select-arrow-icon").forEach((arrow) => arrow.remove());

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = `custom-dropdown-trigger ${Array.from(select.classList).filter((className) => className !== "custom-dropdown-native").join(" ")}`;
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-controls", `custom-select-list-${selectIndex}`);

    const list = document.createElement("div");
    list.className = "custom-dropdown-list";
    list.id = `custom-select-list-${selectIndex}`;
    list.setAttribute("role", "listbox");
    list.setAttribute("hidden", "");

    Array.from(select.options).forEach((option, optionIndex) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "custom-dropdown-option";
      item.setAttribute("role", "option");
      item.setAttribute("aria-selected", option.selected ? "true" : "false");
      item.dataset.value = option.value;
      item.textContent = option.textContent.trim();
      item.tabIndex = -1;
      item.addEventListener("click", () => {
        select.selectedIndex = optionIndex;
        select.dispatchEvent(new Event("change", { bubbles: true }));
        syncCustomSelect(select, trigger);
        shell.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
        list.hidden = true;
        trigger.focus();
      });
      list.appendChild(item);
    });

    const openList = (last = false) => {
      closeCustomDropdowns(shell);
      shell.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
      list.hidden = false;
      const options = Array.from(list.querySelectorAll('[role="option"]'));
      (last ? options[options.length - 1] : options[select.selectedIndex])?.focus();
    };

    trigger.addEventListener("click", () => {
      if (shell.classList.contains("is-open")) {
        closeCustomDropdowns();
      } else {
        openList();
      }
    });
    trigger.addEventListener("keydown", (event) => {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        openList(event.key === "ArrowUp");
      }
    });
    list.addEventListener("keydown", (event) => {
      const options = Array.from(list.querySelectorAll('[role="option"]'));
      const currentIndex = options.indexOf(document.activeElement);
      let nextIndex = currentIndex;
      if (event.key === "ArrowDown") nextIndex = Math.min(options.length - 1, currentIndex + 1);
      else if (event.key === "ArrowUp") nextIndex = Math.max(0, currentIndex - 1);
      else if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = options.length - 1;
      else if (event.key === "Escape") {
        closeCustomDropdowns();
        trigger.focus();
        event.preventDefault();
        return;
      } else if (event.key === "Enter" || event.key === " ") {
        document.activeElement.click();
        event.preventDefault();
        return;
      } else {
        return;
      }
      event.preventDefault();
      options[nextIndex]?.focus();
    });
    select.addEventListener("change", () => {
      syncCustomSelect(select, trigger);
      const phone = select.form?.querySelector('input[type="tel"], input[name="phone"]');
      if (phone) {
        getPhoneError(phone);
        if (phone.value && phone.getAttribute("aria-invalid") === "true") validateControl(phone);
      }
    });

    shell.append(trigger, list);
    syncCustomSelect(select, trigger);
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".custom-dropdown-shell")) closeCustomDropdowns();
  });

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

  function closeEnquiryModal() {
    if (!enquiryModal) return;
    enquiryModal.hidden = true;
    document.body.style.overflow = "";

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

    // 2. Scroll to virtual tour if requested (e.g. Schedule a Virtual Tour CTA)
    const tourScrollTrigger = event.target.closest("[data-scroll-virtual-tour], .button-schedule-tour");
    if (tourScrollTrigger) {
      event.preventDefault();
      const target = document.querySelector("#virtual-tour");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        const playBtn = target.querySelector("#open-tour");
        const video = target.querySelector("#virtualTourVideo");
        if (video && video.paused && playBtn) {
          setTimeout(() => {
            playBtn.click();
          }, 600);
        }
      }
      return;
    }

    // 3. CTA Buttons triggering the Popup Modal
    const btn = event.target.closest(
      "[data-scroll-enquire], [data-open-modal], .nav-cta, .mobile-bar-enquire, .floating-enquire-tab, .spec-quote-btn, .button-brochure-download, .button-complete-costing, .button-download-masterplan, .button-download-plan-card, .button-download-plan-main, .intro-pdf-download-btn, .button-get-price, .button-launch-details"
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
        window.open(`https://wa.me/${salesWhatsappNumber}?text=${msg}`, "_blank", "noopener,noreferrer");
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
  // Direct In-Place Walkthrough Video Player
  // ==========================================================================
  const virtualTourVideo = document.querySelector("#virtual-tour-video");
  const tourFrame = document.querySelector("#tour-frame");
  const openTourBtn = document.querySelector("#open-tour");
  const videoLeadCard = document.querySelector("#videoLeadCard");
  const videoLeadClose = document.querySelector("#video-lead-close");
  const videoLeadPill = document.querySelector("#video-lead-pill");
  const videoPlayerActions = document.querySelector("#video-player-actions");
  const videoControls = document.querySelector("#video-controls");
  const videoToggleButton = document.querySelector("#video-toggle");
  const videoProgress = document.querySelector("#video-progress");
  const videoCaptionsToggle = document.querySelector("#video-captions-toggle");
  const videoCurrentTime = document.querySelector("#video-current-time");
  const videoDuration = document.querySelector("#video-duration");
  const videoLeadForm = document.querySelector("#video-lead-form");
  const videoLeadPhone = document.querySelector("#video-lead-phone");
  let hasTriggeredVideoLead = false;

  const startInlineTour = () => {
    if (!virtualTourVideo || !tourFrame) return;
    tourFrame.classList.add("is-playing");
    if (videoControls) videoControls.hidden = false;
    const videoSource = virtualTourVideo.querySelector("source[data-src]");
    if (videoSource) {
      videoSource.src = videoSource.dataset.src;
      delete videoSource.dataset.src;
      virtualTourVideo.load();
    }
    virtualTourVideo.play().catch(() => {});
  };

  const formatVideoTime = (time) => {
    if (!Number.isFinite(time) || time < 0) return "0:00";
    const totalSeconds = Math.floor(time);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return hours ? `${hours}:${String(minutes).padStart(2, "0")}:${seconds}` : `${minutes}:${seconds}`;
  };

  const updateVideoControls = () => {
    if (!virtualTourVideo) return;
    const duration = virtualTourVideo.duration;
    const currentTime = virtualTourVideo.currentTime;
    if (videoCurrentTime) videoCurrentTime.textContent = formatVideoTime(currentTime);
    if (videoDuration) videoDuration.textContent = formatVideoTime(duration);
    if (videoProgress && Number.isFinite(duration) && duration > 0) {
      const progress = Math.round((currentTime / duration) * Number(videoProgress.max));
      videoProgress.value = String(progress);
      videoProgress.style.setProperty("--progress", `${(currentTime / duration) * 100}%`);
    }
    if (videoToggleButton) {
      const paused = virtualTourVideo.paused || virtualTourVideo.ended;
      videoToggleButton.setAttribute("aria-label", paused ? "Play video" : "Pause video");
      videoToggleButton.innerHTML = paused
        ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>'
        : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zM15 5h4v14h-4z"/></svg>';
      if (tourFrame) tourFrame.classList.toggle("is-paused", paused && tourFrame.classList.contains("is-playing"));
    }
  };

  const updateCaptionsToggle = () => {
    if (!virtualTourVideo || !videoCaptionsToggle) return;
    const tracks = virtualTourVideo.textTracks ? Array.from(virtualTourVideo.textTracks) : [];
    const captionsTrack = tracks.find((track) => track.kind === "captions");
    const captionsEnabled = captionsTrack?.mode === "showing";
    videoCaptionsToggle.setAttribute("aria-pressed", String(captionsEnabled));
    videoCaptionsToggle.setAttribute("aria-label", captionsEnabled ? "Turn captions off" : "Turn captions on");
  };

  if (videoCaptionsToggle && virtualTourVideo) {
    videoCaptionsToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const tracks = virtualTourVideo.textTracks ? Array.from(virtualTourVideo.textTracks) : [];
      const captionsTrack = tracks.find((track) => track.kind === "captions");
      if (!captionsTrack) return;
      captionsTrack.mode = captionsTrack.mode === "showing" ? "disabled" : "showing";
      updateCaptionsToggle();
    });
    virtualTourVideo.addEventListener("loadedmetadata", updateCaptionsToggle);
    virtualTourVideo.textTracks?.addEventListener?.("change", updateCaptionsToggle);
  }

  const toggleVideoPlayback = () => {
    if (!virtualTourVideo) return;
    if (virtualTourVideo.paused || virtualTourVideo.ended) {
      startInlineTour();
    } else {
      virtualTourVideo.pause();
    }
  };

  if (openTourBtn) {
    openTourBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleVideoPlayback();
    });
  }

  if (tourFrame) {
    tourFrame.addEventListener("click", (e) => {
      if (e.target.closest("button, input, .video-lead-card")) return;
      toggleVideoPlayback();
    });
  }

  if (videoToggleButton) {
    videoToggleButton.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleVideoPlayback();
    });
  }

  if (videoProgress && virtualTourVideo) {
    videoProgress.addEventListener("input", () => {
      if (!Number.isFinite(virtualTourVideo.duration) || virtualTourVideo.duration <= 0) return;
      virtualTourVideo.currentTime = (Number(videoProgress.value) / Number(videoProgress.max)) * virtualTourVideo.duration;
    });
  }

  if (virtualTourVideo) {
    ["loadedmetadata", "durationchange", "timeupdate", "play", "pause", "ended", "seeked"].forEach((eventName) => {
      virtualTourVideo.addEventListener(eventName, updateVideoControls);
    });

    virtualTourVideo.addEventListener("play", () => {
      if (virtualTourVideo.currentTime < 0.5) {
        hasTriggeredVideoLead = false;
      }
    });

    virtualTourVideo.addEventListener("ended", () => {
      hasTriggeredVideoLead = true;
      virtualTourVideo.currentTime = 0;
      showVideoLeadCard();
    });
  }

  const showVideoLeadCard = () => {
    if (!videoLeadCard) return;
    videoLeadCard.hidden = false;
    videoLeadCard.setAttribute("aria-hidden", "false");
    if (videoLeadPill) videoLeadPill.hidden = true;
    if (videoPlayerActions) videoPlayerActions.hidden = true;
    requestAnimationFrame(() => videoLeadCard.classList.add("is-visible"));
  };

  const collapseVideoLeadCard = () => {
    if (!videoLeadCard) return;
    videoLeadCard.classList.remove("is-visible");
    videoLeadCard.setAttribute("aria-hidden", "true");
    if (videoLeadPill) videoLeadPill.hidden = false;
    if (videoPlayerActions) videoPlayerActions.hidden = false;
    window.setTimeout(() => {
      if (!videoLeadCard.classList.contains("is-visible")) {
        videoLeadCard.hidden = true;
      }
    }, 450);
  };

  if (virtualTourVideo && videoLeadCard) {
    virtualTourVideo.addEventListener("timeupdate", () => {
      if (!hasTriggeredVideoLead && Number.isFinite(virtualTourVideo.duration) &&
          virtualTourVideo.duration > 0 &&
          (virtualTourVideo.currentTime / virtualTourVideo.duration) * 100 >= 35) {
        hasTriggeredVideoLead = true;
        showVideoLeadCard();
      }
    });
  }

  if (videoLeadClose) {
    videoLeadClose.addEventListener("click", (event) => {
      event.stopPropagation();
      collapseVideoLeadCard();
    });
  }

  if (videoLeadPill) {
    videoLeadPill.addEventListener("click", (event) => {
      event.stopPropagation();
      showVideoLeadCard();
      videoLeadPhone?.focus();
    });
  }

  if (videoLeadForm && videoLeadPhone) {
    videoLeadForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!validateForm(videoLeadForm)) return;

      const phone = videoLeadPhone.value.trim();
      const message = `Hi, I was watching the Godrej Florenne walkthrough video. My phone number is ${phone}. Please share the official cost sheet & 4/5 BHK layouts.`;
      const whatsappUrl = `https://wa.me/${salesWhatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      collapseVideoLeadCard();
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
      if (!validateForm(form)) return;

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
        const msg = encodeURIComponent(`Hi, I am interested in Godrej Florenne and would like to receive the official cost sheet and floor plans. My mobile number is ${phone}.`);
        window.open(`https://wa.me/${salesWhatsappNumber}?text=${msg}`, "_blank", "noopener,noreferrer");
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
    let isScrolled = false;
    let ticking = false;
    const updateHeader = () => {
      const scrolled = window.scrollY > 20;
      if (scrolled !== isScrolled) {
        isScrolled = scrolled;
        siteHeader.classList.toggle("is-scrolled", isScrolled);
      }
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
  }

  // ==========================================================================
  // Image & Media Preservation Protection
  // Prevents image dragging, right-click saving / copying image address, and mobile long-press menus
  // ==========================================================================
  const isProtectedMedia = (el) => {
    if (!el) return false;
    const tag = el.tagName ? el.tagName.toUpperCase() : "";
    if (tag === "IMG" || tag === "VIDEO") return true;
    if (el.closest && el.closest("img, video, .hero-image, .showcase-stage, .amenity-stage, .amenities-showcase-frame, .brochure-stage-wrapper, .location-map-frame, .masterplan-card-sheet, .landscape-band, .virtual-tour-frame, .gallery-card, .floorplan-stage-card, .residence-image")) {
      return true;
    }
    return false;
  };

  document.addEventListener("contextmenu", (e) => {
    if (isProtectedMedia(e.target)) {
      e.preventDefault();
      return false;
    }
  }, { capture: true });

  document.addEventListener("dragstart", (e) => {
    if (isProtectedMedia(e.target)) {
      e.preventDefault();
      return false;
    }
  }, { capture: true });

  document.querySelectorAll("img, video").forEach((media) => {
    media.setAttribute("draggable", "false");
  });
})();
