import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/scrapers.js";
import { rules }   from "../../../src/core/scraper/instagram.js";

describe("scraper/instagram", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL", function () {
            const url = "https://www.instagram.com/accounts/emailsignup/";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://www.instagram.com/p/*", function () {
        let action;
        before(function () {
            action = Array.from(rules.entries())
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when it's not a video", function () {
            const url = "https://www.instagram.com/p/6p_BDeK-8G/";
            const expected = null;
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return video id", function () {
            const url = "https://www.instagram.com/p/BpFwZ6JnYPq/";
            const expected = "/42916318_260547521318610_8896983753906192384" +
                                                                      "_n.mp4?";
            return action(new URL(url)).then(function (file) {
                assert.ok(file.includes(expected),
                          `"${file}".includes(expected)`);
            });
        });

        it("should return video id when protocol is HTTP", function () {
            const url = "https://www.instagram.com/p/Bpji87LiJFs/";
            const expected = "/44816624_492956017868278_4291428187113521152" +
                                                                      "_n.mp4?";
            return action(new URL(url)).then(function (file) {
                assert.ok(file.includes(expected),
                          `"${file}".includes(expected)`);
            });
        });
    });
});
