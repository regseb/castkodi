/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Prime Video", function () {
    it("should return undefined when there isn't video", async function () {
        const url = new URL("https://www.primevideo.com/storefront/");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return video URL", async function () {
        const url = new URL(
            "https://www.primevideo.com/detail/0HAQAA7JM43QWX0H6GUD3IOF70/",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            file?.startsWith(
                "plugin://plugin.video.amazon-test/" +
                    "?mode=PlayVideo" +
                    "&asin=amzn1.dv.gti.242f5d02-0b3e-4f4d-a89b-22da3f65f0ec" +
                    "&name=Fallout%20-%20Season%201",
            ),
            `"${file}"?.startsWith(...)`,
        );
    });

    it('should return video URL from "region/eu"', async function () {
        const url = new URL(
            "https://www.primevideo.com/region/eu/detail" +
                "/0KRGHGZCHKS920ZQGY5LBRF7MA/",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            file?.startsWith(
                "plugin://plugin.video.amazon-test/" +
                    "?mode=PlayVideo" +
                    "&asin=amzn1.dv.gti.5eb510bc-7578-d2dd-49d3-484070a96b52" +
                    "&name=The%20Boys%20-%20Season%201",
            ),
            `"${file}"?.startsWith(...)`,
        );
    });

    it('should return video URL from "amazon.com"', async function () {
        const url = new URL(
            "https://www.amazon.com/gp/video/detail/B0CLRQ7M7Z/",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            file?.startsWith(
                "plugin://plugin.video.amazon-test/" +
                    "?mode=PlayVideo" +
                    "&asin=amzn1.dv.gti.af316d6d-1270-4dba-882f-33fc6a17ea4f" +
                    "&name=Mr.%20%26%2338%3B%20Mrs.%20Smith%20-%20Season%201",
            ),
            `"${file}"?.startsWith(...)`,
        );
    });

    it('should return video URL from "amazon.co.uk"', async function () {
        const url = new URL(
            "https://www.amazon.co.uk/gp/video/detail/B0BYT8W12F/",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            file?.startsWith(
                "plugin://plugin.video.amazon-test/" +
                    "?mode=PlayVideo" +
                    "&asin=amzn1.dv.gti.026cbf6c-0d46-4128-85a0-6e6c882af0ed" +
                    "&name=Jack%20Ryan%20%E2%80%93%20Season%204",
            ),
            `"${file}"?.startsWith(...)`,
        );
    });

    it('should return video URL from "amazon.de"', async function () {
        const url = new URL(
            "https://www.amazon.de/gp/video/detail/B0CPYRVFDQ/",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            file?.startsWith(
                "plugin://plugin.video.amazon-test/" +
                    "?mode=PlayVideo" +
                    "&asin=amzn1.dv.gti.ff3e6df2-2fa6-4a7c-bab3-43972be660cb" +
                    "&name=Heirate%20Meinen%20Mann%20S1",
            ),
            `"${file}"?.startsWith(...)`,
        );
    });

    it('should return video URL from "amazon.de/-/en/"', async function () {
        const url = new URL(
            "https://www.amazon.de/-/en/gp/video/detail/B09NF4YDYC/",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            file?.startsWith(
                "plugin://plugin.video.amazon-test/" +
                    "?mode=PlayVideo" +
                    "&asin=amzn1.dv.gti.56ef5162-901b-4277-9bfa-c5166a89620a" +
                    "&name=The%20Summer%20I%20Turned%20Pretty%20-%20Season%201",
            ),
            `"${file}"?.startsWith(...)`,
        );
    });

    it('should return video URL from "amazon.co.jp"', async function () {
        const url = new URL(
            "https://www.amazon.co.jp/gp/video/detail/B0B8THG5KX/",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            file?.startsWith(
                "plugin://plugin.video.amazon-test/" +
                    "?mode=PlayVideo" +
                    "&asin=amzn1.dv.gti.6c51068a-ab0b-416c-a63e-9ef567371a04" +
                    "&name=%E6%B2%88%E9%BB%99%E3%81%AE%E8%89%A6%E9%9A%8A%20" +
                    "-%20%E3%82%B7%E3%83%BC%E3%82%BA%E3%83%B3%EF%BC%91%E3%80" +
                    "%90%E6%9D%B1%E4%BA%AC%E6%B9%BE%E5%A4%A7%E6%B5%B7%E6%88" +
                    "%A6%E3%80%91",
            ),
            `"${file}"?.startsWith(...)`,
        );
    });

    it('should return video URL from "amazon.co.jp/-/en/"', async function () {
        const url = new URL(
            "https://www.amazon.co.jp/-/en/gp/video/detail/B0CH9DQS7M/",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            file?.startsWith(
                "plugin://plugin.video.amazon-test/" +
                    "?mode=PlayVideo" +
                    "&asin=amzn1.dv.gti.5c2c1110-ccb6-4922-9690-1193f46fa535" +
                    "&name=Reacher%20-%20Season%202",
            ),
            `"${file}"?.startsWith(...)`,
        );
    });
});
