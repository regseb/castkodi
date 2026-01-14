/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import * as scraper from "../../../../src/core/scraper/acestream.js";
import "../../setup.js";

describe("core/scraper/acestream.js", () => {
    describe("extract()", () => {
        it("shouldn't handle when it's a unsupported URL", async () => {
            const url = new URL("https://www.acestream.org/");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return video URL", async () => {
            const url = new URL("acestream://foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://program.plexus/" +
                    "?mode=1&name=&url=acestream%3A%2F%2Ffoo",
            );
        });
    });
});
