// GET WISHLIST
let wishlist =
JSON.parse(localStorage.getItem("wishlist"))
|| [];

function resolvePageImage(path){

    if(path.startsWith("image/")){
        return `../${path}`;
    }

    return path;
}

// DIV
const wishlistItems =
document.getElementById("wishlist-items");

// EMPTY
if(wishlist.length === 0){

    wishlistItems.innerHTML =
    "<h2>No wishlist items ❤️</h2>";
}

// SHOW ITEMS
wishlist.forEach(product => {

    wishlistItems.innerHTML += `

    <div class="product-card">

        <img src="${resolvePageImage(product.image)}">

        <div class="product-info">

            <h3>
                ${product.name}
            </h3>

            <p class="price">
                ₦${product.price}
            </p>

            <button
            onclick="addToCart(
            '${product.name}',
            ${product.price},
            '${product.image}'
            )">

                Add to Cart

            </button>

        </div>

    </div>

    `;
});

// ADD TO CART
function addToCart(name, price, image){

    let cart =
    JSON.parse(localStorage.getItem("cart"))
    || [];

    const existingProduct =
    cart.find(item => item.name === name);

    if(existingProduct){

        existingProduct.quantity += 1;

    }else{

        cart.push({
            name,
            price,
            image,
            quantity: 1
        });
    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    alert("Added to cart 🛒");
}