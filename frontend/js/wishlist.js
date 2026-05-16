// ─── Wishlist Page ────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {

    const wishlistEl = document.getElementById('wishlist-items');
    if (!wishlistEl) return;

    if (!isLoggedIn()) {
        wishlistEl.innerHTML = '<p>Please <a href="login.html">log in</a> to view your wishlist ❤️</p>';
        return;
    }

    const { ok, data } = await apiFetch('/wishlist/');

    if (!ok) {
        wishlistEl.innerHTML = '<p>Failed to load wishlist.</p>';
        return;
    }

    if (data.length === 0) {
        wishlistEl.innerHTML = '<p>Your wishlist is empty ❤️</p>';
        return;
    }

    wishlistEl.innerHTML = '';
    data.forEach(item => {
        wishlistEl.innerHTML += `
        <div class="wishlist-item">
            <img src="../${item.product.image_url}" alt="${item.product.name}"
                 onerror="this.src='../image/dress.jpg'">
            <div class="wishlist-info">
                <h3>${item.product.name}</h3>
                <p>₦${Number(item.product.price).toLocaleString()}</p>
                <button onclick="moveToCart(${item.product.id}, ${item.id})">Add to Cart 🛒</button>
                <button onclick="removeWishlist(${item.id})">Remove ✕</button>
            </div>
        </div>`;
    });
});

async function moveToCart(productId, wishlistItemId) {
    const { ok, data } = await apiFetch('/cart/add/', {
        method: 'POST',
        body: JSON.stringify({ product_id: productId, quantity: 1 }),
    });
    alert(ok ? (data.message || 'Added to cart 🛒') : (data.error || 'Failed.'));
    if (ok) refreshCartCount();
}

async function removeWishlist(itemId) {
    await apiFetch(`/wishlist/item/${itemId}/`, { method: 'DELETE' });
    location.reload();
}
