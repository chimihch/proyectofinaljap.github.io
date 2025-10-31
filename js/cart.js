document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-container");
  const product = JSON.parse(localStorage.getItem("product"));

  // Si no hay producto en el localStorage
  if (!product) {
    cartContainer.innerHTML = `
  <div class="d-flex justify-content-center align-items-center" style="height: 60vh;">
    <div class="alert alert-warning text-center w-50" role="alert">
      No hay ningún producto en el carrito.
    </div>
  </div>`;
    return;
  }

  // Mostrar producto en el carrito
  cartContainer.innerHTML = `
    <div class="col-md-8">
      <div class="card shadow-sm p-3 mb-4">
        <div class="row g-0 align-items-center">
          <div class="col-md-4 text-center">
            <img src="${product.image}" class="img-fluid rounded" alt="${product.name}">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text">Costo: <strong>${product.currency} ${product.cost}</strong></p>
              <div class="d-flex align-items-center mb-2">
                <label class="me-2">Cantidad:</label>
                <input type="number" id="quantity" class="form-control w-25" value="${product.count}" min="1">
              </div>
              <p class="card-text">Subtotal: 
                <strong id="subtotal">${product.currency} ${product.cost * product.count}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Actualizar subtotal al cambiar la cantidad
  const quantityInput = document.getElementById("quantity");
  const subtotalEl = document.getElementById("subtotal");

  quantityInput.addEventListener("input", () => {
    const quantity = parseInt(quantityInput.value) || 1;
    subtotalEl.textContent = `${product.currency} ${product.cost * quantity}`;
  });
});
