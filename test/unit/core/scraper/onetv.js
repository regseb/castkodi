import assert from "node:assert";
import sinon from "sinon";
import * as scraper from "../../../../src/core/scraper/onetv.js";

describe("core/scraper/onetv.js", function () {
    describe("extract()", function () {
        it("should return null when there isn't Open Graph", async function () {
            const url = new URL("https://www.1tv.ru/foo.html");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <head></head>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, null);
        });

        it("should return video URL", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                JSON.stringify([{ mbr: [{ src: "//foo.com/bar.avi" }] }]),
            ));

            const url = new URL("https://www.1tv.ru/baz.html");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <head>
                        <meta property="ya:ovs:content_id" content="qux:quux" />
                      </head>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, "https://foo.com/bar.avi");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://www.1tv.ru/playlist?single=true&video_id=qux",
            ]);
        });

        it("should return video URL from embed", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                JSON.stringify([{ mbr: [{ src: "//foo.com/bar.avi" }] }]),
            ));

            const url = new URL("https://www.1tv.ru/embed/baz:qux");
            const content = undefined;

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, "https://foo.com/bar.avi");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://www.1tv.ru/playlist?single=true&video_id=baz",
            ]);
        });
    });
});
