import { cloneTemplate, getTag, getTags } from "./dom.js";

const disabledButton = (/** @type {HTMLButtonElement} */ button) => {
  button.setAttribute("disabled", "true");
};

const enabledButton = (/** @type {HTMLButtonElement} */ button) => {
  setTimeout(() => {
    button.removeAttribute("disabled");
  }, 250);
};

const toggleActiveThumbnail = (/** @type {string} prefix */ prefix = "") => {
  const carouselImages = getTag(`${prefix} .carousel .images`);
  if (!carouselImages) {
    throw new Error("function toggleActiveThumbnail: No carousel images found");
  }

  carouselImages.addEventListener("next", () => {
    const active = getTag(
      `${prefix} .product-page__images .thumbs button.active`
    );

    if (!active) {
      throw new Error("function toggleActiveThumbnail: No active thumbnail");
    }

    console.log("active", active);

    const next = active.nextElementSibling;

    if (!next) {
      return;
    }

    console.log("next", next);

    active.classList.remove("active");
    next.classList.add("active");
  });

  carouselImages.addEventListener("previous", () => {
    const active = getTag(
      `${prefix} .product-page__images .thumbs button.active`
    );

    if (!active) {
      throw new Error("function toggleActiveThumbnail: No active thumbnail");
    }

    const previous = active.previousElementSibling;

    if (!previous) {
      return;
    }

    active.classList.remove("active");
    previous.classList.add("active");
  });
};

const isPrefersReducedMotion = () => {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const scrollNext = (/** @type {HTMLDivElement} */ carouselImages) => {
  carouselImages.scroll({
    behavior: isPrefersReducedMotion() ? "auto" : "smooth",
    left: carouselImages.scrollLeft + carouselImages.scrollWidth / 4,
  });
  carouselImages.dispatchEvent(new CustomEvent("next"));
};

const scrollPrevious = (/** @type {HTMLDivElement} */ carouselImages) => {
  carouselImages.scroll({
    behavior: isPrefersReducedMotion() ? "auto" : "smooth",
    left: carouselImages.scrollLeft - carouselImages.scrollWidth / 4,
  });
  carouselImages.dispatchEvent(new CustomEvent("previous"));
};

const navButtonClicked = (
  /** @type {HTMLButtonElement} */ button,
  /** @type {HTMLDivElement} */ carouselImages,
  /** @type {string} */ direction
) => {
  disabledButton(button);
  if (direction === "next") {
    scrollNext(carouselImages);
  } else {
    scrollPrevious(carouselImages);
  }
  enabledButton(button);
};

const arrowNav = (/** @type {string} prefix */ prefix = "") => {
  /** @type {HTMLDivElement} */
  // @ts-ignore
  const carouselImages = getTag(`${prefix} .carousel .images`);
  /** @type {HTMLButtonElement} */
  // @ts-ignore
  const prevButton = getTag(`${prefix} .carousel .previous`);
  /** @type {HTMLButtonElement} */
  // @ts-ignore
  const nextButton = getTag(`${prefix} .carousel .next`);

  if (!carouselImages || !prevButton || !nextButton) {
    throw new Error(
      "function arrowNav : No carousel images found, or no buttons found"
    );
  }

  prevButton.addEventListener(
    "click",
    navButtonClicked.bind(null, prevButton, carouselImages, "previous")
  );

  prevButton.addEventListener("mouseenter", () => {
    // @ts-ignore
    const img = getTag("img", prevButton);
    if (!img) {
      throw new Error("function arrowNav : No image found");
    }

    img.setAttribute("src", "/images/icon-previous-orange.svg");
  });

  prevButton.addEventListener("mouseleave", () => {
    // @ts-ignore
    const img = getTag("img", prevButton);
    if (!img) {
      throw new Error("function arrowNav : No image found");
    }

    img.setAttribute("src", "/images/icon-previous.svg");
  });

  nextButton.addEventListener(
    "click",
    navButtonClicked.bind(null, nextButton, carouselImages, "next")
  );

  nextButton.addEventListener("mouseenter", () => {
    // @ts-ignore
    const img = getTag("img", nextButton);
    if (!img) {
      throw new Error("function arrowNav : No image found");
    }

    img.setAttribute("src", "/images/icon-next-orange.svg");
  });

  nextButton.addEventListener("mouseleave", () => {
    // @ts-ignore
    const img = getTag("img", nextButton);
    if (!img) {
      throw new Error("function arrowNav : No image found");
    }

    img.setAttribute("src", "/images/icon-next.svg");
  });
};

const buttonThumbnailClicked = (/** @type {string} prefix */ prefix = "") => {
  const thumbs = getTags(`${prefix} .product-page__images .thumbs button`);
  if (!thumbs) {
    throw new Error("No thumbnails found");
  }

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      thumbs.forEach((thumb) => {
        // @ts-ignore
        thumb.classList.remove("active");
      });
      // @ts-ignore
      thumb.classList.add("active");
      thumb.dispatchEvent(new CustomEvent("active"));
    });
  });
};

const scrollToActive = (/** @type {string} prefix */ prefix = "") => {
  const thumbs = getTags(`${prefix} .product-page__images .thumbs button`);

  if (!thumbs) {
    throw new Error("function scrollToActive : No thumbnails found");
  }

  thumbs.forEach((thumb) => {
    thumb.addEventListener("active", () => {
      const active = getTag(
        `${prefix} .product-page__images .thumbs button.active`
      );

      if (!active) {
        throw new Error("function scrollToActive : No active thumbnail");
      }

      const image = getTag(
        "img",
        // @ts-ignore
        active
      );

      if (!image) {
        throw new Error("function scrollToActive : No image found");
      }

      const src = image.getAttribute("src");

      if (!src) {
        throw new Error("function scrollToActive : No src found");
      }

      const id = src.split("-")[2];

      if (!id) {
        throw new Error("function scrollToActive : No id found");
      }

      const carouselImages = getTag(`${prefix} .carousel .images`);
      const imageToScroll = getTag(
        `${prefix} .carousel .images img[src*="${id}"]`
      );

      if (!carouselImages || !imageToScroll) {
        throw new Error(
          "function scrollToActive : No carousel images or image to scroll found"
        );
      }

      carouselImages.scroll({
        behavior: isPrefersReducedMotion() ? "auto" : "smooth",
        // @ts-ignore
        left: imageToScroll.offsetLeft,
      });
    });
  });
};

const thumbsNav = (/** @type {string} prefix */ prefix) => {
  buttonThumbnailClicked(prefix);
  scrollToActive(prefix);
};

const initializeCarousel = (
  /** @type {string} prefix */ prefix = "",
  /** @type {number} id */ id = 1
) => {
  const carouselImages = getTag(`${prefix} .carousel .images`);

  if (!carouselImages) {
    throw new Error("No carousel images found");
  }

  const computed =
    (carouselImages.scrollLeft + carouselImages.scrollWidth / 4) * (id - 1);

  carouselImages.scroll({
    behavior: "auto",
    // @ts-ignore
    left: prefix === "" ? 0 : computed,
  });
};

const lightbox = () => {
  const aside = getTag(".product-page__images");

  if (!aside) {
    throw new Error("No aside found");
  }

  const lightbox = document.createElement("div");

  lightbox.classList.add("lightbox");

  lightbox.appendChild(aside.cloneNode(true));

  const lightboxButton = cloneTemplate("#lightbox-close-button-template");

  if (!lightboxButton) {
    throw new Error("No lightbox button found");
  }

  document.body.appendChild(lightbox);

  const carouselImages = getTag(".lightbox .product-page__images");

  if (!carouselImages) {
    throw new Error("function lightbox : No carousel images found");
  }

  carouselImages.appendChild(lightboxButton);
};

const closeLightbox = () => {
  const lightbox = getTag(".lightbox");

  if (!lightbox) {
    throw new Error("function closeLightbox : No lightbox found");
  }

  lightbox.classList.add("exit");
  setTimeout(() => {
    lightbox.remove();
  }, 150);
};

const openLightbox = () => {
  const carouselImages = getTag(".carousel .images");

  if (!carouselImages) {
    throw new Error("function openLightbox : No carousel images found");
  }

  carouselImages.addEventListener("click", () => {
    lightbox();
    const lightboxTag = getTag(".lightbox");
    const lightBoxImages = getTag(".lightbox .product-page__images");
    const lightboxButton = getTag(".lightbox-close-button");
    if (!lightboxTag || !lightBoxImages || !lightboxButton) {
      throw new Error(
        "function openLightbox : No lightboxTag, lightBoxImages or lightboxButton"
      );
    }
    const active = getTag(".product-page__images .thumbs button.active img");

    if (!active) {
      throw new Error("function openLightbox : No active thumbnail");
    }

    const id = active.getAttribute("src")?.split("-")[2];

    initDesktop(".lightbox", Number(id));

    lightboxButton.addEventListener("click", () => {
      closeLightbox();
    });

    lightboxButton.addEventListener("mouseenter", () => {
      // @ts-ignore
      const img = getTag("img", lightboxButton);
      if (!img) {
        throw new Error("function openLightbox : No image found");
      }

      img.setAttribute("src", "/images/icon-close-orange.svg");
    });

    lightboxButton.addEventListener("mouseleave", () => {
      // @ts-ignore
      const img = getTag("img", lightboxButton);
      if (!img) {
        throw new Error("function openLightbox : No image found");
      }

      img.setAttribute("src", "/images/icon-close-white.svg");
    });

    lightboxTag.addEventListener("click", (e) => {
      if (
        e.target === lightBoxImages ||
        // @ts-ignore
        lightBoxImages.contains(e.target)
      ) {
        return;
      }
      closeLightbox();
    });
  });
};

const initDesktop = (
  /** @type {string} prefix */ prefix = "",
  /** @type {number} id */ id = 1
) => {
  initializeCarousel(prefix, id);
  thumbsNav(prefix);
  toggleActiveThumbnail(prefix);
  arrowNav(prefix);
};

export const productImages = () => {
  arrowNav();
  initializeCarousel();
  if (window.innerWidth >= 500) {
    openLightbox();
    initDesktop();
  }
};
