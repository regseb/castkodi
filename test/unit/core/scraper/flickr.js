import assert      from "assert";
import { extract } from "../../../../src/core/scraper/flickr.js";

describe("core/scraper/flickr.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            // Appeler les URLs non-sécurisées car l'entête HTTP de la version
            // sécurisé de Flickr est trop grosse pour Node.
            const url = "http://www.flickr.com/explore";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return null when it's not a video", async function () {
            const url = "http://www.flickr.com/photos/149130852@N05" +
                                                                "/40962531395/";
            const expected = null;

            const response = await fetch(url);
            const text = await response.text();
            const doc = new DOMParser().parseFromString(text, "text/html");

            const file = await extract(new URL(url), doc);
            assert.strictEqual(file, expected);
        });

        it("should return video URL", async function () {
            const url = "http://www.flickr.com/photos/brandonsphoto" +
                                                                 "/9501379492/";
            const expected = "https://live.staticflickr.com/video/9501379492/" +
                                                          "b2e279c142/700.mp4?";

            const response = await fetch(url);
            const text = await response.text();
            const doc = new DOMParser().parseFromString(text, "text/html");

            const file = await extract(new URL(url), doc);
            assert.ok(file.startsWith(expected),
                      `"${file}".startsWith(expected)`);
        });
    });
});
