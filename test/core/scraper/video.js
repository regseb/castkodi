import assert    from "assert";
import { URL }   from "url";
import { rules } from "../../../src/core/scraper/video.js";

describe("scraper/video", function () {
    describe("*://*/*", function () {
        let action;
        before(function () {
            action = Array.from(rules.entries())
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when it's not a page HTML", function () {
            const url = "https://kodi.tv/sites/default/themes/kodi/" +
                                                                 "logo-sbs.svg";
            const expected = null;
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return BitChute URL", function () {
            const url = "https://www.bitchute.com/video/dz5JcCZnJMge/";
            const expected = "https://seed22.bitchute.com/hU2elaB5u3kB" +
                                                            "/dz5JcCZnJMge.mp4";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return LiveLeak URL", function () {
            const url = "https://www.liveleak.com/view?t=HfVq_1535497667";
            const expected = "https://cdn.liveleak.com/80281E/ll_a_s/2018/" +
                                                                     "Aug/28/" +
                  "LiveLeak-dot-com-Untitled_1535497475.wmv.5b85d54bbb2dd.mp4?";
            return action(new URL(url)).then(function (file) {
                assert.ok(file.startsWith(expected),
                          `"${file}".startsWith(expected)`);
            });
        });

        it("should return LiveLeak URL even when URL contains" +
                                                       " \"mp4\"", function () {
            const url = "https://www.liveleak.com/view?t=Cmp4X_1539969642";
            const expected = "https://cdn.liveleak.com/80281E/ll_a_s/2018/" +
                                                                     "Oct/19/" +
                  "LiveLeak-dot-com-LaunchPadWaterDelugeSystemTestatNASAKenn_" +
                                            "1539969608.mp4.5bca1334cea29.mp4?";
            return action(new URL(url)).then(function (file) {
                assert.ok(file.startsWith(expected),
                          `"${file}".startsWith(expected)`);
            });
        });
    });
});
