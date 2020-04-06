import assert      from "assert";
import { extract } from "../../../../src/core/scraper/vrtnu.js";

describe("core/scraper/vrtnu.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = "https://www.vrt.be/vrtnu/livestream";

            const file = await extract(new URL(url));
            assert.strictEqual(file, null);
        });

        it("should return video URL", async function () {
            const url = "https://www.vrt.be/vrtnu/a-z/het-journaal/2019" +
                                     "/het-journaal-het-journaal-13u-20190901/";

            const file = await extract(new URL(url));
            assert.strictEqual(file,
                "plugin://plugin.video.vrt.nu/play/url" +
                                  "/https://www.vrt.be/vrtnu/a-z/het-journaal" +
                               "/2019/het-journaal-het-journaal-13u-20190901/");
        });

        it("should return video URL when protocol is HTTP", async function () {
            const url = "http://www.vrt.be/vrtnu/a-z/pano/2019/pano-s2019a9/";

            const file = await extract(new URL(url));
            assert.strictEqual(file,
                "plugin://plugin.video.vrt.nu/play/url" +
                        "/http://www.vrt.be/vrtnu/a-z/pano/2019/pano-s2019a9/");
        });

        it("should return video URL without 'www'", async function () {
            const url = "https://vrt.be/vrtnu/a-z/koppen/2016" +
                                                           "/koppen-d20180721/";

            const file = await extract(new URL(url));
            assert.strictEqual(file,
                "plugin://plugin.video.vrt.nu/play/url" +
                     "/https://vrt.be/vrtnu/a-z/koppen/2016/koppen-d20180721/");
        });

        it("should return video URL from 'link' page", async function () {
            const url = "https://vrtnu.page.link/KXWX";

            const file = await extract(new URL(url));
            assert.strictEqual(file,
                "plugin://plugin.video.vrt.nu/play/url" +
                                               "/https://vrtnu.page.link/KXWX");
        });
    });
});
