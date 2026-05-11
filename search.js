// SEARCH VALUE
const query =
localStorage.getItem("searchQuery")
?.toLowerCase() || "";

// PRODUCTS
const products = [

    {
        name: "Luxury Pink Dress",
        price: 25000,
        image: "images/dress.jpg"
    },

    {
        name: "Premium Handbag",
        price: 18000,
        image: "images/bag.jpg"
    },

    {
        name: "Pink Heels",
        price: 15000,
        image: "images/heels.jpg"
    },

    {
        name: "Luxury Wig",
        price: 45000,
        image: "images/wig.jpg"
    },

    {
        name: "Denim Jacket",
        price: 22000,
        image: "images/jacket.jpg"
    }

];

// DIV
const results =
document.getElementById("search-results");

// FILTER
const filteredProducts =
products.filter(product =>

    product.name
    .toLowerCase()
    .includes(query)
);

// EMPTY
if(filteredProducts.length === 0){

    results.innerHTML =
    "<h2>No products found 😢</h2>";
}

// SHOW PRODUCTS
filteredProducts.forEach(product => {

    results.innerHTML += `

    <div class="product-card"
    onclick="openProduct(
    '${product.name}',
    ${product.price},
    '${product.image}'
    )">

        <img src="${product.image}">

        <div class="product-info">

            <h3>${product.name}</h3>

            <p class="price">
                ₦${product.price}
            </p>

            <button
            onclick="event.stopPropagation();
            addToCart(
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

    cart.push({
        name,
        price,
        image
    });

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    alert("Added to cart 🛒");
}

// OPEN PRODUCT
function openProduct(name, price, image){

    localStorage.setItem(
        "selectedProduct",

        JSON.stringify({
            name,
            price,
            image
        })
    );

    window.location.href =
    "product.html";
}