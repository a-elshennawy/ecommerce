// loader
$(document).ready(function () {
  $(".loader").fadeOut(1000);

  let totalAmount = document.getElementById("totalAmount");
  let SubmitBtn = document.getElementById("SubmitBtn");

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
        console.warn(`Cart data for key ${storageKey} was not an array.`);
        productIds = [];
      }
    }
  } catch (error) {
    console.error("Error retrieving cart data:", error);
    totalAmountElement.text("Error loading total");
    return;
  }

  const calculateTotal = async () => {
    let total = 0;
    if (productIds && productIds.length > 0) {
      const fetchPromises = productIds.map((id) =>
        fetch(`https://dummyjson.com/products/${id}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error(
                `HTTP error! status: ${response.status} for product ID ${id}`
              );
            }
            return response.json();
          })
          .catch((error) => {
            console.error(
              `Failed to fetch details for product ID ${id}:`,
              error
            );
            return null;
          })
      );

      const products = await Promise.all(fetchPromises);
      const validProducts = products.filter((product) => product !== null);

      validProducts.forEach((product) => {
        total += product.price;
      });
    }

    totalAmount.innerHTML = `Total: $ ${total}`;
  };

  calculateTotal();

  SubmitBtn.addEventListener("click", (event) => {
    event.preventDefault();
    alert("your oders is being processed, click ok to continue");
    window.location.href = "orders.html";
  });
});
