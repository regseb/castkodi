/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import { kodi } from "../../../../src/core/jsonrpc/kodi.js";
import * as scraper from "../../../../src/core/scraper/unknown.js";
import "../../setup.js";

const OTHER_ADDON = {
    addonid: "plugin.video.other",
    author: "johndoe",
    type: "xbmc.python.pluginsource",
};
const SENDTOKODI_ADDON = {
    addonid: "plugin.video.sendtokodi",
    author: "firsttris",
    type: "xbmc.python.pluginsource",
};

describe("core/scraper/unknown.js", () => {
    afterEach(() => {
        mock.reset();
    });

    describe("extract()", () => {
        it("should return undefined when it's depth", async () => {
            const url = new URL("https://foo.com/");
            const metadata = undefined;
            const context = { depth: true, incognito: false };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should use SendToKodi plugin", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([SENDTOKODI_ADDON]),
            );

            const url = new URL("https://foo.com/");
            const metadata = undefined;
            const context = { depth: false, incognito: false };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.sendtokodi/?https://foo.com/",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return undefined when there isn't plugin", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://foo.com/");
            const metadata = undefined;
            const context = { depth: false, incognito: false };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, undefined);

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return undefined when there is another plugin", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([OTHER_ADDON]),
            );

            const url = new URL("https://foo.com/");
            const metadata = undefined;
            const context = { depth: false, incognito: false };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, undefined);

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });
    });
});
