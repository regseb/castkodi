import nodeFetch from "node-fetch";

const USER_AGENT = "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:72.0)" +
                   "Gecko/20100101 Firefox/72.0";

export const fetch = function (resource, init = {}) {
    const headers = "headers" in init ? init.headers
                                      : {};
    headers["Accept-Language"] = "*";
    headers["User-Agent"] = USER_AGENT;
    return nodeFetch(resource, { ...init, headers });
};
