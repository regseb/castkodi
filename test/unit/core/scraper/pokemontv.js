import assert      from "assert";
import sinon       from "sinon";
import { extract } from "../../../../src/core/scraper/pokemontv.js";

describe("core/scraper/pokemontv.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("ihttps://watch.pokemon.com/fr-fr/#/season" +
                                            "?id=la-serie-pokemon-les-voyages");

            const file = await extract(url);
            assert.strictEqual(file, null);
        });

        it("should return null when video is unavailable", async function () {
            const url = new URL("https://watch.pokemon.com/fr-fr/#/player?");

            const file = await extract(url);
            assert.strictEqual(file, null);
        });

        it("should return french video URL", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                JSON.stringify([
                    {
                        media: [],
                    }, {
                        media: [{
                            id:          "foo",
                            // eslint-disable-next-line camelcase
                            offline_url: "http://foo.com",
                        }, {
                            id:          "bar",
                            // eslint-disable-next-line camelcase
                            offline_url: "http://bar.fr",
                        }],
                    },
                ]),
            ));

            const url = new URL("https://watch.pokemon.com/fr-fr/#/player" +
                                                                     "?id=bar");

            const file = await extract(url);
            assert.strictEqual(file, "http://bar.fr");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://www.pokemon.com/api/pokemontv/v2/channels/fr",
            ]);

            stub.restore();
        });

        it("should return british video URL", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                JSON.stringify([
                    {
                        media: [{
                            id:          "foo",
                            // eslint-disable-next-line camelcase
                            offline_url: "http://foo.co.uk",
                        }],
                    },
                ]),
            ));

            const url = new URL("https://watch.pokemon.com/en-gb/#/player" +
                                                                     "?id=foo");

            const file = await extract(url);
            assert.strictEqual(file, "http://foo.co.uk");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://www.pokemon.com/api/pokemontv/v2/channels/uk",
            ]);

            stub.restore();
        });

        it("should return null when id not found", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                JSON.stringify([
                    {
                        media: [{
                            id:          "foo",
                            // eslint-disable-next-line camelcase
                            offline_url: "http://foo.com",
                        }],
                    },
                ]),
            ));

            const url = new URL("https://watch.pokemon.com/en-us/#/player" +
                                                                     "?id=bar");

            const file = await extract(url);
            assert.strictEqual(file, null);

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://www.pokemon.com/api/pokemontv/v2/channels/us",
            ]);

            stub.restore();
        });
    });
});
