import assert      from "assert";
import sinon       from "sinon";
import { extract } from "../../../../src/core/scraper/soundcloud.js";

describe("core/scraper/soundcloud.js", function () {
    afterEach(function () {
        sinon.restore();
    });

    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = "https://soundcloud.com/stream";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return null when it's not an audio", async function () {
            const url = "https://soundcloud.com/a-tribe-called-red" +
                                                            "/sets/trapline-ep";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return null when it's not an audio with one slash",
                                                             async function () {
            sinon.stub(globalThis, "fetch")
                 .callsFake(() => Promise.resolve({ "text": () => "" }));

            const url = "https://soundcloud.com/foo/bar";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
            const call = globalThis.fetch.firstCall;
            assert.strictEqual(call.args[0],
                               "https://soundcloud.com/oembed" +
                               "?url=https%3A%2F%2Fsoundcloud.com%2Ffoo%2Fbar");
        });

        it("should return audio id", async function () {
            sinon.stub(globalThis, "fetch")
                 .callsFake(() => Promise.resolve({
                "text": () => "API.soundcloud.com%2Ftracks%2Fbaz&quz"
            }));

            const url = "https://soundcloud.com/foo/bar";
            const expected = "plugin://plugin.audio.soundcloud/play/" +
                                                                "?track_id=baz";

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
            const call = globalThis.fetch.firstCall;
            assert.strictEqual(call.args[0],
                               "https://soundcloud.com/oembed" +
                               "?url=https%3A%2F%2Fsoundcloud.com%2Ffoo%2Fbar");
        });

        it("should return audio id from mobile version", async function () {
            sinon.stub(globalThis, "fetch")
                 .callsFake(() => Promise.resolve({
                "text": () => "API.soundcloud.com%2Ftracks%2Fbaz&quz"
            }));

            const url = "https://mobi.soundcloud.com/foo/bar";
            const expected = "plugin://plugin.audio.soundcloud/play/" +
                                                                "?track_id=baz";

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
            const call = globalThis.fetch.firstCall;
            assert.strictEqual(call.args[0],
                               "https://soundcloud.com/oembed" +
                               "?url=https%3A%2F%2Fsoundcloud.com%2Ffoo%2Fbar");
        });
    });
});
