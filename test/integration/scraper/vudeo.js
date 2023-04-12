/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import { kodi } from "../../../src/core/jsonrpc/kodi.js";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Vudeo", function () {
    it("should return undefined when it isn't a video", async function () {
        sinon.stub(kodi.addons, "getAddons").resolves([]);

        const url = new URL("https://vudeo.io/faq");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, undefined);
    });

    it("should return undefined when there isn't video", async function () {
        sinon.stub(kodi.addons, "getAddons").resolves([]);

        const url = new URL("https://vudeo.io/xr7um5Ieoo5i.html");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, undefined);
    });

    it("should return video URL", async function () {
        const url = new URL("https://vudeo.io/nznkv7ukdhh3.html");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(
            undefined !== file &&
                file.endsWith("/v.mp4|Referer=https://vudeo.io/"),
            `"${file}".endsWith(...)`,
        );
    });

    it("should return video URL from embed", async function () {
        const url = new URL("https://vudeo.io/embed-nznkv7ukdhh3.html");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(
            undefined !== file &&
                file.endsWith("/v.mp4|Referer=https://vudeo.io/"),
            `"${file}".endsWith(...)`,
        );
    });

    it("should return video URL from embed on '.net'", async function () {
        const url = new URL("https://vudeo.net/embed-nznkv7ukdhh3.html");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(
            undefined !== file &&
                file.endsWith("/v.mp4|Referer=https://vudeo.io/"),
            `"${file}".endsWith(...)`,
        );
    });
});
