/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import "../polyfill/browser.js";
import "../polyfill/domparser.js";
import { kodi } from "../core/jsonrpc/kodi.js";
import * as menu from "../core/menu.js";
import * as storage from "../core/storage.js";

browser.runtime.onStartup.addListener(async () => {
    await menu.update();
});

browser.runtime.onInstalled.addListener(async ({ reason }) => {
    switch (reason) {
        case browser.runtime.OnInstalledReason.INSTALL:
            await storage.initialize();
            break;
        case browser.runtime.OnInstalledReason.UPDATE:
            await storage.migrate();
            break;
        default:
        // Ne rien faire.
    }
});

browser.storage.onChanged.addListener(async (changes) => {
    // Garder seulement les changements liés aux menus et aux serveurs.
    if (
        Object.entries(changes).some(
            ([k, v]) =>
                (k.startsWith("menu-") && "newValue" in v) ||
                (k.startsWith("server-") && "newValue" in v),
        )
    ) {
        await menu.update();
    }

    // Garder seulement les changements liés au serveur.
    if (
        Object.keys(changes).some(
            ([k, v]) => k.startsWith("server-") && "newValue" in v,
        )
    ) {
        kodi.close();
    }
});

browser.contextMenus.onClicked.addListener(async (info) => {
    if (
        "send" === info.menuItemId ||
        "insert" === info.menuItemId ||
        "add" === info.menuItemId
    ) {
        await menu.click(info);
    } else if (!info.wasChecked) {
        await menu.change(Number(info.menuItemId));
    }
});

browser.permissions.onRemoved.addListener(async ({ permissions }) => {
    await storage.remove(permissions);
});
