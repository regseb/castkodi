/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import * as scraper from "../../../../src/core/scraper/podcloud.js";
import "../../setup.js";

describe("core/scraper/podcloud.js", () => {
    describe("extract()", () => {
        it("shouldn't handle when it's a unsupported URL", async () => {
            const url = new URL("https://podcloud.fr/podcast/foo");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return audio URL", async () => {
            const url = new URL("https://podcloud.fr/podcast/foo/episode/bar");

            const file = await scraper.extract(url);
            assert.equal(file, "https://podcloud.fr/ext/foo/bar/enclosure.mp3");
        });
    });
});
