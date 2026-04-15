import { getAdviceCache, setAdviceCache } from "./data.js";
import { formatCurrency } from "./ui.js";

export function buildAdviceSummary(risk, forecast, monthlyData) {
  const latest = monthlyData[monthlyData.length - 1] || { expense: 0, misc: 0, income: 0 };
  return JSON.stringify({
    risk: risk.level,
    income: latest.income,
    expense: latest.expense,
    misc: latest.misc,
    predictedNet: forecast.predictedNet
  });
}

export function generateAiAdvice(risk, forecast, monthlyData) {
  const summaryHash = buildAdviceSummary(risk, forecast, monthlyData);
  const cached = getAdviceCache(summaryHash);
  if (cached) {
    return { advice: cached, cached: true };
  }

  const latest = monthlyData[monthlyData.length - 1] || { income: 0, expense: 0, misc: 0 };
  const suggestions = [];

  if (risk.level === "Bankruptcy Risk") {
    suggestions.push(`Reduce non-essential expenses by at least ${formatCurrency(Math.max(latest.expense * 0.15, 500))} next month.`);
    suggestions.push("Freeze miscellaneous spending temporarily until net cashflow returns positive.");
    suggestions.push("Prioritize client collections or recurring service revenue to stabilize monthly inflow.");
  } else if (risk.level === "Overspending Warning") {
    suggestions.push(`Cut flexible expense categories by around ${formatCurrency(Math.max(latest.expense * 0.1, 250))}.`);
    suggestions.push("Set approval rules for cafe, meal, and ad-hoc claims before transaction submission.");
    suggestions.push("Review subscriptions and small recurring charges because they often accumulate unnoticed.");
  } else {
    suggestions.push("Maintain current spending policy and continue monitoring monthly trend.");
    suggestions.push("Set category budgets early to prevent overspending when revenue drops.");
    suggestions.push("Keep invoice uploads consistent so the system can improve categorization accuracy.");
  }

  if (forecast.predictedNet < 0) {
    suggestions.push("Forecast shows negative net cashflow; prepare early cost controls for the coming month.");
  }

  setAdviceCache(summaryHash, suggestions);
  return { advice: suggestions, cached: false };
}
