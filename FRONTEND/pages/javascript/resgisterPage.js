const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("name").value;

    const email = document.getElementById("email").value;

    const password = document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    const category =
        document.getElementById("category").value;

    try {

        const response = await fetch(
            "http://localhost:5000/api/users/register",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    name,
                    email,
                    password,
                    confirmPassword,
                    category,
                }),
            }
        );

        const data = await response.json();

        if (response.ok) {

            alert(data.message);

            window.location.href =
                "../authPages/loginPage.html";

        } else {

            alert(data.message);
        }

    } catch (error) {

        console.log(error);

        alert("Registration Failed");
    }
});