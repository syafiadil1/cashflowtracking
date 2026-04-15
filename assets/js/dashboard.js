import {
  detectRisk,
  forecastCashflow,
  getTransactions,
  groupMonthly,
  summarizeTransactions
} from "./data.js";
import { renderAuthState } from "./auth.js";
import { generateAiAdvice } from "./ai.js";
import { formatCurrency, formatMonth, setActiveNav } from "./ui.js";

renderAuthState();
setActiveNav();

const transactions = getTransactions();
const monthlyData = groupMonthly(transactions);
const totals = summarizeTransactions(transactions);
const risk = detectRisk(monthlyData);
const forecast = forecastCashflow(monthlyData);

renderStats();
renderChart();
renderRisk();
renderForecast();
renderAdvice();

document.getElementById("refresh-advice-btn").addEventListener("click", renderAdvice);

function renderStats() {
  const stats = [
    { label: "Total Income", value: formatCurrency(totals.income) },
    { label: "Total Outflow", value: formatCurrency(totals.expense + totals.misc) },
    { label: "Net Cashflow", value: formatCurrency(totals.net) },
    { label: "Risk Level", value: risk.level }
  ];

  document.getElementById("dashboard-stats").innerHTML = stats
    .map(
      (item) => `
        <article class="summary-box">
          <p>${item.label}</p>
          <h3>${item.value}</h3>
        </article>
      `
    )
    .join("");
}

function renderChart() {
  const peak = Math.max(...monthlyData.map((item) => item.income + item.expense + item.misc), 1);
  document.getElementById("cashflow-chart").innerHTML = monthlyData
    .map((item) => {
      const incomeWidth = ((item.income / peak) * 100).toFixed(1);
      const outflow = item.expense + item.misc;
      const outflowWidth = ((outflow / peak) * 100).toFixed(1);

      return `
        <div class="chart-bar">
        <div class="chart-item">
          <p><strong>${formatMonth(item.month)}</strong></p>
          <p>Net Cashflow: ${formatCurrency(item.net)}</p>
          <p class="info-text">Income: ${formatCurrency(item.income)} | Outflow: ${formatCurrency(outflow)}</p>
          <div class="bar"><div class="bar-fill" style="width:${incomeWidth}%"></div></div>
          <div class="bar"><div class="bar-fill" style="width:${outflowWidth}%; background-color:#b22222;"></div></div>
        </div>
      `;
    })
    .join("");
}

function renderRisk() {
  document.getElementById("risk-panel").innerHTML = `
    <div class="status-box ${risk.tone}">
      <p><strong>${risk.level}</strong></p>
      <h3>${risk.summary}</h3>
      <p>${risk.reason}</p>
    </div>
  `;
}

function renderForecast() {
  document.getElementById("forecast-panel").innerHTML = `
    <div>
      <div class="forecast-item">
        <p><strong>Predicted Income:</strong> ${formatCurrency(forecast.predictedIncome)}</p>
      </div>
      <div class="forecast-item">
        <p><strong>Predicted Expense:</strong> ${formatCurrency(forecast.predictedExpense)}</p>
      </div>
      <div class="forecast-item">
        <p><strong>Predicted Miscellaneous:</strong> ${formatCurrency(forecast.predictedMisc)}</p>
      </div>
      <div class="forecast-item">
        <p><strong>Predicted Net Cashflow:</strong> ${formatCurrency(forecast.predictedNet)}</p>
      </div>
    </div>
  `;
}

function renderAdvice() {
  const result = generateAiAdvice(risk, forecast, monthlyData);
  document.getElementById("advice-panel").innerHTML = `
    <p class="info-text">${result.cached ? "Advice loaded from cache to reduce API usage." : "Advice regenerated based on the latest dashboard summary."}</p>
    <div>
      ${result.advice.map((item) => `<div class="advice-item">${item}</div>`).join("")}
    </div>
  `;
}
