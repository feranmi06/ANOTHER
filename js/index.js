// WAIT FOR PAGE
document.addEventListener("DOMContentLoaded", () => {

    // PRODUCTS
    const products = [

        {
            name: "Luxury Pink Dress",
            image: "image/dress.jpg"
        },

        {
            name: "Premium Handbag",
            image: "image/bag.jpg"
        },

        {
            name: "Pink Heels",
            image: "image/heels.jpg"
        },

        {
            name: "Luxury Wig",
            image: "image/wig.avif"
        },

        {
            name: "Denim Jacket",
            image: "image/jacket.jpg"
        }

    ];

    // ELEMENTS
    const input =
    document.getElementById("search-input");

    const suggestions =
    document.getElementById("suggestions");

    const button =
    document.getElementById("search-btn");

    // STOP IF NO INPUT
    if(!input) return;

    // TYPING
    input.addEventListener("keyup", () => {

        // VALUE
        const value =
        input.value.toLowerCase();

        // CLEAR
        suggestions.innerHTML = "";

        // EMPTY
        if(value === ""){

            suggestions.style.display = "none";

            return;
        }

        // FILTER
        const filtered =
        products.filter(product =>

            product.name
            .toLowerCase()
            .includes(value)
        );

        // SHOW BOX
        suggestions.style.display = "block";

        // LOOP
        filtered.forEach(product => {

            suggestions.innerHTML += `

            <div class="suggestion-item"
            onclick="selectSuggestion(
            '${product.name}'
            )">

                ${product.name}

            </div>

            `;
        });

        // NO RESULT
        if(filtered.length === 0){

            suggestions.innerHTML = `

            <div class="suggestion-item">
                No product found
            </div>

            `;
        }
    });

    // SEARCH BUTTON
    button.addEventListener("click", () => {

        const value =
        input.value.trim();

        if(value === "") return;

        // SAVE
        localStorage.setItem(
            "searchQuery",
            value
        );

        // OPEN PAGE
        window.location.href =
        "search.html";
    });

});

// SELECT SUGGESTION
function selectSuggestion(name){

    document.getElementById(
        "search-input"
    ).value = name;

    document.getElementById(
        "suggestions"
    ).style.display = "none";
}

// GET SLIDES
const slides = document.querySelectorAll(".slide");

// ONLY RUN IF SLIDES EXIST
if(slides.length > 0){

    let currentSlide = 0;

    function changeSlide(){

        // REMOVE ACTIVE
        slides[currentSlide].classList.remove("active");

        // NEXT
        currentSlide++;

        // RESET
        if(currentSlide >= slides.length){
            currentSlide = 0;
        }

        // SHOW NEW SLIDE
        slides[currentSlide].classList.add("active");
    }

    // AUTO SLIDE
    setInterval(changeSlide, 4000);
}

// ADD TO CART
let cart = JSON.parse(localStorage.getItem("cart")) || [];

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

// UPDATE COUNT
function updateCartCount(){

    const count = document.getElementById("cart-count");

    if(count){
        count.innerText = cart.length;
    }
}

updateCartCount();
// FLASH SALE COUNTDOWN
// CHECK IF COUNTDOWN EXISTS
if(
    document.getElementById("hours") &&
    document.getElementById("minutes") &&
    document.getElementById("seconds")
){

    let hours = 10;
    let minutes = 59;
    let seconds = 59;

    function updateCountdown(){

        seconds--;

        if(seconds < 0){
            seconds = 59;
            minutes--;
        }

        if(minutes < 0){
            minutes = 59;
            hours--;
        }

        if(hours < 0){
            hours = 10;
        }

        document.getElementById("hours").innerText =
            String(hours).padStart(2, "0");

        document.getElementById("minutes").innerText =
            String(minutes).padStart(2, "0");

        document.getElementById("seconds").innerText =
            String(seconds).padStart(2, "0");
    }

    setInterval(updateCountdown, 1000);
}

// OPEN PRODUCT PAGE
function openProduct(name, price, image){

    const product = {
        name,
        price,
        image
    };

    // SAVE PRODUCT
    localStorage.setItem(
        "selectedProduct",
        JSON.stringify(product)
    );

    // OPEN PAGE
    window.location.href = "product.html";
}


// PRODUCTS DATABASE
const products = [

    {
        name: "Luxury Pink Dress",
        price: 25000,
        image: "image/dress.jpg"
    },

    {
        name: "Premium Handbag",
        price: 18000,
        image: "image/bag.jpg"
    },

    {
        name: "Pink Heels",
        price: 15000,
        image: "image/heels.jpg"
    },

    {
        name: "Luxury Wig",
        price: 45000,
        image: "image/wig.avif"
    },

    {
        name: "Denim Jacket",
        price: 22000,
        image: "image/jacket.jpg"
    }

];

// INPUT
const searchInput =
document.getElementById("search-input");

// SUGGESTIONS
const suggestions =
document.getElementById("suggestions");

// LIVE SUGGESTIONS
if(searchInput){

    searchInput.addEventListener("keyup", () => {

        // VALUE
        const value =
        searchInput.value.toLowerCase();

        // CLEAR
        suggestions.innerHTML = "";

        // STOP EMPTY
        if(value === "") return;

        // FILTER
        const filtered =
        products.filter(product =>

            product.name
            .toLowerCase()
            .includes(value)
        );

        // SHOW
        filtered.forEach(product => {

            suggestions.innerHTML += `

            <div class="suggestion-item"
            onclick="selectProduct(
            '${product.name}'
            )">

                ${product.name}

            </div>

            `;
        });
    });
}

// SELECT PRODUCT
function selectProduct(name){

    searchInput.value = name;

    suggestions.innerHTML = "";
}

// SEARCH PAGE
function goToSearch(){

    const value =
    searchInput.value.trim();

    if(value === ""){

        alert("Type something");

        return;
    }

    localStorage.setItem(
        "searchQuery",
        value
    );

    window.location.href =
    "search.html";
}

// ADD TO WISHLIST
function addToWishlist(name, price, image){

    let wishlist =
    JSON.parse(localStorage.getItem("wishlist"))
    || [];

    // CHECK EXISTING
    const existing =
    wishlist.find(item => item.name === name);

    if(existing){

        alert("Already in wishlist ❤️");

        return;
    }

    // ADD
    wishlist.push({
        name,
        price,
        image
    });

    // SAVE
    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );

    alert("Added to wishlist ❤️");
}