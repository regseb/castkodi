/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";
import * as labeler from "../../../../../src/core/labeler/plugin/sendtokodi.js";
import "../../../setup.js";

describe("core/labeler/plugin/sendtokodi.js", () => {
    describe("extract()", () => {
        it("should return label", async () => {
            const metaExtract = mock.fn(() => Promise.resolve("foo"));

            const url = new URL(
                "plugin://plugin.video.sendtokodi/?https://bar.com",
            );

            const label = await labeler.extract(url, { metaExtract });
            assert.equal(label, "foo");

            assert.equal(metaExtract.mock.callCount(), 1);
            assert.deepEqual(metaExtract.mock.calls[0].arguments, [
                new URL("https://bar.com"),
            ]);
        });

        it("should return URL", async () => {
            const metaExtract = mock.fn(() => Promise.resolve(undefined));

            const url = new URL(
                "plugin://plugin.video.sendtokodi/?https://foo.io",
            );

            const label = await labeler.extract(url, { metaExtract });
            assert.equal(label, "https://foo.io");

            assert.equal(metaExtract.mock.callCount(), 1);
            assert.deepEqual(metaExtract.mock.calls[0].arguments, [
                new URL("https://foo.io"),
            ]);
        });
    });
});
