import assert      from "assert";
import { extract } from "../../../../src/core/scraper/acestream.js";

describe("core/scraper/acestream.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = "http://www.acestream.org/";

            const file = await extract(new URL(url));
            assert.strictEqual(file, null);
        });

        it("should return video URL", async function () {
            const url = "acestream://94c2fd8fb9bc8f2fc71a2cbe9d4b866f227a0209";

            const file = await extract(new URL(url));
            assert.strictEqual(file,
                "plugin://program.plexus/?mode=1&name=" +
                                          "&url=acestream%3A%2F%2F94c2fd8fb9b" +
                                               "c8f2fc71a2cbe9d4b866f227a0209");
        });
    });
});
