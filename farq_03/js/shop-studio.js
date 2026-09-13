const PRODUCTS = [
  { id: "tee", name: "Studio Tee", price: 32, category: "apparel", color: "#312e81" },
  { id: "hoodie", name: "Dev Hoodie", price: 68, category: "apparel", color: "#134e4a" },
  { id: "mug", name: "Code Mug", price: 18, category: "home", color: "#78350f" },
  { id: "desk-mat", name: "Desk Mat", price: 42, category: "home", color: "#1e3a5f" },
  { id: "cap", name: "Logo Cap", price: 28, category: "accessories", color: "#4c1d95" },
  { id: "tote", name: "Canvas Tote", price: 24, category: "accessories", color: "#713f12" },
];

const STORAGE_KEY = "shop-studio-cart";

const grid = document.getElementById("product-grid");
const cartToggle = document.getElementById("cart-toggle");
const cartPanel = document.getElementById("cart-panel");
const cartOverlay = document.getElementById("cart-overlay");
const cartClose = document.getElementById("cart-close");
const cartItemsEl = document.getElementById("cart-items");
const cartEmpty = document.getElementById("cart-empty");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("category-filter");
const shopStatus = document.getElementById("shop-status");

let cart = loadCart();

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function formatPrice(n) {
  return `$${n.toFixed(2)}`;
}

function getProduct(id) {
  return PRODUCTS.find((p) => p.id === id);
}

function cartQtyTotal() {
  return Object.values(cart).reduce((sum, q) => sum + q, 0);
}

function cartPriceTotal() {
  return Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = getProduct(id);
    return product ? sum + product.price * qty : sum;
  }, 0);
}

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const filtered = PRODUCTS.filter((p) => {
    const matchCat = category === "all" || p.category === category;
    const matchQuery = !query || p.name.toLowerCase().includes(query);
    return matchCat && matchQuery;
  });

  shopStatus.textContent =
    filtered.length === 1 ? "1 product" : `${filtered.length} products`;

  grid.innerHTML = filtered
    .map(
      (p) => `
    <li class="product-card">
      <div class="product-card__img" style="background: linear-gradient(145deg, ${p.color}, #0c0e14)"></div>
      <div class="product-card__body">
        <p class="product-card__cat">${p.category}</p>
        <h3>${p.name}</h3>
        <p class="product-card__price">${formatPrice(p.price)}</p>
        <button type="button" data-add="${p.id}">Add to cart</button>
      </div>
    </li>`
    )
    .join("");

  grid.querySelectorAll("[data-add]").forEach((btn) => {
    btn.addEventListener("click", () => addToCart(btn.dataset.add));
  });
}

function renderCart() {
  const entries = Object.entries(cart).filter(([, qty]) => qty > 0);
  const totalItems = cartQtyTotal();
  const totalPrice = cartPriceTotal();

  cartCount.textContent = String(totalItems);
  cartTotal.textContent = formatPrice(totalPrice);
  checkoutBtn.disabled = totalItems === 0;
  cartEmpty.hidden = entries.length > 0;
  cartItemsEl.hidden = entries.length === 0;

  cartItemsEl.innerHTML = entries
    .map(([id, qty]) => {
      const p = getProduct(id);
      if (!p) return "";
      return `
      <li class="cart-item">
        <div>
          <strong>${p.name}</strong>
          <span>${formatPrice(p.price)} each</span>
        </div>
        <div class="cart-item__qty">
          <button type="button" data-dec="${id}" aria-label="Decrease ${p.name}">−</button>
          <span>${qty}</span>
          <button type="button" data-inc="${id}" aria-label="Increase ${p.name}">+</button>
        </div>
      </li>`;
    })
    .join("");

  cartItemsEl.querySelectorAll("[data-inc]").forEach((btn) => {
    btn.addEventListener("click", () => changeQty(btn.dataset.inc, 1));
  });
  cartItemsEl.querySelectorAll("[data-dec]").forEach((btn) => {
    btn.addEventListener("click", () => changeQty(btn.dataset.dec, -1));
  });
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  renderCart();
  openCart();
}

function changeQty(id, delta) {
  cart[id] = Math.max(0, (cart[id] || 0) + delta);
  if (cart[id] === 0) delete cart[id];
  saveCart();
  renderCart();
}

function openCart() {
  cartPanel.hidden = false;
  cartOverlay.hidden = false;
  cartToggle.setAttribute("aria-expanded", "true");
  cartClose.focus();
}

function closeCart() {
  cartPanel.hidden = true;
  cartOverlay.hidden = true;
  cartToggle.setAttribute("aria-expanded", "false");
  cartToggle.focus();
}

cartToggle.addEventListener("click", () => {
  if (cartPanel.hidden) openCart();
  else closeCart();
});

cartClose.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

checkoutBtn.addEventListener("click", () => {
  alert("Demo checkout — thanks for trying Shop Studio!");
  cart = {};
  saveCart();
  renderCart();
  closeCart();
});

searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !cartPanel.hidden) closeCart();
});

renderProducts();
renderCart();
