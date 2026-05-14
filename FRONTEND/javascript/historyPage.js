const token =
    localStorage.getItem("token");

const developmentMode = false; // Set to false in production 

if (!token && !developmentMode) {

    window.location.href =
        "/authPages/loginPage.html";
}

const historyFeed =
    document.getElementById(
        "historyFeed"
    );

async function getTaskHistory() {

    try {

        const response =
            await fetch(

                "https://onest-higgs-project.onrender.com/api/task/history",

                {

                    method: "GET",
                    headers: {

                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

        const result =
            await response.json();

        const history =
            result.data;

        renderHistory(history);

    } catch (error) {

        console.log(error);
    }
}

function renderHistory(history) {

    const historyFeed =
        document.getElementById(
            "historyFeed"
        );

    historyFeed.innerHTML = "";

    history.forEach(item => {

        const taskTitle =

            item.changes?.task?.to

            ||

            item.changes?.task?.from

            ||

            "Unknown Task";

        historyFeed.innerHTML += `

            <div Class="history-card">

                <h3>
                    ${taskTitle}
                </h3>

                <p>
                    Action:
                    ${item.action}
                </p>

                <p>
                    ${new Date(
            item.performedAt
        ).toLocaleString()}
                </p>

            </div>
        `;
    });
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

getTaskHistory();