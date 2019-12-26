import fs        from "fs";
import { URL }   from "url";
import nodeFetch from "node-fetch";

const MOCK_FETCH_DIR = "./test/unit/mock/fetch/";

export const fetch = (input, init = {}) => {
    const { hostname, searchParams } = new URL(input);
    if ("steamcommunity.com" === hostname) {
        return new Promise((resolve) => {
            const file = MOCK_FETCH_DIR + "steamcommunity/" +
                         searchParams.get("steamid") + ".json";
            fs.readFile(file, (err, data) => {
                if (err) {
                    resolve(nodeFetch(input, init));
                } else {
                    resolve({ "json": () => JSON.parse(data) });
                }
            });
        });
    }
    return nodeFetch(input, init);
};
