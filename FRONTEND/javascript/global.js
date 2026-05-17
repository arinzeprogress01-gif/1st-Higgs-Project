if ("serviceWorker" in navigator) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
                .register(
                    "/service-worker.js"
                )
                .then(() => {

                    console.log(
                        "PWA Ready"
                    );
                })
                .catch((error) => {

                    console.log(error);
                });
        }
    );
}
