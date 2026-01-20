/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import * as scraper from "../../../../src/core/scraper/rumble.js";
import "../../setup.js";

describe("core/scraper/rumble.js", () => {
    afterEach(() => {
        mock.reset();
    });

    describe("extract()", () => {
        it("shouldn't handle when it's a unsupported URL", async () => {
            const url = new URL("https://rumble.com/browse");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when no link", async () => {
            const url = new URL("https://rumble.com/foo.html");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            '<html lang="en"><head></head></html>',
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, undefined);
        });

        it("should return video URL", async () => {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    Response.json({
                        ua: {
                            360: ["https://foo.com/bar_360.mp4", 0],
                            480: ["https://foo.com/bar_480.mp4", 0],
                            720: ["https://foo.com/bar_720.mp4", 0],
                            1080: ["https://foo.com/bar_1080.mp4", 0],
                        },
                    }),
                ),
            );

            const url = new URL("https://rumble.com/baz.html");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><head>
                               <link
                                 rel="alternate"
                                 href="https://rumble.com/api/Media/oembed.json?url=https%3A%2F%2Frumble.com%2Fembed%2Fqux%2F"
                                 type="application/json+oembed"
                               />
                             </head></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, "https://foo.com/bar_1080.mp4");

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://rumble.com/embedJS/u3/?request=video&v=qux",
            ]);
        });
    });

    describe("extractEmbed()", () => {
        it("shouldn't handle when it's a unsupported URL", async () => {
            const url = new URL("https://help.rumble.com/");

            const file = await scraper.extractEmbed(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when id is invalid", async () => {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(Response.json(false)),
            );

            const url = new URL("https://rumble.com/embed/foo/");

            const file = await scraper.extractEmbed(url);
            assert.equal(file, undefined);

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://rumble.com/embedJS/u3/?request=video&v=foo",
            ]);
        });

        it("should return video URL", async () => {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    Response.json({
                        ua: {
                            360: ["https://foo.com/bar_360.mp4", 0],
                            480: ["https://foo.com/bar_480.mp4", 0],
                            720: ["https://foo.com/bar_720.mp4", 0],
                        },
                    }),
                ),
            );

            const url = new URL("https://rumble.com/embed/baz/");

            const file = await scraper.extractEmbed(url);
            assert.equal(file, "https://foo.com/bar_720.mp4");

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://rumble.com/embedJS/u3/?request=video&v=baz",
            ]);
        });
    });
});
