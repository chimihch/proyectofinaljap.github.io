
//  Verificar sesión
if (!localStorage.getItem('sesionIniciada')) {
  alert("Por favor, inicia sesión.");
  window.location.href = "login.html";
}

//  Cargar producto y comentarios al iniciar
document.addEventListener("DOMContentLoaded", () => {
  const productId = localStorage.getItem("selectedProductId");

  if (!productId) {
    document.getElementById("product-info").innerHTML = `
      <p class="text-danger">No se encontró ningún producto seleccionado.</p>`;
    return;
  }

  // Fetch del producto
  const token = localStorage.getItem("token");
  fetch(`http://localhost:3000/product_info/${productId}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("No autorizado o error en la API");
      }
      return response.json();
    })
    .then(product => {
      showProductInfo(product);
      showRelatedProducts(product.relatedProducts);
      fetchComments(productId);
    })
    .catch(error => console.error("Error al cargar el producto:", error));
});


//  Mostrar información del producto
function showProductInfo(product) {
  const container = document.getElementById("product-info");

  container.innerHTML = `
    <div class="card shadow border-0">
      <div class="row g-0">
        <!-- Carrusel -->
        <div class="col-md-6">
          <div id="productImagesCarousel" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner rounded-start">
              ${product.images.map((img, i) => `
                <div class="carousel-item ${i === 0 ? "active" : ""}">
                  <img src="${img}" class="d-block w-100 rounded-start" alt="${product.name}">
                </div>`).join("")}
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#productImagesCarousel" data-bs-slide="prev">
              <span class="carousel-control-prev-icon"></span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#productImagesCarousel" data-bs-slide="next">
              <span class="carousel-control-next-icon"></span>
            </button>
          </div>

          <!-- Miniaturas -->
          <div class="d-flex justify-content-center gap-2 p-2">
            ${product.images.map((img, i) => `
              <img src="${img}" class="img-thumbnail" style="width: 55px; cursor:pointer"
                data-bs-target="#productImagesCarousel" data-bs-slide-to="${i}">
            `).join("")}
          </div>
        </div>

        <!-- Info -->
        <div class="col-md-6 d-flex flex-column p-4">
          <h3 class="fw-bold mb-3">${product.name}</h3>
          <p><strong>Descripción:</strong> ${product.description}</p>
          <p><strong>Categoría:</strong> <span class="badge bg-primary">${product.category}</span></p>
          <p><strong>Vendidos:</strong> ${product.soldCount}</p>
          <p class="fs-4 fw-bold" style="color:#ff6600;">USD ${product.cost}</p>

          <div class="mt-auto d-flex justify-content-end gap-3">
            <button id="add-btn" class="btn w-40"> + 🛒</button>
            <button id="buy-btn" class="btn w-40">Comprar</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Miniaturas controlando el carrusel
  container.querySelectorAll('.img-thumbnail').forEach((thumb, i) => {
    thumb.addEventListener('click', () => {
      const carousel = new bootstrap.Carousel(document.getElementById('productImagesCarousel'));
      carousel.to(i);
    });
  });

    const addBtn = document.getElementById('add-btn');
    const buyBtn = document.getElementById('buy-btn');

const add2Cart = () => {
    const CART_KEY = 'cart';
    const stored = localStorage.getItem(CART_KEY);
    const cart = stored ? JSON.parse(stored) : [];

    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      existing.count = (existing.count || 1) + 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        cost: product.cost,
        currency: product.currency,
        image: product.images && product.images[0] ? product.images[0] : '',
        count: 1
      });
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  };

  //agregar al carrito
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      add2Cart();
      alert('Producto agregado al carrito');
    });
  }

  //comprar
  if (buyBtn) {
    buyBtn.addEventListener('click', () => {
      add2Cart();
      window.location.href = 'cart.html';
    });
  }
}

// Productos relacionados
function showRelatedProducts(relatedProducts) {
  const container = document.getElementById("relatedProducts");
  container.innerHTML = relatedProducts.map(related => `
    <div class="col">
      <div class="card h-100 bg-dark text-white related-product" style="cursor:pointer; width: 250px; height: 150px;" data-id="${related.id}">
        <img src="${related.image}" class="card-img-top" alt="${related.name}">
        <div class="card-body">
          <h5 class="card-title">${related.name}</h5>
        </div>
      </div>
    </div>
  `).join("");

  // Clic en producto relacionado → recargar página
  container.querySelectorAll(".related-product").forEach(card => {
    card.addEventListener("click", e => {
      localStorage.setItem("selectedProductId", e.currentTarget.dataset.id);
      location.reload();
    });
  });
}


// Comentarios
// 🔹 Cargar comentarios al inicio
document.addEventListener("DOMContentLoaded", () => {
  fetchCommentedProducts();
});

// 🔹 Función para obtener los comentarios
function fetchCommentedProducts() {
  const productId = localStorage.getItem("selectedProductId");
  const token = localStorage.getItem("token");

  fetch(`http://localhost:3000/products_comments/${productId}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("No autorizado al cargar comentarios");
      }
      return response.json();
    })
    .then(comments => {
      showCommentedProducts(comments);
    })
    .catch(error => {
      console.error("Error al cargar los comentarios:", error);
    });
}


// 🔹 Función para mostrar los comentarios
function showCommentedProducts(comments) {
  const container = document.getElementById("review-section");

  container.innerHTML = `
    <div class="card shadow border-0 p-4">
      <h4 class="mb-3">Reseñas</h4>
      ${comments.length === 0 ? '<p class="text-muted">No hay reseñas para este producto.</p>' : ''}
      <div class="list-group">
        ${comments.map(comment => `
          <div class="list-group-item">
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1">${comment.user}</h5>
              <small class="text-muted">${comment.dateTime}</small>
            </div>
            <p class="mb-1">${comment.description}</p>
            <div>${'⭐'.repeat(comment.score)}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Agregar nueva reseña (comentario)
document.addEventListener("DOMContentLoaded", () => {
  const commentBtn = document.querySelector(".rating-btn");
  const commentText = document.querySelector(".rating-comment");
  const ratingInputs = document.getElementsByName("rating");

  commentBtn.addEventListener("click", () => {
    const text = commentText.value.trim();
    const selectedRating = Array.from(ratingInputs).find(r => r.checked)?.value;

    if (!text || !selectedRating) {
      alert("Por favor, escribe un comentario y selecciona una calificación.");
      return;
    }

    const userName = localStorage.getItem("userName") || "Usuario Anónimo";
    const date = new Date().toLocaleString();

    const newCommentHTML = `
      <div class="list-group-item">
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">${userName}</h5>
          <small class="text-muted">${date}</small>
        </div>
        <p class="mb-1">${text}</p>
        <div>${'⭐'.repeat(selectedRating)}</div>
      </div>
    `;

    // Buscar el div de la lista dentro del contenedor de reseñas
    const listGroup = document.querySelector("#review-section .list-group");

    if (listGroup) {
      // Inserta dentro de la caja de reseñas (no afuera)
      listGroup.insertAdjacentHTML("beforeend", newCommentHTML);
    } else {
      // Si aún no hay reseñas, crea la estructura entera dentro del div
      const reviewSection = document.getElementById("review-section");
      reviewSection.innerHTML = `
        <div class="card shadow-lg border-0 p-4">
          <h4 class="mb-3">Reseñas</h4>
          <div class="list-group">
            ${newCommentHTML}
          </div>
        </div>
      `;
    }

    // Limpiar el formulario
    commentText.value = "";
    ratingInputs.forEach(r => (r.checked = false));

    alert("¡Tu reseña se agregó correctamente!");
  });
});

