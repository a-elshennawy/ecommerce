// loader
$(document).ready(function () {
  $(".loader").fadeOut(1000);

  const productsContainer = document.getElementById("productsContainer");
  const chekoutBtn = document.getElementById("CheckoutBtn");

  productsContainer.innerHTML = "<p>Loading your cart...</p>";

  let username = null;

  const loginData = JSON.parse(localStorage.getItem("login"));

  if (loginData && loginData.username) {
    username = loginData.username;
  }

  const storageKey = `ordered_products_${username}`;

  let productIds = [];
  try {
    const storedProductIds = localStorage.getItem(storageKey);

    if (storedProductIds) {
      productIds = JSON.parse(storedProductIds);
      if (!Array.isArray(productIds)) {
        console.warn(
          `Cart data for key ${storageKey} was not an array. Resetting cart.`
        );
        productIds = [];
      }
    }
  } catch (error) {
    productsContainer.innerHTML = "<h1>Error retrieving your cart data.</h1>";
    console.error(
      `Cart page error: Error parsing cart data for key ${storageKey}:`,
      error
    );
    return;
  }

  if (productIds.length === 0) {
    productsContainer.innerHTML = "<h1>Your cart is empty.</h1>";
    chekoutBtn.classList.add("d-none");
    return;
  }

  const removeProductFromCart = (productIdToRemove) => {
    const storedProductIds = localStorage.getItem(storageKey);
    if (storedProductIds) {
      let currentProductIds = JSON.parse(storedProductIds);
      currentProductIds = currentProductIds.filter(
        (id) => id !== productIdToRemove
      );
      localStorage.setItem(storageKey, JSON.stringify(currentProductIds));

      window.location.reload();
    }
  };

  const displayCartItems = async () => {
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
                      <div class="prodCard row col-10 col-lg-3">
                          <div class="img col-12">
                              <img src="${product.thumbnail}" alt="${product.title}" loading="lazy">
                          </div>
                          <div class="details row col-12">
                              <h5 class="title col-9">${product.title}</h5>
                              <h5 class="price col-3">$${product.price}</h5>                             
                          </div>
                          <div class="btnDiv col-5">
                              <button class="removeBtn" data-product-id="${product.id}">Remove</button>
                          </div>
                      </div>
                  `;
        });
      }

      if (validProducts.length === 0 && productIds.length > 0) {
        htmlContent =
          "<h1>Could not load details for items in your cart.</h1><p>Please try refreshing the page.</p>";
        chekoutBtn.classList.add("d-none");
      } else if (validProducts.length < productIds.length) {
        htmlContent +=
          '<p style="color:red;">Note: Some items could not be loaded.</p>';
        chekoutBtn.classList.add("d-none");
      }

      productsContainer.innerHTML = htmlContent;

      const removeButtons = document.querySelectorAll(".removeBtn");
      removeButtons.forEach((button) => {
        button.addEventListener("click", function () {
          const productIdToRemove = parseInt(this.dataset.productId);
          removeProductFromCart(productIdToRemove);
        });
      });
    } catch (error) {
      console.error("Cart page error: Error processing cart products:", error);
      productsContainer.innerHTML =
        "<h1>Error displaying cart items. Please try again.</h1>";
      chekoutBtn.classList.add("d-none");
    }
  };

  displayCartItems();
});
