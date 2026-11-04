(() => {
  "use strict";

  const data = window.florenneData;
  if (!data) {
    throw new Error("Florenne page data could not be loaded.");
  }

  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);

  const render = (selector, markup) => {
    const element = document.querySelector(selector);
    if (!element) {
      throw new Error(`Required page element is missing: ${selector}`);
    }
    element.innerHTML = markup;
    return element;
  };

  render("#quick-facts", data.facts.map((fact) => `
    <div class="fact-item">
      <span class="fact-value">${escapeHtml(fact.value)}</span>
      <span class="fact-label">${escapeHtml(fact.label)}</span>
    </div>
  `).join(""));

  render("#project-details", data.projectDetails.map((detail) => `
    <div class="project-table-row"><strong>${escapeHtml(detail.label)}</strong><span>${escapeHtml(detail.value)}</span></div>
  `).join(""));

  render("#overview-highlights", data.highlights.map((highlight) => `
    <p><span aria-hidden="true">✓</span>${escapeHtml(highlight)}</p>
  `).join(""));

  render("#brochure-items", data.brochureItems.map((item) => `
    <p><span aria-hidden="true">✓</span>${escapeHtml(item)}</p>
  `).join(""));

  render("#price-rows", data.prices.map((price) => `
    <div class="price-table-row">
      <strong>${escapeHtml(price.configuration)}</strong>
      <span>${escapeHtml(price.starting)}</span>
      <button class="text-link" type="button" data-scroll-enquire>Request details <span aria-hidden="true">↗</span></button>
    </div>
  `).join(""));

  const floorplanTabs = render("#floorplan-tabs", data.floorPlans.map((plan, index) => `
    <button class="floorplan-tab" id="floorplan-tab-${index}" type="button" role="tab" aria-selected="${index === 0}" aria-controls="floorplan-panel" tabindex="${index === 0 ? "0" : "-1"}" data-floorplan-index="${index}">${escapeHtml(plan.name)}</button>
  `).join(""));

  const floorplanPanel = document.querySelector("#floorplan-panel");
  function showFloorplan(index) {
    const plan = data.floorPlans[index];
    floorplanTabs.querySelectorAll('[role="tab"]').forEach((tab, tabIndex) => {
      tab.setAttribute("aria-selected", String(tabIndex === index));
      tab.setAttribute("tabindex", tabIndex === index ? "0" : "-1");
    });
    floorplanPanel.setAttribute("aria-labelledby", `floorplan-tab-${index}`);
    floorplanPanel.innerHTML = `
      <div class="floorplan-art"><img src="${escapeHtml(plan.image)}" alt="Illustrative ${escapeHtml(plan.name)} floor plan, not to scale" loading="lazy"><span>Illustrative plan · not to scale</span></div>
      <div class="floorplan-copy">
        <p class="eyebrow">${escapeHtml(plan.label)}</p>
        <h4>${escapeHtml(plan.name)}</h4>
        <p>${escapeHtml(plan.description)}</p>
        <div class="floorplan-area"><strong>${escapeHtml(plan.area)}</strong><span>Area details on request</span></div>
        <ul>${plan.points.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul>
        <button class="button button-primary" type="button" data-scroll-enquire>Request this floor plan <span aria-hidden="true">↗</span></button>
      </div>
    `;
  }
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
    target.focus();
    showFloorplan(next);
  });

  render("#residence-cards", data.residences.map((home, index) => `
    <article class="residence-card reveal">
      <div class="residence-image">
        <img src="${escapeHtml(home.image)}" alt="${escapeHtml(home.imageAlt)}" loading="lazy">
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

  render("#amenity-grid", data.amenities.map((amenity, index) => `
    <article class="amenity-card reveal">
      <span class="amenity-number">0${index + 1}</span>
      <span class="amenity-icon" aria-hidden="true">${escapeHtml(amenity.icon)}</span>
      <h3>${escapeHtml(amenity.name)}</h3>
      <p>${escapeHtml(amenity.note)}</p>
    </article>
  `).join(""));

  render("#amenity-groups", data.amenityGroups.map((group) => `
    <article class="amenity-group reveal">
      <h3>${escapeHtml(group.title)}</h3>
      <div>${group.items.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>
    </article>
  `).join(""));

  render("#project-gallery-grid", data.projectGallery.map((photo) => `
    <figure class="project-gallery-item reveal">
      <img src="${escapeHtml(photo.src)}" alt="${escapeHtml(photo.alt)}" loading="lazy">
      <figcaption>${escapeHtml(photo.label)}</figcaption>
    </figure>
  `).join(""));

  render("#location-list", data.locations.map((location, index) => `
    <div class="location-row">
      <span class="location-index">0${index + 1}</span>
      <span><strong>${escapeHtml(location.name)}</strong><small>${escapeHtml(location.detail)}</small></span>
      <span class="location-arrow" aria-hidden="true">↗</span>
    </div>
  `).join(""));

  render("#detail-grid", data.details.map((item) => `
    <article class="detail-card reveal">
      <span>${escapeHtml(item.icon)}</span>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.text)}</p>
    </article>
  `).join(""));

  render("#approval-grid", data.approvals.map((item, index) => `
    <article class="approval-card"><span>0${index + 1}</span><strong>${escapeHtml(item.value)}</strong><p>${escapeHtml(item.label)}</p></article>
  `).join(""));

  render("#masterplan-points", data.masterplanNotes.map((note) => `
    <p><span aria-hidden="true">✳</span>${escapeHtml(note)}</p>
  `).join(""));

  render("#specification-grid", data.specifications.map((specification, index) => `
    <article class="specification-card reveal"><span>0${index + 1}</span><h3>${escapeHtml(specification.title)}</h3><p>${escapeHtml(specification.text)}</p></article>
  `).join(""));

  document.querySelector("#developer-description").textContent = data.developer.description;
  render("#developer-stats", data.developer.stats.map((stat) => `
    <div><strong>${escapeHtml(stat.value)}</strong><span>${escapeHtml(stat.label)}</span></div>
  `).join(""));

  render("#faq-list", data.faqs.map((item, index) => `
    <details class="faq-item"${index === 0 ? " open" : ""}>
      <summary><span>${escapeHtml(item.question)}</span><i aria-hidden="true"></i></summary>
      <p>${escapeHtml(item.answer)}</p>
    </details>
  `).join(""));

  const galleryImage = document.querySelector("#gallery-image");
  const galleryCaption = document.querySelector("#gallery-caption");
  const galleryCount = document.querySelector("#gallery-count");
  let galleryIndex = 0;

  function showGalleryImage(index) {
    galleryIndex = (index + data.gallery.length) % data.gallery.length;
    const image = data.gallery[galleryIndex];
    galleryImage.src = image.src;
    galleryImage.alt = image.alt;
    galleryCaption.textContent = image.caption;
    galleryCount.textContent = `${String(galleryIndex + 1).padStart(2, "0")} / ${String(data.gallery.length).padStart(2, "0")}`;
  }

  document.querySelector("#gallery-prev").addEventListener("click", () => showGalleryImage(galleryIndex - 1));
  document.querySelector("#gallery-next").addEventListener("click", () => showGalleryImage(galleryIndex + 1));

  const amenityImage = document.querySelector("#amenity-image");
  const amenityCaption = document.querySelector("#amenity-caption");
  const amenityCount = document.querySelector("#amenity-count");
  let amenityIndex = 1;
  function showAmenityImage(index) {
    amenityIndex = (index + data.gallery.length) % data.gallery.length;
    const image = data.gallery[amenityIndex];
    amenityImage.src = image.src;
    amenityImage.alt = image.alt;
    amenityCaption.textContent = image.caption;
    amenityCount.textContent = `${String(amenityIndex + 1).padStart(2, "0")} / ${String(data.gallery.length).padStart(2, "0")}`;
  }
  document.querySelector("#amenity-prev").addEventListener("click", () => showAmenityImage(amenityIndex - 1));
  document.querySelector("#amenity-next").addEventListener("click", () => showAmenityImage(amenityIndex + 1));

  const menuToggle = document.querySelector(".menu-toggle");
  const primaryNav = document.querySelector("#primary-nav");
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.querySelector(".sr-only").textContent = isOpen ? "Open menu" : "Close menu";
    primaryNav.classList.toggle("is-open", !isOpen);
  });
  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.querySelector(".sr-only").textContent = "Open menu";
      primaryNav.classList.remove("is-open");
    });
  });

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-scroll-enquire]");
    if (trigger) {
      document.querySelector("#site-visit").scrollIntoView({ behavior: "smooth" });
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

  const tourModal = document.querySelector("#tour-modal");
  const tourVideo = document.querySelector("#tour-video");
  let previousFocus = null;
  function closeTour() {
    tourModal.hidden = true;
    tourVideo.pause();
    previousFocus?.focus();
  }
  document.querySelector("#open-tour").addEventListener("click", () => {
    previousFocus = document.activeElement;
    tourModal.hidden = false;
    tourModal.querySelector(".modal-close").focus();
  });
  tourModal.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", closeTour);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !tourModal.hidden) {
      closeTour();
    }
  });

  const toast = document.querySelector("#site-toast");
  let toastTimeout;
  document.querySelectorAll("[data-enquiry-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) {
        return;
      }

      const name = form.elements.name.value.trim();
      const feedback = form.querySelector(".form-feedback");
      feedback.textContent = `Thanks, ${name}. This preview form is not connected to a sales team yet.`;
      form.reset();

      toast.textContent = "Enquiry preview complete. Connect a form service to receive live submissions.";
      toast.classList.add("is-visible");
      window.clearTimeout(toastTimeout);
      toastTimeout = window.setTimeout(() => toast.classList.remove("is-visible"), 5000);
    });
  });

  document.querySelector("#current-year").textContent = new Date().getFullYear();

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal, .amenity-card, .detail-card").forEach((element) => observer.observe(element));
  } else {
    document.querySelectorAll(".reveal, .amenity-card, .detail-card").forEach((element) => element.classList.add("is-visible"));
  }

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
