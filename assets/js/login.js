import { loginUser, renderAuthState } from "./auth.js";

renderAuthState();

const form = document.getElementById("login-form");
const message = document.getElementById("login-message");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);

  const result = loginUser({
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!result.ok) {
    message.textContent = result.message;
    return;
  }

  message.textContent = "Login successful. Redirecting to dashboard...";
  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 700);
});
