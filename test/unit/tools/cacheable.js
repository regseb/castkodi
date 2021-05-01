import assert from "node:assert";
import sinon from "sinon";
import { cacheable } from "../../../src/tools/cacheable.js";

describe("tools/cacheable.js", function () {
    describe("cacheable()", function () {
        it("should call one times", function () {
            const fake = sinon.fake.returns("foo");
            const cached = cacheable(fake);

            assert.strictEqual(cached(), "foo");
            assert.strictEqual(cached(), "foo");

            assert.strictEqual(fake.callCount, 1);
        });
    });
});
