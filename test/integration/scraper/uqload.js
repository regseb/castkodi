/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import { kodi } from "../../../src/core/jsonrpc/kodi.js";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Uqload", function () {
    it("should return undefined when it isn't a video", async function () {
        sinon.stub(kodi.addons, "getAddons").resolves([]);

        const url = new URL("https://uqload.co/checkfiles.html");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, undefined);
    });

    it("should return undefined when video was deleted", async function () {
        sinon.stub(kodi.addons, "getAddons").resolves([]);

        const url = new URL("https://uqload.co/k1phujbh3t7d.html");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, undefined);
    });

    it("should return video URL", async function () {
        const url = new URL("https://uqload.co/5x0cgygu2bgg.html");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(
            undefined !== file &&
                file.endsWith("/v.mp4|Referer=https://uqload.co/"),
            `"${file}".endsWith(...)`,
        );
    });

    it("should return video URL when protocol is HTTP", async function () {
        const url = new URL("http://uqload.co/5x0cgygu2bgg.html");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(
            undefined !== file &&
                file.endsWith("/v.mp4|Referer=https://uqload.co/"),
            `"${file}".endsWith(...)`,
        );
    });

    it("should return video URL from embed", async function () {
        const url = new URL("https://uqload.co/embed-5x0cgygu2bgg.html");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(
            undefined !== file &&
                file.endsWith("/v.mp4|Referer=https://uqload.co/"),
            `"${file}".endsWith(...)`,
        );
    });

    it("should return video URL from old TLD", async function () {
        const url = new URL("https://uqload.com/5x0cgygu2bgg.html");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(
            undefined !== file &&
                file.endsWith("/v.mp4|Referer=https://uqload.co/"),
            `"${file}".endsWith(...)`,
        );
    });
});
