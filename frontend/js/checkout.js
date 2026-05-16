// ─── Checkout Page ────────────────────────────────────────────────────────────

const checkoutItems = document.getElementById('checkout-items');
const checkoutTotal = document.getElementById('checkout-total');

async function loadCheckout() {
    if (!isLoggedIn()) {
        if (checkoutItems) checkoutItems.innerHTML = '<p>Please <a href="login.html">log in</a> to checkout.</p>';
        return;
    }

    const { ok, data } = await apiFetch('/cart/');
    if (!ok || data.items.length === 0) {
        if (checkoutItems) checkoutItems.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }

    if (checkoutItems) {
        checkoutItems.innerHTML = '';
        data.items.forEach(item => {
            checkoutItems.innerHTML += `
            <div class="checkout-item">
                <img src="../${item.product.image_url}" alt="${item.product.name}"
                     onerror="this.src='../image/dress.jpg'">
                <div>
                    <h4>${item.product.name}</h4>
                    <p>₦${Number(item.product.price).toLocaleString()} × ${item.quantity}</p>
                    <p><strong>₦${Number(item.subtotal).toLocaleString()}</strong></p>
                </div>
            </div>`;
        });
    }

    if (checkoutTotal) {
        checkoutTotal.innerText = `₦${Number(data.total).toLocaleString()}`;
    }
}

loadCheckout();

// ─── Place Order ──────────────────────────────────────────────────────────────

const paymentForm = document.getElementById('payment-form');
if (paymentForm) {
    paymentForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (!isLoggedIn()) {
            alert('Please log in first.');
            window.location.href = 'login.html';
            return;
        }

        // Gather shipping fields — adjust selectors if your HTML uses different names/ids
        const shipping_name    = (document.getElementById('shipping-name')    || document.querySelector('input[placeholder*="Name"]'))?.value?.trim();
        const shipping_address = (document.getElementById('shipping-address') || document.querySelector('textarea, input[placeholder*="Address"]'))?.value?.trim();
        const shipping_phone   = (document.getElementById('shipping-phone')   || document.querySelector('input[type="tel"], input[placeholder*="Phone"]'))?.value?.trim();
        const payment_method   = (document.getElementById('payment-method')   || document.querySelector('select'))?.value || 'card';

        if (!shipping_name || !shipping_address || !shipping_phone) {
            alert('Please fill in all shipping details.');
            return;
        }

        const { ok, data } = await apiFetch('/orders/create/', {
            method: 'POST',
            body: JSON.stringify({ shipping_name, shipping_address, shipping_phone, payment_method }),
        });

        if (ok) {
            alert(`${data.message}\nOrder #${data.order.id} placed successfully 💕`);
            window.location.href = 'index.html';
        } else {
            const errors = typeof data === 'object' ? Object.values(data).flat().join('\n') : 'Order failed.';
            alert(errors);
        }
    });
}
