document.addEventListener("DOMContentLoaded", () => {
  const productId = localStorage.getItem("selectedProductId");

  if (!productId) {
    document.getElementById("product-info").innerHTML = `
      <p class="text-danger">No se encontró ningún producto seleccionado.</p>
    `;
    return;
  }

  const url = `https://japceibal.github.io/emercado-api/products/${productId}.json`;

  fetch(url)
    .then(response => response.json())
    .then(product => {
      showProductInfo(product);
    })
    .catch(error => {
      console.error("Error al cargar el producto:", error);
    });
});

function showProductInfo(product) {
  const container = document.getElementById("product-info");

  container.innerHTML = `
    <div class="card shadow-lg border-0">
      <div class="row g-0">
        
        <!-- Carrusel de imágenes -->
        <div class="col-md-6">
          <div id="productImagesCarousel" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner rounded-start">
              ${product.images.map((imgUrl, index) => `
                <div class="carousel-item ${index === 0 ? "active" : ""}">
                  <img src="${imgUrl}" class="d-block w-100 rounded-start" alt="Imagen de ${product.name}">
                </div>
              `).join('')}
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#productImagesCarousel" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#productImagesCarousel" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>

          <!-- Miniaturas -->
          <div class="d-flex justify-content-center gap-2 p-2">
            ${product.images.map((imgUrl, index) => `
              <img src="${imgUrl}" class="img-thumbnail" style="width: 55px; cursor: pointer;" 
                   data-bs-target="#productImagesCarousel" data-bs-slide-to="${index}" alt="Miniatura de ${product.name}">
            `).join('')}
          </div>
        </div>

        <!-- Info del producto -->
        <div class="col-md-6 d-flex flex-column p-4">
          <h3 class="fw-bold mb-3">${product.name}</h3>
          <p><strong>Descripción:</strong> ${product.description}</p>
          <p><strong>Categoría:</strong> <span class="badge bg-primary">${product.category}</span></p>
          <p><strong>Vendidos:</strong> ${product.soldCount}</p>
          <p class="fs-4 fw-bold" style="color:#ff6600;">USD ${product.cost}</p>

          <div class="mt-auto">
            <button class="btn w-100" style="background-color: #ff6600;">
              🛒 Agregar al carrito
            </button>
          </div>
        </div>

      </div>
    </div>
  `;

  // Miniaturas controlando el carrusel
  const thumbnails = container.querySelectorAll('.img-thumbnail');
  thumbnails.forEach((thumb, i) => {
    thumb.addEventListener('click', () => {
      const carousel = new bootstrap.Carousel(document.getElementById('productImagesCarousel'));
      carousel.to(i);
    });
  });
}

if (!localStorage.getItem('sesionIniciada')) {
        alert("Por favor, inicia sesión.");
         window.location.href = "login.html";
    }
