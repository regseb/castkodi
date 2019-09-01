import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/scrapers.js";
import { rules }   from "../../../src/core/scraper/vrtnu.js";

describe("scraper/vrtnu", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL", function () {
            const url = "https://www.vrt.be/vrtnu/livestream";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://*.vrt.be/vrtnu/a-z/*", function () {
        let action;
        before(function () {
            action = rules.get(this.test.parent.title);
        });

        it("should return video id", function () {
            const url = "https://www.vrt.be/vrtnu/a-z/het-journaal/2019" +
                                     "/het-journaal-het-journaal-13u-20190901/";
            const expected = "plugin://plugin.video.vrt.nu/play/url" +
                                           "/https%3A%2F%2Fvrt.be%2Fvrtnu%2Fa" +
                                     "-z%2Fhet-journaal%2F2019%2Fhet-journaal" +
                                                "-het-journaal-13u-20190901%2F";

            const file = action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return video id when protocol is HTTP", function () {
            const url = "http://www.vrt.be/vrtnu/a-z/pano/2019/pano-s2019a9/";
            const expected = "plugin://plugin.video.vrt.nu/play/url" +
                                           "/https%3A%2F%2Fvrt.be%2Fvrtnu%2Fa" +
                                           "-z%2Fpano%2F2019%2Fpano-s2019a9%2F";

            const file = action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return video id without subdomain", function () {
            const url = "https://vrt.be/vrtnu/a-z/koppen/2016" +
                                                           "/koppen-d20180721/";
            const expected = "plugin://plugin.video.vrt.nu/play/url" +
                                           "/https%3A%2F%2Fvrt.be%2Fvrtnu%2Fa" +
                                     "-z%2Fkoppen%2F2016%2Fkoppen-d20180721%2F";

            const file = action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });
});
