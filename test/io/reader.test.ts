"use strict";

import { read } from "../../src/io/reader";

suite("Reader test", () => {
    test("read", () => {
        const buf = read("./package.json");
    })
});
