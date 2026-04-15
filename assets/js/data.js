import { getSession } from "./auth.js";

const storageKey = "finance-advisory-transactions";
const adviceCacheKey = "finance-advisory-cache";
const demoUserId = "USR-001";

const defaultTransactions = [
  {
    id: "TXN-001",
    date: "2026-01-05",
    type: "income",
    description: "Website development payment",
    amount: 8500,
    vendor: "Nova Retail Sdn Bhd",
    invoiceText: "Invoice website development project January payment",
    category: "Sales Revenue",
    source: "manual"
  },
  {
    id: "TXN-002",
    date: "2026-01-08",
    type: "expense",
    description: "Team lunch after client meeting",
    amount: 248,
    vendor: "Urban Bistro",
    invoiceText: "Food lunch beverages restaurant table bill",
    category: "Food",
    source: "ocr auto-category"
  },
  {
    id: "TXN-003",
    date: "2026-02-02",
    type: "expense",
    description: "Office internet bill",
    amount: 389,
    vendor: "Unifi Business",
    invoiceText: "Monthly wifi internet broadband package office",
    category: "Utilities",
    source: "ocr auto-category"
  },
  {
    id: "TXN-004",
    date: "2026-02-17",
    type: "expense",
    description: "Printer replacement",
    amount: 1200,
    vendor: "Tech Warehouse",
    invoiceText: "Printer toner office equipment",
    category: "Equipment",
    source: "ocr auto-category"
  },
  {
    id: "TXN-005",
    date: "2026-03-03",
    type: "income",
    description: "Maintenance contract payment",
    amount: 6400,
    vendor: "Pacific Trading",
    invoiceText: "Maintenance support monthly contract payment",
    category: "Service Revenue",
    source: "manual"
  },
  {
    id: "TXN-006",
    date: "2026-03-08",
    type: "expense",
    description: "Fuel and toll claims",
    amount: 780,
    vendor: "Shell Station",
    invoiceText: "Petrol fuel toll transportation receipt",
    category: "Transport",
    source: "ocr auto-category"
  },
  {
    id: "TXN-007",
    date: "2026-03-19",
    type: "miscellaneous",
    description: "Ad-hoc event sponsorship",
    amount: 1500,
    vendor: "Campus Event Team",
    invoiceText: "Sponsorship contribution miscellaneous promotional event",
    category: "Miscellaneous",
    source: "manual"
  },
  {
    id: "TXN-008",
    date: "2026-04-01",
    type: "expense",
    description: "Software subscriptions",
    amount: 960,
    vendor: "Productivity Tools",
    invoiceText: "Subscription design collaboration software tools",
    category: "Software",
    source: "ocr auto-category"
  },
  {
    id: "TXN-009",
    date: "2026-04-06",
    type: "income",
    description: "Digital campaign payment",
    amount: 5200,
    vendor: "Bright Reach Co",
    invoiceText: "Campaign management invoice payment received",
    category: "Service Revenue",
    source: "manual"
  },
  {
    id: "TXN-010",
    date: "2026-04-10",
    type: "expense",
    description: "Cafe meeting with supplier",
    amount: 174,
    vendor: "Bean Deck",
    invoiceText: "Cafe coffee food business discussion",
    category: "Food",
    source: "ocr auto-category"
  }
];

const categoryRules = [
  { category: "Food", keywords: ["food", "restaurant", "lunch", "cafe", "coffee", "beverages"] },
  { category: "Utilities", keywords: ["internet", "wifi", "broadband", "electricity", "water", "utility"] },
  { category: "Transport", keywords: ["fuel", "petrol", "toll", "transport", "grab", "parking"] },
  { category: "Equipment", keywords: ["printer", "laptop", "monitor", "equipment", "toner"] },
  { category: "Software", keywords: ["subscription", "software", "license", "saas", "tool"] },
  { category: "Marketing", keywords: ["ads", "campaign", "promotion", "marketing"] },
  { category: "Sales Revenue", keywords: ["sales", "product payment", "invoice paid"] },
  { category: "Service Revenue", keywords: ["service", "contract", "maintenance", "consulting"] }
];

function getCurrentUserId() {
  const session = getSession();
  return session?.id || "guest";
}

function seedTransactions() {
  const store = normalizeTransactionStore(JSON.parse(localStorage.getItem(storageKey) || "{}"));
  if (!store[demoUserId]) {
    store[demoUserId] = defaultTransactions;
    localStorage.setItem(storageKey, JSON.stringify(store));
  }
}

function getTransactionStore() {
  seedTransactions();
  return normalizeTransactionStore(JSON.parse(localStorage.getItem(storageKey) || "{}"));
}

function saveTransactionStore(store) {
  localStorage.setItem(storageKey, JSON.stringify(store));
}

function normalizeTransactionStore(rawStore) {
  if (Array.isArray(rawStore)) {
    return { [demoUserId]: rawStore };
  }

  if (!rawStore || typeof rawStore !== "object") {
    return {};
  }

  return rawStore;
}

export function getTransactions() {
  const store = getTransactionStore();
  const userId = getCurrentUserId();
  return store[userId] || [];
}

export function saveTransactions(transactions) {
  const store = getTransactionStore();
  const userId = getCurrentUserId();
  store[userId] = transactions;
  saveTransactionStore(store);
}

export function generateId(transactions) {
  const index = transactions.length + 1;
  return `TXN-${String(index).padStart(3, "0")}`;
}

export function detectCategory(type, invoiceText, description) {
  if (type === "income") {
    return inferIncomeCategory(invoiceText, description);
  }

  const text = `${invoiceText} ${description}`.toLowerCase();
  const match = categoryRules.find((rule) => rule.keywords.some((keyword) => text.includes(keyword)));
  return match ? match.category : type === "miscellaneous" ? "Miscellaneous" : "Uncategorized";
}

function inferIncomeCategory(invoiceText, description) {
  const text = `${invoiceText} ${description}`.toLowerCase();
  if (text.includes("service") || text.includes("maintenance") || text.includes("consult")) {
    return "Service Revenue";
  }
  return "Sales Revenue";
}

export function addTransaction(formData) {
  const transactions = getTransactions();
  const category = detectCategory(formData.type, formData.invoiceText, formData.description);

  const record = {
    id: generateId(transactions),
    date: formData.date,
    type: formData.type,
    description: formData.description,
    amount: Number(formData.amount),
    vendor: formData.vendor || "-",
    invoiceText: formData.invoiceText || "",
    category,
    source: formData.invoiceText ? "ocr auto-category" : "manual"
  };

  transactions.unshift(record);
  saveTransactions(transactions);
  return record;
}

export function getTransactionById(id) {
  return getTransactions().find((item) => item.id === id);
}

export function getMonths(transactions) {
  return [...new Set(transactions.map((item) => item.date.slice(0, 7)))].sort();
}

export function getCategories(transactions) {
  return [...new Set(transactions.map((item) => item.category))].sort();
}

export function summarizeTransactions(transactions) {
  const income = transactions.filter((item) => item.type === "income").reduce((sum, item) => sum + item.amount, 0);
  const expense = transactions.filter((item) => item.type === "expense").reduce((sum, item) => sum + item.amount, 0);
  const misc = transactions.filter((item) => item.type === "miscellaneous").reduce((sum, item) => sum + item.amount, 0);
  const net = income - expense - misc;

  return {
    income,
    expense,
    misc,
    net
  };
}

export function groupMonthly(transactions) {
  const months = {};

  transactions.forEach((item) => {
    const month = item.date.slice(0, 7);
    if (!months[month]) {
      months[month] = { month, income: 0, expense: 0, misc: 0, net: 0 };
    }

    months[month][item.type] += item.amount;
    months[month].net = months[month].income - months[month].expense - months[month].misc;
  });

  return Object.values(months).sort((a, b) => a.month.localeCompare(b.month));
}

export function detectRisk(monthlyData) {
  const latest = monthlyData[monthlyData.length - 1];
  if (!latest) {
    return {
      level: "Safe",
      tone: "safe",
      summary: "No data available yet.",
      reason: "System needs transaction records to evaluate risk."
    };
  }

  const deficitMonths = monthlyData.filter((item) => item.net < 0).length;
  const expenseRatio = latest.income > 0 ? (latest.expense + latest.misc) / latest.income : 1;

  if (deficitMonths >= 2 || latest.net < -1000) {
    return {
      level: "Bankruptcy Risk",
      tone: "danger",
      summary: "Net cashflow is negative and trend shows repeated deficit pressure.",
      reason: "Expenses and miscellaneous spending are overtaking income across recent months."
    };
  }

  if (expenseRatio >= 0.85 || latest.net < 1000) {
    return {
      level: "Overspending Warning",
      tone: "warning",
      summary: "Business spending is close to or above the safe limit.",
      reason: "Current month expense ratio indicates narrow safety margin."
    };
  }

  return {
    level: "Safe",
    tone: "safe",
    summary: "Income still covers operational spending with reasonable margin.",
    reason: "Current month net cashflow remains positive."
  };
}

export function forecastCashflow(monthlyData) {
  const recent = monthlyData.slice(-3);
  if (!recent.length) {
    return {
      predictedIncome: 0,
      predictedExpense: 0,
      predictedMisc: 0,
      predictedNet: 0
    };
  }

  const avg = (key) => recent.reduce((sum, item) => sum + item[key], 0) / recent.length;
  const predictedIncome = avg("income");
  const predictedExpense = avg("expense");
  const predictedMisc = avg("misc");

  return {
    predictedIncome,
    predictedExpense,
    predictedMisc,
    predictedNet: predictedIncome - predictedExpense - predictedMisc
  };
}

export function getAdviceCache(summaryHash) {
  const cache = JSON.parse(localStorage.getItem(adviceCacheKey) || "{}");
  return cache[summaryHash] || null;
}

export function setAdviceCache(summaryHash, advice) {
  const cache = JSON.parse(localStorage.getItem(adviceCacheKey) || "{}");
  cache[summaryHash] = advice;
  localStorage.setItem(adviceCacheKey, JSON.stringify(cache));
}
