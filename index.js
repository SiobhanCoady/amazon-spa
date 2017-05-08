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

function renderProduct(product) {
  console.log(product);
  return `
    <button class="back">Back</button>
    <h1>${product.title} - $${product.price.toFixed(2)}</h1>
    <p>${product.description}</p>
    <p>Tags: ${renderTags(product.tags)}</p>
    <h4>Reviews</h4>
    <ul class="reviews-list">
      ${ renderReviews(product.reviews) }
    </ul>
  `
}

function renderTags(tags) {
  return tags.map(function(tag) {
    return `${tag.name} `;
  }).join('');
}

function renderReviews(reviews) {
  return reviews.map(function(review) {
    return `<li class="review">${review.body}</li>`;
  }).join('');
}

document.addEventListener('DOMContentLoaded', function() {
  const productsList = document.querySelector('#products-list');
  const productDetails = document.querySelector('#product-details');

  function loadProducts() {
    getProducts()
    .then(renderProducts)
    .then(function(html) { productsList.innerHTML = html })
  }

  loadProducts();

  productsList.addEventListener('click', function(event) {
    const { target } = event;

    if (target.matches('.product-link')) {
      event.preventDefault();
      const productId = target.getAttribute('data-id');

      getProduct(productId)
        .then(function(product) {
          productDetails.innerHTML = renderProduct(product);
          productDetails.classList.remove('hidden');
          productsList.classList.add('hidden');
        });
    }
  });

  productDetails.addEventListener('click', function(event) {
    const { target } = event;

    if (target.matches('button.back')) {
      productDetails.classList.add('hidden');
      productsList.classList.remove('hidden');
    }
  });

});
