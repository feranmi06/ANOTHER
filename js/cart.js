// GET CART
let cart =
JSON.parse(localStorage.getItem("cart"))
|| [];

function resolvePageImage(path){

    if(path.startsWith("image/")){
        return `../${path}`;
    }

    return path;
}

// DIV
const cartItems =
document.getElementById("cart-items");

// DISPLAY
function displayCart(){

    cartItems.innerHTML = "";

    let total = 0;

    // EMPTY
    if(cart.length === 0){

        cartItems.innerHTML =
        "<h2>Your cart is empty 🛒</h2>";

        document.getElementById(
            "cart-total"
        ).innerText = "₦0";

        return;
    }

    // LOOP
    cart.forEach((item, index) => {

        const subtotal =
        item.price * item.quantity;

        total += subtotal;

        cartItems.innerHTML += `

        <div class="cart-item">

            <img src="${resolvePageImage(item.image)}" alt="">

            <div class="cart-info">

                <h3>${item.name}</h3>

                <p>
                    ₦${item.price}
                </p>

                <div class="quantity-box">

                    <button
                    onclick="decreaseQty(${index})">

                        -

                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                    onclick="increaseQty(${index})">

                        +

                    </button>

                </div>

                <h4>
                    Subtotal:
                    ₦${subtotal.toLocaleString()}
                </h4>

            </div>

            <button class="remove-btn"
            onclick="removeItem(${index})">

                Remove

            </button>

        </div>

        `;
    });

    // TOTAL
    document.getElementById(
        "cart-total"
    ).innerText =
    `₦${total.toLocaleString()}`;

}

// INCREASE
function increaseQty(index){

    cart[index].quantity += 1;

    saveCart();
}

// DECREASE
function decreaseQty(index){

    if(cart[index].quantity > 1){

        cart[index].quantity -= 1;

    }else{

        cart.splice(index, 1);
    }

    saveCart();
}

// REMOVE
function removeItem(index){

    cart.splice(index, 1);

    saveCart();
}

// SAVE
function saveCart(){

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    displayCart();
}

// CHECKOUT
const checkoutBtn =
document.getElementById("checkout-btn");

if(checkoutBtn){

    checkoutBtn.addEventListener(
        "click",

        () => {

            if(cart.length === 0){

                alert(
                    "Your cart is empty 🛒"
                );

            }else{

                window.location.href =
                "checkout.html";
            }
        }
    );
}

// RUN
displayCart();