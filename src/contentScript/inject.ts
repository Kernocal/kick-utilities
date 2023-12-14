(() => {
    console.log("Kick Utilities: Injected script.");
    let time = 0;
    let flag = false;

    document.addEventListener("KICKY_GET_TIME", (e) => {
        time = (e as CustomEvent).detail;
    });

    const observer = new MutationObserver((changes) => {
        changes.forEach((change) => {
            change.addedNodes.forEach((added) => {
                if ((added as HTMLElement).querySelector && !flag) {
                    const video = (added as HTMLElement).querySelector("video.vjs-tech");
                    if (video) {
                        flag = true;
                        video.addEventListener("loadedmetadata", (e) => {
                            console.log("mutation: loadedmetadata");
                            console.log("mutation: sleep 4");
                            new Promise(resolve => setTimeout(resolve, 1000)).then(() => {
                                console.log("mutation: set time", time);
                                (video as HTMLVideoElement).currentTime = time - 5;
                            });
                            observer.disconnect();
                        })
                    }
                }
            });
        });
    });

    window.onload = () => {
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

})();
