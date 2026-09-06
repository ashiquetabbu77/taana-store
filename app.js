/* =========================================================
   Taana — demo e-commerce storefront
   Vanilla JS, no build step, no external data dependency.
   Cart persists to localStorage so a reload keeps the bag.
   ========================================================= */

(function () {
  "use strict";

  /* ---------- Data ---------- */

  const CATEGORIES = [
    { id: "sarees", name: "Sarees", desc: "Handwoven, six yards each", base: "#1F3552", pattern: "vertical" },
    { id: "stoles", name: "Stoles & dupattas", desc: "Light weaves for every season", base: "#C68A1F", pattern: "diagonal" },
    { id: "cushions", name: "Cushion covers", desc: "Loom-finished for the home", base: "#9C3B2E", pattern: "cross" },
    { id: "linen", name: "Table linen", desc: "Runners, napkins, mats", base: "#2A2620", pattern: "horizontal" }
  ];

  const PRODUCTS = [
    { id: "p1", name: "Shantipur Tant Saree", category: "sarees", price: 4200, mrp: 5200, base: "#1F3552", accent: "#C68A1F", pattern: "vertical", desc: "A crisp cotton tant woven in Shantipur, Nadia district — fine checks along the body with a contrast mustard border. Cool enough for Delhi summers, sturdy enough for daily wear.", meta: ["100% handspun cotton", "5.5m length, unstitched blouse piece included", "Handwash cold, line dry in shade"] },
    { id: "p2", name: "Chanderi Silk-Cotton Saree", category: "sarees", price: 6800, mrp: null, base: "#9C3B2E", accent: "#E0AE55", pattern: "vertical", desc: "The famous Chanderi sheen, woven with a silk-cotton blend so it drapes soft without clinging. Zari booti scattered across the body, a broad temple border.", meta: ["Silk-cotton blend, zari detailing", "5.5m length", "Dry clean recommended"] },
    { id: "p3", name: "Kutch Ikat Saree", category: "sarees", price: 5400, mrp: 6000, base: "#C68A1F", accent: "#1F3552", pattern: "cross", desc: "Double ikat from a Kutch weaving family, the geometric pattern dyed into the thread before it's ever set on the loom. No two lengths come out quite the same.", meta: ["Pure cotton, double ikat", "5.5m length", "Handwash cold, first wash separately"] },
    { id: "p4", name: "Bengal Cotton Stole", category: "stoles", price: 1100, mrp: null, base: "#C68A1F", accent: "#2A2620", pattern: "diagonal", desc: "A featherweight cotton stole for carrying through a Delhi October — enough warmth for an office AC, light enough to fold into a bag.", meta: ["100% cotton", "2.2m x 0.7m", "Machine wash gentle"] },
    { id: "p5", name: "Tussar Silk Stole", category: "stoles", price: 2600, mrp: 3100, base: "#9C3B2E", accent: "#EFE7D8", pattern: "diagonal", desc: "Raw tussar silk with its characteristic slubbed texture, finished with hand-tied tassels at both ends.", meta: ["Pure tussar silk", "2m x 0.8m", "Dry clean only"] },
    { id: "p6", name: "Kota Doria Dupatta", category: "stoles", price: 1450, mrp: null, base: "#1F3552", accent: "#C68A1F", pattern: "diagonal", desc: "The signature Kota square-check weave, sheer enough to layer over any kurta without adding weight.", meta: ["Cotton-silk blend", "2.3m x 0.9m", "Handwash cold"] },
    { id: "p7", name: "Ikat Cushion Cover, Set of 2", category: "cushions", price: 1350, mrp: 1600, base: "#9C3B2E", accent: "#C68A1F", pattern: "cross", desc: "Two 16-inch cushion covers in a small-scale ikat, backed in plain cotton with a concealed zip.", meta: ["16in x 16in, set of 2", "Cotton, concealed zip closure", "Machine wash cold, insert not included"] },
    { id: "p8", name: "Handloom Stripe Cushion Cover", category: "cushions", price: 750, mrp: null, base: "#1F3552", accent: "#EFE7D8", pattern: "horizontal", desc: "A simple striped weave that reads calm from across the room — good as a single accent or in a set of four.", meta: ["16in x 16in", "100% cotton", "Machine wash cold"] },
    { id: "p9", name: "Table Runner, Kutch Weave", category: "linen", price: 1600, mrp: 1900, base: "#2A2620", accent: "#C68A1F", pattern: "horizontal", desc: "A 6-seater table runner woven in the same geometric idiom as our Kutch sarees — sturdy enough for daily meals.", meta: ["150cm x 35cm", "100% cotton", "Machine wash cold"] },
    { id: "p10", name: "Napkin Set, Natural Dye", category: "linen", price: 950, mrp: null, base: "#C68A1F", accent: "#9C3B2E", pattern: "horizontal", desc: "Six napkins dyed with turmeric and madder root — expect gentle variation from piece to piece; that's the dye, not a flaw.", meta: ["Set of 6, 45cm x 45cm", "Naturally dyed cotton", "Handwash separately for first 3 washes"] },
    { id: "p11", name: "Maheshwari Silk Saree", category: "sarees", price: 5900, mrp: null, base: "#1F3552", accent: "#E0AE55", pattern: "vertical", desc: "The reversible Maheshwari border in a soft silk-cotton weave — light enough for an afternoon, formal enough for evening.", meta: ["Silk-cotton blend", "5.5m length", "Dry clean recommended"] },
    { id: "p12", name: "Placemat Set, Twill Weave", category: "linen", price: 1100, mrp: 1300, base: "#9C3B2E", accent: "#2A2620", pattern: "horizontal", desc: "Four placemats in a tight twill weave that resists everyday spills better than a plain weave would.", meta: ["Set of 4, 45cm x 30cm", "100% cotton", "Machine wash cold"] }
  ];

  /* ---------- Utilities ---------- */

  const fmtPrice = (n) => "₹" + n.toLocaleString("en-IN");

  function swatchStyle(base, accent, pattern) {
    const stripes = {
      vertical: `repeating-linear-gradient(90deg, ${accent}55 0 4px, transparent 4px 18px)`,
      horizontal: `repeating-linear-gradient(0deg, ${accent}55 0 4px, transparent 4px 18px)`,
      diagonal: `repeating-linear-gradient(45deg, ${accent}55 0 4px, transparent 4px 16px)`,
      cross: `repeating-linear-gradient(45deg, ${accent}40 0 3px, transparent 3px 14px), repeating-linear-gradient(-45deg, ${accent}30 0 3px, transparent 3px 14px)`
    };
    return `background-color:${base}; background-image:${stripes[pattern] || stripes.vertical};`;
  }

  function findProduct(id) {
    return PRODUCTS.find((p) => p.id === id);
  }

  /* ---------- Cart state ---------- */

  const CART_KEY = "taana_cart_v1";
  let cart = loadCart();

  function loadCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) { /* ignore */ }
  }

  function addToCart(productId, qty) {
    const existing = cart.find((l) => l.id === productId);
    if (existing) existing.qty += qty;
    else cart.push({ id: productId, qty });
    saveCart();
    renderCart();
    openCart();
  }

  function updateQty(productId, delta) {
    const line = cart.find((l) => l.id === productId);
    if (!line) return;
    line.qty += delta;
    if (line.qty <= 0) cart = cart.filter((l) => l.id !== productId);
    saveCart();
    renderCart();
  }

  function removeLine(productId) {
    cart = cart.filter((l) => l.id !== productId);
    saveCart();
    renderCart();
  }

  function cartSubtotal() {
    return cart.reduce((sum, line) => {
      const p = findProduct(line.id);
      return sum + (p ? p.price * line.qty : 0);
    }, 0);
  }

  function cartCount() {
    return cart.reduce((sum, l) => sum + l.qty, 0);
  }

  /* ---------- Rendering: categories ---------- */

  function renderCategories() {
    const row = document.getElementById("categoryRow");
    row.innerHTML = CATEGORIES.map((c) => `
      <button class="cat-card" data-cat="${c.id}">
        <div class="cat-swatch" style="${swatchStyle(c.base, "#ffffff", c.pattern)}"></div>
        <h4>${c.name}</h4>
        <p>${c.desc}</p>
      </button>
    `).join("");

    row.querySelectorAll(".cat-card").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.getElementById("filterCategory").value = btn.dataset.cat;
        renderProducts();
        document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
      });
    });

    const select = document.getElementById("filterCategory");
    CATEGORIES.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = c.name;
      select.appendChild(opt);
    });
  }

  /* ---------- Rendering: product grid ---------- */

  function renderProducts() {
    const grid = document.getElementById("productGrid");
    const catFilter = document.getElementById("filterCategory").value;
    const sortOrder = document.getElementById("sortOrder").value;

    let items = PRODUCTS.filter((p) => catFilter === "all" || p.category === catFilter);

    if (sortOrder === "price-asc") items = items.slice().sort((a, b) => a.price - b.price);
    if (sortOrder === "price-desc") items = items.slice().sort((a, b) => b.price - a.price);

    grid.innerHTML = items.map((p) => `
      <button class="product-card" data-id="${p.id}">
        <div class="product-swatch" style="${swatchStyle(p.base, p.accent, p.pattern)}"></div>
        <div class="product-title">${p.name}</div>
        <div class="product-meta">${CATEGORIES.find((c) => c.id === p.category).name}</div>
        <div class="product-price">${fmtPrice(p.price)}${p.mrp ? `<span class="old">${fmtPrice(p.mrp)}</span>` : ""}</div>
      </button>
    `).join("");

    grid.querySelectorAll(".product-card").forEach((card) => {
      card.addEventListener("click", () => openProductModal(card.dataset.id));
    });
  }

  /* ---------- Cart drawer ---------- */

  const overlay = document.getElementById("overlay");
  const cartDrawer = document.getElementById("cartDrawer");

  function openCart() {
    cartDrawer.classList.add("active");
    overlay.classList.add("active");
  }
  function closeCart() {
    cartDrawer.classList.remove("active");
    overlay.classList.remove("active");
  }

  function renderCart() {
    document.getElementById("cartCount").textContent = cartCount();
    const body = document.getElementById("cartItems");

    if (cart.length === 0) {
      body.innerHTML = `<p class="empty-cart">Your bag is empty. Go weave something in.</p>`;
    } else {
      body.innerHTML = cart.map((line) => {
        const p = findProduct(line.id);
        if (!p) return "";
        return `
          <div class="cart-line" data-id="${p.id}">
            <div class="line-swatch" style="${swatchStyle(p.base, p.accent, p.pattern)}"></div>
            <div>
              <div class="line-title">${p.name}</div>
              <div class="line-meta">${fmtPrice(p.price)} each</div>
              <div class="qty-control">
                <button class="qty-dec" aria-label="Decrease quantity">&minus;</button>
                <span>${line.qty}</span>
                <button class="qty-inc" aria-label="Increase quantity">&plus;</button>
              </div>
            </div>
            <div>
              <div class="line-title">${fmtPrice(p.price * line.qty)}</div>
              <button class="remove-line">Remove</button>
            </div>
          </div>
        `;
      }).join("");

      body.querySelectorAll(".cart-line").forEach((el) => {
        const id = el.dataset.id;
        el.querySelector(".qty-inc").addEventListener("click", () => updateQty(id, 1));
        el.querySelector(".qty-dec").addEventListener("click", () => updateQty(id, -1));
        el.querySelector(".remove-line").addEventListener("click", () => removeLine(id));
      });
    }

    document.getElementById("cartSubtotal").textContent = fmtPrice(cartSubtotal());
  }

  document.getElementById("cartToggle").addEventListener("click", openCart);
  document.getElementById("closeCart").addEventListener("click", closeCart);
  overlay.addEventListener("click", () => {
    closeCart();
    closeProductModal();
    closeCheckoutModal();
  });

  /* ---------- Product modal ---------- */

  const productOverlay = document.getElementById("productOverlay");
  const productModal = document.getElementById("productModal");
  let activeProductId = null;

  function openProductModal(id) {
    const p = findProduct(id);
    if (!p) return;
    activeProductId = id;
    document.getElementById("productModalBody").innerHTML = `
      <div class="product-modal-grid">
        <div class="pm-visual" style="${swatchStyle(p.base, p.accent, p.pattern)}"></div>
        <div class="pm-body">
          <p class="eyebrow">${CATEGORIES.find((c) => c.id === p.category).name}</p>
          <h2 id="productModalTitle">${p.name}</h2>
          <div class="pm-price">${fmtPrice(p.price)}${p.mrp ? `<span class="old">${fmtPrice(p.mrp)}</span>` : ""}</div>
          <p class="pm-desc">${p.desc}</p>
          <ul class="pm-meta-list">${p.meta.map((m) => `<li>${m}</li>`).join("")}</ul>
          <div class="pm-qty-row">
            <div class="qty-control">
              <button id="pmQtyDec" aria-label="Decrease quantity">&minus;</button>
              <span id="pmQty">1</span>
              <button id="pmQtyInc" aria-label="Increase quantity">&plus;</button>
            </div>
          </div>
          <button class="btn btn-primary" id="pmAddToCart">Add to bag</button>
        </div>
      </div>
    `;

    let qty = 1;
    const qtyLabel = document.getElementById("pmQty");
    document.getElementById("pmQtyInc").addEventListener("click", () => { qty++; qtyLabel.textContent = qty; });
    document.getElementById("pmQtyDec").addEventListener("click", () => { if (qty > 1) qty--; qtyLabel.textContent = qty; });
    document.getElementById("pmAddToCart").addEventListener("click", () => {
      addToCart(p.id, qty);
      closeProductModal();
    });

    productModal.classList.add("active");
    productOverlay.classList.add("active");
  }

  function closeProductModal() {
    productModal.classList.remove("active");
    productOverlay.classList.remove("active");
  }

  document.getElementById("closeProductModal").addEventListener("click", closeProductModal);
  productOverlay.addEventListener("click", closeProductModal);

  /* ---------- Checkout modal ---------- */

  const checkoutOverlay = document.getElementById("checkoutOverlay");
  const checkoutModal = document.getElementById("checkoutModal");

  function openCheckout() {
    if (cart.length === 0) return;
    const subtotal = cartSubtotal();
    const shipping = subtotal > 3000 ? 0 : 99;
    const total = subtotal + shipping;

    document.getElementById("checkoutBody").innerHTML = `
      <h2 id="checkoutTitle">Checkout</h2>
      <form id="checkoutForm">
        <div class="form-row">
          <div><label for="ckName">Full name</label><input id="ckName" required></div>
          <div><label for="ckPhone">Phone</label><input id="ckPhone" type="tel" required></div>
        </div>
        <div class="form-row full">
          <div><label for="ckAddress">Address</label><input id="ckAddress" required></div>
        </div>
        <div class="form-row">
          <div><label for="ckCity">City</label><input id="ckCity" required></div>
          <div><label for="ckPin">Pincode</label><input id="ckPin" required></div>
        </div>
        <label style="display:block; font-size:0.82rem; font-weight:600; margin-bottom:0.3rem; color: var(--indigo-deep);">Payment method</label>
        <div class="payment-options">
          <label><input type="radio" name="payment" value="cod" checked> Cash on delivery</label>
          <label><input type="radio" name="payment" value="upi"> UPI</label>
        </div>
        <div class="checkout-summary">
          <div class="row"><span>Subtotal</span><span>${fmtPrice(subtotal)}</span></div>
          <div class="row"><span>Shipping</span><span>${shipping === 0 ? "Free" : fmtPrice(shipping)}</span></div>
          <div class="row total"><span>Total</span><span>${fmtPrice(total)}</span></div>
        </div>
        <button type="submit" class="btn btn-primary btn-block" style="margin-top:1.5rem;">Place order</button>
      </form>
    `;

    document.getElementById("checkoutForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const orderId = "TN" + Math.floor(100000 + Math.random() * 900000);
      document.getElementById("checkoutBody").innerHTML = `
        <div class="confirmation">
          <p class="eyebrow">Order placed</p>
          <h2>Thank you — it's on the loom to your door.</h2>
          <p class="order-id">${orderId}</p>
          <p>We've sent the details to the phone number you shared. Handloom pieces ship within 3–5 working days.</p>
          <button class="btn btn-ghost" id="ckClose">Close</button>
        </div>
      `;
      document.getElementById("ckClose").addEventListener("click", closeCheckoutModal);
      cart = [];
      saveCart();
      renderCart();
    });

    checkoutModal.classList.add("active");
    checkoutOverlay.classList.add("active");
  }

  function closeCheckoutModal() {
    checkoutModal.classList.remove("active");
    checkoutOverlay.classList.remove("active");
  }

  document.getElementById("checkoutBtn").addEventListener("click", () => {
    closeCart();
    openCheckout();
  });
  document.getElementById("closeCheckoutModal").addEventListener("click", closeCheckoutModal);
  checkoutOverlay.addEventListener("click", closeCheckoutModal);

  /* ---------- Filters ---------- */

  document.getElementById("filterCategory").addEventListener("change", renderProducts);
  document.getElementById("sortOrder").addEventListener("change", renderProducts);

  /* ---------- Newsletter (demo only) ---------- */

  document.getElementById("newsletterForm").addEventListener("submit", (e) => {
    e.preventDefault();
    document.getElementById("newsletterNote").textContent = "You're on the list — welcome in.";
    e.target.reset();
  });

  /* ---------- Keyboard: Escape closes any overlay ---------- */

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeCart();
      closeProductModal();
      closeCheckoutModal();
    }
  });

  /* ---------- Init ---------- */

  renderCategories();
  renderProducts();
  renderCart();
})();
