/**
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

        it("should support arguments", function () {
            const fake = sinon.fake((...args) => JSON.stringify(args));
            const cached = cacheable(fake);

            assert.equal(cached(true), "[true]");
            assert.equal(cached(1, 2), "[1,2]");
            assert.equal(cached(1, 2), "[1,2]");
            assert.equal(cached([1, 2]), "[[1,2]]");

            assert.equal(fake.callCount, 3);
            assert.deepEqual(fake.firstCall.args, [true]);
            assert.deepEqual(fake.secondCall.args, [1, 2]);
            assert.deepEqual(fake.thirdCall.args, [[1, 2]]);
        });
    });
});
