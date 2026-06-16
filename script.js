async function login() {

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    const response = await fetch(
        "http://localhost:8080/users/login",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email,
                password: password
            })
        }
    );

    const token = await response.text();

    if (token.startsWith("ey")) {

        localStorage.setItem("token", token);

        window.location.href = "dashboard.html";

    } else {

        document.getElementById("message")
            .innerText = "Invalid Login";
    }
}