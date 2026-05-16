// GET USERNAME
const username =
localStorage.getItem("username");

// SHOW USERNAME
if(username){

    document.getElementById(
        "username"
    ).innerText =
    `Hello ${username} 👋`;
}

// CART COUNT
let cart =
JSON.parse(localStorage.getItem("cart"))
|| [];

// SHOW COUNT
document.getElementById(
    "cart-count"
).innerText = cart.length;

// ORDERS
function openOrders(){

    alert("Orders page coming soon 📦");
}

// SETTINGS
function openSettings(){

    alert("Settings page coming soon ⚙️");
}

// LOGOUT
function logout(){

    localStorage.removeItem("username");

    alert("Logged out");

    window.location.href =
    "pages/login.html";
}