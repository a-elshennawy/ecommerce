// loader
$(document).ready(function () {
  $(".loader").fadeOut(1000);

  //   setting container
  const prductContainer = document.getElementById("productsContainer");
  prductContainer.innerHTML = "<p>Loading your product...</p>";

  //   setting current username
  let username = null;
  const loginData = JSON.parse(localStorage.getItem("login"));
  if (loginData && loginData.username) {
    username = loginData.username;
  }

  const storageKey = `detailed_product_${username}`;
  let productId = [];
  try {
    const storedProductId = localStorage.getItem(storageKey);

    if (storedProductId) {
      productId = JSON.parse(storedProductId);
    }
  } catch (error) {
    prductContainer.innerHTML = "<h1>Error retrieving your product data.</h1>";
    console.error(
      `product details error: Error parsing product data for key ${storageKey}:`,
      error
    );
    return;
  }

  const productDisplay = async () => {
    try {
      const response = await fetch(
        `https://dummyjson.com/products/${productId}`
      );

      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status} for product ID ${productId}`
        );
      }

      const product = await response.json();
      let htmlContent = "";
      if (product) {
        htmlContent = `
            <div class="prodDetails row col-12">
                        <div class="img col-4">
                            <img src="${product.thumbnail}" alt="${
          product.title
        }" loading="lazy">
                        </div>
                        <div class="details row col-8">
                            <h2 class="title col-12">${product.title} <br>$ ${
          product.price
        }</h2>
                            <h4 class="brand col-12">" ${product.brand} "</h4>
                            <p class="description col-12">${
                              product.description
                            }</p>
                            <p class="col-12">${product.shippingInformation}</p>
                            <p class="col-12">${product.returnPolicy} with ${
          product.warrantyInformation
        }</p>                         
                            <p class="col-12">dimensions : ${
                              product.dimensions.height
                            } x ${product.dimensions.width}</p>
                            <p class="col-6">${product.availabilityStatus} : ${
          product.stock
        }</p>
        <div class="btnDiv col-6">
        <button class="addBtn" onclick="addToCart(${product.id})">
        add to cart
        </button>
        </div>
                         </div>
            </div>
            <div class="reviewsConatiner row col-10">
            <h3 class="reviewHeader">
            customers reviews
            </h3>
            <ul class="reviews col-12">
            ${
              product.reviews &&
              Array.isArray(product.reviews) &&
              product.reviews.length > 0
                ? product.reviews
                    .map(
                      (review) => `
                <li class="reviewItem">
                                    <strong>${review.reviewerName}</strong> gave it : <strong>${review.rating}/5</strong><br>
                                    "${review.comment}"
                                </li>
                                <hr>
                `
                    )
                    .join("")
                : "<p>no reviews available</p>"
            }
            </ul>
            </div>
            `;
      } else {
        htmlContent =
          "<h1>Could not load product details.</h1><p>Please try again.</p>";
      }
      prductContainer.innerHTML = htmlContent;
    } catch (error) {
      prductContainer.innerHTML =
        "<h1>Error loading product details.</h1><p>Please try again later.</p>";
    }
  };
  productDisplay();
});

// add to cart
function addToCart(productId) {
  // Retrieve the username of the logged-in user from localStorage
  const loginData = JSON.parse(localStorage.getItem("login"));
  if (!loginData || !loginData.username) {
    console.error("User not logged in or username not found.");
    return;
  }
  const username = loginData.username;
  const storageKey = `ordered_products_${username}`;

  // Get existing ordered products from localStorage (if any)
  let orderedProducts = localStorage.getItem(storageKey);
  orderedProducts = orderedProducts ? JSON.parse(orderedProducts) : [];

  // Add the current product ID to the array
  orderedProducts.push(productId);

  // Save the updated array back to localStorage
  localStorage.setItem(storageKey, JSON.stringify(orderedProducts));

  console.log(`Product ID ${productId} added to cart for user ${username}.`);
  // You might want to add some user feedback here, like updating a cart counter
}
