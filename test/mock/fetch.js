import fs        from "fs";
import { URL }   from "url";
import nodeFetch from "node-fetch";

export const fetch = (input, init = {}) => {
    const { hostname, pathname } = new URL(input);
    if ("www.1tv.ru" === hostname) {
        return new Promise((resolve) => {
            const file = "./test/mock/fetch/onetv/" +
                         pathname.substring(pathname.lastIndexOf("/") + 1) +
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
    return nodeFetch(input, init);
};
