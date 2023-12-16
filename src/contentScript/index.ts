// @ts-expect-error crxjs/vite? format
import main from './inject?script&module'

if (window.location.pathname.includes("video")) {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL(main);
    script.type = 'module';
    document.head.prepend(script);
}

async function getData(clipID: string, username: string) {
    const user = await fetch(`https://kick.com/api/v1/channels/${username}`);
    const userData = await user.json();
    const clip = await fetch(`https://kick.com/api/v2/clips/${clipID}`);
    const clipData = await clip.json();
    return {userData, clipData};
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "clip") {
        getData(request.clipID, request.username).then(({userData, clipData}) => {
            const stream = userData.previous_livestreams.find((stream: any) => stream.id === Number(clipData.clip.livestream_id));
            if (stream !== undefined) {
                const streamStarted = new Date(stream.start_time);
                const clipStarted = new Date(clipData.clip.started_at);
                // clipStart: clipEnd - clipData.clip.duration
                const clipEnd = Math.trunc((clipStarted.valueOf() - streamStarted.valueOf()) / 1000);
                const downloadButton = Array.from(document.querySelectorAll("div.inner-label")).find((ele) => ele.textContent === "Download")
                const vDataAttribute = downloadButton?.getAttributeNames().find((el) => el.startsWith("data-v"));
                const parentContainer = downloadButton?.closest(".flex.items-center");
                const vodHTML = `
                    <a ${vDataAttribute} class="variant-highlight size-md base-button" href="https://kick.com/video/${stream.video.uuid}?t=${clipEnd}"> 
                        <div ${vDataAttribute} class="button-content"> 
                            <div ${vDataAttribute} class="inner-label">Watch vod</div>
                        </div>
                    </a>`;
                if (parentContainer) {
                    parentContainer.insertAdjacentHTML("beforeend", vodHTML);
                }
            }
        });
        sendResponse({message: "clip"});
        return true;
    }
    if (request.message === "video") {
        document.dispatchEvent(new CustomEvent("KICKY_GET_TIME", {detail: request.time}));
        sendResponse({message: "video"});
        return true;
    };
});
