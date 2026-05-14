const token =
    localStorage.getItem("token");

const developmentMode = false; // Set to false in production

if (!token && !developmentMode) {

    window.location.href =
        "/authPages/loginPage.html";
}

const user =
    JSON.parse(
        localStorage.getItem("user")
    );

document.getElementById(
    "profileName"
).textContent =
    user.name;

document.getElementById(
    "profileEmail"
).textContent =
    user.email;

document.getElementById(
    "systemType"
).textContent =
    user.systemType;

document.getElementById(
    "diaryId"
).textContent =
    user.DiaryId;

document.querySelector(
    ".profile-avatar"
).textContent =
    user.name.charAt(0);

document
    .getElementById("backBtn")
    .addEventListener(
        "click",
        () => {

            const systemType =
                user.systemType;

            if (systemType === "personal") {

                window.location.href =
                    "/dashboard/personalDashboard.html";

            } else if (
                systemType === "professional"
            ) {

                window.location.href =
                    "/dashboard/professionalDashboard.html";

            } else if (
                systemType === "todo-List"
            ) {

                window.location.href =
                    "/dashboard/todoDashboard.html";
            }
        }
    );

const editProfileModal =
    document.getElementById(
        "editProfileModal"
    );

document
    .getElementById(
        "openEditProfileBtn"
    )
    .addEventListener(
        "click",
        () => {

            document.getElementById(
                "editProfileName"
            ).value =
                user.name;

            document.getElementById(
                "editProfileEmail"
            ).value =
                user.email;

            editProfileModal
                .classList.add(
                    "active"
                );
        }
    );

document
    .getElementById(
        "closeProfileModal"
    )
    .addEventListener(
        "click",
        () => {

            editProfileModal
                .classList.remove(
                    "active"
                );
        }
    );

document
    .getElementById(
        "editProfileForm"
    )
    .addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            const name =
                document.getElementById(
                    "editProfileName"
                ).value;

            const email =
                document.getElementById(
                    "editProfileEmail"
                ).value;

            try {

                const response =
                    await fetch(

                        "https://onest-higgs-project.onrender.com/api/user/profile/update",

                        {
                            method: "PUT",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${token}`,
                            },

                            body: JSON.stringify({
                                name,
                                email
                            }),
                        }
                    );

                const data =
                    await response.json();

                if (response.ok) {

                    localStorage.setItem(
                        "user",
                        JSON.stringify(
                            data.user
                        )
                    );

                    showToast(
                        "Profile updated",
                        "success"
                    );

                    location.reload();

                } else {

                    showToast(
                        data.message,
                        "error"
                    );
                }

            } catch (error) {

                showToast(
                    "Update failed",
                    "error"
                );
            }
        }
    );

const currentPage =
    window.location.pathname;

const navItems =
    document.querySelectorAll(
        ".nav-item"
    );

navItems.forEach(item => {

    const href =
        item.getAttribute("href");

    if (
        currentPage.includes(href)
    ) {

        item.classList.add(
            "active"
        );
    }
});

const menuToggle =
    document.getElementById(
        "menuToggle"
    );

const sidebar =
    document.querySelector(
        ".sidebar"
    );

menuToggle.addEventListener(
    "click",
    () => {

        sidebar.classList.toggle(
            "active"
        );
    }
);

const themeToggle =
    document.getElementById(
        "themeToggle"
    );

const savedTheme =
    localStorage.getItem(
        "theme"
    );

if (savedTheme === "light") {

    document.body.classList.add(
        "light-mode"
    );

    themeToggle.textContent =
        "☀️ Light Mode";
}

themeToggle.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "light-mode"
        );

        const isLight =
            document.body.classList.contains(
                "light-mode"
            );

        localStorage.setItem(
            "theme",
            isLight
                ? "light"
                : "dark"
        );

        themeToggle.textContent =
            isLight
                ? "☀️ Light Mode"
                : "🌙 Dark Mode";
    }
);