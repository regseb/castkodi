import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/index.js";
import { rules }   from "../../../src/core/scraper/flickr.js";

describe("scraper/flickr", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL", function () {
            // Appeler les URLs non-sécurisées car l'entête HTTP de la version
            // sécurisé de Flickr est trop grosse pour Node.
            const url = "http://www.flickr.com/explore";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://www.flickr.com/photos/*", function () {
        let action;
        before(function () {
            action = rules.get(this.test.parent.title);
        });

        it("should return null when it's not a video", function () {
            const url = "http://www.flickr.com/photos/149130852@N05" +
                                                                "/40962531395/";
            const expected = null;
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return video URL", function () {
            const url = "http://www.flickr.com/photos/brandonsphoto" +
                                                                 "/9501379492/";
            const expected = "https://live.staticflickr.com/video/9501379492/" +
                                                         "599013f6d7/orig.mp4?";
            return action(new URL(url)).then(function (file) {
                assert.ok(file.startsWith(expected),
                          `"${file}".startsWith(expected)`);
            });
        });
    });
});
