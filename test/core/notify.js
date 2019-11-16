import assert     from "assert";
import { notify } from "../../src/core/notify.js";

describe("notify", function () {
    describe("#constructor()", function () {
        it("should accept Error", async function () {
            try {
                await notify(new Error("Message."));
                assert.fail();
            } catch (err) {
                assert.strictEqual(err.name,    "Error");
                assert.strictEqual(err.message, "Message.");
            }
        });

        it("should accept PebkacError", async function () {
            const pebkac = {
                "name":    "PebkacError",
                "title":   "Titre",
                "message": "Message."
            };
            try {
                await notify(pebkac);
                assert.fail();
            } catch (err) {
                assert.strictEqual(err, pebkac);
            }
        });
    });
});
