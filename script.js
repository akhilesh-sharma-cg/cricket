
// ========================================
// WICKETRA - SHARED FRONTEND INTERACTIONS
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const toast = document.getElementById("toast");

  // ========================================
  // MOBILE NAVIGATION
  // ========================================

  function setMenuState(isOpen) {
    if (!menuToggle || !mainNav) return;

    mainNav.classList.toggle("open", isOpen);
    mainNav.classList.toggle("active", isOpen);

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close menu" : "Open menu"
    );
  }

  function closeMobileMenu() {
    setMenuState(false);
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", (event) => {
      event.stopPropagation();

      const isOpen =
        mainNav.classList.contains("open") ||
        mainNav.classList.contains("active");

      setMenuState(!isOpen);
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });
  }

  // ========================================
  // SMOOTH INTERNAL NAVIGATION
  // ========================================

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        event.preventDefault();
        return;
      }

      const target = document.getElementById(
        targetId.substring(1)
      );

      if (!target) return;

      event.preventDefault();

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });

      history.replaceState(null, "", targetId);

      closeMobileMenu();
    });
  });

  // ========================================
  // TOAST NOTIFICATIONS
  // ========================================

  function showToast(message, type = "success") {
    if (!toast) {
      console.warn("WICKETRA toast element was not found:", message);
      return;
    }

    toast.textContent = message;

    toast.classList.remove("error", "success");
    toast.classList.add("show", type);

    clearTimeout(showToast.timeout);

    showToast.timeout = setTimeout(() => {
      toast.classList.remove("show", "error", "success");
    }, 3000);
  }

  // Shared functions for other website pages.
  window.WICKETRA = window.WICKETRA || {};

  window.WICKETRA.showToast = showToast;
  window.WICKETRA.closeMobileMenu = closeMobileMenu;

  // ========================================
  // ACTIVE HOMEPAGE NAVIGATION
  // ========================================

  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(
    '.main-nav a[href^="#"]'
  );

  if ("IntersectionObserver" in window && sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navLinks.forEach((link) => {
            const linkTarget = link.getAttribute("href");

            link.classList.toggle(
              "active",
              linkTarget === `#${entry.target.id}`
            );
          });
        });
      },
      {
        rootMargin: "-35% 0px -55% 0px"
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  // ========================================
  // CLOSE MENU WHEN CLICKING OUTSIDE
  // ========================================

  document.addEventListener("click", (event) => {
    if (!mainNav || !menuToggle) return;

    const clickedInsideNav = mainNav.contains(event.target);
    const clickedToggle = menuToggle.contains(event.target);

    if (!clickedInsideNav && !clickedToggle) {
      closeMobileMenu();
    }
  });

  // ========================================
  // ESCAPE KEY
  // ========================================

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu();
    }
  });

  console.log("WICKETRA shared interactions initialized.");
});
