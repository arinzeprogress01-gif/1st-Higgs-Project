function showToast(message, type) {

    const toast = document.getElementById("toast");

    toast.textContent = message;

    toast.className = `show ${type}`;

    setTimeout(() => {

        toast.className="";

    }, 3000);
}

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    try {

        const response = await fetch(
            "https://onest-higgs-project.onrender.com/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    email,
                    password,
                }),
            }
        );

        const data = await response.json();

        if (response.ok) {

            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            showToast(
                "Login Successful",
                "success"
            );

            setTimeout(() => {

                if (data.user.category === "personal") {

                    window.location.href =
                        "/dashboards/personalDashboard.html";

                } else if (
                    data.user.category === "professional"
                ) {

                    window.location.href =
                        "/dashboards/professionalDashboard.html";

                } else {

                    window.location.href =
                        "/dashboards/todoDashboard.html";
                }

            }, 1500);

        } else {

            showToast(
                data.message,
                "error"
            );
        }

    } catch (error) {

        console.log(error);

        showToast(
            "Login Failed",
            "error"
        );
    }
});