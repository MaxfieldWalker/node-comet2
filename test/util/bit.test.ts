"use strict";

import { getMSB } from "../../src/util/bit";
import * as assert from "assert";


suite("bit test", () => {
    test("getMSB", () => {
        let n = 0x4000;
        let msb = getMSB(n);
        assert.equal(msb, 0);

        n = 0x8000;
        msb = getMSB(n)
        assert.equal(msb, 1);
    });
});
