// ==========================
// Import Statements
// ==========================

import { cardData } from "./data/cardData.js";
import { cardComponent } from "./components/cardComponent.js";

// ==========================
// DOM Selectors
// ==========================

const container = document.querySelector("#card_wrap");
const cartContainer = document.querySelector("#cart_container");
const cartCount = document.querySelector("#cart_count");
const modalContainer = document.querySelector("#modal_container");

// ==========================
// Cart : Array
// ==========================
const cart = [];

// ====================================================
// Functions
// ====================================================

function getProductQuantity(productName) {
  for (let n = 0; n < cart.length; n++) {
    if (cart[n].name === productName) {
      return cart[n].quantity;
    }
  }

  return 0;
}

function renderProducts() {
  container.innerHTML = "";

  for (let c = 0; c < cardData.length; c++) {
    const card = cardData[c];

    const quantity = getProductQuantity(card.name);

    container.innerHTML += cardComponent(card, quantity);
  }
}

// renderProducts();

function renderCart() {
  const totalItems = cart.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  cartCount.textContent = totalItems;

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="flex flex-col items-center py-10 text-center">
        <p class="text-5xl">🛒</p>

        <p class="mt-4 text-sm font-semibold text-[#87635a]">
          Your added items will appear here
        </p>
      </div>
    `;

    return;
  }

  cartContainer.innerHTML = cart
    .map((item) => {
      const itemTotal = Number(item.price.replace("$", "")) * item.quantity;

      return `
    <div class="border-b border-[#f5eeec] py-4">
          <div class="flex items-start justify-between gap-4">
              <h3 class="font-semibold text-[#260f08]">
                ${item.description}
              </h3>

              <button
                type="button"
                data-remove="${item.name}"
                aria-label="Remove ${item.description}"
                class="flex h-5 w-5 items-center justify-center rounded-full border border-[#ad8a85] text-xs text-[#87635a]"
              >
                ×
              </button>
          </div>

          <div class="mt-2 flex items-center gap-3 text-sm">
            <span class="font-semibold text-[#c73b0f]">
              ${item.quantity}x
            </span>

            <span class="text-[#87635a]">
              @ ${item.price}
            </span>

            <span class="font-semibold text-[#87635a]">
              $${itemTotal.toFixed(2)}
            </span>
          </div>
        </div>
    `;
    })

    .join("");

  const orderTotal = cart.reduce((total, item) => {
    const price = Number(item.price.replace("$", ""));

    return total + price * item.quantity;
  }, 0);

  cartContainer.innerHTML += `
  <div class="pt-6">
    <div class="flex items-center justify-between text-sm text-[#87635a]">
      <span>Order Total</span>

      <strong class="text-2xl text-[#260f08]">
        $${orderTotal.toFixed(2)}
      </strong>
    </div>

    <div class="mt-6 rounded-lg bg-[#fcf8f5] px-4 py-4 text-center text-sm text-[#260f08]">
      Click the button below to proceed.
    </div>

    <button
      type="button"
      data-confirm-order
      class="mt-6 w-full rounded-full bg-[#c73b0f] px-6 py-4 font-semibold text-white"
    >
      Confirm Order
    </button>
  </div>
`;
}

function showOrderConfirmation() {
  let confirmationItems = "";
  let orderTotal = 0;

  for (let oc = 0; oc < cart.length; oc++) {
    const item = cart[oc];

    const unitPrice = Number(item.price.replace("$", ""));
    const itemTotal = unitPrice * item.quantity;

    orderTotal += itemTotal;

    confirmationItems += `
      <div class="flex items-center gap-4 border-b border-[#f5eeec] py-4">
        <img
          src="${item.image}"
          alt="${item.description}"
          class="h-12 w-12 rounded object-cover"
        />

        <div class="flex-1">
          <h3 class="font-semibold text-[#260f08]">
            ${item.description}
          </h3>

          <p class="mt-1 text-sm text-[#87635a]">
            <span class="font-semibold text-[#c73b0f]">
              ${item.quantity}x
            </span>
            <span class="ml-3">@ ${item.price}</span>
          </p>
        </div>

        <strong class="text-[#260f08]">
          $${itemTotal.toFixed(2)}
        </strong>
      </div>
    `;
  }

  modalContainer.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <section class="w-full max-w-xl rounded-xl bg-white p-6 sm:p-10">
        <p class="text-4xl text-[#1ea575]">✓</p>

        <h2 class="mt-6 text-4xl font-bold text-[#260f08]">
          Order Confirmed
        </h2>

        <p class="mt-2 text-[#87635a]">
          We hope you enjoy your food!
        </p>

        <div class="mt-8 rounded-lg bg-[#fcf8f5] p-6">
          ${confirmationItems}

          <div class="flex items-center justify-between pt-6">
            <span class="text-[#87635a]">Order Total</span>

            <strong class="text-2xl text-[#260f08]">
              $${orderTotal.toFixed(2)}
            </strong>
          </div>
        </div>

        <button
          type="button"
          data-start-new-order
          class="mt-8 w-full rounded-full bg-[#c73b0f] px-6 py-4 font-semibold text-white"
        >
          Start New Order
        </button>
      </section>
    </div>
  `;
}

// ==========================
// Function Call
// ==========================
renderProducts();
renderCart();

// ====================================================
// Event Listeners
// ====================================================

// ==========================
// Add : Listener

container.addEventListener("click", (event) => {
  const button = event.target.closest("[data-product]");

  // If Condition

  if (!button) return;

  const selectedCard = cardData.find(
    (card) => card.name === button.dataset.product,
  );

  const cartItem = cart.find((item) => item.name === selectedCard.name);

  // If...else Condition

  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({
      ...selectedCard,
      quantity: 1,
    });
  }

  // ==========================
  // Function Call
  // ==========================

  renderCart();
  renderProducts();
});

// ==========================
// Remove : Listener

cartContainer.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove]");

  if (!button) return;

  const itemIndex = cart.findIndex(
    (item) => item.name === button.dataset.remove,
  );

  cart.splice(itemIndex, 1);

  // ==========================
  // Function Call
  // ==========================

  renderCart();
  renderProducts();
});

// ==========================
// Confirm / Submit : Listener

cartContainer.addEventListener("click", (event) => {
  const button = event.target.closest("[data-confirm-order]");

  // If condition

  if (!button) return;

  // ==========================
  // Function Call
  // ==========================

  showOrderConfirmation();
});

// ==========================
// Reset : Listener

modalContainer.addEventListener("click", (event) => {
  const button = event.target.closest("[data-start-new-order]");

  // If condition

  if (!button) return;
  cart.length = 0;

  modalContainer.innerHTML = "";

  // ==========================
  // Function Call
  // ==========================

  renderCart();
  renderProducts();
});
