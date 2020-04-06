import assert      from "assert";
import sinon       from "sinon";
import { extract } from "../../../../src/core/scraper/mixer.js";

describe("core/scraper/mixer.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = "https://dev.mixer.com/guides/core/introduction";

            const file = await extract(new URL(url));
            assert.strictEqual(file, null);
        });

        it("should return null when it's invalid URL", async function () {
            const url = "https://mixer.com/foo/bar";

            const file = await extract(new URL(url));
            assert.strictEqual(file, null);
        });

        it("should return null when it's not a video", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                "",
                { status: 404 },
            ));

            const url = "https://mixer.com/foo";

            const file = await extract(new URL(url));
            assert.strictEqual(file, null);

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://mixer.com/api/v1/channels/foo",
            ]);

            stub.restore();
        });

        it("should return video URL", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                JSON.stringify({ id: "bar" }),
            ));

            const url = "https://mixer.com/foo";

            const file = await extract(new URL(url));
            assert.strictEqual(file,
                "https://mixer.com/api/v1/channels/bar/manifest.m3u8");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://mixer.com/api/v1/channels/foo",
            ]);

            stub.restore();
        });

        it("should return video URL from embed video", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                JSON.stringify({ id: "bar" }),
            ));

            const url = "https://mixer.com/embed/player/foo";

            const file = await extract(new URL(url));
            assert.strictEqual(file,
                "https://mixer.com/api/v1/channels/bar/manifest.m3u8");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://mixer.com/api/v1/channels/foo",
            ]);

            stub.restore();
        });
    });
});
