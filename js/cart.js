// loader
$(document).ready(function () {
    $(".loader").fadeOut(1000);
});

// Retrieve username from localStorage
const username = JSON.parse(localStorage.getItem("login")).username;

// greeting user
document.querySelectorAll("#userGreetings").forEach(span => {
    span.innerHTML = username;
});
document.querySelector("#usernameInput").value = username;

// getting added products
(async () => {
    try {
        let cart = JSON.parse(localStorage.getItem(`cart_${username}`)) || [];

        // If cart is empty, show a message
        if (cart.length === 0) {
            document.getElementById('selected').innerHTML = '<p>Your cart is empty.</p>';
            document.getElementById('finilize').classList.add('d-none');
            return;
        }

        // Fetch the products data
        let products = await fetch("../API/products.json");
        products = await products.json();

        window.products = products;

        // Initialize totalPrice variable
        let totalPrice = 0;

        // rendring the cart only
        let selectedProducts = cart.map(itemId => {
            const product = products.find(p => p.id === itemId);
            if (!product) return '';

            // total price
            let priceToAdd = product.sale ? product.discounted_price : product.price;
            totalPrice += priceToAdd;

            return `
                <div class="col-5 col-md-4 col-lg-3 row item">
                    ${product.sale ?
                    `<div class="discount">
                            <h4>${product.discount}%</h4>
                        </div>` : ''}
                    <div class="img">
                        <img src="${product.img}" />
                    </div>
                    <div class="row text">
                        <div class="row col-12 head">
                            <div class="col-8 name">
                                <h3>${product.name}</h3>
                            </div>
                            <div class="col-4 price">
                                ${product.sale ?
                    `<del>
                                        <h4>${product.price} EGP</h4>
                                    </del>
                                    <h4>${product.discounted_price} EGP</h4>`
                    :
                    `<h4>${product.price} EGP</h4>`
                }
                            </div>
                        </div>
                        <div class="actions row">
                            <button class="remove col-6" onclick="removeFromCart(${product.id})">
                                <h4>remove</h4>
                                <i class="fa-solid fa-trash"></i>
                            </button>
                            <button class="info col-6" onclick="productDetails(${product.id})">
                                <h4>details</h4>
                                <i class="fa-solid fa-circle-info"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Inject the selected products into the cart container
        document.getElementById('selected').innerHTML = selectedProducts;

        document.getElementById('totalPrrice').innerHTML = `Total price: ${totalPrice} EGP`;

    } catch (error) {
        console.error("Error fetching products for cart:", error);
    }
})();

// Function to remove an item from the cart
function removeFromCart(productId) {
    // Retrieve the current username from localStorage
    const username = JSON.parse(localStorage.getItem("login")).username;

    // Get the cart for the current user, or initialize as an empty array if not found
    let cart = JSON.parse(localStorage.getItem(`cart_${username}`)) || [];

    // Remove the item from the cart array
    cart = cart.filter(item => item !== productId);

    // Save the updated cart back to localStorage for the current user
    localStorage.setItem(`cart_${username}`, JSON.stringify(cart));

    // Refresh the cart page
    location.reload();
}

// Product details
function productDetails(id) {
    // Find the product by ID
    const item = window.products.find(product => product.id === id);

    if (!item) {
        console.error(`Product with ID ${id} not found`);
        return;
    }

    const productDetails = `
        <div class="row product-details">
            <button class="closebtn" id="closeBtn">
                <i class="fa-solid fa-x"></i>
            </button>
            <div class="col-4 img">
                <img src="${item.img}" alt="">
            </div>
            <div class="row col-8 details">
                <div class="col-10 product-info">
                    <h4>${item.name}</h4>
                    ${item.sale
            ? `<h4>${item.discounted_price} EGP</h4>
                           <h4><del>${item.price} EGP</del></h4>`
            : `<h4>${item.price} EGP</h4>`}
                </div>
                <div class="col-10 description">
                    <p>${item.description}</p>
                </div>
                <div class="col-10 btns">
                    <button class="col-5 add-wish-list" onclick="addToWishlist(${item.id})">
                        <h6>Add to Wishlist</h6>
                        <i class="fa-solid fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('prodDetails').innerHTML = productDetails;
    document.getElementById('prodDetails').style.display = 'flex';
    setTimeout(() => {
        document.getElementById('prodDetails').style.opacity = '1';
    }, 500);

    document.getElementById('closeBtn').addEventListener('click', () => {
        document.getElementById('prodDetails').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('prodDetails').style.display = 'none';
        }, 500);
    });
}

// Add to wishlist
function addToWishlist(productId) {
    // Get the current username (since this function is in home.js, user is already logged in)
    const username = JSON.parse(localStorage.getItem("login")).username;

    // Get current wishlist from localStorage or initialize as an empty array
    let wishlist = JSON.parse(localStorage.getItem(`wishlist_${username}`)) || [];

    // Add the product to the wishlist
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        // Save the updated wishlist for the current user
        localStorage.setItem(`wishlist_${username}`, JSON.stringify(wishlist));
    } else {
        alert("Item is already in the wishlist");
    }
}

// Popup payment
let checkoutFormBtn = document.getElementById('popuptheForm');
checkoutFormBtn.addEventListener("click", () => {
    document.getElementById('checkoutForm').style.display = 'flex';
    setTimeout(() => {
        document.getElementById('checkoutForm').style.opacity = '1';
    }, 500);
});

// Cancel payment
let cancelBtn = document.getElementById('cancelPayment');
cancelBtn.addEventListener("click", () => {
    document.getElementById('checkoutForm').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('checkoutForm').style.display = 'none';
    }, 500);
});

// Checkout done
document.addEventListener('DOMContentLoaded', () => {
    let pay = document.getElementById('finalPay');

    if (pay) {
        pay.addEventListener('click', () => {
            // get username from localStorage
            const username = JSON.parse(localStorage.getItem("login"))?.username;

            // Get all input values (case sensitive)
            let address = document.getElementById('address')?.value?.trim();
            let cardHolder = document.getElementById('cardHolder')?.value?.trim();
            let cardNumber = document.getElementById('cardNumber')?.value?.trim();
            let cvv = document.getElementById('cvv')?.value?.trim();
            let ExpDate = document.getElementById('expDate')?.value?.trim();

            let cart = JSON.parse(localStorage.getItem(`cart_${username}`)) || [];

            // Fetch the products data
            let products = window.products;

            // total price
            let totalPrice = 0;
            cart.forEach(itemId => {
                const product = products.find(p => p.id === itemId);
                if (product) {
                    let priceToAdd = product.sale ? product.discounted_price : product.price;
                    totalPrice += priceToAdd;
                }
            });

            // Ensure all elements exist and values are filled
            if (!address || !cardHolder || !cardNumber || !cvv || !ExpDate) {
                alert("Please fill all fields!");
                return;
            }

            // Set order data to localStorage
            const orderData = {
                cart,
                totalPrice,
            };

            // Retrieve and update the orders array for the current user
            let userOrders = JSON.parse(localStorage.getItem(`orders_${username}`)) || [];
            userOrders.push(orderData);
            localStorage.setItem(`orders_${username}`, JSON.stringify(userOrders));

            // Clear the cart after successful checkout
            localStorage.setItem(`cart_${username}`, JSON.stringify([]));

            // Show the payment success alert
            alert("Payment successful! Your order has been placed.");

            // redirect to the orders page
            window.location.href = "orders.html";
        });
    }
});

