/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { complete } from "../../../src/core/labelers.js";
import { extract } from "../../../src/core/scrapers.js";
import "../setup.js";

describe("Labeler: Dailymotion", () => {
    it("should return video label", async () => {
        const url = new URL("https://www.dailymotion.com/video/x2knr9t");
        const context = { depth: false, incognito: false };

        const file = /** @type {string} */ (await extract(url, context));
        const item = await complete({
            file,
            label: "",
            position: 0,
            title: "",
            type: "unknown",
        });
        assert.deepEqual(item, {
            file,
            label: "Comment perdre 30 secondes sur Dailymotion ? - Archive INA",
            position: 0,
            title: "",
            type: "unknown",
        });
    });
});
