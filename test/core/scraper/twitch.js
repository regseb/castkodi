import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/index.js";
import { rules }   from "../../../src/core/scraper/twitch.js";

describe("scraper/twitch", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL",
                                                             async function () {
            const url = "https://app.twitch.tv/download";

            const file = await extract(url);
            assert.strictEqual(file, url);
        });
    });

    describe("*://www.twitch.tv/videos/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return video id", async function () {
            const url = "https://www.twitch.tv/videos/164088111";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                                          "&video_id=164088111";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return video id when protocol is HTTP", async function () {
            const url = "http://www.twitch.tv/videos/164088111";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                                          "&video_id=164088111";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });

    describe("*://go.twitch.tv/videos/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return video id", async function () {
            const url = "https://go.twitch.tv/videos/164088111";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                                          "&video_id=164088111";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });

    describe("*://m.twitch.tv/videos/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return video id", async function () {
            const url = "https://m.twitch.tv/videos/164088111";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                                          "&video_id=164088111";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });

    describe("*://clips.twitch.tv/embed*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when it's not a clip", async function () {
            const url = "https://clips.twitch.tv/embed?noclip=Awesome";
            const expected = null;

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return clip name", async function () {
            const url = "https://clips.twitch.tv/embed" +
                                    "?clip=IncredulousAbstemiousFennelImGlitch";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                    "&slug=IncredulousAbstemiousFennelImGlitch";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });

    describe("*://clips.twitch.tv/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return clip name", async function () {
            const url = "https://clips.twitch.tv/GleamingWildCougarFUNgineer";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                            "&slug=GleamingWildCougarFUNgineer";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return clip name when protocol is HTTP", async function () {
            const url = "http://clips.twitch.tv/GleamingWildCougarFUNgineer";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                            "&slug=GleamingWildCougarFUNgineer";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });

    describe("*://www.twitch.tv/*/clip/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return clip name", async function () {
            const url = "https://www.twitch.tv/twitch/clip" +
                                                "/GleamingWildCougarFUNgineer" +
                                             "?filter=clips&range=7d&sort=time";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                            "&slug=GleamingWildCougarFUNgineer";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return clip name when protocol is HTTP", async function () {
            const url = "http://www.twitch.tv/twitch/clip" +
                                                "/GleamingWildCougarFUNgineer" +
                                             "?filter=clips&range=7d&sort=time";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                            "&slug=GleamingWildCougarFUNgineer";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });

    describe("*://go.twitch.tv/*/clip/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return clip name", async function () {
            const url = "https://go.twitch.tv/twitch/clip" +
                                                 "/GleamingWildCougarFUNgineer";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                            "&slug=GleamingWildCougarFUNgineer";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });

    describe("*://m.twitch.tv/*/clip/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return clip name", async function () {
            const url = "https://m.twitch.tv/twitch/clip" +
                                                 "/GleamingWildCougarFUNgineer";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                            "&slug=GleamingWildCougarFUNgineer";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });

    describe("*://player.twitch.tv/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when it's not channel or video",
                                                             async function () {
            const url = "https://player.twitch.tv/?other=foobar";
            const expected = null;

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return channel name", async function () {
            const url = "https://player.twitch.tv/?channel=canardpc&muted=true";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                                       "&channel_name=canardpc";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return video id", async function () {
            const url = "https://player.twitch.tv/?video=474384559" +
                                                 "&autoplay=false";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                                          "&video_id=474384559";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });

    describe("*://www.twitch.tv/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when it's embed", async function () {
            const url = "https://www.twitch.tv/embed/lestream/chat";
            const expected = null;

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return null when it's subs", async function () {
            const url = "https://www.twitch.tv/subs/lestream";
            const expected = null;

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return channel name", async function () {
            const url = "https://www.twitch.tv/nolife";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                                         "&channel_name=nolife";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return channel name when protocol is HTTP",
                                                             async function () {
            const url = "http://www.twitch.tv/nolife";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                                         "&channel_name=nolife";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });

    describe("*://go.twitch.tv/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return channel name", async function () {
            const url = "https://go.twitch.tv/nolife";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                                         "&channel_name=nolife";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });

    describe("*://m.twitch.tv/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return channel name", async function () {
            const url = "https://m.twitch.tv/jvtv";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                                           "&channel_name=jvtv";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });
});
