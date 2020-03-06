import assert      from "assert";
import sinon       from "sinon";
import { extract } from "../../../../src/core/scraper/onetv.js";

describe("core/scraper/onetv.js", function () {
    afterEach(function () {
        sinon.restore();
    });

    describe("extract()", function () {
        it("should return null when there isn't Open Graph", async function () {
            const url = "https://www.1tv.ru/foo.html";
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <head></head>
                    </html>`, "text/html")),
            };
            const expected = null;

            const file = await extract(new URL(url), content);
            assert.strictEqual(file, expected);
        });

        it("should return video URL", async function () {
            sinon.stub(globalThis, "fetch")
                 .callsFake(() => Promise.resolve({
                json: () => [{ mbr: [{ src: "//qux.com/quux.avi" }] }],
            }));

            const url = "https://www.1tv.ru/foo.html";
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <head>
                        <meta property="ya:ovs:content_id" content="bar:baz" />
                      </head>
                    </html>`, "text/html")),
            };
            const expected = "https://qux.com/quux.avi";

            const file = await extract(new URL(url), content);
            assert.strictEqual(file, expected);
            const call = globalThis.fetch.firstCall;
            assert.strictEqual(call.args[0],
                               "https://www.1tv.ru/playlist?single=true" +
                                                          "&video_id=bar");
        });

        it("should return video URL from embed", async function () {
            sinon.stub(globalThis, "fetch")
                 .callsFake(() => Promise.resolve({
                json: () => [{ mbr: [{ src: "//baz.com/qux.avi" }] }],
            }));

            const url = "https://www.1tv.ru/embed/foo:bar";
            const content = undefined;
            const expected = "https://baz.com/qux.avi";

            const file = await extract(new URL(url), content);
            assert.strictEqual(file, expected);
            const call = globalThis.fetch.firstCall;
            assert.strictEqual(call.args[0],
                               "https://www.1tv.ru/playlist?single=true" +
                                                          "&video_id=foo");
        });
    });
});
