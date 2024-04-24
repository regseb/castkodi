/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

// Désactiver les tests car Vudeo n'est plus accessible.
describe.skip("Scraper: Vudeo", function () {
    it("should return undefined when it isn't a video", async function () {
        const url = new URL("https://vudeo.co/faq");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return undefined when there isn't video", async function () {
        const url = new URL("https://vudeo.co/xr7um5Ieoo5i.html");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return video URL", async function () {
        const url = new URL("https://vudeo.co/coyo0r55r5xj.html");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            undefined !== file &&
                file.endsWith(
                    "/v.mp4|Referer=https://vudeo.co/coyo0r55r5xj.html",
                ),
            `"${file}".endsWith(...)`,
        );
    });

    it("should return video URL from embed", async function () {
        const url = new URL("https://vudeo.co/embed-coyo0r55r5xj.html");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            undefined !== file &&
                file.endsWith(
                    "/v.mp4|Referer=https://vudeo.co/embed-coyo0r55r5xj.html",
                ),
            `"${file}".endsWith(...)`,
        );
    });
});
