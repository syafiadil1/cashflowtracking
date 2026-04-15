const usersKey = "finance-advisory-users";
const sessionKey = "finance-advisory-session";

function seedUsers() {
  const users = JSON.parse(localStorage.getItem(usersKey) || "[]");
  if (!users.length) {
    const demoUsers = [
      {
        id: "USR-001",
        name: "Demo User",
        email: "demo@system.com",
        password: "123456",
        role: "User"
      }
    ];
    localStorage.setItem(usersKey, JSON.stringify(demoUsers));
  }
}

export function getUsers() {
  seedUsers();
  return JSON.parse(localStorage.getItem(usersKey) || "[]");
}

export function registerUser({ name, email, password, role }) {
  const users = getUsers();
  const normalizedEmail = String(email).trim().toLowerCase();
  const exists = users.some((user) => user.email.toLowerCase() === normalizedEmail);

  if (exists) {
    return { ok: false, message: "Email already registered." };
  }

  const newUser = {
    id: `USR-${String(users.length + 1).padStart(3, "0")}`,
    name: String(name).trim(),
    email: normalizedEmail,
    password: String(password),
    role: role || "User"
  };

  users.push(newUser);
  localStorage.setItem(usersKey, JSON.stringify(users));
  return { ok: true, user: newUser };
}

export function loginUser({ email, password }) {
  const users = getUsers();
  const normalizedEmail = String(email).trim().toLowerCase();
  const user = users.find((item) => item.email.toLowerCase() === normalizedEmail && item.password === String(password));

  if (!user) {
    return { ok: false, message: "Invalid email or password." };
  }

  const session = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };

  localStorage.setItem(sessionKey, JSON.stringify(session));
  return { ok: true, session };
}

export function getSession() {
  return JSON.parse(localStorage.getItem(sessionKey) || "null");
}

export function logoutUser() {
  localStorage.removeItem(sessionKey);
}

export function renderAuthState() {
  const session = getSession();
  const authArea = document.getElementById("auth-status");
  if (!authArea) {
    return;
  }

  if (session) {
    authArea.innerHTML = `
      <span>Logged in as <strong>${session.name}</strong> (${session.role})</span>
      <button class="button-secondary" id="logout-btn" type="button">Logout</button>
    `;

    const logoutButton = document.getElementById("logout-btn");
    logoutButton.addEventListener("click", () => {
      logoutUser();
      window.location.href = "login.html";
    });
    return;
  }

  authArea.innerHTML = `<span>Not logged in</span>`;
}
