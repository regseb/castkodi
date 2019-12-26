import assert      from "assert";
import { extract } from "../../../../src/core/scraper/peertube.js";

describe("core/scraper/peertube.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = "https://joinpeertube.org/fr/faq/";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return null when it's not a video", async function () {
            const url = "https://video.blender.org/videos/watch/uuid";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return video URL", async function () {
            const url = "https://framatube.org/videos/watch" +
                                        "/0b04f13d-1e18-4f1d-814e-4979aa7c9c44";
            const expected = "https://peertube.datagueule.tv/static/webseed" +
                               "/0b04f13d-1e18-4f1d-814e-4979aa7c9c44-1080.mp4";

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return video URL when protocol is HTTP", async function () {
            const url = "http://framatube.org/videos/watch" +
                                        "/0b04f13d-1e18-4f1d-814e-4979aa7c9c44";
            const expected = "https://peertube.datagueule.tv/static/webseed" +
                               "/0b04f13d-1e18-4f1d-814e-4979aa7c9c44-1080.mp4";

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return null when it's not a PeerTube website",
                                                             async function () {
            const url = "https://not.peertube/videos/watch" +
                                        "/123e4567-e89b-12d3-a456-426655440000";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return video embed URL", async function () {
            const url = "https://framatube.org/videos/embed" +
                                        "/0900bd2e-7306-4c39-b48b-2d0cd611742e";
            const expected = "https://framatube.org/static/webseed" +
                               "/0900bd2e-7306-4c39-b48b-2d0cd611742e-1080.mp4";

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });
    });
});
