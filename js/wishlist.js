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

  const productsContainer = document.getElementById("wishlist");

  let username = null;
  let loginData = JSON.parse(localStorage.getItem("login"));
  if (loginData && loginData.username) {
    username = loginData.username;
  }

  const storageKey = `wished_products_${username}`;

  let productIds = [];
  try {
    const wishedProductsIds = localStorage.getItem(storageKey);

    if (wishedProductsIds) {
      productIds = JSON.parse(wishedProductsIds);
      if (!Array.isArray(productIds)) {
        console.warn(
          `wishlist data for key ${storageKey} was not an array. Resetting wishlist.`
        );
        productIds = [];
      }
    }
  } catch (error) {
    productsContainer.innerHTML =
      '<h1 class="errorRetreving">Error retrieving your wishlist data.</h1>';
    console.error(
      `wishlist error: Error parsing cart data for key ${storageKey}:`,
      error
    );
    return;
  }
  if (productIds.length === 0) {
    productsContainer.innerHTML =
      '<h1 class="emptyContainer">Your wihslist is empty.</h1>';
    return;
  }

  const removeFromWishlist = (productIdToRemove) => {
    const wishedProductsIds = localStorage.getItem(storageKey);
    if (wishedProductsIds) {
      let currentProductIds = JSON.parse(wishedProductsIds);
      currentProductIds = currentProductIds.filter(
        (id) => id !== productIdToRemove
      );
      localStorage.setItem(storageKey, JSON.stringify(currentProductIds));
      window.location.reload();
    }
  };

  const displayWishlist = async () => {
    const fetchPromises = productIds.map((id) => {
      return fetch(`https://dummyjson.com/products/${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `HTTP error! status: ${response.status} for product ID ${id}`
            );
          }
          return response.json();
        })
        .catch((error) => {
          console.error(`Failed to fetch details for product ID ${id}:`, error);
          return null;
        });
    });

    try {
      const products = await Promise.all(fetchPromises);
      const validProducts = products.filter((product) => product !== null);

      let htmlContent = "";
      if (validProducts.length > 0) {
        validProducts.forEach((product) => {
          htmlContent += `
                            <div class="prodCard row col-12 col-lg-3">
                                <div class="img col-4 col-lg-12">
                                    <img src="${product.thumbnail}" alt="${product.title}" loading="lazy">
                                </div>
                                <div class="details row col-8 col-lg-12">
                                    <h5 class="title col-9">${product.title}</h5>
                                    <h5 class="price col-3">$${product.price}</h5>                             
                                </div>
                                <div class="btnDiv row col-12">
                                    <button class="addBtn col-5 " onclick="addToCart(${product.id})">add to cart</button>
                                    <button class="removeBtn col-5" data-product-id="${product.id}">Remove</button>
                                </div>
                            </div>
                        `;
        });
      }
      if (validProducts.length === 0 && productIds.length > 0) {
        htmlContent =
          '<h1 class="pageError">Could not load details for items in your cart.<br>Please try refreshing the page.</h1>';
      } else if (validProducts.length < productIds.length) {
        htmlContent +=
          '<h1 class="itemError">Note: Some items could not be loaded.</h1>';
      }

      productsContainer.innerHTML = htmlContent;
      const removeButtons = document.querySelectorAll(".removeBtn");
      removeButtons.forEach((button) => {
        button.addEventListener("click", function () {
          const productIdToRemove = parseInt(this.dataset.productId);
          removeFromWishlist(productIdToRemove);
        });
      });
    } catch (error) {
      console.error(
        "wishlist error: Error processing wishlist products:",
        error
      );
      productsContainer.innerHTML =
        '<h1 class="pageError">Error displaying wishlist items. Please try again.</h1>';
    }
  };

  displayWishlist();
});

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
