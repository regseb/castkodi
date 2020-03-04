import assert      from "assert";
import sinon       from "sinon";
import { extract } from "../../../../src/core/scraper/mixer.js";

describe("core/scraper/mixer.js", function () {
    afterEach(function () {
        sinon.restore();
    });

    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = "https://dev.mixer.com/guides/core/introduction";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return null when it's invalid URL", async function () {
            const url = "https://mixer.com/foo/bar";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return null when it's not a video", async function () {
            sinon.stub(globalThis, "fetch")
                 .callsFake(() => Promise.resolve({ ok: false }));

            const url = "https://mixer.com/foo";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
            const call = globalThis.fetch.firstCall;
            assert.strictEqual(call.args[0],
                               "https://mixer.com/api/v1/channels/foo");
        });

        it("should return video URL", async function () {
            sinon.stub(globalThis, "fetch")
                 .callsFake(() => Promise.resolve({
                ok:   true,
                json: () => ({ id: "bar" }),
            }));

            const url = "https://mixer.com/foo";
            const expected = "https://mixer.com/api/v1/channels/bar" +
                                                               "/manifest.m3u8";

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
            const call = globalThis.fetch.firstCall;
            assert.strictEqual(call.args[0],
                               "https://mixer.com/api/v1/channels/foo");
        });

        it("should return video URL from embed video", async function () {
            sinon.stub(globalThis, "fetch")
                 .callsFake(() => Promise.resolve({
                ok:   true,
                json: () => ({ id: "bar" }),
            }));

            const url = "https://mixer.com/embed/player/foo";
            const expected = "https://mixer.com/api/v1/channels/bar" +
                                                               "/manifest.m3u8";

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
            const call = globalThis.fetch.firstCall;
            assert.strictEqual(call.args[0],
                               "https://mixer.com/api/v1/channels/foo");
        });
    });
});
