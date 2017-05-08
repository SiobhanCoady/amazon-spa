const DOMAIN = 'http://localhost:3000';
const API_TOKEN = 'g-gmOCz6T-UxPr-PsHUG6PYVO5dXLhl7bzzrYSPjQk4';

function getProducts() {
  return fetch(`${DOMAIN}/api/v1/products?api_token=${API_TOKEN}`)
    .then(function(res) { return res.json() })
}

function getProduct(id) {
  return fetch(`${DOMAIN}/api/v1/products/${id}?api_token=${API_TOKEN}`)
    .then(function(res) { return res.json() })
}

function renderProducts(products) {
  return products.map(function(product) {
    return `
      <div class="product-summary">
        <a
          data-id=${product.id}
          href
          class="product-link">
            ${product.title}
        </a>
      </div>
    `
  }).join('');
}

document.addEventListener('DOMContentLoaded', function() {
  const productsList = document.querySelector('#products-list');

  function loadProducts() {
    getProducts()
    .then(renderProducts)
    .then(function(html) { productsList.innerHTML = html })
  }

  loadProducts();

});
