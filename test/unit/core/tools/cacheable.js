/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import { cacheable } from "../../../../src/core/tools/cacheable.js";

describe("core/tools/cacheable.js", function () {
    describe("cacheable()", function () {
        it("should call one times", function () {
            const fake = sinon.fake.returns("foo");
            const cached = cacheable(fake);
            assert.deepEqual(
                Object.getOwnPropertyDescriptor(cached, "name"),
                Object.getOwnPropertyDescriptor(fake, "name"),
            );

            assert.equal(cached(), "foo");
            assert.equal(cached(), "foo");

            assert.equal(fake.callCount, 1);
        });
    });
});
