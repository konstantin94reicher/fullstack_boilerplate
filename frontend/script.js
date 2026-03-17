// Beim Laden der Seite: alle Produkte abrufen
async function loadProducts() {
  const response = await fetch("http://localhost:3000/api/products");
  const products = await response.json();

  const list = document.getElementById("product-list");
  list.innerHTML = "";
  products.forEach((product) => {
    const li = document.createElement("li");
    li.textContent = `${product.name} — €${product.price}`;
    list.appendChild(li);
  });
}

// Formular abschicken: neues Produkt erstellen
document.getElementById("product-form").addEventListener("submit", async (e) => {
  e.preventDefault(); // verhindert dass die Seite neu lädt

  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;

  await fetch("http://localhost:3000/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, price: parseFloat(price) }),
  });

  // Formular leeren und Liste neu laden
  document.getElementById("product-form").reset();
  loadProducts();
});

loadProducts();
