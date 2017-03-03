"use strict";

import { hexDump, splitTo2ByteArray } from "../../src/util/hexdumpHelper";
import * as assert from "assert";

suite("HexdumpHelper test", () => {
    test("dump", () => {
        const buf = new Buffer("abc");
        const dump = hexDump(buf);
        assert.equal(dump, "616263");
    });

    test("splitTo2ByteArray", () => {
        const memory = splitTo2ByteArray("0123456789ABCDEF");
        assert.deepEqual(memory, [0x0123, 0x4567, 0x89AB, 0xCDEF]);
    });
});
