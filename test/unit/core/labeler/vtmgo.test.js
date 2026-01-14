/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import * as labeler from "../../../../src/core/labeler/vtmgo.js";
import "../../setup.js";

describe("core/labeler/vtmgo.js", () => {
    afterEach(() => {
        mock.reset();
    });

    describe("extract()", () => {
        it("shouldn't handle when it's a unsupported URL", async () => {
            const url = new URL("https://www.vtmgo.be/vtmgo/regarder/foo");

            const label = await labeler.extract(url);
            assert.equal(label, undefined);
        });

        it("should return label", async () => {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    new Response(
                        `<html lang="en"><head>
                           <title>foo</title>
                         </head></html>`,
                    ),
                ),
            );

            const url = new URL("https://www.vtmgo.be/vtmgo/afspelen/bar");

            const label = await labeler.extract(url);
            assert.equal(label, "foo");

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                new URL("https://www.vtmgo.be/vtmgo/afspelen/bar"),
            ]);
        });

        it("should return undefined when there isn't title", async () => {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    new Response(
                        '<html lang="en"><body><h1>foo</h1></body></html>',
                    ),
                ),
            );

            const url = new URL("https://www.vtmgo.be/vtmgo/afspelen/bar");

            const label = await labeler.extract(url);
            assert.equal(label, undefined);

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                new URL("https://www.vtmgo.be/vtmgo/afspelen/bar"),
            ]);
        });
    });
});
