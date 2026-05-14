const token =
    localStorage.getItem("token");

const developmentMode = false; // Set to false in production

if (!token && !developmentMode) {

    window.location.href =
        "/authPages/loginPage.html";
}

const completedTaskFeed =
    document.getElementById(
        "completedTaskFeed"
    );

async function getCompletedTasks() {

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

        const completedTasks =
            tasks.filter(task =>

                task.status ===
                "completed"
            );

        renderCompletedTasks(
            completedTasks
        );

    } catch (error) {

        console.log(error);
    }
}

function renderCompletedTasks(tasks) {

    if (tasks.length === 0) {

        completedTaskFeed.innerHTML = `

            <p Class="empty-text">
                No completed tasks yet
            </p>
        `;

        return;
    }

    completedTaskFeed.innerHTML = "";

    tasks.forEach(task => {

        completedTaskFeed.innerHTML += `

            <div Class="task-card">

                <div Class="task-top">

                    <h3>
                        ${task.task}
                    </h3>

                    <span Class="priority completed">

                        completed

                    </span>

                </div>

                <p Class="task-description">

                    ${task.description || "No description"}

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
getCompletedTasks();