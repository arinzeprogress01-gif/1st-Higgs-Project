const token = localStorage.getItem("token");

const developmentMode = false; // Set to false in production
if (!token && !developmentMode) {

    window.location.href =
        "/authPages/loginPage.html";
}

function showToast(message, type) {

    const toast =
        document.getElementById("toast");

    toast.textContent = message;

    toast.className =
        `show ${type}`;

    setTimeout(() => {

        toast.className="";

    }, 3000);
};

let allTasks = [];
let currentEditTaskId = null;
let currentDeleteTaskId = null;

const user =
    JSON.parse(localStorage.getItem("user"));

const welcomeText =
    document.getElementById("welcomeText");

welcomeText.innerHTML =
    `Welcome Back, ${user.name} 👋`;

const taskFeed =
    document.getElementById(
        "taskFeed"
    );

async function getTasks() {

    try {

        const response = await fetch(
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

        console.log(tasks);

        if (!Array.isArray(tasks)) {

            showToast(
                "Failed to fetch tasks",
                "error"
            );

            return;
        };

        allTasks = tasks;

        renderTasks(tasks);

        updateStats(tasks);

    } catch (error) {

        console.log(error);

        showToast(
            "Failed to fetch tasks",
            "error"
        );
    }
};

function getDueStatus(dueDate) {

    if (!dueDate)
        return "No due date";

    const now =
        new Date();

    const due =
        new Date(dueDate);

    const diff =
        due.getTime() - now.getTime();

    if (diff <= 0) {

        return "Overdue";
    }

    const minutes =
        Math.floor(diff / (1000 * 60));

    const hours =
        Math.floor(diff / (1000 * 60 * 60));

    const days =
        Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) {

        return `Due in ${days} day(s)`;
    }

    if (hours > 0) {

        return `Due in ${hours} hour(s)`;
    }

    return `Due in ${minutes} minute(s)`;
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

function renderTasks(tasks) {

    const taskFeed =
        document.getElementById("taskFeed");

    taskFeed.innerHTML = "";

    if (tasks.length === 0) {

        taskFeed.innerHTML = `
    
        <p Class="empty-text">
            No tasks found
        </p>
    `;

        return;
    }

    tasks.forEach((task) => {

        taskFeed.innerHTML += `

            <div Class="task-card
            ${task.status === "completed"
                            ? "completed-task"
                            : ""}

            ${task.status === "overdue"
                            ? "overdue-task"
                            : ""}
            "
            draggable="true"
            data-id="${task._id}"
            >

            <span Class="status-badge
            ${task.status}">
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

                <p Class="due-status">
                    ${getDueStatus(task.dueDate)}
                </p>

                <div Class="task-bottom">

                    <span>
                        ${task.age || "No age"}
                    </span>

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
                            onclick="openEditModal('${task._id}')"
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

    initializeDragAndDrop();
}



function initializeDragAndDrop() {

    const taskCards =
        document.querySelectorAll(
            ".task-card"
        );

    const taskFeed =
        document.getElementById(
            "taskFeed"
        );

    let draggedCard = null;

    taskCards.forEach(card => {

        card.addEventListener(
            "dragstart",
            () => {

                draggedCard = card;

                card.classList.add(
                    "dragging"
                );
            }
        );

        card.addEventListener(
            "dragend",
            () => {

                draggedCard = null;

                card.classList.remove(
                    "dragging"
                );
            }
        );
    });
}
taskFeed.addEventListener(
        "dragover",
        (e) => {

            e.preventDefault();

            const afterElement =
                getDragAfterElement(
                    taskFeed,
                    e.clientY
                );

            if (!afterElement) {

                taskFeed.appendChild(
                    draggedCard
                );

            } else {

                taskFeed.insertBefore(
                    draggedCard,
                    afterElement
                );
            }
        }
    );

function getDragAfterElement(
    container,
    y
) {

    const draggableElements =
        [
            ...container.querySelectorAll(
                ".task-card:not(.dragging)"
            )
        ];

    return draggableElements.reduce(

        (closest, child) => {

            const box =
                child.getBoundingClientRect();

            const offset =
                y - box.top - box.height / 2;

            if (
                offset < 0
                &&
                offset > closest.offset
            ) {

                return {
                    offset,
                    element: child
                };
            }

            return closest;

        },

        {
            offset: Number.NEGATIVE_INFINITY
        }

    ).element;
}

function openEditModal(id) {

    const task =
        allTasks.find(
            task => task._id === id
        );

    currentEditTaskId = id;

    document.getElementById(
        "editTask"
    ).value =
        task.task;

    document.getElementById(
        "editDescription"
    ).value =
        task.description;

    document.getElementById(
        "editPriority"
    ).value =
        task.priority;

    if (task.dueDate) {

        const formattedDate =
            new Date(task.dueDate)
                .toISOString()
                .slice(0, 16);

        document.getElementById(
            "editDueDate"
        ).value =
            formattedDate;
    }

    document
        .getElementById("editTaskModal")
        .classList.add("active");
};

document
    .getElementById("closeEditModal")
    .addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "editTaskModal"
                )
                .classList.remove("active");
        }
    );

function filterTasks(status) {

    if (status === "all") {

        renderTasks(allTasks);

        return;
    }

    const filteredTasks =
        allTasks.filter(task =>
            task.status === status
        );

    renderTasks(filteredTasks);
}

const searchInput =
    document.getElementById("searchInput");

searchInput.addEventListener(
    "input",
    () => {

        const value =
            searchInput.value
                .toLowerCase();

        const filteredTasks =
            allTasks.filter(task =>

                task.task
                    .toLowerCase()
                    .includes(value)

                ||

                (task.description || "")
                    .toLowerCase()
                    .includes(value)
            );

        renderTasks(filteredTasks);
    }
);

getTasks();

const filterButtons =
    document.querySelectorAll(".filter-btn");

filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            document
                .querySelector(".active-filter")
                .classList
                .remove("active-filter");

            button.classList.add(
                "active-filter"
            );

            const filter =
                button.dataset.filter;

            filterTasks(filter);
        }
    );
});

const taskModal =
    document.getElementById("taskModal");

const openModalBtn =
    document.getElementById(
        "openModalBtn"
    );

if (openModalBtn) {

    openModalBtn.addEventListener(

        "click",

        () => {

            taskModal.classList.add(
                "active"
            );
        }
    );
}

const closeModalBtn =
    document.getElementById("closeModalBtn");

if (closeModalBtn) {

    closeModalBtn.addEventListener(
        "click",
        () => {
            taskModal.classList.remove(
                "active"
            );
        }

    );
}

const taskForm =
    document.getElementById("taskForm");

taskForm.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        const task =
            document.getElementById("task").value;

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

            const response = await fetch(
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
                        dueDate,
                    }),
                }
            );

            const data =
                await response.json();

            showToast(
                "Task created successfully",
                "success"
            );

            if (response.ok) {

                taskModal.classList.remove(
                    "active"
                );

                taskForm.reset();

                getTasks();
            } else {

                showToast(data.message, "error");
            }

        } catch (error) {

            showToast("Failed to create task.", "error");
        }
    }
);

const editTaskForm =
    document.getElementById(
        "editTaskForm"
    );

editTaskForm.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        const task =
            document.getElementById(
                "editTask"
            ).value;

        const description =
            document.getElementById(
                "editDescription"
            ).value;

        const priority =
            document.getElementById(
                "editPriority"
            ).value;

        const dueDate =
            document.getElementById(
                "editDueDate"
            ).value;

        try {

            const response =
                await fetch(

                    `https://onest-higgs-project.onrender.com/api/task/update/${currentEditTaskId}`,

                    {
                        method: "PUT",

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
                            dueDate,
                        }),
                    }
                );

            const data =
                await response.json();

            if (response.ok) {

                document
                    .getElementById(
                        "editTaskModal"
                    )
                    .classList.remove(
                        "active"
                    );

                showToast(
                    "Task updated successfully",
                    "success"
                );

                getTasks();

            } else {

                showToast(
                    data.message,
                    "error"
                );
            }

        } catch (error) {

            showToast(
                "Failed to update task",
                "error"
            );
        }
    }
);

function updateStats(tasks) {

    const total =
        tasks.length;

    const completed =
        tasks.filter(
            task =>
                task.status === "completed"
        ).length;

    const pending =
        tasks.filter(
            task =>
                task.status === "pending"
        ).length;

    const overdue =
        tasks.filter(
            task =>
                task.status === "overdue"
        ).length;

    document.getElementById(
        "totalTasks"
    ).textContent = total;

    document.getElementById(
        "completedTasks"
    ).textContent = completed;

    document.getElementById(
        "pendingTasks"
    ).textContent = pending;

    document.getElementById(
        "overdueTasks"
    ).textContent = overdue;

    const completionRate =
        total > 0

            ?

            Math.round(
                (completed / total) * 100
            )

            :

            0;

    document.getElementById(
        "completionRate"
    ).textContent =
        `${completionRate}%`;

    const productivityScore =
        (completed * 5)
        -
        (overdue * 3);

    document.getElementById(
        "productivityScore"
    ).textContent =
        productivityScore;
}

async function completeTask(id) {

    try {

        const response = await fetch(
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
                    status: "completed",
                }),
            }
        );

        const data =
            await response.json();

        showToast(
            "Task updated successfully",
            "success"
        );


        if (response.ok) {

            getTasks();

        } else {

            showToast(data.message, "error");
        }

    } catch (error) {

        showToast("Failed to update task.", "error");
    }
}

function deleteTask(id) {

    currentDeleteTaskId = id;

    document
        .getElementById("deleteModal")
        .classList.add("active");
}

document
    .getElementById("cancelDeleteBtn")
    .addEventListener(
        "click",
        () => {

            document
                .getElementById("deleteModal")
                .classList.remove("active");
        }
    );

document
    .getElementById("confirmDeleteBtn")
    .addEventListener(
        "click",
        async () => {

            try {

                const response =
                    await fetch(

                        `https://onest-higgs-project.onrender.com/api/task/delete/${currentDeleteTaskId}`,

                        {
                            method: "DELETE",

                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }
                    );

                const data =
                    await response.json();

                if (response.ok) {

                    document
                        .getElementById(
                            "deleteModal"
                        )
                        .classList.remove(
                            "active"
                        );

                    showToast(
                        "Task deleted successfully",
                        "success"
                    );

                    getTasks();

                } else {

                    showToast(
                        data.message,
                        "error"
                    );
                }

            } catch (error) {

                showToast(
                    "Failed to delete task",
                    "error"
                );
            }
        }
    );

document
    .getElementById("tasksBtn")
    .addEventListener(
        "click",
        () => {

            renderTasks(allTasks);

            document
                .querySelectorAll(".nav-item")
                .forEach(item =>
                    item.classList.remove("active")
                );

            document
                .getElementById("tasksBtn")
                .classList.add("active");
        }
    );

document
    .getElementById("completedBtn")
    .addEventListener(
        "click",
        () => {

            const completedTasks =
                allTasks.filter(task =>
                    task.status === "completed"
                );

            renderTasks(completedTasks);

            document
                .querySelectorAll(".nav-item")
                .forEach(item =>
                    item.classList.remove("active")
                );

            document
                .getElementById("completedBtn")
                .classList.add("active");
        }
    );

document
    .getElementById("overdueBtn")
    .addEventListener(
        "click",
        () => {

            const overdueTasks =
                allTasks.filter(task =>
                    task.status === "overdue"
                );

            renderTasks(overdueTasks);

            document
                .querySelectorAll(".nav-item")
                .forEach(item =>
                    item.classList.remove("active")
                );

            document
                .getElementById("overdueBtn")
                .classList.add("active");
        }
    );

document
    .getElementById("profileBtn")
    .addEventListener(
        "click",
        () => {

            window.location.href =
                "/dashboard/profilePage.html";
        }
    );

document
    .getElementById("logoutBtn")
    .addEventListener(
        "click",
        () => {

            localStorage.removeItem("token");

            localStorage.removeItem("user");

            showToast(
                "Logged out successfully",
                "success"
            );

            setTimeout(() => {

                window.location.href =
                    "/authPages/loginPage.html";

            }, 1000);
        }
    );

const currentPage =
    window.location.pathname;

const navItems =
    document.querySelectorAll(
        ".nav-item"
    );

navItems.forEach(item => {

    const page =
        item.dataset.page;

    if (
        currentPage.includes(
            page
        )
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

setInterval(() => {

    applyFilters();

}, 60000);

