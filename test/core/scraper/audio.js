import assert    from "assert";
import { URL }   from "url";
import { rules } from "../../../src/core/scraper/audio.js";

describe("scraper/audio", function () {
    describe("*://*/*", function () {
        let action;
        before(function () {
            action = Array.from(rules.entries())
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when it's not a page HTML", function () {
            const url = "https://kodi.tv/sites/default/themes/kodi/" +
                                                                 "logo-sbs.svg";
            const expected = null;
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return Útvarp Saga URL", function () {
            const url = "http://utvarpsaga.is/" +
                             "snjallsimarnir-eru-farnir-ad-stjorna-lifi-folks/";
            const expected = "http://utvarpsaga.is/file/" +
                                           "s%C3%AD%C3%B0degi-a-7.9.18.mp3?_=1";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });
});
