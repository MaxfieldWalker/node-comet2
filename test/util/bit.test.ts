"use strict";

import { getMSB, toSigned } from "../../src/util/bit";
import * as assert from "assert";


suite("bit test", () => {
    test("getMSB", () => {
        let n = 0x4000;
        let msb = getMSB(n);
        assert.equal(msb, 0);

        n = 0x8000;
        msb = getMSB(n);
        assert.equal(msb, 1);
    });

    test("toDecimal", () => {
        let n = 0x0000;
        let d = toSigned(n);
        assert.equal(d, 0);

        n = 0xFFFF;
        d = toSigned(n);
        assert.equal(d, -1);


        n = 0x8000;
        d = toSigned(n);
        assert.equal(d, -32768);
    });
});
