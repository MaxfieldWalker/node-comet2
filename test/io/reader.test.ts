"use strict";

import { Reader } from "../../src/io/reader";

suite("Reader test", () => {
    test("read", () => {
        const buf = Reader.read("./package.json");
    })
});
