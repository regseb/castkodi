import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/index.js";
import { rules }   from "../../../src/core/scraper/youtube.js";

describe("scraper/youtube", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL", function () {
            const url = "https://www.youtube.com/feed/trending";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://*.youtube.com/watch*", function () {
        let action;
        before(function () {
            action = Array.from(rules.entries())
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when it's not a video", function () {
            browser.storage.local.set({ "youtube-playlist": "playlist" });

            const url = "https://www.youtube.com/watch?x=123456";
            const expected = null;
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);

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
            return action(new URL(url)).then(function (file) {
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
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);

                browser.storage.local.clear();
            });
        });

        it("should return video id even with playlist option", function () {
            browser.storage.local.set({ "youtube-playlist": "playlist" });

            const url = "https://www.youtube.com/watch?v=sWfAtMQa_yo";
            const expected = "plugin://plugin.video.youtube/play/" +
                                                        "?video_id=sWfAtMQa_yo";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);

                browser.storage.local.clear();
            });
        });

        it("should return video id when protocol is HTTP", function () {
            browser.storage.local.set({ "youtube-playlist": "playlist" });

            const url = "http://www.youtube.com/watch?v=sWfAtMQa_yo";
            const expected = "plugin://plugin.video.youtube/play/" +
                                                        "?video_id=sWfAtMQa_yo";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);

                browser.storage.local.clear();
            });
        });

        it("should return null when it's not a video from mobile", function () {
            browser.storage.local.set({ "youtube-playlist": "video" });

            const url = "https://m.youtube.com/watch?a=dQw4w9WgXcQ";
            const expected = null;
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);

                browser.storage.local.clear();
            });
        });

        it("should return video id from mobile", function () {
            browser.storage.local.set({ "youtube-playlist": "playlist" });

            const url = "https://m.youtube.com/watch?v=dQw4w9WgXcQ";
            const expected = "plugin://plugin.video.youtube/play/" +
                                                        "?video_id=dQw4w9WgXcQ";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);

                browser.storage.local.clear();
            });
        });

        it("should return null when it's not a video from music", function () {
            browser.storage.local.set({ "youtube-playlist": "video" });

            const url = "https://music.youtube.com/watch?m=abcdef";
            const expected = null;
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);

                browser.storage.local.clear();
            });
        });

        it("should return video id from music", function () {
            browser.storage.local.set({ "youtube-playlist": "video" });

            const url = "https://music.youtube.com/watch" +
                                                      "?v=IOqxarVWKRs" +
                                                      "&list=RDAMVMIOqxarVWKRs";
            const expected = "plugin://plugin.video.youtube/play/" +
                                                        "?video_id=IOqxarVWKRs";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);

                browser.storage.local.clear();
            });
        });
    });

    describe("*://invidio.us/watch*", function () {
        let action;
        before(function () {
            action = Array.from(rules.entries())
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return video id", function () {
            browser.storage.local.set({ "youtube-playlist": "video" });

            const url = "https://invidio.us/watch?v=e6EQwSadpPk";
            const expected = "plugin://plugin.video.youtube/play/" +
                                                        "?video_id=e6EQwSadpPk";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);

                browser.storage.local.clear();
            });
        });
    });

    describe("*://hooktube.com/watch*", function () {
        let action;
        before(function () {
            action = Array.from(rules.entries())
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return video id", function () {
            browser.storage.local.set({ "youtube-playlist": "video" });

            const url = "https://hooktube.com/watch?v=LACbVhgtx9I";
            const expected = "plugin://plugin.video.youtube/play/" +
                                                        "?video_id=LACbVhgtx9I";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);

                browser.storage.local.clear();
            });
        });
    });

    describe("*://*.youtube.com/playlist*", function () {
        let action;
        before(function () {
            action = rules.get(this.test.parent.title);
        });

        it("should return null when it's not a playlist", function () {
            const url = "https://www.youtube.com/playlist?v=dQw4w9WgXcQ";
            const expected = null;

            const file = action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return playlist id", function () {
            const url = "https://www.youtube.com/playlist" +
                                     "?list=PLd8UclkuwTj9vaRGP3859UHcdmlrkAd-9";
            const expected = "plugin://plugin.video.youtube/play/" +
                              "?playlist_id=PLd8UclkuwTj9vaRGP3859UHcdmlrkAd-9";

            const file = action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return null when it's not a playlist from mobile",
                                                                   function () {
            const url = "https://m.youtube.com/playlist" +
                                                    "?video=PL3A5849BDE0581B19";
            const expected = null;

            const file = action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return playlist id from mobile", function () {
            const url = "https://m.youtube.com/playlist" +
                                                     "?list=PL3A5849BDE0581B19";
            const expected = "plugin://plugin.video.youtube/play/" +
                                              "?playlist_id=PL3A5849BDE0581B19";

            const file = action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });

    describe("*://www.youtube.com/embed/*", function () {
        let action;
        before(function () {
            action = Array.from(rules.entries())
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return video id", function () {
            const url = "https://www.youtube.com/embed/v3gefWEggSc";
            const expected = "plugin://plugin.video.youtube/play/" +
                                                        "?video_id=v3gefWEggSc";

            const file = action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });

    describe("*://www.youtube-nocookie.com/embed/*", function () {
        let action;
        before(function () {
            action = Array.from(rules.entries())
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return video id", function () {
            const url = "https://www.youtube-nocookie.com/embed/u9gVaeb9le4";
            const expected = "plugin://plugin.video.youtube/play/" +
                                                        "?video_id=u9gVaeb9le4";

            const file = action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });

    describe("*://invidio.us/embed/*", function () {
        let action;
        before(function () {
            action = Array.from(rules.entries())
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return video id", function () {
            const url = "https://invidio.us/embed/8cmBd7lkunk";
            const expected = "plugin://plugin.video.youtube/play/" +
                                                        "?video_id=8cmBd7lkunk";

            const file = action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });

    describe("*://hooktube.com/embed/*", function () {
        let action;
        before(function () {
            action = Array.from(rules.entries())
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return video id", function () {
            const url = "https://hooktube.com/embed/3lPSQ5KjamI";
            const expected = "plugin://plugin.video.youtube/play/" +
                                                        "?video_id=3lPSQ5KjamI";

            const file = action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });

    describe("*://youtu.be/*", function () {
        let action;
        before(function () {
            action = rules.get(this.test.parent.title);
        });

        it("should return video id", function () {
            const url = "https://youtu.be/NSFbekvYOlI";
            const expected = "plugin://plugin.video.youtube/play/" +
                                                        "?video_id=NSFbekvYOlI";

            const file = action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });
});
