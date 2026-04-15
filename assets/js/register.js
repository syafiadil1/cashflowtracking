import { registerUser, renderAuthState } from "./auth.js";

renderAuthState();

const form = document.getElementById("register-form");
const message = document.getElementById("register-message");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);

  const result = registerUser({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role")
  });

  if (!result.ok) {
    message.textContent = result.message;
    return;
  }

  message.textContent = "Registration successful. You can now login using the new account.";
  form.reset();
});
