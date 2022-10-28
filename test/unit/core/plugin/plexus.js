import assert from "node:assert/strict";
import * as plugin from "../../../../src/core/plugin/plexus.js";

describe("core/plugin/plexus.js", function () {
    describe("generateUrl()", function () {
        it("should return URL with video URL", async function () {
            const label = await plugin.generateUrl(new URL("acestream://foo"));
            assert.equal(label,
                "plugin://program.plexus/?mode=1&name=" +
                                        "&url=acestream%3A%2F%2Ffoo");
        });
    });
});
