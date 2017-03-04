"use strict";

import * as assert from "assert";
import { sla, sll, sra, srl } from "../../src/comet2/calc";

suite("calc test", () => {
    suite("sla", () => {
        test("positive number", () => {
            const n = 0b0001;
            const r = sla(n, 1);
            assert.equal(r.ans, 0b0010);
            assert.equal(r.lastExpelledBit, 0);
        });

        test("negative number", () => {
            const n = 0b1000000000000001;
            const r = sla(n, 1);
            assert.equal(r.ans, 0b1000000000000010);
            assert.equal(r.lastExpelledBit, 0);
        });
    });

    suite("sll", () => {
        test("positive number", () => {
            const n = 0b0001;
            const r = sll(n, 1);
            assert.equal(r.ans, 0b0010);
            assert.equal(r.lastExpelledBit, 0);
        });

        test("negative number", () => {
            const n = 0b1000000000000001;
            const r = sll(n, 1);
            assert.equal(r.ans, 0b0000000000000010);
            assert.equal(r.lastExpelledBit, 1);
        });
    });

    suite("sra", () => {
        test("positive number", () => {
            const n = 0b0010;
            const r = sra(n, 1);
            assert.equal(r.ans, 0b0001);
            assert.equal(r.lastExpelledBit, 0);
        });

        test("negative number", () => {
            const n = 0b1000000000000010;
            const r = sra(n, 1);
            // 空いたビット位置には符号ビットと同じビットが入る
            assert.equal(r.ans, 0b1100000000000001);
            assert.equal(r.lastExpelledBit, 0);
        });
    });

    suite("srl", () => {
        test("positive number", () => {
            const n = 0b0010;
            const r = srl(n, 1);
            assert.equal(r.ans, 0b001);
            assert.equal(r.lastExpelledBit, 0);
        });

        test("negative number", () => {
            const n = 0b1000000000000010;
            const r = srl(n, 1);
            assert.equal(r.ans, 0b0100000000000001);
            assert.equal(r.lastExpelledBit, 0);
        });
    });
});
