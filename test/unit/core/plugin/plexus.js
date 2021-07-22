import assert from "node:assert";
import * as plugin from "../../../../src/core/plugin/plexus.js";

describe("core/plugin/plexus.js", function () {
    describe("generateUrl()", function () {
        it("should return URL with video URL", async function () {
            const label = await plugin.generateUrl(new URL("acestream://01234" +
                                                                "56789abcdef"));
            assert.strictEqual(label,
                "plugin://program.plexus/?mode=1&name=" +
                                     "&url=acestream%3A%2F%2F0123456789abcdef");
        });
    });
});
