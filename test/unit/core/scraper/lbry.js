import assert      from "assert";
import sinon       from "sinon";
import { extract } from "../../../../src/core/scraper/lbry.js";

describe("core/scraper/lbry.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("https://lbry.tech/");

            const file = await extract(url);
            assert.strictEqual(file, null);
        });

        it("should return null when it's not a video", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                JSON.stringify({}),
            ));
            const clock = sinon.useFakeTimers(42);

            const url = new URL("https://lbry.tv/foo");

            const file = await extract(url);
            assert.strictEqual(file, null);

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://api.lbry.tv/api/v1/proxy?m=get",
                {
                    method:  "POST",
                    headers: { "Content-Type": "application/json-rpc" },
                    body:    JSON.stringify({
                        jsonrpc: "2.0",
                        method:  "get",
                        params:  {
                            uri:       "lbry://foo",
                            // eslint-disable-next-line camelcase
                            save_file: false,
                        },
                        id:      42,
                    }),
                },
            ]);

            clock.restore();
            stub.restore();
        });

        it("should return video URL", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                JSON.stringify({
                    // eslint-disable-next-line camelcase
                    result: { streaming_url: "https://baz.com/" },
                }),
            ));
            const clock = sinon.useFakeTimers(42);

            const url = new URL("https://lbry.tv/foo:0/bar:1");

            const file = await extract(url);
            assert.strictEqual(file, "https://baz.com/");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://api.lbry.tv/api/v1/proxy?m=get",
                {
                    method:  "POST",
                    headers: { "Content-Type": "application/json-rpc" },
                    body:    JSON.stringify({
                        jsonrpc: "2.0",
                        method:  "get",
                        params:  {
                            uri:       "lbry://foo#0/bar#1",
                            // eslint-disable-next-line camelcase
                            save_file: false,
                        },
                        id:      42,
                    }),
                },
            ]);

            clock.restore();
            stub.restore();
        });

        it("should return video URL from embed", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                JSON.stringify({
                    // eslint-disable-next-line camelcase
                    result: { streaming_url: "https://baz.com/" },
                }),
            ));
            const clock = sinon.useFakeTimers(42);

            const url = new URL("https://lbry.tv/$/embed/foo/bar");

            const file = await extract(url);
            assert.strictEqual(file, "https://baz.com/");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://api.lbry.tv/api/v1/proxy?m=get",
                {
                    method:  "POST",
                    headers: { "Content-Type": "application/json-rpc" },
                    body:    JSON.stringify({
                        jsonrpc: "2.0",
                        method:  "get",
                        params:  {
                            uri:       "lbry://foo#bar",
                            // eslint-disable-next-line camelcase
                            save_file: false,
                        },
                        id:      42,
                    }),
                },
            ]);

            clock.restore();
            stub.restore();
        });
    });
});
