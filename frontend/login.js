// Falls bereits eingeloggt, direkt weiterleiten
if (localStorage.getItem("token")) {
  window.location.href = "./index.html";
}

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`${CONFIG.API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      document.getElementById("error").textContent = data.error;
      return;
    }

    // Token speichern und weiterleiten
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    window.location.href = "./index.html";
  } catch (err) {
    document.getElementById("error").textContent = "Verbindungsfehler";
  }
});
