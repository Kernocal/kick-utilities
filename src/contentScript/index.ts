// @ts-expect-error crxjs/vite? format
import main from './inject?script&module';

if (window.location.pathname.includes('video')) {
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
    return { userData, clipData };
}

function createButton(userData: any, clipData: any) {
    const stream = userData.previous_livestreams.find((stream: any) => stream.id === Number(clipData.clip.livestream_id));
    if (stream !== undefined) {
        const streamStarted = new Date(stream.start_time);
        const clipStarted = new Date(clipData.clip.started_at);
        // clipStart: clipEnd - clipData.clip.duration
        const clipEnd = Math.trunc((clipStarted.valueOf() - streamStarted.valueOf()) / 1000);
        const downloadButton = Array.from(document.querySelectorAll('div.inner-label')).find(ele => ele.textContent === 'Download');
        const vDataAttribute = downloadButton?.getAttributeNames().find(el => el.startsWith('data-v'));
        const parentContainer = downloadButton?.closest('.flex.items-center');
        const vodHTML = `
            <a ${vDataAttribute} class="variant-highlight size-md base-button" href="https://kick.com/video/${stream.video.uuid}?t=${clipEnd}"> 
                <div ${vDataAttribute} class="button-content"> 
                    <div ${vDataAttribute} class="inner-label">Watch vod</div>
                </div>
            </a>`;
        if (parentContainer) {
            parentContainer.insertAdjacentHTML('beforeend', vodHTML);
        }
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'video') {
        document.dispatchEvent(new CustomEvent('KICKY_GET_TIME', { detail: request.time }));
        sendResponse({ message: 'video' });
        return true;
    } else if (request.message === 'clip') {
        getData(request.clipID, request.username).then(({ userData, clipData }) => {
            createButton(userData, clipData); 
        });
        sendResponse({ message: 'clip' });
        return true;
    } else if (request.message === 'general') {
        const clipsSeen: string[] = [];
        const observer = new MutationObserver((changes) => {
            changes.forEach((change) => {
                if (change.target instanceof HTMLDivElement && change.target.id === 'clip-video-player') {
                    const clipID = (change.target.getAttribute('poster') ?? '').split('/')[5];
                    if (!clipsSeen.includes(clipID)) {
                        clipsSeen.push(clipID);
                        getData(clipID, request.username).then(({ userData, clipData }) => {
                            createButton(userData, clipData); 
                        });
                    }
                }
                change.removedNodes.forEach((node) => {
                    if (node instanceof HTMLDivElement && node.id === 'clip-video-player') {
                        const clipID = (node.getAttribute('poster') ?? '').split('/')[5];
                        const indexID = clipsSeen.indexOf(clipID);
                        clipsSeen.splice(indexID, indexID !== -1 ? 1 : 0);
                    }
                });
            });
        }); 
        observer.observe(document.body, { subtree: true, childList: true });
        sendResponse({ message: 'general' });
        return true;
    }
});
