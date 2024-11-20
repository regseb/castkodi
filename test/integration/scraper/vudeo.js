/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Vudeo", function () {
    it("should return undefined when it isn't a video", async function () {
        const url = new URL("https://vudeo.ws/faq");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return undefined when there isn't video", async function () {
        const url = new URL("https://vudeo.ws/xr7um5Ieoo5i.html");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return video URL", async function () {
        const url = new URL("https://vudeo.ws/kuapcw7r6uzz.html");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            undefined !== file &&
                file.endsWith(
                    "/v.mp4|Referer=https://vudeo.ws/kuapcw7r6uzz.html",
                ),
            `"${file}".endsWith(...)`,
        );
    });

    it("should return video URL from embed", async function () {
        const url = new URL("https://vudeo.ws/embed-kuapcw7r6uzz.html");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            undefined !== file &&
                file.endsWith(
                    "/v.mp4|Referer=https://vudeo.ws/embed-kuapcw7r6uzz.html",
                ),
            `"${file}".endsWith(...)`,
        );
    });
});
