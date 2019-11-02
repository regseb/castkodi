import fs        from "fs";
import { URL }   from "url";
import nodeFetch from "node-fetch";

export const fetch = (input, init = {}) => {
    const { hostname, pathname, searchParams } = new URL(input);
    if ("www.1tv.ru" === hostname) {
        return new Promise((resolve) => {
            const file = "./test/mock/fetch/onetv/" +
                         pathname.slice(pathname.lastIndexOf("/") + 1) +
                         ".html";
            fs.readFile(file, (err, data) => {
                if (err) {
                    resolve(nodeFetch(input, init));
                } else {
                    resolve({ "text": () => data });
                }
            });
        });
    }
    if ("steamcommunity.com" === hostname) {
        return new Promise((resolve) => {
            const file = "./test/mock/fetch/steamcommunity/" +
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
