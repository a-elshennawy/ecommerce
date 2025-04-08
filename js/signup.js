// loader
//the loader
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

// signup variables
let signupEmail = document.getElementById("signup_email");
let signupUsername = document.getElementById("signup_username");
let signupPassword = document.getElementById("signup_password");
let signupBtn = document.getElementById("signup_btn")

// saving users credentials
signupBtn.addEventListener("click", () => {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (signupEmail.value && signupUsername.value && signupPassword.value) {
        users.push({
            email: signupEmail.value,
            username: signupUsername.value,
            password: signupPassword.value
        }

        )
        localStorage.setItem("users",
            JSON.stringify(users));
    }
    // clearing inputs
    signupEmail.value = ""
    signupUsername.value = ""
    signupPassword.value = ""

    // directing to login
    location.href = "index.html"
});
