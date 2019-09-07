import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/index.js";
import { rules }   from "../../../src/core/scraper/jamendo.js";

describe("scraper/jamendo", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL", function () {
            const url = "https://www.jamendo.com/community/punk";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://www.jamendo.com/track/*/*", function () {
        let action;
        before(function () {
            action = rules.get(this.test.parent.title);
        });

        it("should return null when it's not a sound", function () {
            const url = "https://www.jamendo.com/track/404/not-found";
            const expected = null;
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return audio URL", function () {
            const url = "https://www.jamendo.com/track/3431" +
                                                      "/avant-j-etais-trappeur";
            const expected = "https://mp3l.jamendo.com/" +
                                  "?trackid=3431&format=mp31&from=app-97dab294";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return audio URL when protocol is HTTP", function () {
            const url = "http://www.jamendo.com/track/33454" +
                                                          "/vacance-au-camping";
            const expected = "https://mp3l.jamendo.com/" +
                                 "?trackid=33454&format=mp31&from=app-97dab294";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });
});
