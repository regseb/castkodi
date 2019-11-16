import assert    from "assert";
import { URL }   from "url";
import { rules } from "../../../src/core/scraper/generics.js";

describe("scraper/generics", function () {
    describe("*://*/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when it's not a page HTML", async function () {
            const url = "https://kodi.tv/sites/default/themes/kodi/" +
                                                                 "logo-sbs.svg";
            const expected = null;

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return media URL", async function () {
            const url = "https://www.bitchute.com/video/dz5JcCZnJMge/";
            const expected = "https://seed126.bitchute.com/hU2elaB5u3kB" +
                                                            "/dz5JcCZnJMge.mp4";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });
});
