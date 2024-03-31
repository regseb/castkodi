/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import * as labeler from "../../../../../src/core/labeler/plugin/sendtokodi.js";

describe("core/labeler/plugin/sendtokodi.js", function () {
    describe("extract()", function () {
        it("should return label", async function () {
            const fake = sinon.fake.resolves("foo");

            const url = new URL(
                "plugin://plugin.video.sendtokodi/?https://bar.com",
            );

            const label = await labeler.extract(url, { metaExtract: fake });
            assert.equal(label, "foo");

            assert.equal(fake.callCount, 1);
            assert.deepEqual(fake.firstCall.args, [new URL("https://bar.com")]);
        });

        it("should return URL", async function () {
            const fake = sinon.fake.resolves(undefined);

            const url = new URL(
                "plugin://plugin.video.sendtokodi/?https://foo.io",
            );

            const label = await labeler.extract(url, { metaExtract: fake });
            assert.equal(label, "https://foo.io");

            assert.equal(fake.callCount, 1);
            assert.deepEqual(fake.firstCall.args, [new URL("https://foo.io")]);
        });
    });
});
