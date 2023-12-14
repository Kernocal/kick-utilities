import { useState, useEffect } from 'react'

export const Popup = () => {
    const [count, setCount] = useState(0)
    const link = 'https://github.com/guocaoyi/create-chrome-ext'

    async function getData(e: any) {
        
        // const user = await fetch(`https://kick.com/api/v1/channels/${user}`);
        // const userData = await user.json();
        // const clip = await fetch("https://kick.com/api/v2/clips/");
        // const clipData = await clip.json();

        // const stream = userData.previous_livestreams.filter((e) => e.id === Number(clipData.clip.livestream_id));

        // const streamStarted = new Date(stream.start_time);
        // const clipStarted = new Date(clipData.clip.started_at);
        // const startedDiffVal = new Date(clipStarted.valueOf() - streamStarted.valueOf());

        // const startedDiff = Math.trunc((clipStarted.valueOf() - streamStarted.valueOf()) / 1000);

        // const end = startedDiff;
        // const start = startedDiff - clipData.clip.duration;
        chrome.permissions.request({origins: ["*://*.kick.com/*"]}, (e) => {
            console.log("perms", e);
        });
    }

    const minus = () => {
        if (count > 0) setCount(count - 1)
    }

    const add = () => setCount(count + 1)

    useEffect(() => {
        chrome.storage.sync.get(['count'], (result) => {
        setCount(result.count || 0)
        })
    }, [])

    useEffect(() => {
        const res = async () => {

        }
        res();
        chrome.storage.sync.set({ count });
        chrome.runtime.sendMessage({ type: 'COUNT', count });
    }, [count])

    return (
        <main>
        <button onClick={getData} className="bg-red-950">Get time</button>
        <h3>Popup Page aaa</h3>
        <div className="calc">
            <button onClick={minus} disabled={count <= 0}>
            -
            </button>
            <label>{count}</label>
            <button onClick={add}>+</button>
        </div>
        <a href={link} target="_blank">
            generated by create-chrome-ext
        </a>
        </main>
    )
}

export default Popup
