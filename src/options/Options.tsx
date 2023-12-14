import { useState, useEffect } from 'react'
import permission from '../assets/permission.png';
import noPermission from '../assets/noPermission.png';

    // function revokePermission() {
    //     chrome.permissions.remove({origins: ["*://*.kick.com/*"]}, (e) => {
    //         setHasPermission(!e)
    //     }); 
    // }

export const Options = () => {
    const [hasPermission, setHasPermission] = useState(false);
    function getPermission() {
        chrome.permissions.request({origins: ["*://*.kick.com/*"]}, (e) => {
            setHasPermission(e)
        });
    }

    useEffect(() => {
        chrome.permissions.contains({origins: ["*://*.kick.com/*"]}, (perm) => {
            setHasPermission(perm);
        });
    }, []);

    return (
        <main>
            <div className="flex flex-col justify-center items-center">
                <img src={hasPermission ? permission : noPermission} alt="tt" className="w-[3cqw] h-[3cqw]" />
                {hasPermission && <>
                    <h1 className="text-3xl font-bold">Permissions granted, carry on.</h1>
                    {/* <button onClick={revokePermission} className="bg-red-950 p-2 m-2 w-fit h-fit text-xl">Revoke</button> */}

                </>}
                {hasPermission !== true && <>
                    <h3 className="text-3xl font-bold">Give extension permissions for Kick:</h3>
                    <button onClick={getPermission} className="bg-green-950 p-2 m-2 w-fit h-fit text-xl">Allow</button>
                </>}
            </div>
        </main>
    )
}

export default Options
