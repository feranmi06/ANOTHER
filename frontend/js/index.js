// ─── Index Page ───────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {

    // ── Search bar ───────────────────────────────────────────────────────────

    const input       = document.getElementById('search-input');
    const suggestions = document.getElementById('suggestions');
    const searchBtn   = document.getElementById('search-btn');

    if (input) {

        // Live suggestions — hit the API as the user types
        input.addEventListener('keyup', async () => {
            const value = input.value.trim();
            suggestions.innerHTML = '';
            if (!value) { suggestions.style.display = 'none'; return; }

            const { ok, data } = await apiFetch(`/products/?q=${encodeURIComponent(value)}`);
            suggestions.style.display = 'block';

            if (ok && data.length > 0) {
                data.slice(0, 6).forEach(product => {
                    const div = document.createElement('div');
                    div.className = 'suggestion-item';
                    div.textContent = product.name;
                    div.onclick = () => {
                        input.value = product.name;
                        suggestions.style.display = 'none';
                    };
                    suggestions.appendChild(div);
                });
            } else {
                suggestions.innerHTML = '<div class="suggestion-item">No product found</div>';
            }
        });

        // Search button click
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const value = input.value.trim();
                if (!value) return;
                localStorage.setItem('searchQuery', value);
                window.location.href = 'search.html';
            });
        }
    }

    // ── Hero slider ──────────────────────────────────────────────────────────

    const slides = document.querySelectorAll('.slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        function changeSlide() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }
        setInterval(changeSlide, 4000);
    }

    // ── Flash sale countdown ─────────────────────────────────────────────────

    if (document.getElementById('hours')) {
        let h = 10, m = 59, s = 59;
        function updateCountdown() {
            s--;
            if (s < 0) { s = 59; m--; }
            if (m < 0) { m = 59; h--; }
            if (h < 0) { h = 10; }
            document.getElementById('hours').innerText   = String(h).padStart(2, '0');
            document.getElementById('minutes').innerText = String(m).padStart(2, '0');
            document.getElementById('seconds').innerText = String(s).padStart(2, '0');
        }
        setInterval(updateCountdown, 1000);
    }
});

// ─── Add to Cart ──────────────────────────────────────────────────────────────

async function addToCart(name, price, imageUrl) {
    if (!isLoggedIn()) {
        alert('Please log in to add items to your cart 🛒');
        window.location.href = 'login.html';
        return;
    }

    // Look up the product ID by name
    const { ok: searchOk, data: products } = await apiFetch(`/products/?q=${encodeURIComponent(name)}`);
    if (!searchOk || products.length === 0) {
        alert('Product not found. Please refresh the page.');
        return;
    }

    const product = products.find(p => p.name === name) || products[0];

    const { ok, data } = await apiFetch('/cart/add/', {
        method: 'POST',
        body: JSON.stringify({ product_id: product.id, quantity: 1 }),
    });

    if (ok) {
        alert(data.message || 'Added to cart 🛒');
        refreshCartCount();
    } else {
        alert(data.error || 'Could not add to cart.');
    }
}

// ─── Open Product Detail Page ─────────────────────────────────────────────────

async function openProduct(name, price, imageUrl) {
    // Store basic info so product.js can render immediately while the API loads
    localStorage.setItem('selectedProduct', JSON.stringify({ name, price, image: imageUrl }));
    window.location.href = 'product.html';
}

// ─── Add to Wishlist ──────────────────────────────────────────────────────────

async function addToWishlist(name, price, imageUrl) {
    if (!isLoggedIn()) {
        alert('Please log in to save items to your wishlist ❤️');
        window.location.href = 'login.html';
        return;
    }

    const { ok: searchOk, data: products } = await apiFetch(`/products/?q=${encodeURIComponent(name)}`);
    if (!searchOk || products.length === 0) {
        alert('Product not found.');
        return;
    }

    const product = products.find(p => p.name === name) || products[0];

    const { ok, data } = await apiFetch('/wishlist/add/', {
        method: 'POST',
        body: JSON.stringify({ product_id: product.id }),
    });

    alert(data.message || (ok ? 'Added to wishlist ❤️' : 'Could not add to wishlist.'));
}
