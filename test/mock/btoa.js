import { Buffer } from "buffer";

export const btoa = function (stringToEncode) {
    return Buffer.from(stringToEncode).toString("base64");
};
