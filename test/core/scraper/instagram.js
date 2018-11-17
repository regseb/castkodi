import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

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
        it("should return error when it's not a video", function () {
            const url = "https://www.instagram.com/p/6p_BDeK-8G/";
            const expected = "noVideo";
            return extract(url).then(function () {
                assert.fail();
            }, function (error) {
                assert.strictEqual(error.name, "PebkacError");
                assert.ok(error.title.includes(expected),
                          `"${error.title}".includes(expected)`);
                assert.ok(error.message.includes(expected),
                          `"${error.message}".includes(expected)`);
            });
        });

        it("should return video id", function () {
            const url = "https://www.instagram.com/p/BpFwZ6JnYPq/";
            const expected = "/43507506_351933205369613_6559511411523846144" +
                                                                       "_n.mp4";
            return extract(url).then(function (file) {
                assert.ok(file.endsWith(expected),
                          `"${file}".endsWith(expected)`);
            });
        });

        it("should return video id when protocol is HTTP", function () {
            const url = "https://www.instagram.com/p/Bpji87LiJFs/";
            const expected = "/44876841_340575853170202_7413375163648966656" +
                                                                       "_n.mp4";
            return extract(url).then(function (file) {
                assert.ok(file.endsWith(expected),
                          `"${file}".endsWith(expected)`);
            });
        });
    });
});
