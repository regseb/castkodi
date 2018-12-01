import { notify } from "../../src/core/notify.js";

describe("notify", function () {
    describe("#constructor()", function () {
        it("should accept Error", function () {
            notify(new Error("Message."));
        });

        it("should accept PebkacError", function () {
            const err = {
                "name":    "PebkacError",
                "title":   "Titre",
                "message": "Message."
            };
            notify(err);
        });
    });
});
