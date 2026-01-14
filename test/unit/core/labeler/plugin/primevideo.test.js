/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import * as labeler from "../../../../../src/core/labeler/plugin/primevideo.js";
import "../../../setup.js";

describe("core/labeler/plugin/primevideo.js", () => {
    describe("extract()", () => {
        it("should return video label", async () => {
            const url = new URL(
                "plugin://plugin.video.amazon-test/" +
                    "?mode=PlayVideo&asin=foo&name=Bar",
            );

            const label = await labeler.extract(url);
            assert.equal(label, "Bar");
        });

        it("should return undefined when there isn't 'name' parameter", async () => {
            const url = new URL(
                "plugin://plugin.video.amazon-test/?mode=PlayVideo&asin=foo",
            );

            const label = await labeler.extract(url);
            assert.equal(label, undefined);
        });
    });
});
