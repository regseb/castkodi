import { notify } from "../../src/core/notify.js";

describe("notify", function () {
    it("should accept Error", function () {
        notify(new Error("Message."));
    });

    it("should accept PebkacError", function () {
        const error = {
            "name":    "PebkacError",
            "title":   "Titre",
            "message": "Message."
        };
        notify(error);
    });
});
