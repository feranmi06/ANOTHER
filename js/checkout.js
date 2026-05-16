// GET CART
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// DIVS
const checkoutItems =
document.getElementById("checkout-items");

const checkoutTotal =
document.getElementById("checkout-total");

// DISPLAY ITEMS
function displayCheckout(){

    let total = 0;

    cart.forEach(item => {

        total += item.price;

        checkoutItems.innerHTML += `

        <div class="checkout-item">

            <img src="${item.image}" alt="">

            <div>
                <h4>${item.name}</h4>
                <p>₦${item.price}</p>
            </div>

        </div>

        `;
    });

    checkoutTotal.innerText =
    `₦${total.toLocaleString()}`;
}

// RUN
displayCheckout();

// FORM
const paymentForm =
document.getElementById("payment-form");

// SUBMIT
paymentForm.addEventListener("submit", function(e){

    e.preventDefault();

    alert("Order placed successfully 💕");

    // CLEAR CART
    localStorage.removeItem("cart");

    // REDIRECT
    window.location.href = "index.html";
});