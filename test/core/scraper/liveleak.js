import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("scraper/liveleak", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL", function () {
            const url = "https://www.liveleak.com/broadcasts";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://www.liveleak.com/view*", function () {
        it("should return sound URL", function () {
            const url = "https://www.liveleak.com/view?t=HfVq_1535497667";
            const expected = "https://cdn.liveleak.com/80281E/ll_a_s/2018/" +
                                                                     "Aug/28/" +
                  "LiveLeak-dot-com-Untitled_1535497475.wmv.5b85d54bbb2dd.mp4?";
            return extract(url).then(function (file) {
                assert.ok(file.startsWith(expected),
                          `"${file}".startsWith(expected)`);
            });
        });

        it("should return sound URL when protocol is HTTP", function () {
            const url = "http://www.liveleak.com/view?t=HfVq_1535497667";
            const expected = "https://cdn.liveleak.com/80281E/ll_a_s/2018/" +
                                                                     "Aug/28/" +
                  "LiveLeak-dot-com-Untitled_1535497475.wmv.5b85d54bbb2dd.mp4?";
            return extract(url).then(function (file) {
                assert.ok(file.startsWith(expected),
                          `"${file}".startsWith(expected)`);
            });
        });
    });
});
