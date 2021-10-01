import assert from "node:assert";
import sinon from "sinon";
import { Input } from "../../../../src/core/jsonrpc/input.js";
import { Kodi } from "../../../../src/core/jsonrpc/kodi.js";
import { NotificationEvent }
                         from "../../../../src/core/tools/notificationevent.js";

describe("core/jsonrpc/input.js", function () {
    describe("back()", function () {
        it("should send request", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves("OK");

            const input = new Input(kodi);
            const result = await input.back();
            assert.strictEqual(result, "OK");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, ["Input.Back"]);

            stub.restore();
        });
    });

    describe("contextMenu()", function () {
        it("should send request", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves("OK");

            const input = new Input(kodi);
            const result = await input.contextMenu();
            assert.strictEqual(result, "OK");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, ["Input.ContextMenu"]);

            stub.restore();
        });
    });

    describe("down()", function () {
        it("should send request", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves("OK");

            const input = new Input(kodi);
            const result = await input.down();
            assert.strictEqual(result, "OK");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, ["Input.Down"]);

            stub.restore();
        });
    });

    describe("home()", function () {
        it("should send request", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves("OK");

            const input = new Input(kodi);
            const result = await input.home();
            assert.strictEqual(result, "OK");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, ["Input.Home"]);

            stub.restore();
        });
    });

    describe("info()", function () {
        it("should send request", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves("OK");

            const input = new Input(kodi);
            const result = await input.info();
            assert.strictEqual(result, "OK");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, ["Input.Info"]);

            stub.restore();
        });
    });

    describe("left()", function () {
        it("should send request", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves("OK");

            const input = new Input(kodi);
            const result = await input.left();
            assert.strictEqual(result, "OK");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, ["Input.Left"]);

            stub.restore();
        });
    });

    describe("right()", function () {
        it("should send request", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves("OK");

            const input = new Input(kodi);
            const result = await input.right();
            assert.strictEqual(result, "OK");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, ["Input.Right"]);

            stub.restore();
        });
    });

    describe("select()", function () {
        it("should send request", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves("OK");

            const input = new Input(kodi);
            const result = await input.select();
            assert.strictEqual(result, "OK");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, ["Input.Select"]);

            stub.restore();
        });
    });

    describe("sendText()", function () {
        it("should send request", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves("OK");

            const input = new Input(kodi);
            const result = await input.sendText("foo", false);
            assert.strictEqual(result, "OK");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "Input.SendText",
                { text: "foo", done: false },
            ]);

            stub.restore();
        });

        it("should send request and finish", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves("OK");

            const input = new Input(kodi);
            const result = await input.sendText("foo", true);
            assert.strictEqual(result, "OK");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "Input.SendText",
                { text: "foo", done: true },
            ]);

            stub.restore();
        });
    });

    describe("showOSD()", function () {
        it("should send request", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves("OK");

            const input = new Input(kodi);
            const result = await input.showOSD();
            assert.strictEqual(result, "OK");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, ["Input.ShowOSD"]);

            stub.restore();
        });
    });

    describe("showPlayerProcessInfo()", function () {
        it("should send request", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves("OK");

            const input = new Input(kodi);
            const result = await input.showPlayerProcessInfo();
            assert.strictEqual(result, "OK");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "Input.ShowPlayerProcessInfo",
            ]);

            stub.restore();
        });
    });

    describe("up()", function () {
        it("should send request", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves("OK");

            const input = new Input(kodi);
            const result = await input.up();
            assert.strictEqual(result, "OK");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, ["Input.Up"]);

            stub.restore();
        });
    });

    describe("handleNotification()", function () {
        it("should ignore others namespaces", function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send");
            const fake = sinon.fake();

            const input = new Input(kodi);
            input.onInputRequested.addListener(fake);
            input.handleNotification(new NotificationEvent("notification", {
                method: "Other.OnInputRequested",
                params: { data: "foo" },
            }));

            assert.strictEqual(stub.callCount, 0);
            assert.strictEqual(fake.callCount, 0);

            stub.restore();
        });

        it("should ignore when no listener", function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send");

            const input = new Input(kodi);
            input.handleNotification(new NotificationEvent("notification", {
                method: "Input.OnInputRequested",
                params: { data: "foo" },
            }));

            assert.strictEqual(stub.callCount, 0);

            stub.restore();
        });

        it("should handle 'OnInputRequested'", function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send");
            const fake = sinon.fake();

            const input = new Input(kodi);
            input.onInputRequested.addListener(fake);
            input.handleNotification(new NotificationEvent("notification", {
                method: "Input.OnInputRequested",
                params: { data: { foo: "bar" } },
            }));

            assert.strictEqual(stub.callCount, 0);
            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, [{ foo: "bar" }]);

            stub.restore();
        });

        it("should ignore others notifications", function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send");
            const fake = sinon.fake();

            const input = new Input(kodi);
            input.onInputRequested.addListener(fake);
            input.handleNotification(new NotificationEvent("notification", {
                method: "Input.Other",
                params: { data: "foo" },
            }));

            assert.strictEqual(stub.callCount, 0);
            assert.strictEqual(fake.callCount, 0);

            stub.restore();
        });
    });
});
