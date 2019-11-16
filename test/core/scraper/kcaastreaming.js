import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/index.js";
import { rules }   from "../../../src/core/scraper/kcaastreaming.js";

describe("scraper/kcaastreaming", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL",
                                                             async function () {
            const url = "http://www.kcaaradio.com/";

            const file = await extract(url);
            assert.strictEqual(file, url);
        });
    });

    describe("http://live.kcaastreaming.com/", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return audio URL", async function () {
            const url = "http://live.kcaastreaming.com/";
            const expected = "http://stream.kcaastreaming.com:5222/kcaa.mp3";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });
});
