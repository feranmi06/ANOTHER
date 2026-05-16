// ─── Cart Page ────────────────────────────────────────────────────────────────

const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');

async function loadCart() {
    if (!cartItems) return;

    if (!isLoggedIn()) {
        cartItems.innerHTML = '<h2>Please <a href="login.html">log in</a> to view your cart 🛒</h2>';
        if (cartTotal) cartTotal.innerText = '₦0';
        return;
    }

    const { ok, data } = await apiFetch('/cart/');

    if (!ok) {
        cartItems.innerHTML = '<h2>Failed to load cart. Please try again.</h2>';
        return;
    }

    cartItems.innerHTML = '';

    if (data.items.length === 0) {
        cartItems.innerHTML = '<h2>Your cart is empty 🛒</h2>';
        if (cartTotal) cartTotal.innerText = '₦0';
        return;
    }

    data.items.forEach(item => {
        const subtotal = item.subtotal;
        const imgSrc = item.product.image || `../../image/${item.product.image_url.replace('image/', '')}`;

        cartItems.innerHTML += `
        <div class="cart-item">
            <img src="../${item.product.image_url}" alt="${item.product.name}"
                 onerror="this.src='../image/dress.jpg'">
            <div class="cart-info">
                <h3>${item.product.name}</h3>
                <p>₦${Number(item.product.price).toLocaleString()}</p>
                <div class="quantity-box">
                    <button onclick="changeQty(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQty(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <h4>Subtotal: ₦${Number(subtotal).toLocaleString()}</h4>
            </div>
            <button class="remove-btn" onclick="removeItem(${item.id})">Remove</button>
        </div>`;
    });

    if (cartTotal) {
        cartTotal.innerText = `₦${Number(data.total).toLocaleString()}`;
    }

    // Update badge
    const badge = document.getElementById('cart-count');
    if (badge) badge.innerText = data.item_count;
}

async function changeQty(itemId, newQty) {
    if (newQty < 1) {
        await removeItem(itemId);
        return;
    }
    await apiFetch(`/cart/item/${itemId}/`, {
        method: 'PUT',
        body: JSON.stringify({ quantity: newQty }),
    });
    loadCart();
}

async function removeItem(itemId) {
    await apiFetch(`/cart/item/${itemId}/`, { method: 'DELETE' });
    loadCart();
}

// Checkout button
const checkoutBtn = document.getElementById('checkout-btn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', async () => {
        if (!isLoggedIn()) {
            alert('Please log in first.');
            window.location.href = 'login.html';
            return;
        }
        const { ok, data } = await apiFetch('/cart/');
        if (ok && data.items.length > 0) {
            window.location.href = 'Checkout.html';
        } else {
            alert('Your cart is empty 🛒');
        }
    });
}

// Run
loadCart();
