import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/index.js";
import { rules }   from "../../../src/core/scraper/peertube.js";

describe("scraper/peertube", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL", function () {
            const url = "https://joinpeertube.org/fr/faq/";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://*/videos/watch/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when it's not a video", function () {
            const url = "https://video.blender.org/videos/watch/uuid";
            const expected = null;
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return video URL", function () {
            const url = "https://framatube.org/videos/watch" +
                                        "/0b04f13d-1e18-4f1d-814e-4979aa7c9c44";
            const expected = "https://peertube.datagueule.tv/static/webseed" +
                               "/0b04f13d-1e18-4f1d-814e-4979aa7c9c44-1080.mp4";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return video URL when protocol is HTTP", function () {
            const url = "http://framatube.org/videos/watch" +
                                        "/0b04f13d-1e18-4f1d-814e-4979aa7c9c44";
            const expected = "https://peertube.datagueule.tv/static/webseed" +
                               "/0b04f13d-1e18-4f1d-814e-4979aa7c9c44-1080.mp4";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("*://*/videos/embed/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when it's not a PeerTube website", function () {
            const url = "https://not.peertube/videos/watch" +
                                        "/123e4567-e89b-12d3-a456-426655440000";
            const expected = null;
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return video URL", function () {
            const url = "https://framatube.org/videos/watch" +
                                        "/0900bd2e-7306-4c39-b48b-2d0cd611742e";
            const expected = "https://framatube.org/static/webseed" +
                               "/0900bd2e-7306-4c39-b48b-2d0cd611742e-1080.mp4";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });
});
