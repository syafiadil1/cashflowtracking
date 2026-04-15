import { addTransaction } from "./data.js";
import { renderAuthState } from "./auth.js";

const form = document.getElementById("transaction-form");
const message = document.getElementById("form-message");

renderAuthState();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);

  addTransaction({
    date: formData.get("date"),
    type: formData.get("type"),
    description: formData.get("description"),
    amount: formData.get("amount"),
    vendor: formData.get("vendor"),
    invoiceText: formData.get("invoiceText")
  });

  form.reset();
  message.textContent = "Transaction saved successfully. Open Transaction Listing to view the new record.";
});
