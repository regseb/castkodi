import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/index.js";
import { rules }   from "../../../src/core/scraper/blogtalkradio.js";

describe("scraper/blogtalkradio", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL",
                                                             async function () {
            const url = "https://help.blogtalkradio.com/en/";

            const file = await extract(url);
            assert.strictEqual(file, url);
        });
    });

    describe("*://www.blogtalkradio.com/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when it's not an audio", async function () {
            const url = "https://www.blogtalkradio.com/technology";
            const expected = null;

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return audio URL", async function () {
            const url = "https://www.blogtalkradio.com/stretchingadollar" +
                               "/2011/03/02/7-mozilla-firefox-add-ons-to-help" +
                                "-your-small-business-stretch-a-dollar-to-save";
            const expected = "https://www.blogtalkradio.com/stretchingadollar" +
                               "/2011/03/02/7-mozilla-firefox-add-ons-to-help" +
                            "-your-small-business-stretch-a-dollar-to-save.mp3";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return audio URL when protocol is HTTP", async function () {
            const url = "http://www.blogtalkradio.com/firefoxnews-online/2011" +
                                                    "/06/13/firefoxnews-online";
            const expected = "https://www.blogtalkradio.com" +
                        "/firefoxnews-online/2011/06/13/firefoxnews-online.mp3";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });
});
