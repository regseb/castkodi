import fs        from "fs";
import { URL }   from "url";
import nodeFetch from "node-fetch";

export const fetch = (input, init = {}) => {
    const url = new URL(input);
    if ("www.1tv.ru" === url.hostname) {
        return new Promise((resolve) => {
            fs.readFile("./fetch/onetv", (err, data) => {
                if (err) {
                    resolve(nodeFetch(input, init));
                } else {
                    resolve(data);
                }
            });
        });
    }
    return nodeFetch(input, init);
};
