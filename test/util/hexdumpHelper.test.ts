"use strict";

import { HexdumpHelper } from "../../src/util/hexdumpHelper";
import * as assert from "assert";

suite("HexdumpHelper test", () => {
    test("dump", () => {
        const buf = new Buffer("abc");
        const dump = HexdumpHelper.dump(buf);
        assert.equal(dump, "616263");
    })
});
