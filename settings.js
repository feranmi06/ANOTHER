// IMAGE INPUT
const profileInput =
document.getElementById("profile-input");

// PREVIEW
const profilePreview =
document.getElementById("profile-preview");

// CHANGE IMAGE
profileInput.addEventListener("change", () => {

    const file =
    profileInput.files[0];

    if(file){

        profilePreview.src =
        URL.createObjectURL(file);
    }
});

// SAVE PROFILE
function saveProfile(){

    const name =
    document.getElementById("name").value;

    const email =
    document.getElementById("email").value;

    // SAVE
    localStorage.setItem(
        "username",
        name
    );

    localStorage.setItem(
        "email",
        email
    );

    alert(
        "Profile updated successfully 💕"
    );
}

// LOGOUT
function logout(){

    localStorage.removeItem(
        "username"
    );

    alert("Logged out");

    window.location.href =
    "login.html";
}