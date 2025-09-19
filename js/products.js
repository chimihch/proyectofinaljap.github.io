let catId = localStorage.getItem("catID");
let allProducts = []; 
let filteredProducts = []; 

fetchProductsByCategory(catId);

function fetchProductsByCategory(catId) {
  const url = `https://japceibal.github.io/emercado-api/cats_products/${catId}.json`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      showCategoryName(data.catName);
      allProducts = data.products;
      filteredProducts = [...allProducts];
      showProducts(filteredProducts);
    })
    .catch(error => console.error("Error al cargar los productos:", error));
}

document.addEventListener("DOMContentLoaded", () => {
  fetchProductsByCategory(catId);

  // Eventos de filtro y orden
  document.getElementById("filterBtn").addEventListener("click", applyFilters);
  document.getElementById("clearFilterBtn").addEventListener("click", clearFilters);
  document.getElementById("sort").addEventListener("change", applyFilters);
});

function showCategoryName(catName) {
  const categoryTitle = document.getElementById("category-title");
  categoryTitle.innerHTML = `Productos de la categoría: ${catName}`;
}

function showProducts(products) {
  const container = document.getElementById("products-container");
  container.innerHTML = "";

  if (products.length === 0) {
    container.innerHTML = `<p class="text-muted">No hay productos que coincidan con el filtro.</p>`;
    return;
  }

  products.forEach(product => {
    container.innerHTML += `
      <div class="col-md-4">
        <div class="card h-100 shadow-sm ver-producto" data-id="${product.id}">
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

  document.querySelectorAll(".ver-producto").forEach(card => {
    card.addEventListener("click", () => {
      const productId = card.getAttribute("data-id");
      localStorage.setItem("selectedProductId", productId);
      window.location = "product-info.html";
    });
  });
}


// Filtro + Ordenamiento


function applyFilters() {
  let min = parseInt(document.getElementById("minPrice").value) || 0;
  let max = parseInt(document.getElementById("maxPrice").value) || Infinity;
  let sortValue = document.getElementById("sort").value;

  filteredProducts = allProducts.filter(p => p.cost >= min && p.cost <= max);

  if (sortValue === "price-asc") {
    filteredProducts.sort((a, b) => a.cost - b.cost);
  } else if (sortValue === "price-desc") {
    filteredProducts.sort((a, b) => b.cost - a.cost);
  } else if (sortValue === "relevance-desc") {
    filteredProducts.sort((a, b) => b.soldCount - a.soldCount);
  }

  showProducts(filteredProducts);
}

function clearFilters() {
  document.getElementById("minPrice").value = "";
  document.getElementById("maxPrice").value = "";
  document.getElementById("sort").value = "price-asc";
  filteredProducts = [...allProducts];
  showProducts(filteredProducts);
}
