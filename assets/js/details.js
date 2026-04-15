import { getTransactionById } from "./data.js";
import { renderAuthState } from "./auth.js";
import { formatCurrency, pillClass, setActiveNav } from "./ui.js";

renderAuthState();
setActiveNav();

const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const transaction = getTransactionById(id);
const container = document.getElementById("details-container");

if (!transaction) {
  container.innerHTML = `
    <section class="simple-card">
      <h3>Transaction not found</h3>
      <p class="info-text">Open the listing page and choose a valid transaction record.</p>
    </section>
  `;
} else {
  container.innerHTML = `
    <section class="simple-card">
      <div class="detail-box">
        <p>Record Summary</p>
        <h3>${transaction.description}</h3>
        <p><strong>Date:</strong> ${transaction.date}</p>
        <p><strong>Type:</strong> <span class="${pillClass(transaction.type)}">${transaction.type}</span></p>
        <p><strong>Amount:</strong> ${formatCurrency(transaction.amount)}</p>
        <p><strong>Vendor:</strong> ${transaction.vendor}</p>
      </div>

      <div class="detail-box">
        <p>Classification</p>
        <p><strong>Auto Category:</strong> ${transaction.category}</p>
        <p><strong>Detection Source:</strong> ${transaction.source}</p>
      </div>
    </section>

    <section class="simple-card">
      <div class="detail-box">
        <p>OCR Extracted Text</p>
        <p>${transaction.invoiceText || "No OCR text stored for this record."}</p>
      </div>

      <div class="detail-box">
        <p>Backend Flow</p>
        <p>1. User uploads invoice image or PDF.</p>
        <p>2. OCR extracts merchant, keywords, and payment details.</p>
        <p>3. Keyword matching assigns category before it appears on the listing page.</p>
        <p>4. Record contributes to risk detection and advisory dashboard.</p>
      </div>
    </section>
  `;
}
