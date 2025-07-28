chrome.devtools.panels.create(
    'contxt Debug',
    'icons/icon-48-unknown.png',
    'src/devtools/panel.html',
    (panel) => {
        console.log('[contxt-devtools] Debug panel created.', panel);
    }
);