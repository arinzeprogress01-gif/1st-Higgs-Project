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

    historyFeed.innerHTML = "";

    if (history.length === 0) {

        historyFeed.innerHTML = `

            <p>
                No history found
            </p>
        `;

        return;
    }

    history.forEach(item => {

        historyFeed.innerHTML += `

            <div Class="history-card">

                <div Class="history-title">

                    ${item.task}

                </div>

                <p>

                    ${item.description || "No description"}

                </p>

                <span
                    Class="history-status ${item.status}"
                >

                    ${item.status}

                </span>

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

getTaskHistory();