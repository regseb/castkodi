import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/index.js";
import { rules }   from "../../../src/core/scraper/flickr.js";

describe("scraper/flickr", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL",
                                                             async function () {
            // Appeler les URLs non-sécurisées car l'entête HTTP de la version
            // sécurisé de Flickr est trop grosse pour Node.
            const url = "http://www.flickr.com/explore";

            const file = await extract(url);
            assert.strictEqual(file, url);
        });
    });

    describe("*://www.flickr.com/photos/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when it's not a video", async function () {
            const url = "http://www.flickr.com/photos/149130852@N05" +
                                                                "/40962531395/";
            const expected = null;

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return video URL", async function () {
            const url = "http://www.flickr.com/photos/brandonsphoto" +
                                                                 "/9501379492/";
            const expected = "https://live.staticflickr.com/video/9501379492/" +
                                                         "599013f6d7/orig.mp4?";

            const file = await action(new URL(url));
            assert.ok(file.startsWith(expected),
                      `"${file}".startsWith(expected)`);
        });
    });
});
