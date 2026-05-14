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



let currentFilter = "all";

let currentSort = "newest";

/* GET TASKS */
function renderSkeletons() {

    const taskFeed =
        document.getElementById(
            "taskFeed"
        );

    taskFeed.innerHTML = "";

    for (let i = 0; i < 6; i++) {

        taskFeed.innerHTML += `

            <div Class="skeleton-card">

                <div Class="skeleton skeleton-title"></div>

                <div Class="skeleton skeleton-text"></div>

                <div Class="skeleton skeleton-text short"></div>

                <div Class="skeleton skeleton-btn"></div>

            </div>
        `;
    }
}

async function getTasks() {

    renderSkeletons();

    try {

        const response =
            await fetch(

                "https://onest-higgs-project.onrender.com/api/task/list",

                {
                    
                    headers: {

                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

        const tasks =
            await response.json();

        allTasks = tasks;

        applyFilters();

    } catch (error) {

        console.log(error);

        showToast(
            "Failed to fetch tasks",
            "error"
        );
    }
}

function getTimeRemaining(dueDate) {

    if (!dueDate) {

        return "No due date";
    }

    const now =
        new Date();

    const due =
        new Date(dueDate);

    const difference =
        due - now;

    if (difference <= 0) {

        return "Overdue";
    }

    const days =
        Math.floor(
            difference /
            (1000 * 60 * 60 * 24)
        );

    const hours =
        Math.floor(
            (difference /
                (1000 * 60 * 60))
            % 24
        );

    const minutes =
        Math.floor(
            (difference /
                (1000 * 60))
            % 60
        );

    if (days > 0) {

        return `${days}d ${hours}h left`;
    }

    if (hours > 0) {

        return `${hours}h ${minutes}m left`;
    }

    return `${minutes}m left`;
}
/* RENDER */

function renderTasks(tasks) {

    const pendingFeed =
        document.getElementById(
            "pendingFeed"
        );

    const completedFeed =
        document.getElementById(
            "completedFeed"
        );

    const overdueFeed =
        document.getElementById(
            "overdueFeed"
        );

    pendingFeed.innerHTML = "";
    completedFeed.innerHTML = "";
    overdueFeed.innerHTML = "";

    if (tasks.length === 0) {

        pendingFeed.innerHTML = `
            <p className=ty-text>
                No tasks found
            </p>
        `;

        return;
    }

    tasks.forEach(task => {

        const card = `

            <div class="task-card
            ${task.status === "completed"
                ? "completed-task"
                : ""}

            ${task.status === "overdue"
                ? "overdue-task"
                : ""}
            "

            draggable="true"
            data-id="${task._id}">

                <span Class="status-badge ${task.status}">
                    ${task.status}
                </span>

                <div Class="task-top">

                    <h3>
                        ${task.task}
                    </h3>

                    <span Class="priority ${task.priority}">
                        ${task.priority}
                    </span>

                </div>

                <p Class="task-description">

                    ${task.description || "No description"}

                </p>

                <p Class="due-text
                ${getTimeRemaining(task.dueDate)
                .includes("Overdue")
                ? "due-overdue"
                : ""}

                ${getTimeRemaining(task.dueDate)
                .includes("m left")
                ? "due-urgent"
                : ""}
                ">

                    ⏳ ${getTimeRemaining(task.dueDate)}

                </p>

                <div Class="task-bottom">

                    <div Class="task-actions">

                        ${task.status !== "completed"
                        ? `
                        <button
                        Class="complete-btn"
                        onclick="completeTask('${task._id}')">
                        Complete
                        </button>
                        `
                        : ""
                        }

                        <button
                            Class="edit-btn"
                            onclick="openEditTask('${task._id}')">
                            Edit
                        </button>

                        <button
                            Class=""delete-btn
                            onclick="deleteTask('${task._id}')">
                            Delete
                        </button>

                    </div>

                </div>

            </div>
        `;

        if (task.status === "completed") {

            completedFeed.innerHTML += card;

        } else if (task.status === "overdue") {

            overdueFeed.innerHTML += card;

        } else {

            pendingFeed.innerHTML += card;
        }
    });

    initializeDragAndDrop();
    initializeDragSystem();
}

const searchInput =
    document.getElementById(
        "searchInput"
    );

const filterButtons =
    document.querySelectorAll(
        ".filter-btn"
    );

filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            document
                .querySelector(".active-filter")
                ?.classList.remove(
                    "active-filter"
                );

            button.classList.add(
                "active-filter"
            );

            currentFilter =
                button.dataset.filter;

            applyFilters();
        }
    );
});

searchInput.addEventListener(
    "input",
    applyFilters
);

function applyFilters() {

    let filteredTasks =
        [...allTasks];

    // SEARCH
    const searchValue =
        searchInput.value
            .toLowerCase()
            .trim();

    if (searchValue) {

        filteredTasks =
            filteredTasks.filter(task =>

                task.task
                    .toLowerCase()
                    .includes(searchValue)

                ||

                (task.description || "")
                    .toLowerCase()
                    .includes(searchValue)
            );
    }

    // STATUS FILTER
    if (currentFilter !== "all") {

        filteredTasks =
            filteredTasks.filter(task =>

                task.status === currentFilter
            );
    }

    // SORTING
    if (currentSort === "newest") {

        filteredTasks.sort((a, b) =>

            new Date(b.createdAt)
            -
            new Date(a.createdAt)
        );
    }

    if (currentSort === "oldest") {

        filteredTasks.sort((a, b) =>

            new Date(a.createdAt)
            -
            new Date(b.createdAt)
        );
    }

    renderTasks(filteredTasks);
}

function initializeDragSystem() {

    const taskCards =
        document.querySelectorAll(
            ".task-card"
        );

    taskCards.forEach(card => {

        card.addEventListener(
            "dragstart",
            () => {

                card.classList.add(
                    "dragging"
                );
            }
        );

        card.addEventListener(
            "dragend",
            () => {

                card.classList.remove(
                    "dragging"
                );
            }
        );
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

                const selectedDate =
                    new Date(dueDate);

                const now =
                    new Date();

                if (selectedDate < now) {

                    showToast(
                        "Due date cannot be in the past",
                        "error"
                    );

                    return;
                }

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

searchInput.addEventListener(
    "input",
    applyFilters
);

function initializeDragAndDrop() {

    const cards =
        document.querySelectorAll(
            ".task-card"
        );

    const columns =
        document.querySelectorAll(
            ".task-column"
        );

    cards.forEach(card => {

        card.addEventListener(
            "dragstart",
            () => {

                card.classList.add(
                    "dragging"
                );
            }
        );

        card.addEventListener(
            "dragend",
            () => {

                card.classList.remove(
                    "dragging"
                );
            }
        );
    });

    columns.forEach(column => {

        column.addEventListener(
            "dragover",
            (e) => {

                e.preventDefault();
            }
        );

        column.addEventListener(
            "drop",
            async () => {

                const card =
                    document.querySelector(
                        ".dragging"
                    );

                const taskId =
                    card.dataset.id;

                const newStatus =
                    column.dataset.status;

                try {

                    await fetch(

                        `https://onest-higgs-project.onrender.com/api/task/update/${taskId}`,

                        {
                            method: "PUT",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${token}`,
                            },

                            body: JSON.stringify({

                                status: newStatus
                            }),
                        }
                    );

                    getTasks();

                    showToast(
                        "Task moved",
                        "success"
                    );

                } catch (error) {

                    showToast(
                        "Drag update failed",
                        "error"
                    );
                }
            }
        );
    });
}

setInterval(() => {

    applyFilters();

}, 60000);

getTasks();