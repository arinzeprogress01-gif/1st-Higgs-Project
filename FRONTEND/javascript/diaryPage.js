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
    "diaryOwner"
).textContent =
    `${user.name}'s Journal`;

function showToast(message, type) {

    const toast =
        document.getElementById("toast");

    toast.textContent = message;

    toast.className =
        `show ${type}`;

    setTimeout(() => {

        toast.className="";

    }, 3000);
}

const diaryFeed =
    document.getElementById(
        "diaryFeed"
    );

function getDiaryEntries() {

    const entries =
        JSON.parse( 
            localStorage.getItem(
                `diary-${user.DiaryId}`
            )
        ) || [];

    renderDiary(entries);
}

function renderDiary(entries) {

    diaryFeed.innerHTML = "";

    entries.reverse().forEach(entry => {

        diaryFeed.innerHTML += `

            <div Class="diary-entry">

                <p>
                    ${entry.text}
                </p>

                <div Class="diary-date">
                    ${entry.date}
                </div>

            </div>
        `;
    });
}

document
    .getElementById("saveDiaryBtn")
    .addEventListener(
        "click",
        () => {

            const text =
                document
                    .getElementById(
                        "diaryText"
                    )
                    .value;

            if (!text) {

                showToast(
                    "Diary entry cannot be empty",
                    "error"
                );

                return;
            }

            const entries =
                JSON.parse(
                    localStorage.getItem(
                        `diary-${user.DiaryId}`
                    )
                ) || [];

            entries.push({

                text,

                date:
                    new Date()
                        .toLocaleString(),
            });

            localStorage.setItem(
                `diary-${user.DiaryId}`,
                JSON.stringify(entries)
            );

            document
                .getElementById(
                    "diaryText"
                )
                .value = "";

            showToast(
                "Diary saved",
                "success"
            );

            getDiaryEntries();
        }
    );

document
    .getElementById("backBtn")
    .addEventListener(
        "click",
        () => {

            const systemType =
                user.systemType;

            if (
                systemType === "personal"
            ) {

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

getDiaryEntries();

document
    .getElementById("backBtn")
    .addEventListener(
        "click",
        () => {

            window.location.href =
                "/dashboard/personalDashboard.html";
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