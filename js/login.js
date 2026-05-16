// LOGIN USER FUNCTION
function loginUser(event) {
    event.preventDefault();

    // GET FORM VALUES
    const email = event.target.querySelector('input[type="email"]').value;
    const password = event.target.querySelector('input[type="password"]').value;

    // VALIDATE
    if (!email || !password) {
        alert("Please fill in all fields");
        return;
    }

    // SIMPLE VALIDATION (in real app, validate with backend)
    if (email && password) {
        // EXTRACT USERNAME FROM EMAIL
        const username = email.split("@")[0];

        // SAVE TO LOCALSTORAGE
        localStorage.setItem("username", username);
        localStorage.setItem("email", email);

        alert("Login successful! Welcome " + username);

        // REDIRECT TO HOME
        window.location.href = "index.html";
    } else {
        alert("Invalid email or password");
    }
}

// SIGNUP USER FUNCTION
function signupUser(event) {
    event.preventDefault();

    // GET FORM VALUES
    const lastName = event.target.querySelector('input[placeholder="Last Name"]').value;
    const firstName = event.target.querySelector('input[placeholder="First Name"]').value;
    const email = event.target.querySelector('input[type="email"]').value;
    const password = event.target.querySelector('input[type="password"]').value;
    const confirmPassword = event.target.querySelector('input[placeholder="Confirm Password"]').value;

    // VALIDATE
    if (!lastName || !firstName || !email || !password || !confirmPassword) {
        alert("Please fill in all fields");
        return;
    }

    // CHECK PASSWORD MATCH
    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    // CHECK PASSWORD LENGTH
    if (password.length < 6) {
        alert("Password must be at least 6 characters long");
        return;
    }

    // SAVE TO LOCALSTORAGE
    const username = firstName + " " + lastName;
    localStorage.setItem("username", username);
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);

    alert("Account created successfully! Welcome " + username);

    // REDIRECT TO HOME
    window.location.href = "index.html";
}
