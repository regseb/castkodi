import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/index.js";
import { rules }   from "../../../src/core/scraper/twitch.js";

describe("scraper/twitch", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL", function () {
            const url = "https://app.twitch.tv/download";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://www.twitch.tv/videos/*", function () {
        let action;
        before(function () {
            action = Array.from(rules.entries())
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return video id", function () {
            const url = "https://www.twitch.tv/videos/164088111";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                                          "&video_id=164088111";

            const file = action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return video id when protocol is HTTP", function () {
            const url = "http://www.twitch.tv/videos/164088111";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                                          "&video_id=164088111";

            const file = action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });

    describe("*://go.twitch.tv/videos/*", function () {
        let action;
        before(function () {
            action = Array.from(rules.entries())
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return video id", function () {
            const url = "https://go.twitch.tv/videos/164088111";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                                          "&video_id=164088111";

            const file = action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });

    describe("*://m.twitch.tv/videos/*", function () {
        let action;
        before(function () {
            action = Array.from(rules.entries())
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return video id", function () {
            const url = "https://m.twitch.tv/videos/164088111";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                                          "&video_id=164088111";

            const file = action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });

    describe("*://clips.twitch.tv/*", function () {
        let action;
        before(function () {
            action = rules.get(this.test.parent.title);
        });

        it("should return clip name", function () {
            const url = "https://clips.twitch.tv/GleamingWildCougarFUNgineer";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                            "&slug=GleamingWildCougarFUNgineer";

            const file = action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return clip name when protocol is HTTP", function () {
            const url = "http://clips.twitch.tv/GleamingWildCougarFUNgineer";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                            "&slug=GleamingWildCougarFUNgineer";

            const file = action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });

    describe("*://www.twitch.tv/*/clip/*", function () {
        let action;
        before(function () {
            action = Array.from(rules.entries())
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return clip name", function () {
            const url = "https://www.twitch.tv/twitch/clip" +
                                                "/GleamingWildCougarFUNgineer" +
                                             "?filter=clips&range=7d&sort=time";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                            "&slug=GleamingWildCougarFUNgineer";

            const file = action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return clip name when protocol is HTTP", function () {
            const url = "http://www.twitch.tv/twitch/clip" +
                                                "/GleamingWildCougarFUNgineer" +
                                             "?filter=clips&range=7d&sort=time";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                            "&slug=GleamingWildCougarFUNgineer";

            const file = action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });

    describe("*://go.twitch.tv/*/clip/*", function () {
        let action;
        before(function () {
            action = Array.from(rules.entries())
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return clip name", function () {
            const url = "https://go.twitch.tv/twitch/clip" +
                                                 "/GleamingWildCougarFUNgineer";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                            "&slug=GleamingWildCougarFUNgineer";

            const file = action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });

    describe("*://m.twitch.tv/*/clip/*", function () {
        let action;
        before(function () {
            action = Array.from(rules.entries())
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return clip name", function () {
            const url = "https://m.twitch.tv/twitch/clip" +
                                                 "/GleamingWildCougarFUNgineer";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                            "&slug=GleamingWildCougarFUNgineer";

            const file = action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });

    describe("*://www.twitch.tv/*", function () {
        let action;
        before(function () {
            action = Array.from(rules.entries())
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return channel name", function () {
            const url = "https://www.twitch.tv/nolife";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                                         "&channel_name=nolife";

            const file = action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return channel name when protocol is HTTP", function () {
            const url = "http://www.twitch.tv/nolife";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                                         "&channel_name=nolife";

            const file = action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });

    describe("*://go.twitch.tv/*", function () {
        let action;
        before(function () {
            action = Array.from(rules.entries())
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return channel name", function () {
            const url = "https://go.twitch.tv/nolife";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                                         "&channel_name=nolife";

            const file = action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });

    describe("*://m.twitch.tv/*", function () {
        let action;
        before(function () {
            action = Array.from(rules.entries())
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return channel name", function () {
            const url = "https://m.twitch.tv/jvtv";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                                           "&channel_name=jvtv";

            const file = action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });
});
