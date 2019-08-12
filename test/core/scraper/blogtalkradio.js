import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/scrapers.js";
import { rules }   from "../../../src/core/scraper/blogtalkradio.js";

describe("scraper/blogtalkradio", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL", function () {
            const url = "https://help.blogtalkradio.com/en/";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://www.blogtalkradio.com/*", function () {
        let action;
        before(function () {
            action = rules.get(this.test.parent.title);
        });

        it("should return null when it's not a sound", function () {
            const url = "https://www.blogtalkradio.com/technology";
            const expected = null;
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return sound URL", function () {
            const url = "https://www.blogtalkradio.com/stretchingadollar" +
                               "/2011/03/02/7-mozilla-firefox-add-ons-to-help" +
                                "-your-small-business-stretch-a-dollar-to-save";
            const expected = "https://www.blogtalkradio.com/stretchingadollar" +
                               "/2011/03/02/7-mozilla-firefox-add-ons-to-help" +
                            "-your-small-business-stretch-a-dollar-to-save.mp3";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return video id when protocol is HTTP", function () {
            const url = "http://www.blogtalkradio.com/firefoxnews-online/2011" +
                                                    "/06/13/firefoxnews-online";
            const expected = "https://www.blogtalkradio.com" +
                        "/firefoxnews-online/2011/06/13/firefoxnews-online.mp3";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });
});
