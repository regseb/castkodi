import assert     from "assert";
import { action } from "../../../../src/core/scraper/extractor/video.js";

describe("scraper/extractor/video", function () {
    describe("#action()", function () {
        it("should return null when there is not video", async function () {
            const url = "https://en.wikipedia.org/wiki/HTML5_video";
            const expected = null;

            const response = await fetch(url);
            const text = await response.text();
            const doc = new DOMParser().parseFromString(text, "text/html");

            const file = action(doc);
            assert.strictEqual(file, expected);
        });

        it("should return BitChute URL", async function () {
            const url = "https://www.bitchute.com/video/dz5JcCZnJMge/";
            const expected = "https://seed126.bitchute.com/hU2elaB5u3kB" +
                                                            "/dz5JcCZnJMge.mp4";

            const response = await fetch(url);
            const text = await response.text();
            const doc = new DOMParser().parseFromString(text, "text/html");

            const file = action(doc);
            assert.strictEqual(file, expected);
        });

        it("should return LiveLeak URL", async function () {
            const url = "https://www.liveleak.com/view?t=HfVq_1535497667";
            const expected = "https://cdn.liveleak.com/80281E/ll_a_s/2018/" +
                                                                     "Aug/28/" +
                  "LiveLeak-dot-com-Untitled_1535497475.wmv.5b85d54bbb2dd.mp4?";

            const response = await fetch(url);
            const text = await response.text();
            const doc = new DOMParser().parseFromString(text, "text/html");

            const file = action(doc);
            assert.ok(file.startsWith(expected),
                      `"${file}".startsWith(expected)`);
        });

        it("should return LiveLeak URL even when URL contains" +
                                                 " \"mp4\"", async function () {
            const url = "https://www.liveleak.com/view?t=Cmp4X_1539969642";
            const expected = "https://cdn.liveleak.com/80281E/ll_a_s/2018/" +
                                                                     "Oct/19/" +
                  "LiveLeak-dot-com-LaunchPadWaterDelugeSystemTestatNASAKenn_" +
                                            "1539969608.mp4.5bca1334cea29.mp4?";

            const response = await fetch(url);
            const text = await response.text();
            const doc = new DOMParser().parseFromString(text, "text/html");

            const file = action(doc);
            assert.ok(file.startsWith(expected),
                      `"${file}".startsWith(expected)`);
        });
    });
});
