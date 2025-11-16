document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Helpers para elementos seguros ---------- */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const cartContainer = document.getElementById("cart-container");
  let storedCart = JSON.parse(localStorage.getItem("cart")) || [];

  if (!storedCart || storedCart.length === 0) {
    if (cartContainer) {
      cartContainer.innerHTML = `
        <div class="d-flex justify-content-center align-items-center" style="height: 60vh;">
          <div class="alert alert-warning text-center w-50" role="alert">
            No hay ningún producto en el carrito.
          </div>
        </div>`;
    }
    // actualizar badges a 0
    const b1 = document.getElementById("total-products");
    const b2 = document.getElementById("total-products2");
    if (b1) b1.textContent = "";
    if (b2) b2.textContent = "";
    return;
  }

  /* ---------- Renderizado de productos ---------- */
  function renderCartItems(cartItems) {
    storedCart = Array.isArray(cartItems) ? cartItems.slice() : [];
    cartContainer.innerHTML = cartItems.map((product, idx) => {
      const pid = product.id ?? `idx-${idx}`;
      const qty = product.count || 1;
      const currency = product.currency ? `${product.currency} ` : "";
      const subtotal = (Number(product.cost) || 0) * qty;
      const imgSrc = product.image || (product.images && product.images[0]) || "";

      return `
        <div class="card shadow p-3 mb-3 border-0" data-pid="${pid}">
          <div class="row g-0 align-items-center">
            <div class="col-md-4">
              <img src="${imgSrc}" class="img-fluid rounded" alt="${product.name}">
            </div>
            <div class="col-md-8">
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
                <button class="btn btn-outline-danger btn-sm deletep" data-pid="${pid}">
                    <i class="fa fa-trash"></i> Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join("");

      quitarDelCarrito();
      attachQuantityListeners();
  }

  renderCartItems(storedCart);

function quitarDelCarrito() {
  const deleteBtns = document.querySelectorAll('.deletep');
  deleteBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pid = String(btn.dataset.pid);

      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const newCart = cart.filter((item, i) => {
        const itemId = String(item.id ?? `idx-${i}`);
        return itemId !== pid;
      });

      localStorage.setItem("cart", JSON.stringify(newCart));

      const card = btn.closest('[data-pid]');
      if (card) card.remove();

      renderCartItems(newCart);
      actualizarTotalesFinales();
    });
  });
}

  /* ---------- Calcular subtotal de productos (suma de subtotales) ---------- */
  function calcularSubtotalProductos() {
    const subs = $$('.subtotal');
    let total = 0;
    subs.forEach(el => {
      const text = (el.textContent || "").replace(/[^\d.-]/g, "");
      total += parseFloat(text) || 0;
    });
    return total;
  }

  /* ---------- Obtener porcentaje de envío (maneja value numérico o keys) ---------- */
  function getShippingPercentage() {
    // busca radio seleccionado tanto para name="shipping" como name="envio" por compatibilidad
    const radio = document.querySelector('input[name="shipping"]:checked') || document.querySelector('input[name="envio"]:checked');
    if (!radio) return 0;

    const v = (radio.value || "").trim();

    // si value es numérico (ej "0.15"), parsearlo
    const asNum = parseFloat(v);
    if (!isNaN(asNum) && isFinite(asNum)) return asNum;

    // si es palabra (premium/express/standard), mapear a porcentaje
    const map = {
      premium: 0.15,
      express: 0.07,
      standard: 0.05
    };
    return map[v.toLowerCase()] ?? 0;
  }

  /* ---------- Calcular costo envío y total final ---------- */
  function actualizarTotalesFinales() {
    const subtotalProductos = calcularSubtotalProductos();
    const porc = getShippingPercentage();
    const costoEnvio = subtotalProductos * porc;
    const totalFinal = subtotalProductos + costoEnvio;

    // Actualizar displays - verificar existencia
    const subtotalEl = document.getElementById("subtotal-general");
    const envioEl = document.getElementById("costo-envio");
    const totalEl = document.getElementById("total-final") || document.getElementById("total");

    if (subtotalEl) subtotalEl.textContent = `USD ${subtotalProductos.toFixed(2)}`;
    if (envioEl) envioEl.textContent = `USD ${costoEnvio.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `USD ${totalFinal.toFixed(2)}`;

    // badge de cantidad de productos
    const totalProductsB = document.getElementById("total-products");
    const totalProductsB2 = document.getElementById("total-products2");
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = stored.reduce((acc, item) => acc + (Number(item.count) || 0), 0);
    if (totalProductsB) totalProductsB.textContent = totalItems > 0 ? `${totalItems}` : '';
    if (totalProductsB2) totalProductsB2.textContent = totalItems > 0 ? `${totalItems}` : '';
  }

  /* ---------- Actualiza los subtotales individuales y localStorage ---------- */
  function attachQuantityListeners() {
    // Reattach for each item
    storedCart.forEach(product => {
      const pid = product.id ?? `idx-${storedCart.indexOf(product)}`;
      const qtyInput = document.getElementById(`quantity-${pid}`);
      const subtotalEl = document.getElementById(`subtotal-${pid}`);
      if (!qtyInput || !subtotalEl) return;

      // input listener
      qtyInput.addEventListener("input", () => {
        let quantity = parseInt(qtyInput.value, 10);
        if (isNaN(quantity) || quantity < 1) quantity = 1;
        qtyInput.value = quantity;

        const newSubtotal = (Number(product.cost) || 0) * quantity;
        const currency = product.currency ? `${product.currency} ` : "";
        subtotalEl.textContent = `${currency}${newSubtotal.toFixed(2)}`;

        // actualizar localStorage
        const stored = JSON.parse(localStorage.getItem("cart")) || [];
        const idx = stored.findIndex(item => (item.id ?? null) === (product.id ?? null));
        if (idx > -1) {
          stored[idx].count = quantity;
          localStorage.setItem("cart", JSON.stringify(stored));
        }

        // recalcular totales
        actualizarTotalesFinales();
      });
    });
  }

  attachQuantityListeners();

  /* ---------- Listeners para cambios de envío (soporta name shipping o envio) ---------- */
  function attachShippingListeners() {
    const radios = Array.from(document.querySelectorAll('input[name="shipping"], input[name="envio"]'));
    radios.forEach(r => r.addEventListener('change', () => {
      console.log('Cambio envío a', r.value);
      actualizarTotalesFinales();
    }));
  }

  attachShippingListeners();

  // calcular una vez al cargar
  actualizarTotalesFinales();

  /* ---------- Validaciones (dirección y pago) ---------- */
  function validarDireccion() {
    const calleEl = document.getElementById("calle");
    const numeroEl = document.getElementById("numero");
    const esquinaEl = document.getElementById("esquina");

    const ok = calleEl && numeroEl && esquinaEl &&
      calleEl.value.trim() !== "" &&
      numeroEl.value.trim() !== "" &&
      esquinaEl.value.trim() !== "";

    // si tenés alert placeholders, los mostramos/ocultamos
    const alertDir = document.getElementById("alert-direccion");
    if (alertDir) alertDir.classList.toggle("d-none", ok);

    return ok;
  }

 function validarPago() {
  const tarjeta = document.getElementById("pago-tarjeta");
  const transferencia = document.getElementById("pago-transferencia");

  const okTarjeta = tarjeta && tarjeta.checked;
  const okTransf = transferencia && transferencia.checked;

  let okCamposExtra = true;

  // Si elige tarjeta: que sus campos no estén vacíos
  if (okTarjeta) {
    const num = document.getElementById("num-tarjeta")?.value.trim();
    const vto = document.getElementById("vto-tarjeta")?.value.trim();
    const cvv = document.getElementById("cvv-tarjeta")?.value.trim();

    okCamposExtra = num !== "" && vto !== "" && cvv !== "";
  }

  // Si elige transferencia: que su campo no esté vacío
  if (okTransf) {
    const cuenta = document.getElementById("cuenta-transferencia")?.value.trim();
    okCamposExtra = cuenta !== "";
  }

  const ok = (okTarjeta || okTransf) && okCamposExtra;

  // Mostrar/ocultar alerta
  const alertPago = document.getElementById("alert-pago");
  if (alertPago) alertPago.classList.toggle("d-none", ok);

  return ok;
}

  function validarEnvio() {
  const envioSel = document.querySelector('input[name="shipping"]:checked');
  const alertEnvio = document.getElementById("alert-envio");

  const ok = !!envioSel;

  if (alertEnvio) alertEnvio.classList.toggle("d-none", ok);

  return ok;
}

  /* ---------- Botón Finalizar compra: conexión segura y fallback ---------- */
 function handleFinalizarCompra() {
  const stored = JSON.parse(localStorage.getItem("cart")) || [];

  //  SI EL CARRITO ESTÁ VACÍO, NO HAY COMPRA
  if (stored.length === 0) {
    if (window.Swal && typeof Swal.fire === 'function') {
      Swal.fire({
        icon: 'warning',
        title: 'Carrito vacío',
        text: 'Agregá productos antes de finalizar la compra.'
      });
    } else {
      alert('El carrito está vacío. Agregá productos antes de comprar.');
    }
    return;
  }

  // VALIDACIONES NORMALES
  const okDir = validarDireccion();
  const okPago = validarPago();
  const okEnvio = validarEnvio();

  if (!okDir || !okPago || !okEnvio) {
    const title = "Faltan datos";
    const text = "Por favor completa dirección y/o forma de pago antes de finalizar.";
    if (window.Swal && typeof Swal.fire === 'function') {
      Swal.fire({ icon: 'error', title, text });
    } else {
      alert(`${title}\n\n${text}`);
    }
    return;
  }

  // ÉXITO
  if (window.Swal && typeof Swal.fire === 'function') {
    Swal.fire({
      icon: 'success',
      title: 'Compra realizada',
      text: 'Tu pedido ha sido procesado.'
    });
  } else {
    alert('Compra realizada con éxito. Gracias.');
  }

  // limpiar carrito
  localStorage.removeItem('cart');
  renderCartItems([]);
  actualizarTotalesFinales();
}

  // conectar el botón de confirmar (buscar por varios posibles ids para compatibilidad)
  function attachConfirmButton() {
    const btn = document.getElementById("btn-confirmar") || document.getElementById("finalizarCompra") || document.getElementById("confirmar");
    if (!btn) {
      console.warn("No se encontró el botón Finalizar compra (ids probados: btn-confirmar, finalizarCompra, confirmar).");
      return;
    }
    btn.addEventListener("click", handleFinalizarCompra);
  }

  attachConfirmButton();

  /* ---------- Debug: log inicial ---------- */
  console.log("cart.js cargado — productos:", storedCart.length);

 // --- Mostrar/ocultar campos segun forma de pago ---
const tarjetaRadio = document.getElementById("pago-tarjeta");
const transfRadio = document.getElementById("pago-transferencia");

const tarjetaFields = document.getElementById("tarjeta-fields");
const transfFields = document.getElementById("transferencia-fields");

function togglePaymentFields() {
  if (tarjetaRadio?.checked) {
    tarjetaFields.classList.remove("d-none");
    transfFields.classList.add("d-none");
  } else if (transfRadio?.checked) {
    tarjetaFields.classList.add("d-none");
    transfFields.classList.remove("d-none");
  } else {
    tarjetaFields.classList.add("d-none");
    transfFields.classList.add("d-none");
  }
}

if (tarjetaRadio) tarjetaRadio.addEventListener("change", togglePaymentFields);
if (transfRadio) transfRadio.addEventListener("change", togglePaymentFields);
 
});
