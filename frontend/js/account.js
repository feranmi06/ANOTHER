// ─── Account Page ─────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {

    const nameEl   = document.getElementById('account-name');
    const emailEl  = document.getElementById('account-email');
    const logoutBtn = document.getElementById('logout-btn');

    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    // Load profile from API
    const { ok, data } = await apiFetch('/auth/me/');
    if (ok) {
        if (nameEl)  nameEl.innerText  = data.full_name || data.email;
        if (emailEl) emailEl.innerText = data.email;
    }

    // Load order history
    const ordersEl = document.getElementById('order-list');
    if (ordersEl) {
        const { ok: ordOk, data: orders } = await apiFetch('/orders/');
        if (ordOk && orders.length > 0) {
            ordersEl.innerHTML = '';
            orders.forEach(order => {
                ordersEl.innerHTML += `
                <div class="order-card">
                    <p><strong>Order #${order.id}</strong> — ${order.status.toUpperCase()}</p>
                    <p>${order.items.length} item(s) · ₦${Number(order.total).toLocaleString()}</p>
                    <p>${new Date(order.created_at).toLocaleDateString('en-NG', { dateStyle: 'medium' })}</p>
                </div>`;
            });
        } else if (ordOk) {
            ordersEl.innerHTML = '<p>No orders yet. Start shopping! 💕</p>';
        }
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await apiFetch('/auth/logout/', { method: 'POST' });
            clearSession();
            window.location.href = 'login.html';
        });
    }
});
