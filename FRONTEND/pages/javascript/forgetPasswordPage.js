function showToast(message, type) {

    const toast = document.getElementById("toast");

    toast.textContent = message;

    toast.className = `show ${type}`;

    setTimeout(() => {

        toast.className="";

    }, 3000);
}

const forgotPasswordForm =
    document.getElementById("forgotPasswordForm");

forgotPasswordForm.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        const email =
            document.getElementById("email").value;

        const newPassword =
            document.getElementById("newPassword").value;

        const confirmNewPassword =
            document.getElementById(
                "confirmNewPassword"
            ).value;

        try {

            const response = await fetch(
                "https://onest-higgs-project.onrender.com/api/auth/reset-password",
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        email,
                        newPassword,
                        confirmNewPassword,
                    }),
                }
            );

            const data = await response.json();

            if (response.ok) {

                showToast(
                    data.message,
                    "success"
                );

                setTimeout(() => {

                    window.location.href =
                        "/authPages/loginPage.html";

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
                "Password Reset Failed",
                "error"
            );
        }
    }
);