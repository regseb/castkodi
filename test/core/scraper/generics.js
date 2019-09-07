import assert    from "assert";
import { URL }   from "url";
import { rules } from "../../../src/core/scraper/generics.js";

describe("scraper/generics", function () {
    describe("*://*/*", function () {
        let action;
        before(function () {
            action = rules.get(this.test.parent.title);
        });

        it("should return null when it's not a page HTML", function () {
            const url = "https://kodi.tv/sites/default/themes/kodi/" +
                                                                 "logo-sbs.svg";
            const expected = null;
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return media URL", function () {
            const url = "https://www.bitchute.com/video/dz5JcCZnJMge/";
            const expected = "https://seed26.bitchute.com/hU2elaB5u3kB" +
                                               "/dz5JcCZnJMge.mp4?storage=ipfs";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });
});
