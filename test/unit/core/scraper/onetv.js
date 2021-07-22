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
                JSON.stringify([{ mbr: [{ src: "//qux.com/quux.avi" }] }]),
            ));

            const url = new URL("https://www.1tv.ru/foo.html");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <head>
                        <meta property="ya:ovs:content_id" content="bar:baz" />
                      </head>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, "https://qux.com/quux.avi");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://www.1tv.ru/playlist?single=true&video_id=bar",
            ]);

            stub.restore();
        });

        it("should return video URL from embed", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                JSON.stringify([{ mbr: [{ src: "//baz.com/qux.avi" }] }]),
            ));

            const url = new URL("https://www.1tv.ru/embed/foo:bar");
            const content = undefined;

            const file = await scraper.extract(url, content);
            assert.strictEqual(file, "https://baz.com/qux.avi");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://www.1tv.ru/playlist?single=true&video_id=foo",
            ]);

            stub.restore();
        });
    });
});
