document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-container");
  const cartItems = JSON.parse(localStorage.getItem("cart"));

  // Si no hay producto en el localStorage
  if (!cartItems || cartItems.length === 0) {
    cartContainer.innerHTML = `
  <div class="d-flex justify-content-center align-items-center" style="height: 60vh;">
    <div class="alert alert-warning text-center w-50" role="alert">
      No hay ningún producto en el carrito.
    </div>
  </div>`;
    return;
  }

  // Mostrar productos en el carrito 
  cartContainer.innerHTML = cartItems.map((product, idx) => {
    const pid = product.id ?? `idx-${idx}`;
    const qty = product.count || 1;
    const currency = product.currency ? `${product.currency} ` : "";
    const subtotal = (Number(product.cost) || 0) * qty;
    const imgSrc = product.image || (product.images && product.images[0]) || "";

    return `
      <div class="col-md-7" data-id="${pid}">
        <div class="card shadow p-3 mb-3 border-0">
          <div class="row g-0 align-items-center">
            <div class="col-md-4 mx-2">
              <img src="${imgSrc}" class="img-fluid rounded" alt="${product.name}">
            </div>
            <div class="col-md-7">
              <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text mb-1">Costo: <strong>${currency}${Number(product.cost).toFixed(2)}</strong></p>
                <div class="d-flex align-items-center mb-2">
                  <label class="me-2">Cantidad:</label>
                  <input type="number" id="quantity-${pid}" data-id="${pid}" class="form-control w-25 quantity-input" value="${qty}" min="1">
                </div>
                <p class="card-text">Subtotal:
                  <strong id="subtotal-${pid}" class="subtotal">${currency}${subtotal.toFixed(2)}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");

  //listeners a cada input para actualizar subtotal en tiempo real
  cartItems.forEach(product => {
    const pid = product.id ?? `idx-${cartItems.indexOf(product)}`;
    const qtyInput = document.getElementById(`quantity-${pid}`);
    const subtotalEl = document.getElementById(`subtotal-${pid}`);
    if (!qtyInput || !subtotalEl) return;

    qtyInput.addEventListener("input", () => {
      let quantity = parseInt(qtyInput.value, 10);
      if (isNaN(quantity) || quantity < 1) quantity = 1;
      qtyInput.value = quantity;

      const newSubtotal = (Number(product.cost) || 0) * quantity;
      const currency = product.currency ? `${product.currency} ` : "";
      subtotalEl.textContent = `${currency}${newSubtotal.toFixed(2)}`;

      // actualizar cantidad en localStorage
      const stored = JSON.parse(localStorage.getItem("cart")) || [];
      const idx = stored.findIndex(item => (item.id ?? null) === (product.id ?? null));
      if (idx > -1) {
        stored[idx].count = quantity;
        localStorage.setItem("cart", JSON.stringify(stored));
      }
    });
  });
});