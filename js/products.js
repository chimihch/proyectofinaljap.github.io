let catId = localStorage.getItem("catID");
fetchProductsByCategory(catId);

function fetchProductsByCategory(catId) {
  const url = `https://japceibal.github.io/emercado-api/cats_products/${catId}.json`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      showCategoryName(data.catName);
      showProducts(data.products);
    })
    .catch(error => console.error("Error al cargar los productos:", error));
}

document.addEventListener("DOMContentLoaded", () => {
  fetchProductsByCategory(catId);
});

function showCategoryName(catName) {
  const categoryTitle = document.getElementById("category-title");
  categoryTitle.innerHTML = `Productos de la categoría: ${catName}`;
}

function showProducts(products) {

  const container = document.getElementById("products-container");
  container.innerHTML = "";

  products.forEach(product => {
    container.innerHTML += `
      <div class="col-md-4">
        <div class="card" data-id="${product.id}">
          <img src="${product.image}" class="card-img-top" alt="${product.name}">
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">${product.description}</p>
          </div>
          <div class="card-footer">
            <span class="cost">USD ${product.cost}</span>
            <small class="text-muted">${product.soldCount} vendidos</small>
          </div>
        </div>
      </div>
    `;
  });
document.querySelectorAll(".ver-producto").forEach(card => {
    card.addEventListener("click", () => {
      const productId = card.getAttribute("data-id"); // obtenemos el id desde el data-id de la card
      console.log("Producto clickeado:", productId); // debug
      localStorage.setItem("selectedProductId", productId);
      window.location = "product-info.html";
    });
  });
}

if (!localStorage.getItem('sesionIniciada')) {
        alert("Por favor, inicia sesión.");
         window.location.href = "login.html";
    }
