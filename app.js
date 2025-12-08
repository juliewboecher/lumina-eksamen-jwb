// Toggle menu
// Denne kode håndterer visningen af mobilmenuen, når brugeren klikker på menuikonet.

// Hent elementerne fra DOM
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

// Tilføj klik-event til menuikonet
menuToggle.addEventListener("click", () => {
  mobileMenu.classList.toggle("active");
});

// Luk menu når man klikker på et link
const menuLinks = mobileMenu.querySelectorAll("a");
menuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
  });
});

// Luk menu når man klikker uden for menuen
document.addEventListener("click", (e) => {
  if (!e.target.closest(".topNav") && !e.target.closest(".mobile-menu")) {
    mobileMenu.classList.remove("active");
  }
});

// Farveudvalg på produktside
// Denne kode håndterer skiftet af produktbillede baseret på den valgte farve.

// Hent alle farveknapper og hovedbilledet
const colorButtons = document.querySelectorAll(".color-btn");
const mainImage = document.getElementById("mainImage");
const colorLabel = document.getElementById("colorLabel");

// Tilføj klik-events til hver farveknap
colorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Fjern active klasse fra alle knapper
    colorButtons.forEach((btn) => btn.classList.remove("active"));

    // Tilføj active klasse til den klikkede knap
    button.classList.add("active");

    // Skift billedet
    const newImage = button.getAttribute("data-image");
    mainImage.src = newImage;

    // Skift farvetitlen
    const newColorName = button.getAttribute("data-color-name");
    colorLabel.textContent = newColorName;
  });
});

// Kurv funktionalitet
// Denne kode håndterer tilføjelse af produkter til kurven og gemmer dem lokalt

// Vent til at hele siden er indlæst før vi kører kurv-koden
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCart);
} else {
  initCart();
}

function initCart() {
  const addToCartBtn = document.getElementById("addToCartBtn");

  if (!addToCartBtn) {
    console.log(
      "addToCartBtn ikke fundet - denne side har måske ikke en kurv-knap"
    );
    return;
  }

  addToCartBtn.addEventListener("click", () => {
    // Hent det valgte produkt
    const activeColorBtn = document.querySelector(".color-btn.active");
    const productName = document.querySelector(".product-info h1").textContent;
    const productPrice = document.querySelector(".price").textContent;
    const productImage = document.getElementById("mainImage").src;
    const selectedColor = activeColorBtn.getAttribute("data-color-name");

    // Opret produkt objekt
    const product = {
      id: Date.now(),
      name: productName,
      price: productPrice,
      image: productImage,
      color: selectedColor,
      quantity: 1,
    };

    // Hent eksisterende kurv fra localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Tjek om produktet med samme farve allerede er i kurven
    const existingProduct = cart.find(
      (item) => item.name === product.name && item.color === product.color
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push(product);
    }

    // Gem den opdaterede kurv i localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Vis modal popup i stedet for alert
    showCartModal(product);

    // Skift knappetekst midlertidigt
    const originalText = addToCartBtn.textContent;
    addToCartBtn.textContent = "✓ Tilføjet til kurv";
    addToCartBtn.style.backgroundColor = "#ffffff";

    setTimeout(() => {
      addToCartBtn.textContent = originalText;
      addToCartBtn.style.backgroundColor = "";
    }, 2000);
  });
}

function showCartModal(product) {
  const modal = document.getElementById("cartModal");
  document.getElementById("modalImage").src = product.image;
  document.getElementById("modalQuantity").textContent =
    product.quantity + " stk.";
  document.getElementById("modalColor").textContent = product.color;
  document.getElementById("modalPrice").textContent = product.price;

  modal.classList.add("active");

  // Luk modal efter 5 sekunder
  setTimeout(() => {
    closeCartModal();
  }, 5000);
}

function closeCartModal() {
  const modal = document.getElementById("cartModal");
  modal.classList.remove("active");
}

// Vis kurv på kurv.html siden
function displayCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItemsDiv = document.getElementById("cartItems");
  const cartTotalDiv = document.getElementById("cartTotal");

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = "<p>Din kurv er tom</p>";
    return;
  }

  let html = '<h2>Din kurv</h2><table border="1" style="width:100%">';
  html +=
    "<tr><th>Produkt</th><th>titel</th><th>Farve</th><th>Pris</th><th>Antal</th><th>Slet</th></tr>";

  let total = 0;

  cart.forEach((item) => {
    const price = parseInt(item.price);
    const itemTotal = price * item.quantity;
    total += itemTotal;

    html += `<tr>
      <td><img src="${item.image}" alt="${item.name}" style="width:200px;height:auto;"></td>
      <td>${item.name}</td>
      <td>${item.color}</td>
      <td>${item.price}</td>
      <td>${item.quantity}</td>
      <td><button onclick="removeFromCart(${item.id})">Slet</button></td>
    </tr>`;
  });

  html += "</table>";
  cartItemsDiv.innerHTML = html;
  cartTotalDiv.innerHTML = `<h3>I alt: ${total} DKK</h3>`;
}

function removeFromCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((item) => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

// Kald funktionen når siden indlæses
displayCart();
