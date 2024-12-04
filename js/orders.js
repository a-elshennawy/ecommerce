//the loader
$(document).ready(function () {
    $(".loader").fadeOut(1000);
});

// Username check
const username = JSON.parse(localStorage.getItem("login")).username;

// Greeting user in navbar
document.querySelectorAll("#userGreetings").forEach(span => {
    span.innerHTML = username;
});

// Getting the orders list from the local storage
let ordersContainer = '';
let orders = JSON.parse(localStorage.getItem(`orders_${username}`));


// Fetch product data 
fetch("../API/products.json")
    .then(response => response.json())
    .then(products => {
        window.products = products;
        let ordersContainer = ''; 

        // Loop through orders and build the container
        for (let i = 0; i < orders.length; i++) {
            const currentOrder = orders[i];
            const randomOrderId = Math.floor(Math.random() * 1000000); 

            ordersContainer += `
                <div class="order row col-10 col-md-6 col-sm-10">
                    <div class="totPrice col-10" id="totPrice">
                        <h4>
                            Order ID: ${randomOrderId}
                        </h4>
                        <h4>
                            Total price: ${currentOrder.totalPrice} EGP
                        </h4>
                    </div>
            `;

            // Loop through the cart to repeat the ordered item part for each product in the cart
            currentOrder.cart.forEach(productId => {
                const foundProduct = products.find(product => product.id === productId);

                if (foundProduct) {
                    ordersContainer += `
                        <div class="orderedItem row col-10">
                            <div class="img col-3">
                                <img src="${foundProduct.img}" alt="${foundProduct.name}">
                            </div>
                            <div class="name col-5">
                                <h4>${foundProduct.name}</h4>
                            </div>
                            <div class="col-4 det">
                                <button onclick="productDetails(${foundProduct.id})">
                                    <h4>Details</h4>
                                    <i class="fa-sharp fa-solid fa-circle-info"></i>
                                </button>
                            </div>
                        </div>
                    `;
                } else {
                    console.warn(`Product with ID ${productId} not found in product data`);
                }
            });

            ordersContainer += `</div>`; 
        }

        // Render all the order items
        document.getElementById('orders').innerHTML = ordersContainer;
    });



// add to wishlist
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