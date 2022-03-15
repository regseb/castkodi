import assert from "node:assert";
import sinon from "sinon";
import { cacheable } from "../../../../src/core/tools/cacheable.js";

describe("tools/cacheable.js", function () {
    describe("cacheable()", function () {
        it("should call one times", function () {
            const fake = sinon.fake.returns("foo");
            const cached = cacheable(fake);
            assert.deepStrictEqual(
                Object.getOwnPropertyDescriptor(cached, "name"),
                Object.getOwnPropertyDescriptor(fake, "name"),
            );

            assert.strictEqual(cached(), "foo");
            assert.strictEqual(cached(), "foo");

            assert.strictEqual(fake.callCount, 1);
        });
    });
});
