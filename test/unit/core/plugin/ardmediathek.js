/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import * as plugin from "../../../../src/core/plugin/ardmediathek.js";

describe("core/plugin/ardmediathek.js", function () {
    describe("generateUrl()", function () {
        it("should return URL with video URL", async function () {
            const label = await plugin.generateUrl("foo");
            assert.equal(
                label,
                "plugin://plugin.video.ardmediathek_de/" +
                    "?client=ard&mode=libArdPlay&id=foo",
            );
        });
    });
});
