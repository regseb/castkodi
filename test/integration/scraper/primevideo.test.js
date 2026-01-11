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
        assert.equal(
            file,
            "plugin://plugin.video.amazon-test/?mode=PlayVideo" +
                "&asin=amzn1.dv.gti.242f5d02-0b3e-4f4d-a89b-22da3f65f0ec" +
                "&name=Fallout%20-%20Season%201",
        );
    });

    it('should return video URL from "region/eu"', async function () {
        const url = new URL(
            "https://www.primevideo.com/region/eu/detail" +
                "/0KRGHGZCHKS920ZQGY5LBRF7MA/",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.amazon-test/?mode=PlayVideo" +
                "&asin=amzn1.dv.gti.d9a17eaa-1a66-416a-a169-610fc3ec9f17" +
                "&name=The%20Boys%20-%20Season%201",
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
                "plugin://plugin.video.amazon-test/?mode=PlayVideo" +
                    "&asin=amzn1.dv.gti.af316d6d-1270-4dba-882f-33fc6a17ea4f" +
                    // Ne pas vérifier le nom qui est changeant.
                    "&name=",
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
        assert.equal(
            file,
            "plugin://plugin.video.amazon-test/?mode=PlayVideo" +
                "&asin=amzn1.dv.gti.a3f19de4-9ec3-4428-a3ea-a7aa4a0792d8" +
                "&name=Tom%20Clancy%26%2339%3Bs%20Jack%20Ryan",
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
                "plugin://plugin.video.amazon-test/?mode=PlayVideo" +
                    "&asin=amzn1.dv.gti.ff3e6df2-2fa6-4a7c-bab3-43972be660cb" +
                    // Ne pas vérifier le nom qui est changeant.
                    "&name=",
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
        assert.equal(
            file,
            "plugin://plugin.video.amazon-test/?mode=PlayVideo" +
                "&asin=amzn1.dv.gti.56ef5162-901b-4277-9bfa-c5166a89620a" +
                "&name=The%20Summer%20I%20Turned%20Pretty%20-%20Season%201",
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
                "plugin://plugin.video.amazon-test/?mode=PlayVideo" +
                    "&asin=amzn1.dv.gti.6c51068a-ab0b-416c-a63e-9ef567371a04" +
                    // Ne pas vérifier le nom qui est changeant.
                    "&name=",
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
        assert.equal(
            file,
            "plugin://plugin.video.amazon-test/?mode=PlayVideo" +
                "&asin=amzn1.dv.gti.b552c326-3035-4910-b2d0-72b2943ea778" +
                "&name=Reacher%20-%20Season%202",
        );
    });
});
