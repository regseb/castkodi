import assert from "node:assert";
import * as plugin from "../../../../src/core/plugin/vrtnu.js";

describe("core/plugin/vrtnu.js", function () {
    describe("generateUrl()", function () {
        it("should return URL with video URL", async function () {
            const label = await plugin.generateUrl(new URL("http://foo.io" +
                                                                  "/bar.html"));
            assert.strictEqual(label,
                "plugin://plugin.video.vrt.nu/play/url/http://foo.io/bar.html");
        });
    });
});
