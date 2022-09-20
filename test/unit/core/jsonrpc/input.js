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
        });
    });

    describe("handleNotification()", function () {
        it("should ignore others namespaces", function () {
            const fake = sinon.fake();

            const input = new Input(new Kodi());
            input.onInputRequested.addListener(fake);
            input.handleNotification(new NotificationEvent("notification", {
                // Utiliser un espace de 5 caractères pour avoir la même
                // longueur que le mot "Input".
                method: "12345.OnInputRequested",
                // eslint-disable-next-line unicorn/no-null
                params: { data: null },
            }));

            assert.strictEqual(fake.callCount, 0);
        });

        it("should ignore when no listener", function () {
            const input = new Input(new Kodi());
            const spy = sinon.spy(input.onInputRequested, "dispatch");
            input.handleNotification(new NotificationEvent("notification", {
                method: "Input.OnInputRequested",
                params: { data: "foo" },
            }));

            assert.strictEqual(spy.callCount, 0);
        });

        it("should handle 'OnInputRequested'", function () {
            const fake = sinon.fake();

            const input = new Input(new Kodi());
            input.onInputRequested.addListener(fake);
            input.handleNotification(new NotificationEvent("notification", {
                method: "Input.OnInputRequested",
                params: { data: { foo: "bar" } },
            }));

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, [{ foo: "bar" }]);
        });

        it("should ignore others notifications", function () {
            const fake = sinon.fake();

            const input = new Input(new Kodi());
            input.onInputRequested.addListener(fake);
            input.handleNotification(new NotificationEvent("notification", {
                method: "Input.Other",
                params: { data: "foo" },
            }));

            assert.strictEqual(fake.callCount, 0);
        });
    });
});
