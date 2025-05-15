/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import * as labeler from "../../../../src/core/labeler/soundcloud.js";

describe("core/labeler/soundcloud.js", function () {
    afterEach(function () {
        mock.reset();
    });

    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://blog.soundcloud.com/");

            const file = await labeler.extract(url);
            assert.equal(file, undefined);
        });

        it("should return audio label", async function () {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    new Response(
                        `<html lang="en"><head>
                           <meta property="og:title" content="foo" />
                         </head></html>`,
                    ),
                ),
            );

            const url = new URL("https://soundcloud.com/bar");

            const label = await labeler.extract(url);
            assert.equal(label, "foo");

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                new URL("https://soundcloud.com/bar"),
            ]);
        });

        it("should return undefined when it isn't audio page", async function () {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    new Response('<html lang="en"><head></head></html>'),
                ),
            );

            const url = new URL("https://soundcloud.com/foo");

            const label = await labeler.extract(url);
            assert.equal(label, undefined);

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                new URL("https://soundcloud.com/foo"),
            ]);
        });
    });
});
