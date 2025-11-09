const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isExpanded));
    navLinks.dataset.open = String(!isExpanded);
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement && window.innerWidth <= 720) {
      navToggle.setAttribute("aria-expanded", "false");
      navLinks.dataset.open = "false";
    }
  });
}

const yearTarget = document.getElementById("year");
if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear().toString();
}

const form = document.querySelector(".connect__form");
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get("name") || "friend";
    alert(`Thanks ${name}! Your request has been received.`);
    form.reset();
  });
}
