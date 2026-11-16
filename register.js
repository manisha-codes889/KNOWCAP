const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");

registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    registerMessage.textContent = "Creating account...";

    try {
        const response = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            registerMessage.textContent = data.message || "Registration failed.";
            return;
        }

        registerMessage.textContent = "Registration successful! Please login.";

        registerForm.reset();

    } catch (error) {
        registerMessage.textContent = "Server connection failed.";
        console.error(error);
    }
});