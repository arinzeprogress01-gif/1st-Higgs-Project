const token =
    localStorage.getItem("token");

const developmentMode = false; // Set to false in production

if (!token && !developmentMode) {

    window.location.href =
        "/authPages/loginPage.html";
}

const overdueTaskFeed =
    document.getElementById(
        "overdueTaskFeed"
    );

async function getOverdueTasks() {

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

        const overdueTasks =
            tasks.filter(task =>

                task.status ===
                "overdue"
            );

        renderOverdueTasks(
            overdueTasks
        );

    } catch (error) {

        console.log(error);
    }
}

function renderOverdueTasks(tasks) {

    if (tasks.length === 0) {

        overdueTaskFeed.innerHTML = `

            <p Class="empty-text">
                No overdue tasks
            </p>
        `;

        return;
    }

    overdueTaskFeed.innerHTML = "";

    tasks.forEach(task => {

        overdueTaskFeed.innerHTML += `

            <div Class="task-card">

                <div Class="task-top">

                    <h3>
                        ${task.task}
                    </h3>

                    <span Class="priority overdue">

                        overdue

                    </span>

                </div>

                <p Class="task-description">

                    ${task.description || "No description"}

                </p>

                <p Class="due-warning">

                    Task deadline exceeded

                </p>

            </div>
        `;
    });
}

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

getOverdueTasks();