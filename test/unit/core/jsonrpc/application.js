import assert          from "assert";
import sinon           from "sinon";
import { Application } from "../../../../src/core/jsonrpc/application.js";

describe("core/jsonrpc/application.js", function () {
    describe("getProperties()", function () {
        it("should return properties", async function () {
            const fake = sinon.fake.resolves({ mute: false, volume: 51 });

            const application = new Application({ send: fake });
            const properties = ["mute", "volume"];
            const result = await application.getProperties(properties);
            assert.deepStrictEqual(result, { mute: false, volume: 51 });

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, [
                "Application.GetProperties",
                { properties },
            ]);
        });
    });

    describe("setMute()", function () {
        it("should send request", async function () {
            const fake = sinon.fake.resolves("OK");

            const application = new Application({ send: fake });
            const mute = true;
            const result = await application.setMute(mute);
            assert.strictEqual(result, "OK");

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, [
                "Application.SetMute",
                { mute },
            ]);
        });
    });

    describe("setVolume()", function () {
        it("should send request", async function () {
            const fake = sinon.fake.resolves("OK");

            const application = new Application({ send: fake });
            const volume = 51;
            const result = await application.setVolume(volume);
            assert.strictEqual(result, "OK");

            assert.strictEqual(fake.callCount, 2);
            assert.deepStrictEqual(fake.firstCall.args, [
                "Application.SetMute",
                { mute: false },
            ]);
            assert.deepStrictEqual(fake.secondCall.args, [
                "Application.SetVolume",
                { volume },
            ]);
        });
    });

    describe("handleNotification()", function () {
        it("should ignore others namespaces", function (done) {
            const application = new Application({ send: Function.prototype });
            application.onVolumeChanged.addListener(assert.fail);
            application.handleNotification({
                method: "Other.OnVolumeChanged",
                params: { data: "foo" },
            });
            done();
        });

        it("should call 'onVolumeChanged' listeners", function (done) {
            const application = new Application({ send: Function.prototype });
            application.onVolumeChanged.addListener((data) => {
                assert.strictEqual(data, "foo");
                done();
            });
            application.handleNotification({
                method: "Application.OnVolumeChanged",
                params: { data: "foo" },
            });
            assert.fail();
        });

        it("should ignore others notifications", function (done) {
            const application = new Application({ send: Function.prototype });
            application.onVolumeChanged.addListener(assert.fail);
            application.handleNotification({
                method: "Application.Other",
                params: { data: "foo" },
            });
            done();
        });
    });
});
