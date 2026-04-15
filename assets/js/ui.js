export function formatCurrency(value) {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    maximumFractionDigits: 2
  }).format(value || 0);
}

export function formatMonth(monthText) {
  const [year, month] = monthText.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleString("en-MY", { month: "long", year: "numeric" });
}

export function pillClass(type) {
  return `badge badge-${type}`;
}

export function setActiveNav() {
  const page = document.body.dataset.page;
  document.querySelectorAll(".site-nav a, .nav-link").forEach((link) => {
    const href = link.getAttribute("href");
    if (
      (page === "home" && href === "index.html") ||
      (page === "login" && href === "login.html") ||
      (page === "register" && href === "register.html") ||
      (page === "listing" && href === "listing.html") ||
      (page === "add" && href === "add-transaction.html") ||
      (page === "dashboard" && href === "dashboard.html")
    ) {
      link.classList.add("active");
    }
  });
}
