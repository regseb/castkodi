/**
 * @license MIT
 * @author David Magnus Henriques
 */

import assert from "node:assert/strict";
import * as plugin from "../../../../src/core/plugin/invidious.js";

describe("core/plugin/invidious.js", function () {
    describe("generateUrl()", function () {
        it("should return Invidious URL", function () {
            const label = plugin.generateUrl("foo");
            assert.equal(
                label,
                "plugin://plugin.video.invidious/?action=play&videoId=foo",
            );
        });
    });
});
