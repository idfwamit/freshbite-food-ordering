const foodItems = [
  { 
    id: 1, 
    name: "Margherita Pizza", 
    price: 12.99, 
    category: "veg", 
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&auto=format&fit=crop&q=60", 
    desc: "Fresh tomatoes, mozzarella, and aromatic basil." 
  },
  { 
    id: 2, 
    name: "Chicken Burger", 
    price: 8.99, 
    category: "non-veg", 
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60", 
    desc: "Grilled chicken patty with spicy secret sauce." 
  },
  { 
    id: 3, 
    name: "Pasta Alfredo", 
    price: 10.99, 
    category: "veg", 
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500&auto=format&fit=crop&q=80", 
    desc: "Creamy white sauce pasta with herbs." 
  },
  { 
    id: 4, 
    name: "Spicy Pepperoni Pizza", 
    price: 14.49, 
    category: "non-veg", 
    image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=500&auto=format&fit=crop&q=60", 
    desc: "Topped with spicy pepperoni and mozzarella." 
  },
  { 
    id: 5, 
    name: "Vegan Buddha Bowl", 
    price: 11.49, 
    category: "vegan", 
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60", 
    desc: "Quinoa, avocado, chickpeas, and tahini." 
  },
  { 
    id: 6, 
    name: "Crispy Tofu Salad", 
    price: 9.99, 
    category: "vegan", 
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=60", 
    desc: "Organic crispy tofu with fresh greens." 
  }
];

let cart = [];
let wishlist = [];
let discount = 0;
let appliedCouponCode = "";
let ordersCount = 0;

function renderMenu(items) {
  const menuContainer = document.getElementById("menu-grid");
  menuContainer.innerHTML = "";

  items.forEach(item => {
    const isWishlisted = wishlist.includes(item.id);
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="card-body">
        <i class="fa fa-heart wishlist-icon ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist(${item.id})"></i>
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
        <span class="tag tag-${item.category}">
          ${item.category.toUpperCase()}
        </span>
        <p style="font-weight: bold; margin-top: 8px;">$${item.price.toFixed(2)}</p>
        <button class="btn primary-btn" style="width:100%; margin-top: 8px;" onclick="addToCart(${item.id})">Add to Cart</button>
      </div>
    `;
    menuContainer.appendChild(card);
  });
}

function filterMenu(type) {
  document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
  event.target.classList.add("active");

  if (type === "all") {
    renderMenu(foodItems);
  } else {
    renderMenu(foodItems.filter(item => item.category === type));
  }
}

// Wishlist Functionality
function toggleWishlist(id) {
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(itemId => itemId !== id);
  } else {
    wishlist.push(id);
  }
  document.getElementById("wishlist-count").innerText = wishlist.length;
  renderWishlist();
  renderMenu(foodItems);
}

function renderWishlist() {
  const container = document.getElementById("wishlist-grid");
  if (wishlist.length === 0) {
    container.innerHTML = `<p style="grid-column: 1/-1; text-align: center;">No items in wishlist yet.</p>`;
    return;
  }
  const wishlistedItems = foodItems.filter(item => wishlist.includes(item.id));
  container.innerHTML = "";
  wishlistedItems.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="card-body">
        <h3>${item.name}</h3>
        <p style="font-weight: bold;">$${item.price.toFixed(2)}</p>
        <button class="btn primary-btn" style="width:100%;" onclick="addToCart(${item.id})">Move to Cart</button>
      </div>
    `;
    container.appendChild(card);
  });
}

// Cart Functionality
function addToCart(id) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    const product = foodItems.find(p => p.id === id);
    cart.push({ ...product, qty: 1 });
  }
  updateCart();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.id !== id);
    }
  }
  updateCart();
}

function applyCoupon() {
  const code = document.getElementById("coupon-input").value.trim().toUpperCase();
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const status = document.getElementById("coupon-status");

  if (code === "FRESH30") {
    if (subtotal >= 20) {
      discount = subtotal * 0.30;
      appliedCouponCode = code;
      status.innerText = "✅ Coupon FRESH30 applied (30% Off)!";
      status.style.color = "green";
    } else {
      status.innerText = "❌ Minimum cart value of $20 required for FRESH30.";
      status.style.color = "red";
    }
  } else if (code === "TASTY5") {
    discount = Math.min(5, subtotal);
    appliedCouponCode = code;
    status.innerText = "✅ Coupon TASTY5 applied ($5 Off)!";
    status.style.color = "green";
  } else {
    discount = 0;
    status.innerText = "❌ Invalid Coupon Code.";
    status.style.color = "red";
  }
  updateCart();
}

function updateCart() {
  const countSpan = document.getElementById("cart-count");
  const cartItemsDiv = document.getElementById("cart-items");
  const totalContainer = document.getElementById("cart-total-container");
  const subtotalSpan = document.getElementById("cart-subtotal");
  const discountRow = document.getElementById("discount-row");
  const discountSpan = document.getElementById("cart-discount");
  const totalSpan = document.getElementById("cart-total");

  const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
  countSpan.innerText = totalQty;

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
    totalContainer.style.display = "none";
    discount = 0;
    return;
  }

  totalContainer.style.display = "block";
  cartItemsDiv.innerHTML = "";

  let subtotal = 0;
  cart.forEach(item => {
    subtotal += item.price * item.qty;
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div>
        <strong>${item.name}</strong> - $${item.price.toFixed(2)}
      </div>
      <div class="cart-controls">
        <button onclick="changeQty(${item.id}, -1)">-</button>
        <span style="padding: 0 8px;">${item.qty}</span>
        <button onclick="changeQty(${item.id}, 1)">+</button>
      </div>
    `;
    cartItemsDiv.appendChild(div);
  });

  const finalTotal = Math.max(0, subtotal - discount);

  subtotalSpan.innerText = subtotal.toFixed(2);
  if (discount > 0) {
    discountRow.style.display = "block";
    discountSpan.innerText = discount.toFixed(2);
  } else {
    discountRow.style.display = "none";
  }
  totalSpan.innerText = finalTotal.toFixed(2);
}

// Simulated Payment & Order Checkout Flow
function handleCheckout(e) {
  e.preventDefault();
  if (cart.length === 0) {
    alert("Please add items to your cart first!");
    return;
  }

  const method = document.getElementById("payment-method-select").value;
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const finalTotal = Math.max(0, subtotal - discount);

  if (method === "online") {
    document.getElementById("modal-pay-amount").innerText = finalTotal.toFixed(2);
    document.getElementById("payment-modal").style.display = "flex";
  } else {
    completeOrderProcess();
  }
}

function confirmPayment(isSuccess) {
  document.getElementById("payment-modal").style.display = "none";
  if (isSuccess) {
    completeOrderProcess();
  } else {
    alert("Payment cancelled by user.");
  }
}

function completeOrderProcess() {
  ordersCount++;
  document.getElementById("orders-count").innerText = ordersCount;
  cart = [];
  discount = 0;
  updateCart();
  document.getElementById("checkout-form").reset();
  
  startOrderTracking();
}

// Simulated Order Tracking
function startOrderTracking() {
  const trackingSection = document.getElementById("tracking");
  const msg = document.getElementById("tracking-message");
  trackingSection.style.display = "block";
  trackingSection.scrollIntoView({ behavior: "smooth" });

  const steps = [
    { id: "step-1", text: "Order Placed Successfully! Sent to kitchen." },
    { id: "step-2", text: "Chef is preparing your fresh meal 🔥" },
    { id: "step-3", text: "Delivery partner is on the way 🛵" },
    { id: "step-4", text: "Order Delivered! Enjoy your meal 🎉" }
  ];

  steps.forEach(s => document.getElementById(s.id).classList.remove("active"));
  
  steps.forEach((step, index) => {
    setTimeout(() => {
      document.getElementById(step.id).classList.add("active");
      msg.innerText = step.text;
    }, index * 2500);
  });
}

// Initial Call
renderMenu(foodItems);