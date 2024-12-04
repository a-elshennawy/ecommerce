// loader
$(document).ready(function () {
    $(".loader").fadeOut(1000);
});
// Retrieve username from localStorage
const username = JSON.parse(localStorage.getItem("login")).username;
// userGreetings
document.querySelectorAll("#userGreetings").forEach(span => {
    span.innerHTML = username;
});
// getting added products from local storage
(async () => {
    try {
        // Get the wishlist items from localStorage
        const username = JSON.parse(localStorage.getItem("login")).username;
        let wishlist = JSON.parse(localStorage.getItem(`wishlist_${username}`)) || [];


        // If wishlist is empty, show a message
        if (wishlist.length === 0) {
            document.getElementById('wishlist').innerHTML = '<p>Your wishlist is empty.</p>';
            return;
        }

        // Fetch the products data
        let products = await fetch("../API/products.json");
        products = await products.json();

        window.products = products;

        // Find the products in the wishlist and render them
        let wishedProducts = wishlist.map(itemId => {
            const product = products.find(p => p.id === itemId);
            if (!product) return ''; 

            return `
                <div class="wishedItem row col-12 col-md-10 col-lg-6">
                    <div class="img col-2">
                        <img src="${product.img}" alt="${product.name}">
                    </div>
                    <div class="info col-6">
                        <h4>${product.name}</h4>
                        <h4>${product.price} EGP</h4>
                    </div>
                    <div class="actions row col-4">
                        <button class="addTocart col-10" onclick="addToCart(${product.id})">
                            add to cart
                            <i class="fa-solid fa-cart-plus"></i>
                        </button>
                        <button class="details col-10" onclick="productDetails(${product.id})">
                            details
                            <i class="fa-solid fa-circle-info"></i>
                        </button>
                        <button class="remove col-10" onclick="removeFromWishlist(${product.id})">
                            remove
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // Inject the wished products into the wishlist container
        document.getElementById('wishlist').innerHTML = wishedProducts;

    } catch (error) {
        console.error("Error fetching products for wishlist:", error);
    }
})();

// Function to add an item to the cart
function addTocart(productId) {
    // Get the current username 
    const username = JSON.parse(localStorage.getItem("login")).username;

    // Get current cart from localStorage or initialize as an empty array
    let cart = JSON.parse(localStorage.getItem(`cart_${username}`)) || [];

    // Add the product to the cart
    if (!cart.includes(productId)) {
        cart.push(productId);
        // Save the updated cart for the current user
        localStorage.setItem(`cart_${username}`, JSON.stringify(cart));
    } else {
        alert("Item is already in the cart");
    }
}

function productDetails(id) {
    // Find the product by ID
    const item = window.products.find(product => product.id === id);

    if (!item) {
        console.error(`Product with ID ${id} not found`);
        return;
    }

    const productDetails = `
        <div class="row product-details">
        <button class="closebtn" id="colseBtn">
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
                    <button class="col-5 add-to-cart"onclick="addToCart(${item.id})">
                        <h6>Add to Cart</h6>
                        <i class="fa-solid fa-cart-plus"></i>
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

    document.getElementById('colseBtn').addEventListener('click', () => {
        document.getElementById('prodDetails').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('prodDetails').style.display = 'none';
        }, 500);
    });
}

// Function to remove an item from the wishlist
function removeFromWishlist(productId) {
    // Retrieve the current username from localStorage
    const username = JSON.parse(localStorage.getItem("login")).username;

    // Get the wishlist for the current user, or initialize as an empty array if not found
    let wishlist = JSON.parse(localStorage.getItem(`wishlist_${username}`)) || [];

    // Remove the item from the wishlist array
    wishlist = wishlist.filter(item => item !== productId);

    // Save the updated wishlist back to localStorage for the current user
    localStorage.setItem(`wishlist_${username}`, JSON.stringify(wishlist));

    // Refresh the wishlist page
    location.reload();
}
