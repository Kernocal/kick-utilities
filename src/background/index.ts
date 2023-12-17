function sendMessage(tabID: number, message: {}, callback: ((res: any) => void)) {
    try {
        const res = chrome.tabs.sendMessage(tabID, message, (res) => {
            if (chrome.runtime.lastError) {
                console.warn('Callback failed, tab likely didn\'t exist', chrome.runtime.lastError.message);
            }
            callback(res);
        });
        return res;
    } catch (e) {
        console.warn('Tab likely doesn\'t exist.', e);
    }
}

chrome.runtime.onInstalled.addListener(() => {
    // firefox mv3 requires explicit permission via user action
    if (chrome.runtime.getURL('').startsWith('moz-extension')) {
        chrome.permissions.contains({ origins: ['*://*.kick.com/*'] }, (perm) => {
            if (!perm) {
                chrome.runtime.openOptionsPage();
            };
        });
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    const url = new URL(tab.url ?? 'http://a');
    if (url.hostname.includes('kick.com')) {
        if (changeInfo.status === 'complete') {
            if (url.searchParams.has('clip')) {
                sendMessage(tabId, {
                    message: 'clip', 
                    username: url.pathname.replace('/', ''), 
                    clipID: url.searchParams.get('clip')
                }, (res: any) => {});
            } else if (url.pathname.includes('/video') && url.searchParams.has('t')) {
                sendMessage(tabId, {
                    message: 'video', 
                    time: url.searchParams.get('t')
                }, (res: any) => {});
            }
        }
    }
});
