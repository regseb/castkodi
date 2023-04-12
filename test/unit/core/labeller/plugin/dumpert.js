/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import * as labeller from "../../../../../src/core/labeller/plugin/dumpert.js";

describe("core/labeller/plugin/dumpert.js", function () {
    describe("extract()", function () {
        it("should return video label", async function () {
            const fake = sinon.fake.resolves("foo");

            const url = new URL(
                "plugin://plugin.video.dumpert/" +
                    "?video_page_url=http%3A%2F%2Fbar.com%2F",
            );

            const label = await labeller.extract(url, { metaExtract: fake });
            assert.equal(label, "foo");

            assert.equal(fake.callCount, 1);
            assert.deepEqual(fake.firstCall.args, [new URL("http://bar.com/")]);
        });

        it(
            "should return undefined when there isn't 'video_page_url'" +
                " parameter",
            async function () {
                const fake = sinon.fake.resolves("foo");

                const url = new URL("plugin://plugin.video.dumpert/?bar=baz");

                const label = await labeller.extract(url, {
                    metaExtract: fake,
                });
                assert.equal(label, undefined);

                assert.equal(fake.callCount, 0);
            },
        );
    });
});
