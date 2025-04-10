// loader
document.addEventListener("DOMContentLoaded", function () {
  const loader = document.querySelector(".loader");
  if (loader) {
    loader.style.display = "none";
    setTimeout(() => {
      if (loader) {
        loader.style.display = "none";
      }
    }, 1000);
  }
});

// login variables
let loginUsername = document.getElementById("login_username");
let loginPassword = document.getElementById("login_password");
let loginBtn = document.getElementById("login_btn");

loginBtn.addEventListener("click", function () {
  if (loginUsername && loginPassword) {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let user = users.find(
      (u) =>
        u.username === loginUsername.value && u.password === loginPassword.value
    );

    if (user) {
      alert(`welcome, ${user.username}`);

      // Store the user data in localStorage only after successful login
      localStorage.setItem("login", JSON.stringify(user));

      // Redirect to the homepage
      location.href = "homepage.html";
    } else {
      document.getElementById("denied").classList.remove("d-none");

      loginUsername.value = "";
      loginPassword.value = "";
    }
  }
});
