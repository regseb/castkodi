import assert from "node:assert/strict";
import sinon from "sinon";
import * as scraper from "../../../../src/core/scraper/pokemontv.js";

describe("core/scraper/pokemontv.js", function () {
    describe("extract()", function () {
        it("should return undefined when it's a unsupported URL",
                                                             async function () {
            const url = new URL("https://watch.pokemon.com/fr-fr/#/season" +
                                "?id=la-serie-pokemon-les-voyages");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when video is unavailable",
                                                             async function () {
            const url = new URL("https://watch.pokemon.com/fr-fr/#/player?");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return french video URL", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(
                Response.json([
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
            );

            const url = new URL("https://watch.pokemon.com/fr-fr/#/player" +
                                "?id=bar");

            const file = await scraper.extract(url);
            assert.equal(file, "http://bar.fr");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://www.pokemon.com/api/pokemontv/v2/channels/fr",
            ]);
        });

        it("should return british video URL", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(
                Response.json([
                    {
                        media: [{
                            id:          "foo",
                            // eslint-disable-next-line camelcase
                            offline_url: "http://foo.co.uk",
                        }],
                    },
                ]),
            );

            const url = new URL("https://watch.pokemon.com/en-gb/#/player" +
                                "?id=foo");

            const file = await scraper.extract(url);
            assert.equal(file, "http://foo.co.uk");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://www.pokemon.com/api/pokemontv/v2/channels/uk",
            ]);
        });

        it("should return undefined when id not found", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(
                Response.json([
                    {
                        media: [{
                            id:          "foo",
                            // eslint-disable-next-line camelcase
                            offline_url: "http://foo.com",
                        }],
                    },
                ]),
            );

            const url = new URL("https://watch.pokemon.com/en-us/#/player" +
                                "?id=bar");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://www.pokemon.com/api/pokemontv/v2/channels/us",
            ]);
        });
    });
});
