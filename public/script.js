const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const loginBox = document.getElementById("loginBox");
const registerBox = document.getElementById("registerBox");

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");

const loginMessage = document.getElementById("loginMessage");
const registerMessage = document.getElementById("registerMessage");


// ==========================================
// SWITCH TO REGISTER
// ==========================================

showRegister.addEventListener("click", () => {

    loginBox.classList.add("hidden");
    registerBox.classList.remove("hidden");

    loginMessage.textContent = "";
    registerMessage.textContent = "";

});


// ==========================================
// SWITCH TO LOGIN
// ==========================================

showLogin.addEventListener("click", () => {

    registerBox.classList.add("hidden");
    loginBox.classList.remove("hidden");

    loginMessage.textContent = "";
    registerMessage.textContent = "";

});


// ==========================================
// LOGIN
// ==========================================

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const username =
        document.getElementById("loginUsername").value;

    const password =
        document.getElementById("loginPassword").value;

    try {

        const response = await fetch("/api/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username: username,
                password: password
            })

        });

        const data = await response.json();

        loginMessage.textContent = data.message;

    } catch (error) {

        console.error(error);

        loginMessage.textContent =
            "Unable to connect to the server.";

    }

});


// ==========================================
// REGISTER
// ==========================================

registerForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const username =
        document.getElementById("registerUsername").value;

    const password =
        document.getElementById("registerPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;


    // Check passwords
    if (password !== confirmPassword) {

        registerMessage.textContent =
            "Passwords do not match.";

        return;
    }


    try {

        const response = await fetch("/api/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username: username,
                password: password
            })

        });

        const data = await response.json();

        registerMessage.textContent = data.message;


        // If registration succeeded
        if (response.ok) {

            registerForm.reset();

        }

    } catch (error) {

        console.error(error);

        registerMessage.textContent =
            "Unable to connect to the server.";

    }

});

