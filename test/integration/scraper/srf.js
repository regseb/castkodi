/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import { kodi } from "../../../src/core/jsonrpc/kodi.js";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Play SRF", function () {
    it("should return undefined when it isn't a video", async function () {
        sinon.stub(kodi.addons, "getAddons").resolves([]);

        const url = new URL(
            "https://www.srf.ch/hilfe/kontakt?srg_shorturl_source=kontakt",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, undefined);
    });

    it("should return undefined when urn is invalid", async function () {
        sinon.stub(kodi.addons, "getAddons").resolves([]);

        const url = new URL(
            "https://www.srf.ch/play/tv/foo/video/bar" +
                "?urn=urn:srf:video:d5cb6b79-cc9f-4e29-82fb-64e8283f02e2",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, undefined);
    });

    it("should return video URL", async function () {
        const url = new URL(
            "https://www.srf.ch/play/tv/mona-mittendrin/video" +
                "/bei-spitzenkoechin-tanja-grandits" +
                "?urn=urn:srf:video:05fe9231-6f59-46e1-bcd1-82c3d30f9ccd",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(
            undefined !== file &&
                new URL(file).pathname.endsWith("/master.m3u8"),
            `new URL("${file}").pathname.endsWith(...) from ${url}`,
        );
    });

    it("should return video URL from redirect", async function () {
        const url = new URL(
            "https://www.srf.ch/play/tv/redirect/detail" +
                "/074231f3-96d9-4ee5-8baa-c029e774caeb",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(
            undefined !== file &&
                new URL(file).pathname.endsWith("/master.m3u8"),
            `new URL("${file}").pathname.endsWith(...) from ${url}`,
        );
    });
});
