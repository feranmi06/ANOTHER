// ─── Search Page ──────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {

    const query        = localStorage.getItem('searchQuery') || '';
    const resultsEl    = document.getElementById('search-results');
    const queryDisplay = document.getElementById('search-query');

    if (queryDisplay) queryDisplay.innerText = `"${query}"`;
    if (!query || !resultsEl) return;

    resultsEl.innerHTML = '<p>Searching...</p>';

    const { ok, data } = await apiFetch(`/products/?q=${encodeURIComponent(query)}`);

    if (!ok) {
        resultsEl.innerHTML = '<p>Search failed. Please try again.</p>';
        return;
    }

    if (data.length === 0) {
        resultsEl.innerHTML = `<p>No products found for "${query}".</p>`;
        return;
    }

    resultsEl.innerHTML = '';
    data.forEach(product => {
        resultsEl.innerHTML += `
        <div class="product-card" onclick="openProduct('${product.name.replace(/'/g, "\\'")}', ${product.price}, '${product.image_url}')">
            <div class="product-image">
                <img src="../${product.image_url}" alt="${product.name}"
                     onerror="this.src='../image/dress.jpg'">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="price">₦${Number(product.price).toLocaleString()}</p>
                <button onclick="event.stopPropagation(); addToCart('${product.name.replace(/'/g, "\\'")}', ${product.price}, '${product.image_url}')">
                    Add to Cart
                </button>
            </div>
        </div>`;
    });
});

// Reuse from index.js — defined globally via api.js context
async function openProduct(name, price, imageUrl) {
    localStorage.setItem('selectedProduct', JSON.stringify({ name, price, image: imageUrl }));
    window.location.href = 'product.html';
}

async function addToCart(name, price, imageUrl) {
    if (!isLoggedIn()) {
        alert('Please log in to add items to your cart 🛒');
        window.location.href = 'login.html';
        return;
    }
    const { ok: searchOk, data: products } = await apiFetch(`/products/?q=${encodeURIComponent(name)}`);
    if (!searchOk || products.length === 0) { alert('Product not found.'); return; }
    const product = products.find(p => p.name === name) || products[0];
    const { ok, data } = await apiFetch('/cart/add/', {
        method: 'POST',
        body: JSON.stringify({ product_id: product.id, quantity: 1 }),
    });
    alert(ok ? (data.message || 'Added to cart 🛒') : (data.error || 'Failed.'));
    if (ok) refreshCartCount();
}
