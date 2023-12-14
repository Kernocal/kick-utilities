import { defineManifest } from '@crxjs/vite-plugin'
import { BROWSER, GECKO_ID } from './env'
import packageData from '../package.json'

const firefoxExtra = {
    browser_specific_settings: {
        gecko: {
            id: GECKO_ID
        }
    }
}

export default defineManifest({
    ...(BROWSER === "firefox" ? firefoxExtra : {}),
    name: packageData.name,
    description: packageData.description,
    version: packageData.version,
    manifest_version: 3,
    icons: {
        16: 'img/logo-16.png',
        32: 'img/logo-32.png',
        48: 'img/logo-48.png',
        128: 'img/logo-128.png',
    },
    // action: {
    //   default_popup: 'src/popup/popup.html',
    //   default_icon: 'img/logo-48.png',
    // },
    options_ui: {
        page: 'src/options/options.html',
        open_in_tab: true
    },
    background: {
        ...(BROWSER === "firefox" ? {
            scripts: ['src/background/index.ts']
        } : {
            service_worker: 'src/background/index.ts'
        }),
        type: 'module',
    },
    content_scripts: [
        {
            run_at: "document_start",
            matches: ['*://*.kick.com/*'],
            js: ['src/contentScript/index.ts'],
        },
    ],
    web_accessible_resources: [
        {
            resources: ['src/contentScript/index.ts', 'img/logo-16.png', 'img/logo-32.png', 'img/logo-48.png', 'img/logo-128.png'],
            matches: ['*://*.kick.com/*'],
        },
    ],
    permissions: ['storage', 'scripting', 'webRequest', 'activeTab'],
    host_permissions: ['*://*.kick.com/*'], 
});
