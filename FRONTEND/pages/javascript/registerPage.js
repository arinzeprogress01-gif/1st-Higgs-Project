console.log("Register Page JS Loaded");

function showToast(message, type) {

    const toast = document.getElementById("toast");

    toast.textContent = message;

    toast.className = `show ${type}`;

    setTimeout(() => {

        toast.className="";

    }, 3000);
}
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



    console.log({
        name,
        email,
        password,
        confirmPassword,
        category,
    });

    if (!category) {
        showToast("Please select a system type", "error");
        return;
    }

    try {

        const response = await fetch(
            "https://onest-higgs-project.onrender.com/api/auth/register",
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

            showToast(data.message, "success");

            window.location.href =
                "/authPages/loginPage.html";

        } else {

            showToast(data.message, "error");
        }

    } catch (error) {

        console.log(error);
        if (!response.ok) {

            showToast(
                data.message,
                "error"
            );

            return;
        }

        showToast(error.message, "error");
    }
});