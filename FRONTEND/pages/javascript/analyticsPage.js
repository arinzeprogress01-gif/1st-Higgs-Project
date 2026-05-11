const token =
    localStorage.getItem("token");

const developmentMode = false; // Set to false in production


if (!token && !developmentMode) {

    window.location.href =
        "../authPages/loginPage.html";
}

async function loadAnalytics() {

    try {

        const response =
            await fetch(

                "https://onest-higgs-project.onrender.com/api/task/list",

                {

                    method: "GET",
                    headers: {

                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

        const tasks =
            await response.json();

        updateAnalytics(tasks);

    } catch (error) {

        console.log(error);
    }
}

function updateAnalytics(tasks) {

    const total =
        tasks.length;

    const completed =
        tasks.filter(task =>

            task.status ===
            "completed"
        ).length;

    const pending =
        tasks.filter(task =>

            task.status ===
            "pending"
        ).length;

    const overdue =
        tasks.filter(task =>

            task.status ===
            "overdue"
        ).length;

    document.getElementById(
        "totalTasks"
    ).textContent =
        total;

    document.getElementById(
        "completedTasks"
    ).textContent =
        completed;

    document.getElementById(
        "pendingTasks"
    ).textContent =
        pending;

    document.getElementById(
        "overdueTasks"
    ).textContent =
        overdue;

    const productivityScore =

        total === 0
            ? 0
            :
            Math.floor(
                (completed / total) * 100
            );

    document.getElementById(
        "productivityText"
    ).textContent =

        `${productivityScore}% Productivity`;

    document.getElementById(
        "progressFill"
    ).style.width =

        `${productivityScore}%`;
}

/* LOGOUT */

document
    .getElementById(
        "logoutBtn"
    )
    .addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );

            window.location.href =
                "../authPages/loginPage.html";
        }
    );

loadAnalytics();