import assert from "assert";
import { extractClip, extractEmbed, extract }
                                  from "../../../../src/core/scraper/twitch.js";

describe("core/scraper/twitch.js", function () {
    describe("extractClip()", function () {
        it("should return null when it's not a clip", async function () {
            const url = "https://clips.twitch.tv/embed?noclip=Awesome";
            const expected = null;

            const file = await extractClip(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return embed clip name", async function () {
            const url = "https://clips.twitch.tv/embed" +
                                    "?clip=IncredulousAbstemiousFennelImGlitch";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                    "&slug=IncredulousAbstemiousFennelImGlitch";

            const file = await extractClip(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return clip name", async function () {
            const url = "https://clips.twitch.tv/GleamingWildCougarFUNgineer";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                            "&slug=GleamingWildCougarFUNgineer";

            const file = await extractClip(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return clip name when protocol is HTTP", async function () {
            const url = "http://clips.twitch.tv/GleamingWildCougarFUNgineer";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                            "&slug=GleamingWildCougarFUNgineer";

            const file = await extractClip(new URL(url));
            assert.strictEqual(file, expected);
        });
    });

    describe("extractEmbed()", function () {
        it("should return null when it's not channel or video",
                                                             async function () {
            const url = "https://player.twitch.tv/?other=foobar";
            const expected = null;

            const file = await extractEmbed(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return channel name", async function () {
            const url = "https://player.twitch.tv/?channel=canardpc&muted=true";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                                       "&channel_name=canardpc";

            const file = await extractEmbed(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return video id", async function () {
            const url = "https://player.twitch.tv/?video=474384559" +
                                                 "&autoplay=false";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                                          "&video_id=474384559";

            const file = await extractEmbed(new URL(url));
            assert.strictEqual(file, expected);
        });
    });

    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = "https://app.twitch.tv/download";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return video id", async function () {
            const url = "https://www.twitch.tv/videos/164088111";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                                          "&video_id=164088111";

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return video id when protocol is HTTP", async function () {
            const url = "http://www.twitch.tv/videos/164088111";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                                          "&video_id=164088111";

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return video id from 'go'", async function () {
            const url = "https://go.twitch.tv/videos/164088111";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                                          "&video_id=164088111";

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return video id from mobile version", async function () {
            const url = "https://m.twitch.tv/videos/164088111";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                                          "&video_id=164088111";

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return clip name", async function () {
            const url = "https://www.twitch.tv/twitch/clip" +
                                                "/GleamingWildCougarFUNgineer" +
                                             "?filter=clips&range=7d&sort=time";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                            "&slug=GleamingWildCougarFUNgineer";

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return clip name when protocol is HTTP", async function () {
            const url = "http://www.twitch.tv/twitch/clip" +
                                                "/GleamingWildCougarFUNgineer" +
                                             "?filter=clips&range=7d&sort=time";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                            "&slug=GleamingWildCougarFUNgineer";

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return clip name from 'go'", async function () {
            const url = "https://go.twitch.tv/twitch/clip" +
                                                 "/GleamingWildCougarFUNgineer";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                            "&slug=GleamingWildCougarFUNgineer";

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return clip name from mobile version", async function () {
            const url = "https://m.twitch.tv/twitch/clip" +
                                                 "/GleamingWildCougarFUNgineer";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                            "&slug=GleamingWildCougarFUNgineer";

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return channel name", async function () {
            const url = "https://www.twitch.tv/nolife";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                                         "&channel_name=nolife";

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return channel name when protocol is HTTP",
                                                             async function () {
            const url = "http://www.twitch.tv/nolife";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                                         "&channel_name=nolife";

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return channel name form 'go'", async function () {
            const url = "https://go.twitch.tv/nolife";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                                         "&channel_name=nolife";

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return channel name from mobile version", async function () {
            const url = "https://m.twitch.tv/jvtv";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                                           "&channel_name=jvtv";

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });
    });
});
