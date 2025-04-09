// loader
document.addEventListener("DOMContentLoaded", function () {
  const loader = document.querySelector(".loader");
  if (loader) {
    loader.style.display = "none";
    setTimeout(() => {
      if (loader) {
        loader.style.display = "none";
      }
    }, 1000);
  }
});

// search
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", function () {
  searchProductsFromApi(this.value);
});

// Retrieve username from localStorage
const username = JSON.parse(localStorage.getItem("login")).username;

// Function to search products fetched from the API
function searchProductsFromApi(term) {
  const productsContainer = document.getElementById("products");
  let html = "";

  if (term.trim() === "") {
    // search is empty
    (async () => {
      productsContainer.innerHTML =
        '<p class="loading">Loading products...</p>';
      try {
        const response = await fetch(
          "https://dummyjson.com/products?limit=200"
        );
        const data = await response.json();
        data.products.forEach((product) => {
          html += `
            <div class="prodCard row col-12 col-lg-3">
              <div class="img col-4 col-lg-12">
                <img src="${product.thumbnail}" alt="${
            product.title
          }" loading="lazy">
              </div>
              <div class="details row col-8 col-lg-12">
                <h5 class="title col-9">${product.title}</h5>
                <h5 class="price col-3">$${product.price}</h5>
                <h6 class="category col-4">${product.category}</h6>
                <h6 class="tags col-8">${
                  product.tags?.join(", ") || "No tags"
                }</h6>
                <h6 class="rating col-6">Rating: ${product.rating}/5</h6>
                <h6 class="stock col-6">${product.availabilityStatus} : ${
            product.stock
          } available</h6>
                <h6 class="shipping col-12">${product.shippingInformation}</h6>
              </div>
              <div class="btnDiv row col-12">
              <button class="addBtn col-5" onclick="addToCart(${product.id})">
              add to cart
              </button>
              <button class="detailsBtn col-5" onclick="moredetails(${
                product.id
              })>
              more details
              </button>
              </div>
            </div>
          `;
        });
        productsContainer.innerHTML = html;
      } catch (error) {
        console.error("Error:", error);
        productsContainer.innerHTML =
          '<p class="pageError">Error loading products</p>';
      }
    })();
    return;
  } else {
    (async () => {
      productsContainer.innerHTML =
        '<p class="searching">Searching products...</p>';
      try {
        const response = await fetch(
          "https://dummyjson.com/products?limit=200"
        );
        const data = await response.json();

        data.products.forEach((product) => {
          if (product.title.toLowerCase().includes(term.trim().toLowerCase())) {
            html += `
              <div class="prodCard row col-12 col-lg-3">
                <div class="img col-4 col-lg-12">
                  <img src="${product.thumbnail}" alt="${
              product.title
            }" loading="lazy">
                </div>
                <div class="details row col-8 col-lg-12">
                  <h5 class="title col-9">${product.title}</h5>
                  <h5 class="price col-3">$${product.price}</h5>
                  <h6 class="category col-4">${product.category}</h6>
                  <h6 class="tags col-8">${
                    product.tags?.join(", ") || "No tags"
                  }</h6>
                  <h6 class="rating col-6">Rating: ${product.rating}/5</h6>
                  <h6 class="stock col-6">${product.availabilityStatus} : ${
              product.stock
            } available</h6>
                  <h6 class="shipping col-12">${
                    product.shippingInformation
                  }</h6>
                </div>
                <div class="btnDiv row col-12">
                <button class="addBtn col-5" onclick="addToCart(${product.id})">
                add to cart
                </button>
                <button class="detailsBtn col-5" onclick="moredetails(${
                  product.id
                })>
                more details
                </button>
                </div>
              </div>
            `;
          }
        });

        if (html === "") {
          productsContainer.innerHTML =
            '<h1 class="noMatch">No products found matching your search.</h1>';
        } else {
          productsContainer.innerHTML = html;
        }
      } catch (error) {
        console.error("Error:", error);
        productsContainer.innerHTML =
          '<h1 class="searchError">Error searching products</h1>';
      }
    })();
  }
}

// fetching products (https://dummyjson.com/products)
(async () => {
  const productsContainer = document.getElementById("products");

  try {
    productsContainer.innerHTML =
      '<h1 class="searching">Searching products...</h1>';

    const response = await fetch("https://dummyjson.com/products?limit=200");
    const data = await response.json();
    console.log(data);

    // Build HTML for all products
    let html = "";
    data.products.forEach((product) => {
      html += `
        <div class="prodCard row col-12 col-lg-3">
          <div class="img col-4 col-lg-12">
            <img src="${product.thumbnail}" alt="${
        product.title
      }" loading="lazy">
          </div>
          <div class="details row col-8 col-lg-12">
            <h5 class="title col-9">${product.title}</h5>
            <h5 class="price col-3">$${product.price}</h5>
            <h6 class="category col-4">${product.category}</h6>
            <h6 class="tags col-8">${product.tags?.join(", ") || "No tags"}</h6>
            <h6 class="rating col-6">Rating: ${product.rating}/5</h6>
            <h6 class="stock col-6">${product.availabilityStatus} : ${
        product.stock
      } available</h6>
            <h6 class="shipping col-12">${product.shippingInformation}</h6>
          </div>
          <div class="btnDiv row col-12">
          <button class="addBtn col-2" onclick="addToCart(${product.id})">
          <i class="fa-solid fa-cart-plus"></i>
          </button>
          <button class="wishBtn col-2" onclick="wishItem(${product.id})">
          <i class="fa-solid fa-heart-circle-plus"></i>
          </button>
          <button class="detailsBtn col-2" onclick="moredetails(${product.id})">
          <i class="fa-solid fa-circle-info"></i>
          </button>
          </div>
        </div>
      `;
    });

    productsContainer.innerHTML = html;
  } catch (error) {
    console.error("Error:", error);
    productsContainer.innerHTML =
      '<h1 class="searchError">Error searching products</h1>';
  }
})();

// add to cart
function addToCart(productId) {
  // Retrieve the username of the logged-in user from localStorage
  const loginData = JSON.parse(localStorage.getItem("login"));

  const username = loginData.username;
  const storageKey = `ordered_products_${username}`;

  // Get existing ordered products from localStorage (if any)
  let orderedProducts = localStorage.getItem(storageKey);
  orderedProducts = orderedProducts ? JSON.parse(orderedProducts) : [];

  // Add the current product ID to the array
  orderedProducts.push(productId);

  // Save the updated array back to localStorage
  localStorage.setItem(storageKey, JSON.stringify(orderedProducts));

  console.log(`Product ID ${productId} is added to ${username} cart.`);
}

function moredetails(productId) {
  const loginData = JSON.parse(localStorage.getItem("login"));

  const username = loginData.username;
  const storageKey = `detailed_product_${username}`;

  let detailed_product = localStorage.getItem(storageKey);
  detailed_product = detailed_product ? JSON.parse(detailed_product) : [];

  localStorage.setItem(storageKey, JSON.stringify([productId]));
  console.log(
    `Product ID ${productId} will be shown in details right now ${username}.`
  );
  window.location.href = "productDetails.html";
}

function wishItem(productId) {
  const loginData = JSON.parse(localStorage.getItem("login"));

  const username = loginData.username;
  const storageKey = `wished_products_${username}`;

  let wishedProducts = localStorage.getItem(storageKey);
  wishedProducts = wishedProducts ? JSON.parse(wishedProducts) : [];

  wishedProducts.push(productId);

  localStorage.setItem(storageKey, JSON.stringify(wishedProducts));
  console.log(`product id ${productId} is added to ${username} wishlist.`);
}

// scroll top btn
let scrollToTopButton = document.getElementById("toTop");
window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    scrollToTopButton.style.opacity = "1";
  } else {
    scrollToTopButton.style.opacity = "0";
  }
});
scrollToTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
