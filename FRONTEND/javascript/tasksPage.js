const token =
    localStorage.getItem("token");

const developmentMode = false; // Set to false in production

if (!token && !developmentMode) {

    window.location.href =
        "/authPages/loginPage.html";
}

let allTasks = [];

function showToast(message, type) {

    const toast =
        document.getElementById(
            "toast"
        );

    toast.textContent =
        message;

    toast.className =
        `show ${type}`;

    setTimeout(() => {

        toast.className="";

    }, 3000);
}

/* GET TASKS */

async function getTasks() {

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

        allTasks = tasks;

        renderTasks(tasks);

    } catch (error) {

        console.log(error);

        showToast(
            "Failed to fetch tasks",
            "error"
        );
    }
}

/* RENDER */

function renderTasks(tasks) {

    const taskFeed =
        document.getElementById(
            "taskFeed"
        );

    taskFeed.innerHTML = "";

    if (tasks.length === 0) {

        taskFeed.innerHTML = `

            <p Class="empty-text">
                No tasks found
            </p>
        `;

        return;
    }

    tasks.forEach(task => {

        taskFeed.innerHTML += `

            <div
                Class="task-card"
            >

                <div Class="task-top">

                    <h3>
                        ${task.task}
                    </h3>

                    <span
                        Class="priority ${task.priority}"
                    >
                        ${task.priority}
                    </span>

                </div>

                <p Class="task-description">

                    ${task.description || "No description"}

                </p>

                <div Class="task-bottom">

                    <div Class="task-actions">

                        <button
                            Class="complete-btn"
                            onclick="completeTask('${task._id}')"
                        >
                            Complete
                        </button>

                        <button
                            Class="edit-btn"
                            onclick="openEditTask('${task._id}')"
                        >
                            Edit
                        </button>

                        <button
                            Class="delete-btn"
                            onclick="deleteTask('${task._id}')"
                        >
                            Delete
                        </button>

                    </div>

                </div>

            </div>
        `;
    });
}

/* CREATE TASK */

const taskModal =
    document.getElementById(
        "taskModal"
    );

document
    .getElementById(
        "openModalBtn"
    )
    .addEventListener(
        "click",
        () => {

            taskModal.classList.add(
                "active"
            );
        }
    );

document
    .getElementById(
        "closeModalBtn"
    )
    .addEventListener(
        "click",
        () => {

            taskModal.classList.remove(
                "active"
            );
        }
    );

document
    .getElementById(
        "taskForm"
    )
    .addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            const task =
                document.getElementById(
                    "task"
                ).value;

            const description =
                document.getElementById(
                    "description"
                ).value;

            const priority =
                document.getElementById(
                    "priority"
                ).value;

            const dueDate =
                document.getElementById(
                    "dueDate"
                ).value;

            try {

                const response =
                    await fetch(

                        "https://onest-higgs-project.onrender.com/api/task/create",

                        {
                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${token}`,
                            },

                            body: JSON.stringify({

                                task,
                                description,
                                priority,
                                dueDate
                            }),
                        }
                    );

                const data =
                    await response.json();

                if (response.ok) {

                    showToast(
                        "Task created",
                        "success"
                    );

                    taskModal.classList.remove(
                        "active"
                    );

                    document
                        .getElementById(
                            "taskForm"
                        )
                        .reset();

                    getTasks();

                } else {

                    showToast(
                        data.message,
                        "error"
                    );
                }

            } catch (error) {

                showToast(
                    "Task creation failed",
                    "error"
                );
            }
        }
    );

/* COMPLETE TASK */

async function completeTask(id) {

    try {

        const response =
            await fetch(

                `https://onest-higgs-project.onrender.com/api/task/update/${id}`,

                {
                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`,
                    },

                    body: JSON.stringify({

                        status:
                            "completed"
                    }),
                }
            );

        if (response.ok) {

            showToast(
                "Task completed",
                "success"
            );

            getTasks();
        }

    } catch (error) {

        showToast(
            "Update failed",
            "error"
        );
    }
}

/* DELETE TASK */

async function deleteTask(id) {

    const confirmDelete =
        confirm(
            "Delete this task?"
        );

    if (!confirmDelete)
        return;

    try {

        const response =
            await fetch(

                `https://onest-higgs-project.onrender.com/api/task/delete/${id}`,

                {
                    method: "DELETE",

                    headers: {

                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

        if (response.ok) {

            showToast(
                "Task deleted",
                "success"
            );

            getTasks();
        }

    } catch (error) {

        showToast(
            "Delete failed",
            "error"
        );
    }
}

/* SEARCH */

document
    .getElementById(
        "searchInput"
    )
    .addEventListener(
        "input",
        (e) => {

            const value =
                e.target.value
                    .toLowerCase();

            const filtered =
                allTasks.filter(task =>

                    task.task
                        .toLowerCase()
                        .includes(value)

                    ||

                    task.description
                        .toLowerCase()
                        .includes(value)
                );

            renderTasks(filtered);
        }
    );

/* FILTERS */

const filterButtons =
    document.querySelectorAll(
        ".filter-btn"
    );

filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            document
                .querySelector(
                    ".active-filter"
                )
                .classList.remove(
                    "active-filter"
                );

            button.classList.add(
                "active-filter"
            );

            const filter =
                button.dataset.filter;

            if (filter === "all") {

                renderTasks(allTasks);

                return;
            }

            const filteredTasks =
                allTasks.filter(task =>

                    task.status ===
                    filter
                );

            renderTasks(filteredTasks);
        }
    );
});

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
                "/authPages/loginPage.html";
        }
    );

getTasks();