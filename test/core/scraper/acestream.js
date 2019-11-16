import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/index.js";
import { rules }   from "../../../src/core/scraper/acestream.js";

describe("scraper/acestream", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL",
                                                             async function () {
            const url = "http://www.acestream.org/";

            const file = await extract(url);
            assert.strictEqual(file, url);
        });
    });

    describe("acestream://*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return video URL", async function () {
            const url = "acestream://94c2fd8fb9bc8f2fc71a2cbe9d4b866f227a0209";
            const expected = "plugin://program.plexus/?mode=1&name=" +
                                          "&url=acestream%3A%2F%2F94c2fd8fb9b" +
                                                "c8f2fc71a2cbe9d4b866f227a0209";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });
});
