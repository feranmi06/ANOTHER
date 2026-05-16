// ─── Login ────────────────────────────────────────────────────────────────────

async function loginUser(event) {
    event.preventDefault();

    const email    = event.target.querySelector('input[type="email"]').value.trim();
    const password = event.target.querySelector('input[type="password"]').value;

    if (!email || !password) {
        alert('Please fill in all fields.');
        return;
    }

    const { ok, data } = await apiFetch('/auth/login/', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });

    if (ok) {
        saveSession(data.token, data.user);
        alert(data.message || 'Login successful! 💕');
        window.location.href = 'index.html';
    } else {
        const msg = data.error || 'Login failed. Please check your credentials.';
        alert(msg);
    }
}

// ─── Sign Up ─────────────────────────────────────────────────────────────────

async function signupUser(event) {
    event.preventDefault();

    const lastName        = event.target.querySelector('input[placeholder="Last Name"]').value.trim();
    const firstName       = event.target.querySelector('input[placeholder="First Name"]').value.trim();
    const email           = event.target.querySelector('input[type="email"]').value.trim();
    const password        = event.target.querySelector('input[type="password"]').value;
    const confirmPassword = event.target.querySelector('input[placeholder="Confirm Password"]').value;

    if (!lastName || !firstName || !email || !password || !confirmPassword) {
        alert('Please fill in all fields.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    if (password.length < 6) {
        alert('Password must be at least 6 characters.');
        return;
    }

    const { ok, data } = await apiFetch('/auth/register/', {
        method: 'POST',
        body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            email,
            password,
            confirm_password: confirmPassword,
        }),
    });

    if (ok) {
        saveSession(data.token, data.user);
        alert(data.message || 'Account created! Welcome to L-BUY 💕');
        window.location.href = 'index.html';
    } else {
        const errors = Object.values(data).flat().join('\n');
        alert(errors || 'Registration failed. Please try again.');
    }
}
