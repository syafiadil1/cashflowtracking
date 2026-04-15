import { getCategories, getMonths, getTransactions, summarizeTransactions } from "./data.js";
import { renderAuthState } from "./auth.js";
import { formatCurrency, pillClass, formatMonth, setActiveNav } from "./ui.js";

const state = {
  transactions: getTransactions(),
  filters: {
    type: "all",
    category: "all",
    month: "all"
  }
};

const tableBody = document.getElementById("transaction-table-body");
const categoryFilter = document.getElementById("category-filter");
const monthFilter = document.getElementById("month-filter");
const typeFilter = document.getElementById("type-filter");
const summary = document.getElementById("listing-summary");
renderAuthState();
setActiveNav();
populateFilters();
render();
bindEvents();

function bindEvents() {
  typeFilter.addEventListener("change", (event) => {
    state.filters.type = event.target.value;
    render();
  });

  categoryFilter.addEventListener("change", (event) => {
    state.filters.category = event.target.value;
    render();
  });

  monthFilter.addEventListener("change", (event) => {
    state.filters.month = event.target.value;
    render();
  });
}

function populateFilters() {
  const categories = getCategories(state.transactions);
  const months = getMonths(state.transactions);

  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  monthFilter.innerHTML = '<option value="all">All Months</option>';

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.append(option);
  });

  months.forEach((month) => {
    const option = document.createElement("option");
    option.value = month;
    option.textContent = formatMonth(month);
    monthFilter.append(option);
  });
}

function getFilteredTransactions() {
  return state.transactions.filter((item) => {
    const typeMatch = state.filters.type === "all" || item.type === state.filters.type;
    const categoryMatch = state.filters.category === "all" || item.category === state.filters.category;
    const monthMatch = state.filters.month === "all" || item.date.startsWith(state.filters.month);
    return typeMatch && categoryMatch && monthMatch;
  });
}

function render() {
  const filtered = getFilteredTransactions();
  renderSummary(filtered);
  renderTable(filtered);
}

function renderSummary(transactions) {
  const totals = summarizeTransactions(transactions);
  const cards = [
    { label: "Income", value: formatCurrency(totals.income) },
    { label: "Expense", value: formatCurrency(totals.expense) },
    { label: "Miscellaneous", value: formatCurrency(totals.misc) },
    { label: "Net Cashflow", value: formatCurrency(totals.net) }
  ];

  summary.innerHTML = cards
    .map(
      (card) => `
        <article class="summary-box">
          <p>${card.label}</p>
          <h3>${card.value}</h3>
        </article>
      `
    )
    .join("");
}

function renderTable(transactions) {
  if (!transactions.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="muted">No transactions found for the selected filters.</td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = transactions
    .map(
      (item) => `
        <tr>
          <td>${item.id}</td>
          <td>${item.date}</td>
          <td>${item.description}</td>
          <td><span class="${pillClass(item.type)}">${item.type}</span></td>
          <td>${item.category}</td>
          <td>${formatCurrency(item.amount)}</td>
          <td><a class="button-secondary" href="details.html?id=${item.id}">View</a></td>
        </tr>
      `
    )
    .join("");
}
