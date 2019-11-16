import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/index.js";
import { rules }   from "../../../src/core/scraper/steam.js";

describe("scraper/steam", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL",
                                                             async function () {
            const url = "https://store.steampowered.com/stats/";

            const file = await extract(url);
            assert.strictEqual(file, url);
        });
    });

    describe("*://store.steampowered.com/app/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when it's not a video", async function () {
            const url = "https://store.steampowered.com/app/400/Portal/";
            const expected = null;

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return video URL", async function () {
            const url = "https://store.steampowered.com/app/620/Portal_2/";
            const expected = "https://steamcdn-a.akamaihd.net/steam/apps" +
                                            "/81613/movie_max.mp4?t=1452903069";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return video URL when protocol is HTTP", async function () {
            const url = "http://store.steampowered.com/app/322500/SUPERHOT/";
            const expected = "https://steamcdn-a.akamaihd.net/steam/apps" +
                                        "/256682033/movie_max.mp4?t=1492645342";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });

    describe("*://steamcommunity.com/broadcast/watch/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when it's not a video", async function () {
            const url = "https://steamcommunity.com/broadcast/watch/404";
            const expected = null;

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return video URL", async function () {
            const url = "https://steamcommunity.com/broadcast/watch" +
                                                           "/76561198802066071";
            const expected = "https://cache4-lhr1.steamcontent.com/broadcast" +
                                                          "/76561198802066071/";

            const file = await action(new URL(url));
            assert.ok(file.startsWith(expected),
                      `"${file}".startsWith(expected)`);
        });

        it("should return video URL when protocol is HTTP", async function () {
            const url = "http://steamcommunity.com/broadcast/watch" +
                                                           "/76561198802066071";
            const expected = "https://cache4-lhr1.steamcontent.com/broadcast" +
                                                          "/76561198802066071/";

            const file = await action(new URL(url));
            assert.ok(file.startsWith(expected),
                      `"${file}".startsWith(expected)`);
        });
    });
});
