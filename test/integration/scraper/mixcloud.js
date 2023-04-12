/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import { kodi } from "../../../src/core/jsonrpc/kodi.js";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Mixcloud", function () {
    it("should return undefined when it isn't an audio", async function () {
        sinon.stub(kodi.addons, "getAddons").resolves([]);

        const url = new URL("https://www.mixcloud.com/discover/jazz/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, undefined);
    });

    it("should return audio id", async function () {
        const url = new URL(
            "https://www.mixcloud.com/LesGar%C3%A7onsBienElev%C3%A9s/n101/",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "plugin://plugin.audio.mixcloud/?mode=40" +
                "&key=%2FLesGar%25C3%25A7onsBienElev%25C3%25A9s%2Fn101%2F",
        );
    });

    it("should return audio id when protocol is HTTP", async function () {
        const url = new URL(
            "http://www.mixcloud.com/LesGar%C3%A7onsBienElev%C3%A9s/n101/",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "plugin://plugin.audio.mixcloud/?mode=40" +
                "&key=%2FLesGar%25C3%25A7onsBienElev%25C3%25A9s%2Fn101%2F",
        );
    });
});
