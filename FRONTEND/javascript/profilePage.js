const token =
    localStorage.getItem("token");

const developmentMode = false; // Set to false in production

if (!token && !developmentMode) {

    window.location.href =
        "/authPages/loginPage.html";
}
function showToast(message, type) {

    const toast = document.getElementById("toast");

    if (!toast) {
        console.warn("Toast element missing on this page");
        return;
    }

    toast.textContent = message;
    toast.className = `show ${type}`;

    setTimeout(() => {
        toast.className="";
    }, 3000);
}
/* ANIMATED COUNTERS */

function animateCounter(id, endValue) {

    const element =
        document.getElementById(id);

    let start = 0;

    const duration = 1000;

    const increment =
        endValue / (duration / 16);

    const counter =
        setInterval(() => {

            start += increment;

            if (start >= endValue) {

                element.textContent =
                    endValue;

                clearInterval(counter);

            } else {

                element.textContent =
                    Math.floor(start);
            }

        }, 16);
}


function renderSecurityLogs() {

    const securityLogFeed =
        document.getElementById(
            "securityLogFeed"
        );

    const logs =
        JSON.parse(
            localStorage.getItem(
                "securityLogs"
            )
        ) || [];

    securityLogFeed.innerHTML = "";

    if (logs.length === 0) {

        securityLogFeed.innerHTML = `

    < p >
    No security activity yet
            </p >
    `;

        return;
    }

    logs.forEach(log => {

        securityLogFeed.innerHTML += `

    < div Class = "security-log-item" >

                <div Class="security-log-action">

                    ${log.action}

                </div>

                <div Class="security-log-date">

                    ${log.date}

                </div>

            </div >
    `;
    });
}

/* =========================
   SECURITY LOG SYSTEM
========================= */

function addSecurityLog(action) {

    const logs =
        JSON.parse(
            localStorage.getItem(
                "securityLogs"
            )
        ) || [];

    logs.unshift({

        action,

        date:
            new Date()
                .toLocaleString()
    });

    
    if (logs.length > 20) {

        logs.pop();
    }



    localStorage.setItem(

        "securityLogs",

        JSON.stringify(logs)
    );
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

const profileAvatar =
    document.getElementById(
        "profileAvatar"
    );

const profileImageInput =
    document.getElementById(
        "profileImageInput"
    );

profileAvatar.addEventListener(
    "click",
    () => {

        profileImageInput.click();
    }
);

profileImageInput.addEventListener(
    "change",
    (e) => {

        const file =
            e.target.files[0];

        if (!file) return;

        const reader =
            new FileReader();

        reader.onload = () => {

            const imageData =
                reader.result;

            profileAvatar.src =
                imageData;

            localStorage.setItem(
                "profileImage",
                imageData
            );

            showToast(
                "Profile image updated",
                "success"
            );
        };

        reader.readAsDataURL(file);
    }
);

const savedProfileImage =
    localStorage.getItem(
        "profileImage"
    );

if (savedProfileImage) {

    profileAvatar.src =
        savedProfileImage;
}


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

async function loadProfileStats() {

    try {

        const response =
            await fetch(

                "https://onest-higgs-project.onrender.com/api/task/list",

                {
                    headers: {

                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

        const tasks =
            await response.json();

        const total =
            tasks.length;

        const completed =
            tasks.filter(task =>
                task.status === "completed"
            ).length;

        const overdue =
            tasks.filter(task =>
                task.status === "overdue"
            ).length;

        const pending =
            tasks.filter(task =>
                task.status === "pending"
            ).length;

       
       
        animateCounter(
            "totalTasks",
            total
        );

        animateCounter(
            "completedTasks",
            completed
        );

        animateCounter(
            "pendingTasks",
            pending
        );

        animateCounter(
            "overdueTasks",
            overdue
        );





        loadActivity(tasks);

    } catch (error) {

        console.log(error);
    }
}

function loadActivity(tasks) {

    const activityFeed =
        document.getElementById(
            "activityFeed"
        );

    activityFeed.innerHTML = "";

    const recentTasks =
        [...tasks]
            .sort(

                (a, b) =>

                    new Date(b.updatedAt)
                    -
                    new Date(a.updatedAt)
            )
            .slice(0, 5);

    recentTasks.forEach(task => {

        activityFeed.innerHTML += `

            <div Class="activity-item">

                Task:

                <strong>
                    ${task.task}
                </strong>

                was updated to

                <strong>
                    ${task.status}
                </strong>

            </div>
        `;
    });
}

loadProfileStats();

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

document
    .getElementById(
        "changePasswordForm"
    )
    .addEventListener(

        "submit",

        async (e) => {

            e.preventDefault();

            const currentPassword =
                document.getElementById(
                    "currentPassword"
                ).value;

            const newPassword =
                document.getElementById(
                    "newPassword"
                ).value;

            const confirmPassword =
                document.getElementById(
                    "confirmNewPassword"
                ).value;

            try {

                const response =
                    await fetch(

                        "https://onest-higgs-project.onrender.com/api/auth/change-password",

                        {
                            method: "PUT",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${token}`
                            },

                            body: JSON.stringify({

                                currentPassword,
                                newPassword,
                                confirmPassword
                            })
                        }
                    );

                const data =
                    await response.json();

                if (response.ok) {

                    showToast(
                        data.message,
                        "success"
                    );

                    document
                        .getElementById(
                            "changePasswordForm"
                        )
                        .reset();

                } else {

                    showToast(
                        data.message,
                        "error"
                    );
                }

            } catch (error) {

                showToast(
                    "Password update failed",
                    "error"
                );
            }
        }
    );

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

    themeToggle.textContent = "☀️ Light Mode";
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


/* =========================
   DELETE ACCOUNT SYSTEM
========================= */

const deleteAccountBtn =
    document.getElementById(
        "deleteAccountBtn"
    );

const deleteAccountModal =
    document.getElementById(
        "deleteAccountModal"
    );

const cancelDeleteBtn =
    document.getElementById(
        "cancelDeleteBtn"
    );

const confirmDeleteBtn =
    document.getElementById(
        "confirmDeleteBtn"
    );

/* OPEN MODAL */

deleteAccountBtn.addEventListener(
    "click",
    () => {

        deleteAccountModal.classList.add(
            "active"
        );
    }
);

/* CLOSE MODAL */

cancelDeleteBtn.addEventListener(
    "click",
    () => {

        deleteAccountModal.classList.remove(
            "active"
        );
    }
);

/* DELETE ACCOUNT */

confirmDeleteBtn.addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );

        localStorage.removeItem(
            "profileImage"
        );

        localStorage.removeItem(
            "theme"
        );

        localStorage.clear();

        showToast(
            "Account deleted",
            "success"
        );

        setTimeout(() => {

            window.location.href =
                "/authPages/signupPage.html";

        }, 1500);
    }
);


window.addEventListener(
    "load",
    () => {

        const pageLoader =
            document.getElementById(
                "pageLoader"
            );

        setTimeout(() => {

            pageLoader.classList.add(
                "hidden"
            );

        }, 800);
    }
);

renderSecurityLogs();

