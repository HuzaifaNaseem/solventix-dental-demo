(() => {
  "use strict";
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [
    ...scope.querySelectorAll(selector),
  ];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const header = $("#siteHeader");
  const menuToggle = $("#menuToggle");
  const mobileNav = $("#mobileNav");

  function closeMenu(returnFocus = false) {
    mobileNav.hidden = true;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    if (returnFocus) menuToggle.focus();
  }
  menuToggle.addEventListener("click", () => {
    const opening = menuToggle.getAttribute("aria-expanded") !== "true";
    mobileNav.hidden = !opening;
    menuToggle.setAttribute("aria-expanded", String(opening));
    menuToggle.setAttribute(
      "aria-label",
      opening ? "Close navigation" : "Open navigation",
    );
  });
  $$("#mobileNav a").forEach((link) =>
    link.addEventListener("click", () => closeMenu()),
  );
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !mobileNav.hidden) closeMenu(true);
  });
  document.addEventListener("click", (event) => {
    if (!mobileNav.hidden && !header.contains(event.target)) closeMenu();
  });
  window
    .matchMedia("(min-width: 721px)")
    .addEventListener("change", (event) => {
      if (event.matches) closeMenu();
    });

  const progress = $(".scroll-progress");
  const mobileBookBar = $(".mobile-book-bar");
  let scheduled = false;
  function updateScroll() {
    const scroll = window.scrollY;
    header.classList.toggle("scrolled", scroll > 60);
    mobileBookBar.classList.toggle(
      "visible",
      scroll > $(".hero").offsetHeight - 180,
    );
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform =
      "scaleX(" + (max > 0 ? Math.min(1, scroll / max) : 0) + ")";
    scheduled = false;
  }
  window.addEventListener(
    "scroll",
    () => {
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(updateScroll);
      }
    },
    { passive: true },
  );
  window.addEventListener("resize", updateScroll, { passive: true });
  updateScroll();

  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08 },
    );
    $$(".reveal").forEach((element) => observer.observe(element));
  }

  const treatments = {
    general: {
      name: "General dentistry",
      tag: "THE FOUNDATION",
      title: "A healthy smile.<br>A good place to start.",
      description:
        "Make room for the essentials. A conversation about your oral health, your routine, and the care that suits you.",
      benefits: [
        "Routine check-ups",
        "Cleaning and preventive care",
        "Personal oral-health guidance",
      ],
      image: "dental_smile.webp",
      alt: "Illustrative portrait of a smiling adult",
      caption: "A little care goes a long way.",
      index: "01 / 04",
    },
    cosmetic: {
      name: "Cosmetic dentistry",
      tag: "YOUR SMILE, YOUR WAY",
      title: "A change that still<br>feels like you.",
      description:
        "Explore the details you’d like to refine. Discuss whitening, veneers, and smile design with your dentist, starting with your own goals.",
      benefits: [
        "A conversation about your smile",
        "Explore cosmetic options",
        "Understand your individual plan",
      ],
      image: "dental_smile.webp",
      alt: "Illustrative smiling portrait, not a treatment result",
      caption: "Your individuality comes first.",
      index: "02 / 04",
    },
    restorative: {
      name: "Restorative care",
      tag: "COMFORT & CONFIDENCE",
      title: "More comfort.<br>More possibility.",
      description:
        "Discuss concerns about damaged or missing teeth, and explore restorative options following a personal assessment.",
      benefits: [
        "Discuss everyday comfort",
        "Explore crowns and implant options",
        "A plan shaped around your needs",
      ],
      image: "specialist_extra.webp",
      alt: "Illustrative clinician examining dental imaging",
      caption: "Consider the whole picture.",
      index: "03 / 04",
    },
    aligners: {
      name: "Clear aligners",
      tag: "A NEW PERSPECTIVE",
      title: "Your smile.<br>A new direction.",
      description:
        "Curious about clear aligners? Start with a conversation about your smile, your bite, and whether this approach may be suitable for you.",
      benefits: [
        "Discuss alignment goals",
        "Explore suitability and options",
        "Understand the treatment journey",
      ],
      image: "dental_smile.webp",
      alt: "Illustrative portrait, not a clear-aligner treatment result",
      caption: "A considered next step.",
      index: "04 / 04",
    },
  };
  const treatmentTabs = $$(".treatment-tab");
  const treatmentPanel = $("#treatmentPanel");
  let animationTimer;
  function selectTreatment(key, focus = false) {
    const treatment = treatments[key];
    if (!treatment) return;
    treatmentTabs.forEach((tab) => {
      const selected = tab.dataset.treatment === key;
      tab.classList.toggle("active", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && focus) tab.focus();
    });
    treatmentPanel.setAttribute("aria-labelledby", "tab-" + key);
    $("#treatmentTag").textContent = treatment.tag;
    $("#treatmentTitle").innerHTML = treatment.title;
    $("#treatmentDescription").textContent = treatment.description;
    $("#treatmentBenefits").replaceChildren(
      ...treatment.benefits.map((text) => {
        const item = document.createElement("li");
        item.textContent = text;
        return item;
      }),
    );
    $("#treatmentImage").src = treatment.image;
    $("#treatmentImage").alt = treatment.alt;
    $(".treatment-image-label").lastChild.textContent = " " + treatment.caption;
    $("#treatmentIndex").textContent = treatment.index;
    $("#treatmentBook").dataset.selected = treatment.name;
    clearTimeout(animationTimer);
    treatmentPanel.classList.remove("changing");
    requestAnimationFrame(() => {
      treatmentPanel.classList.add("changing");
      animationTimer = setTimeout(
        () => treatmentPanel.classList.remove("changing"),
        450,
      );
    });
  }
  treatmentTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTreatment(tab.dataset.treatment));
    tab.addEventListener("keydown", (event) => {
      let next = index;
      if (event.key === "ArrowDown" || event.key === "ArrowRight")
        next = (index + 1) % treatmentTabs.length;
      else if (event.key === "ArrowUp" || event.key === "ArrowLeft")
        next = (index - 1 + treatmentTabs.length) % treatmentTabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = treatmentTabs.length - 1;
      else return;
      event.preventDefault();
      selectTreatment(treatmentTabs[next].dataset.treatment, true);
    });
  });

  const bookingDialog = $("#bookingDialog");
  const galleryDialog = $("#galleryDialog");
  const bookingForm = $("#bookingForm");
  let lastTrigger = null;
  let currentStep = 1;
  function setBookingStep(step) {
    currentStep = step;
    $("#bookingStepOne").hidden = step !== 1;
    $("#bookingStepTwo").hidden = step !== 2;
    $("#bookingStepLabel").textContent = step === 1 ? "01 / 02" : "02 / 02";
    $("#bookingTitle").textContent =
      step === 1 ? "Let’s start with you." : "Your conversation, previewed.";
    $("#bookingIntro").textContent =
      step === 1
        ? "Choose what you’d like to discuss. This is a demo; your details will not be sent or stored."
        : "Here’s how your request could look. This preview does not reserve a time or contact a clinic.";
  }
  function openDialog(dialog, trigger) {
    if (typeof dialog.showModal !== "function") return false;
    closeMenu();
    lastTrigger = trigger;
    document.body.classList.add("modal-open");
    dialog.showModal();
    return true;
  }
  $$("[data-book]").forEach((trigger) =>
    trigger.addEventListener("click", (event) => {
      if (typeof bookingDialog.showModal !== "function") return;
      event.preventDefault();
      bookingForm.reset();
      setBookingStep(1);
      if (trigger.dataset.selected)
        $("#bookingTreatment").value = trigger.dataset.selected;
      openDialog(bookingDialog, trigger);
      $("#bookingTreatment").focus();
    }),
  );
  $$("[data-gallery]").forEach((trigger) =>
    trigger.addEventListener("click", () => {
      $("#galleryImage").src = trigger.dataset.gallery;
      $("#galleryImage").alt = $("img", trigger).alt;
      $("#galleryCaption").textContent = trigger.dataset.caption;
      openDialog(galleryDialog, trigger);
    }),
  );
  $$("[data-close]").forEach((button) =>
    button.addEventListener("click", () => button.closest("dialog").close()),
  );
  [bookingDialog, galleryDialog].forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      )
        dialog.close();
    });
    dialog.addEventListener("close", () => {
      document.body.classList.remove("modal-open");
      if (dialog === bookingDialog) {
        bookingForm.reset();
        setBookingStep(1);
        $("#bookingSummary").replaceChildren();
      }
      if (lastTrigger && lastTrigger.isConnected)
        lastTrigger.focus({ preventScroll: true });
    });
  });
  $("#bookingName").addEventListener("input", () =>
    $("#bookingName").setCustomValidity(""),
  );
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!$("#bookingName").value.trim())
      $("#bookingName").setCustomValidity("Please enter your name.");
    if (currentStep !== 1 || !bookingForm.reportValidity()) return;
    const formData = new FormData(bookingForm);
    const values = [
      ["Treatment", formData.get("treatment")],
      ["Name", String(formData.get("name")).trim()],
      ["Email", String(formData.get("email")).trim()],
      ["Preferred time", formData.get("preference")],
    ];
    $("#bookingSummary").replaceChildren(
      ...values.map(([label, value]) => {
        const row = document.createElement("div");
        const dt = document.createElement("dt");
        const dd = document.createElement("dd");
        dt.textContent = label;
        dd.textContent = value;
        row.append(dt, dd);
        return row;
      }),
    );
    setBookingStep(2);
    $("#bookingTitle").tabIndex = -1;
    $("#bookingTitle").focus();
    $(".booking-body").scrollIntoView({ block: "start", behavior: "instant" });
  });
  $("#editPreview").addEventListener("click", () => {
    setBookingStep(1);
    $("#bookingName").focus();
  });
  const details = $$(".faq-list details");
  details.forEach((detail) =>
    detail.addEventListener("toggle", () => {
      if (detail.open)
        details.forEach((other) => {
          if (other !== detail) other.open = false;
        });
    }),
  );
})();
