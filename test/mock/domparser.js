"use strict";

const jsdom = require("jsdom");

const DOMParser = class {
    constructor() {
        this.JSDOM = jsdom.JSDOM;
    }

    parseFromString(data) {
        return new this.JSDOM(data).window.document;
    }
};

module.exports = DOMParser;
