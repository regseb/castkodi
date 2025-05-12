/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: ZDF", function () {
    it("should return undefined when it isn't a video", async function () {
        const url = new URL("https://www.zdf.de/filme");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return video URL", async function () {
        const url = new URL(
            "https://www.zdf.de/dokumentation/37-grad" +
                "/37-im-schuldenstrudel-100.html",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            undefined !== file &&
                new URL(file).pathname.endsWith("/master.m3u8"),
            `new URL("${file}").pathname.endsWith(...)`,
        );
    });
});
