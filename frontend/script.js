const API_URL = CONFIG.API_URL;

// Prüfen ob eingeloggt — wenn nicht, zu Login weiterleiten
const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "./login.html";
}

// Eingeloggten Benutzer anzeigen
const user = JSON.parse(localStorage.getItem("user"));
if (user) {
  document.getElementById("username").textContent = `Hallo, ${user.name}`;
}

// Logout
document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "./login.html";
});

// Alle Produkte laden
async function loadProducts() {
  const response = await fetch(`${API_URL}/api/products`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const products = await response.json();

  const list = document.getElementById("product-list");
  list.innerHTML = "";
  products.forEach((product) => {
    const li = document.createElement("li");
    li.textContent = `${product.name} — €${product.price}`;
    list.appendChild(li);
  });
}

// Neues Produkt erstellen
document.getElementById("product-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;

  await fetch(`${API_URL}/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, price: parseFloat(price) }),
  });

  document.getElementById("product-form").reset();
  loadProducts();
});

loadProducts();
