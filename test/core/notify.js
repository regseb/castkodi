import assert     from "assert";
import { notify } from "../../src/core/notify.js";

describe("notify", function () {
    describe("#constructor()", function () {
        it("should accept Error", function () {
            return notify(new Error("Message.")).then(() => {
                assert.fail();
            }).catch((err) => {
                assert.strictEqual(err.name,    "Error");
                assert.strictEqual(err.message, "Message.");
            });
        });

        it("should accept PebkacError", function () {
            const pebkac = {
                "name":    "PebkacError",
                "title":   "Titre",
                "message": "Message."
            };
            return notify(pebkac).then(() => {
                assert.fail();
            }).catch((err) => {
                assert.strictEqual(err, pebkac);
            });
        });
    });
});
