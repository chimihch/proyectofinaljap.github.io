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
        <div class="card h-100 shadow-sm">
          <img src="${product.image}" class="card-img-top" alt="${product.name}">
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">${product.description}</p>
          </div>
          <div class="card-footer d-flex justify-content-between align-items-center">
            <span class="fw-bold text-primary">USD ${product.cost}</span>
            <small class="text-muted">${product.soldCount} vendidos</small>
          </div>
        </div>
      </div>
    `;
  });
}
