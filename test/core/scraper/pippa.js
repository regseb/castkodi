import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/scrapers.js";
import { rules }   from "../../../src/core/scraper/pippa.js";

describe("scraper/pippa", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL", function () {
            const url = "https://shows.pippa.io/studio-404";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://shows.pippa.io/*/*", function () {
        let action;
        before(function () {
            action = rules.get(this.test.parent.title);
        });

        it("should return null when it's not a sound", function () {
            const url = "https://shows.pippa.io/studio-404/";
            const expected = null;
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return sound URL", function () {
            const url = "https://shows.pippa.io/studio-404" +
                                                 "/studio-404-65-novembre-2018";
            const expected = "https://app.pippa.io/public/streams" +
                                          "/59ee5fc85d6ff59869bbeb01/episodes" +
                                                "/5bfc6eae690503213d3db1ac.mp3";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return video id when protocol is HTTP", function () {
            const url = "http://shows.pippa.io/studio-404" +
                           "/studio-404-64-octobre-2018-studio-404-x-surfrider";
            const expected = "https://app.pippa.io/public/streams" +
                                          "/59ee5fc85d6ff59869bbeb01/episodes" +
                                                "/5bc3af025840c11d736078eb.mp3";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });
});
