"use strict";

import { hexDump } from "../../src/util/hexdumpHelper";
import * as assert from "assert";

suite("HexdumpHelper test", () => {
    test("dump", () => {
        const buf = new Buffer("abc");
        const dump = hexDump(buf);
        assert.equal(dump, "616263");
    })
});
