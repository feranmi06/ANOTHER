// ─── Product Detail Page ──────────────────────────────────────────────────────

const productImg   = document.getElementById('product-img');
const productName  = document.getElementById('product-name');
const productPrice = document.getElementById('product-price');

// Render from cached data first (instant paint)
const cached = JSON.parse(localStorage.getItem('selectedProduct') || 'null');
if (cached && productImg) {
    productImg.src          = `../${cached.image}`;
    productName.innerText   = cached.name;
    productPrice.innerText  = `₦${Number(cached.price).toLocaleString()}`;
}

// Then fetch fresh data from API
let currentProduct = null;

async function loadProduct() {
    if (!cached) return;
    const { ok, data } = await apiFetch(`/products/?q=${encodeURIComponent(cached.name)}`);
    if (ok && data.length > 0) {
        currentProduct = data.find(p => p.name === cached.name) || data[0];

        // Update with live data
        if (productImg)   productImg.src         = `../${currentProduct.image_url}`;
        if (productName)  productName.innerText   = currentProduct.name;
        if (productPrice) productPrice.innerText  = `₦${Number(currentProduct.price).toLocaleString()}`;
    }
}

loadProduct();

// ─── Add to Cart ──────────────────────────────────────────────────────────────

async function doAddToCart() {
    if (!isLoggedIn()) {
        alert('Please log in to add items to your cart 🛒');
        window.location.href = 'login.html';
        return;
    }

    if (!currentProduct) {
        alert('Product not loaded yet. Please wait a moment.');
        return;
    }

    const { ok, data } = await apiFetch('/cart/add/', {
        method: 'POST',
        body: JSON.stringify({ product_id: currentProduct.id, quantity: 1 }),
    });

    if (ok) {
        alert(data.message || 'Added to cart 🛒');
        refreshCartCount();
    } else {
        alert(data.error || 'Could not add to cart.');
    }
}

const addCartBtn = document.getElementById('add-cart-btn');
if (addCartBtn) addCartBtn.addEventListener('click', doAddToCart);

// ─── Buy Now ──────────────────────────────────────────────────────────────────

const buyBtn = document.querySelector('.buy-btn');
if (buyBtn) {
    buyBtn.addEventListener('click', async () => {
        await doAddToCart();
        if (isLoggedIn()) window.location.href = 'Checkout.html';
    });
}
