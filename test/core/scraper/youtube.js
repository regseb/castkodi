import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("scraper/youtube", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL", function () {
            const url = "https://www.youtube.com/feed/trending";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://www.youtube.com/watch*", function () {
        it("should return error when it's not a video", function () {
            browser.storage.local.set({ "youtube-playlist": "playlist" });

            const url = "https://www.youtube.com/watch?x=123456";
            const expected = "noVideo";
            return extract(url).then(function () {
                assert.fail();
            }, function (error) {
                assert.strictEqual(error.name, "PebkacError");
                assert.ok(error.title.includes(expected));
                assert.ok(error.message.includes(expected));

                browser.storage.local.clear();
            });
        });

        it("should return playlist id", function () {
            browser.storage.local.set({ "youtube-playlist": "playlist" });

            const url = "https://www.youtube.com/watch" +
                                     "?v=avt4ZWlVjdY" +
                                     "&list=PL7nedIL_qbuZBS5ZAiGkjB1LW9C3zZvum";
            const expected = "plugin://plugin.video.youtube/play/" +
                              "?playlist_id=PL7nedIL_qbuZBS5ZAiGkjB1LW9C3zZvum";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);

                browser.storage.local.clear();
            });
        });

        it("should return video id", function () {
            browser.storage.local.set({ "youtube-playlist": "video" });

            const url = "https://www.youtube.com/watch" +
                                     "?v=avt4ZWlVjdY" +
                                     "&list=PL7nedIL_qbuZBS5ZAiGkjB1LW9C3zZvum";
            const expected = "plugin://plugin.video.youtube/play/" +
                                                        "?video_id=avt4ZWlVjdY";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);

                browser.storage.local.clear();
            });
        });

        it("should return video id", function () {
            browser.storage.local.set({ "youtube-playlist": "playlist" });

            const url = "https://www.youtube.com/watch?v=sWfAtMQa_yo";
            const expected = "plugin://plugin.video.youtube/play/" +
                                                        "?video_id=sWfAtMQa_yo";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);

                browser.storage.local.clear();
            });
        });

        it("should return video id when protocol is HTTP", function () {
            browser.storage.local.set({ "youtube-playlist": "playlist" });

            const url = "http://www.youtube.com/watch?v=sWfAtMQa_yo";
            const expected = "plugin://plugin.video.youtube/play/" +
                                                        "?video_id=sWfAtMQa_yo";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);

                browser.storage.local.clear();
            });
        });
    });

    describe("*://m.youtube.com/watch*", function () {
        it("should return error when it's not a video", function () {
            browser.storage.local.set({ "youtube-playlist": "video" });

            const url = "https://m.youtube.com/watch?a=dQw4w9WgXcQ";
            const expected = "noVideo";
            return extract(url).then(function () {
                assert.fail();
            }, function (error) {
                assert.strictEqual(error.name, "PebkacError");
                assert.ok(error.title.includes(expected));
                assert.ok(error.message.includes(expected));

                browser.storage.local.clear();
            });
        });

        it("should return video id", function () {
            browser.storage.local.set({ "youtube-playlist": "playlist" });

            const url = "https://m.youtube.com/watch?v=dQw4w9WgXcQ";
            const expected = "plugin://plugin.video.youtube/play/" +
                                                        "?video_id=dQw4w9WgXcQ";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);

                browser.storage.local.clear();
            });
        });
    });

    describe("*://www.youtube.com/playlist*", function () {
        it("should return error when it's not a playlist", function () {
            const url = "https://www.youtube.com/playlist?v=dQw4w9WgXcQ";
            const expected = "noVideo";
            return extract(url).then(function () {
                assert.fail();
            }, function (error) {
                assert.strictEqual(error.name, "PebkacError");
                assert.ok(error.title.includes(expected));
                assert.ok(error.message.includes(expected));
            });
        });

        it("should return playlist id", function () {
            const url = "https://www.youtube.com/playlist" +
                                     "?list=PLd8UclkuwTj9vaRGP3859UHcdmlrkAd-9";
            const expected = "plugin://plugin.video.youtube/play/" +
                              "?playlist_id=PLd8UclkuwTj9vaRGP3859UHcdmlrkAd-9";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("*://m.youtube.com/playlist*", function () {
        it("should return error when it's not a playlist", function () {
            const url = "https://m.youtube.com/playlist" +
                                                    "?video=PL3A5849BDE0581B19";
            const expected = "noVideo";
            return extract(url).then(function () {
                assert.fail();
            }, function (error) {
                assert.strictEqual(error.name, "PebkacError");
                assert.ok(error.title.includes(expected));
                assert.ok(error.message.includes(expected));
            });
        });

        it("should return playlist id", function () {
            const url = "https://m.youtube.com/playlist" +
                                                     "?list=PL3A5849BDE0581B19";
            const expected = "plugin://plugin.video.youtube/play/" +
                                              "?playlist_id=PL3A5849BDE0581B19";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("*://youtu.be/*", function () {
        it("should return video id", function () {
            const url = "https://youtu.be/NSFbekvYOlI";
            const expected = "plugin://plugin.video.youtube/play/" +
                                                        "?video_id=NSFbekvYOlI";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });
});
