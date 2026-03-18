document.getElementById("register-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`${CONFIG.API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      document.getElementById("error").textContent = data.error;
      return;
    }

    document.getElementById("success").textContent = "Registrierung erfolgreich — du wirst weitergeleitet...";
    setTimeout(() => {
      window.location.href = "./login.html";
    }, 1500);
  } catch (err) {
    document.getElementById("error").textContent = "Verbindungsfehler";
  }
});
