// GET PRODUCT
const product =
JSON.parse(localStorage.getItem("selectedProduct"));

function resolvePageImage(path){

    if(path.startsWith("image/")){
        return `../${path}`;
    }

    return path;
}

// GET ELEMENTS
const productImg =
document.getElementById("product-img");

const productName =
document.getElementById("product-name");

const productPrice =
document.getElementById("product-price");

// SHOW PRODUCT
productImg.src = resolvePageImage(product.image);

productName.innerText = product.name;

productPrice.innerText =
`₦${product.price.toLocaleString()}`;

// GET CART
let cart =
JSON.parse(localStorage.getItem("cart")) || [];

// UPDATE COUNT
function updateCartCount(){

    const count =
    document.getElementById("cart-count");

    if(count){
        count.innerText = cart.length;
    }
}

// LOAD COUNT
updateCartCount();

// ADD TO CART
document.getElementById("add-cart-btn")
.addEventListener("click", () => {

    cart.push(product);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCartCount();

    alert("Added to cart 🛒");
});

// BUY NOW
document.querySelector(".buy-btn")
.addEventListener("click", () => {

    // ADD TO CART FIRST
    cart.push(product);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    // GO TO CHECKOUT
    window.location.href =
    "checkout.html";
});