import { cloneTemplate, getTag, getTags } from "./dom.js";

const cloneAndAppend = () => {
  const node = cloneTemplate("#mobile-nav-template");
  if (!node) {
    return false;
  }
  document.body.appendChild(node);
  return true;
};

export const closeMenu = (/** @type {HTMLDivElement} */ mobileMenu) => {
  mobileMenu.remove();
};

export const openMenu = () => {
  if (!cloneAndAppend()) {
    return;
  }

  const mobileMenu = getTag(".mobile-nav");
  const closeButton = getTag(".mobile-menu-close");

  if (!closeButton || !mobileMenu) {
    return;
  }

  mobileMenu.addEventListener("click", (e) => {
    if (e.target === mobileMenu) {
      mobileMenu.classList.add("exit");
      setTimeout(() => {
        // @ts-ignore
        closeMenu(mobileMenu);
      }, 150);
    }
  });

  closeButton.addEventListener("click", () => {
    mobileMenu.classList.add("exit");
    setTimeout(() => {
      // @ts-ignore
      closeMenu(mobileMenu);
    }, 150);
  });
};

export const mobileMenu = () => {
  const menuButton = getTag(".mobile-menu-trigger");

  if (menuButton) {
    menuButton.addEventListener("click", () => {
      // @ts-ignore
      openMenu();
    });
  }
};

export const menu = () => {
  const menuLinks = getTags("header nav ul a");

  if (!menuLinks) {
    throw new Error("No menu links found");
  }

  menuLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      menuLinks.forEach((link) => {
        // @ts-ignore
        link.classList.remove("active");
      });
      // @ts-ignore
      link.classList.add("active");
    });
  });
};
