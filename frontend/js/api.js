// ─── L-BUY API Helper ────────────────────────────────────────────────────────
// Central place for API configuration and shared fetch logic.

const API_BASE = 'http://127.0.0.1:8000/api';

// Return the stored auth token (or null if not logged in)
function getToken() {
    return localStorage.getItem('lbuy_token');
}

// Return headers — always JSON, auth token when available
function getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) headers['Authorization'] = `Token ${token}`;
    return headers;
}

// Generic fetch wrapper — resolves to { ok, data }
async function apiFetch(path, options = {}) {
    try {
        const res = await fetch(`${API_BASE}${path}`, {
            ...options,
            headers: getHeaders(),
        });
        const data = await res.json();
        return { ok: res.ok, status: res.status, data };
    } catch (err) {
        console.error('API error:', err);
        return { ok: false, status: 0, data: { error: 'Network error. Is the server running?' } };
    }
}

// ── Auth helpers ─────────────────────────────────────────────────────────────

function isLoggedIn() {
    return Boolean(getToken());
}

function getCurrentUser() {
    const raw = localStorage.getItem('lbuy_user');
    return raw ? JSON.parse(raw) : null;
}

function saveSession(token, user) {
    localStorage.setItem('lbuy_token', token);
    localStorage.setItem('lbuy_user', JSON.stringify(user));
}

function clearSession() {
    localStorage.removeItem('lbuy_token');
    localStorage.removeItem('lbuy_user');
    localStorage.removeItem('lbuy_cart_count');
}

// ── Cart count badge ─────────────────────────────────────────────────────────

async function refreshCartCount() {
    const badge = document.getElementById('cart-count');
    if (!badge) return;

    if (!isLoggedIn()) {
        badge.innerText = '0';
        return;
    }

    const { ok, data } = await apiFetch('/cart/');
    if (ok) {
        badge.innerText = data.item_count || 0;
    }
}

// Run on every page that includes this script
document.addEventListener('DOMContentLoaded', refreshCartCount);
