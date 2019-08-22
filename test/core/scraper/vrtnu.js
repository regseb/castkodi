import assert from "assert";
import { URL } from "url";
import { extract } from "../../../src/core/scrapers.js";
import { rules } from "../../../src/core/scraper/vrtnu.js";

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

        it("should return null when it's a-z view", function () {
            const url = "https://www.vrt.be/vrtnu/a-z/";
            const expected = null;

            const file = action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return null when it's not a video", function () {
            const url = "https://www.vrt.be/vrtnu/livestream/";
            const expected = null;

            const file = action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return video id", function () {
            const url = "https://www.vrt.be/vrtnu/a-z/woodstock/2019/woodstock/";
            const expected = "plugin://plugin.video.vrt.nu/play/url/https://vrt.be/vrtnu/a-z/woodstock/2019/woodstock/";

            const file = action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return video id when protocol is HTTP", function () {
            const url = "http://www.vrt.be/vrtnu/a-z/just-another-immigrant/1/just-another-immigrant-s1a1/";
            const expected = "plugin://plugin.video.vrt.nu/play/url/https://vrt.be/vrtnu/a-z/just-another-immigrant/1/just-another-immigrant-s1a1/";

            const file = action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return video id withoud www prefix", function () {
            const url = "https://vrt.be/vrtnu/a-z/ennemi-public/1/ennemi-public-s1a1-la-brebis-egaree/";
            const expected = "plugin://plugin.video.vrt.nu/play/url/https://vrt.be/vrtnu/a-z/ennemi-public/1/ennemi-public-s1a1-la-brebis-egaree/";

            const file = action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });
});
