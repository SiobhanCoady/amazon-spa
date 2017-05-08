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

function postReview(id, reviewParams) {
  return fetch(
    `${DOMAIN}/api/v1/products/${id}/reviews?api_token=${API_TOKEN}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({review: reviewParams})
    }
  )
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
    return `<li class="review">${review.body}, ${review.rating} stars</li>`;
  }).join('');
}

document.addEventListener('DOMContentLoaded', function() {
  const productsList = document.querySelector('#products-list');
  const productDetails = document.querySelector('#product-details');
  const reviewForm = document.querySelector('#review-form');

  function loadProducts() {
    getProducts()
      .then(renderProducts)
      .then(function(html) { productsList.innerHTML = html })
  }

  function loadProduct(id) {
    getProduct(id)
      .then(function(product) { return renderProduct(product) })
      .then(function(html) { productDetails.innerHTML = html })
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
          reviewForm.classList.remove('hidden');
          reviewForm.setAttribute('data-id', productId);
          productsList.classList.add('hidden');
        });
    }
  });

  productDetails.addEventListener('click', function(event) {
    const { target } = event;

    if (target.matches('button.back')) {
      productDetails.classList.add('hidden');
      reviewForm.classList.add('hidden');
      productsList.classList.remove('hidden');
    }
  });

  reviewForm.addEventListener('submit', function(event) {
    const { target } = event;
    event.preventDefault();

    const body = event.currentTarget.querySelector('#body');
    const rating = event.currentTarget.querySelector('#rating');
    const productId = target.getAttribute('data-id');
    console.log(productId);

    const fData = new FormData(event.currentTarget);

    postReview(productId, {body: fData.get('body'), rating: fData.get('rating')})
      .then(function() {
        loadProduct(productId);
        body.value = '';
        rating.value = '';
      })
  });

});
