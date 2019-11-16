import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/index.js";
import { rules }   from "../../../src/core/scraper/jamendo.js";

describe("scraper/jamendo", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL",
                                                             async function () {
            const url = "https://www.jamendo.com/community/punk";

            const file = await extract(url);
            assert.strictEqual(file, url);
        });
    });

    describe("*://www.jamendo.com/track/*/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when it's not a sound", async function () {
            const url = "https://www.jamendo.com/track/404/not-found";
            const expected = null;

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return audio URL", async function () {
            const url = "https://www.jamendo.com/track/3431" +
                                                      "/avant-j-etais-trappeur";
            const expected = "https://mp3l.jamendo.com/" +
                                  "?trackid=3431&format=mp31&from=app-97dab294";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return audio URL when protocol is HTTP", async function () {
            const url = "http://www.jamendo.com/track/33454" +
                                                          "/vacance-au-camping";
            const expected = "https://mp3l.jamendo.com/" +
                                 "?trackid=33454&format=mp31&from=app-97dab294";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });
});
