import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("scraper/flickr", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL", function () {
            const url = "https://www.flickr.com/explore";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("https://www.flickr.com/photos/*", function () {
        it("should return error when it's not a video", function () {
            const url = "https://www.flickr.com/photos/149130852@N05" +
                                                                "/40962531395/";
            const expected = "noVideo";
            return extract(url).then(function () {
                assert.fail();
            }).catch(function (err) {
                assert.strictEqual(err.name, "PebkacError");
                assert.ok(err.title.includes(expected),
                          `"${err.title}".includes(expected)`);
                assert.ok(err.message.includes(expected),
                          `"${err.message}".includes(expected)`);
            });
        });

        it("should return video URL", function () {
            const url = "https://www.flickr.com/photos/brandonsphoto" +
                                                                 "/9501379492/";
            const expected = "https://ci-9501379492-4e98885b.http.atlas.cdn" +
                                             ".yimg.com/flickr2/90534814@N05/" +
                                               "9501379492/9501379492_360p.mp4";
            return extract(url).then(function (file) {
                assert.ok(file.startsWith(expected),
                          `"${file}".startsWith(expected)`);
            });
        });
    });
});
