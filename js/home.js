// loader
$(document).ready(function () {
    $(".loader").fadeOut(1000);
});
// Retrieve username from localStorage
const username = JSON.parse(localStorage.getItem("login")).username;
//userGreetings
document.querySelectorAll("#userGreetings").forEach(span => {
    span.innerHTML = username;
});
// handeling the API
(async () => {
    try {
        let products = await fetch("../API/products.json");
        products = await products.json();

        window.products = products;

        let productsContainer = products.map(item => `
            <div class="col-5 col-md-4 col-lg-3 row item">
                <div class="img">
                    <img src="${item.img}" />
                </div>
                <div class="row text">
                    <div class="row col-12 head">
                        <div class="col-8 name">
                            <h3>${item.name}</h3>
                        </div>
                        <div class="col-4 price">
                            ${item.sale ? `
                                <del>
                                    <h4>${item.price}EGP</h4>
                                </del>
                                <h4>${item.discounted_price}EGP</h4>
                            ` : `
                                <h4>${item.price}EGP</h4>
                            `}
                        </div>
                    </div>
                    ${item.sale ? `
                        <div class="discount">
                            <h4>${item.discount}%</h4>
                        </div>
                    ` : ''}
                    <div class="actions row">
                        <button class=" col-4" onclick="addTocart(${item.id})">
                            <h4>Add to Cart</h4>
                            <i class="fa-solid fa-cart-plus"></i>
                        </button>
                        <button class=" col-4" onclick="addTowishlist(${item.id})">
                            <h4>Add to wislist</h4>
                            <i class="fa-solid fa-heart"></i>
                        </button>
                        <button class=" col-4" onclick="productDetails(${item.id})">
                            <h4>More Details</h4>
                            <i class="fa-sharp fa-solid fa-circle-info"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        document.getElementById('products').innerHTML = productsContainer;
    } catch (error) {
        console.error("Error fetching products:", error);
    }
})();


// product details function
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
                    <button class="col-5 add-to-cart">
                        <h6>Add to Cart</h6>
                        <i class="fa-solid fa-cart-plus"></i>
                    </button>
                    <button class="col-5 add-wish-list">
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

    document.getElementById('colseBtn').addEventListener('click', () => {
        document.getElementById('prodDetails').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('prodDetails').style.display = 'none';
        }, 500);
    });
}
// add to cart
function addTocart(itemId) {
    // Get the current username 
    const username = JSON.parse(localStorage.getItem("login")).username;
    document.getElementById('cartIcon').classList.add('glow')
    setTimeout(() => {
        document.getElementById('cartIcon').classList.remove('glow')
    }, 700)

    // Get current cart from localStorage or initialize as an empty array
    let cart = JSON.parse(localStorage.getItem(`cart_${username}`)) || [];

    // Add the product to the cart
    if (!cart.includes(itemId)) {
        cart.push(itemId);
        // Save the updated cart for the current user
        localStorage.setItem(`cart_${username}`, JSON.stringify(cart));
    } else {
        alert("Item is already in the cart");
    }
}
// add to wish list 
function addTowishlist(itemId) {
    // Get the current username (since this function is in home.js, user is already logged in)
    const username = JSON.parse(localStorage.getItem("login")).username;
    document.getElementById('wishlistIcon').classList.add('glow')
    setTimeout(() => {
        document.getElementById('wishlistIcon').classList.remove('glow')
    }, 700)

    // Get current wishlist from localStorage or initialize as an empty array
    let wishlist = JSON.parse(localStorage.getItem(`wishlist_${username}`)) || [];

    // Add the product to the wishlist
    if (!wishlist.includes(itemId)) {
        wishlist.push(itemId);
        // Save the updated wishlist for the current user
        localStorage.setItem(`wishlist_${username}`, JSON.stringify(wishlist));
    } else {
        alert("Item is already in the wishlist");
    }
}
// search
async function searchProduct(searchTerm) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    try {
        let products = await fetch("../API/products.json");
        products = await products.json();

        // Filter
        const filteredProducts = products.filter(item => {
            return item.name.toLowerCase().includes(lowerCaseSearchTerm);
        });

        let productsContainer = filteredProducts.map(item => `
            <div class="col-3 row item">
                <div class="img">
                    <img src="${item.img}" />
                </div>
                <div class="row text">
                    <div class="row col-12 head">
                        <div class="col-8 name" id="productName">
                            <h3>${item.name}</h3>
                        </div>
                        <div class="col-4 price">
                            ${item.sale ? `
                                <del>
                                    <h4>${item.price}EGP</h4>
                                </del>
                                <h4>${item.discounted_price}EGP</h4>
                            ` : `
                                <h4>${item.price}EGP</h4>
                            `}
                        </div>
                    </div>
                    ${item.sale ? `
                        <div class="discount">
                            <h4>${item.discount}%</h4>
                        </div>
                    ` : ''}
                    <div class="actions row">
                        <button class="addtocart col-5" onclick="addTocart(${item.id})">
                            <h4>Add to Cart</h4>
                            <i class="fa-solid fa-cart-plus"></i>
                        </button>
                        <button class="info col-5">
                            <h4>More Details</h4>
                            <i class="fa-sharp fa-solid fa-circle-info"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        document.getElementById('products').innerHTML = productsContainer;

    } catch (error) {
        console.error("Error fetching products:", error);
    }
}
// scroll top btn
let scrollToTopButton = document.getElementById('toTop');
window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
        scrollToTopButton.style.opacity = '1';
    } else {
        scrollToTopButton.style.opacity = '0';
    }
});
scrollToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
