"use strict";

import { Memory } from "../../src/parts/memory";
import * as assert from "assert";

suite("Memory test", () => {
    test("set and get value", () => {
        const memory = new Memory();
        memory.setMemoryValue(3, 0);
        const value = memory.getValue(0);

        assert.equal(value, 3);
    });
});
