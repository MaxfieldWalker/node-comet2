"use strict";

import { Comet2, GR } from "../../src/comet2/comet2";
import * as assert from "assert";

suite("Comet2 test", () => {
    test("NOP", () => {
        const comet2 = new Comet2();
        const { gr0, gr1, gr2, gr3, gr4, gr5, gr6, gr7, gr8 } = comet2.grs;
        const { of, sf, zf } = comet2.flags;
        const pr = comet2.PR;

        comet2.nop();

        // 何も変化していないか?
        assert.equal(comet2.GR0, gr0);
        assert.equal(comet2.GR1, gr1);
        assert.equal(comet2.GR2, gr2);
        assert.equal(comet2.GR3, gr3);
        assert.equal(comet2.GR4, gr4);
        assert.equal(comet2.GR5, gr5);
        assert.equal(comet2.GR6, gr6);
        assert.equal(comet2.GR7, gr7);
        assert.equal(comet2.GR8, gr8);

        assert.equal(comet2.OF, of);
        assert.equal(comet2.SF, sf);
        assert.equal(comet2.ZF, zf);
    });

    test("LD", () => {
        const comet2 = new Comet2();
        comet2.lad(GR.GR2, GR.GR0, 0x0003);
        comet2.ld(GR.GR1, GR.GR2);

        const result = comet2.GR1;
        assert.equal(result, 0x0003);
    });

    test("ST", () => {
        const comet2 = new Comet2();
        comet2.lad(GR.GR2, GR.GR0, 0x0002);
        comet2.st(GR.GR2, 0x0100);

        assert.equal(comet2.getMemoryValue(0x0100), 0x0002);

        comet2.lad(GR.GR3, GR.GR0, 0x0003);
        comet2.st(GR.GR3, 0x0200, GR.GR2);

        assert.equal(comet2.getMemoryValue(0x0202), 0x0003);
    });

    test("LAD", () => {
        const comet2 = new Comet2();
        comet2.lad(GR.GR1, GR.GR0, 0x0003);

        const result = comet2.GR1;
        assert.equal(result, 0x0003);
    });


    suite("ADDA", () => {
        test("normal", () => {
            const comet2 = new Comet2();
            comet2.lad(GR.GR1, GR.GR0, 0x0002);
            comet2.lad(GR.GR2, GR.GR0, 0x0003);
            comet2.adda(GR.GR1, GR.GR2);

            assert.equal(comet2.GR1, 0x0005);
            assert.equal(comet2.OF, false);
            assert.equal(comet2.SF, false);
            assert.equal(comet2.ZF, false);
        });
        test("over 32767", () => {
            const comet2 = new Comet2();
            // 0x4000 + 0x4000 = 0x8000 (-32768)より
            // OFフラグが立つ
            comet2.lad(GR.GR1, GR.GR0, 0x4000);
            comet2.lad(GR.GR2, GR.GR0, 0x4000);
            comet2.adda(GR.GR1, GR.GR2);

            assert.equal(comet2.GR1, 0x8000);
            assert.equal(comet2.OF, true);
            assert.equal(comet2.SF, true);
            assert.equal(comet2.ZF, false);
        });
        test("over -32768", () => {
            const comet2 = new Comet2();
            // 0x8000(-32768) + 0xFFFF(-1) = 0x7FFF (32767)より
            // OFフラグが立つ
            comet2.lad(GR.GR1, GR.GR0, 0x8000);
            comet2.lad(GR.GR2, GR.GR0, 0xFFFF);
            comet2.adda(GR.GR1, GR.GR2);

            assert.equal(comet2.GR1, 0x7FFF);
            assert.equal(comet2.OF, true);
            assert.equal(comet2.SF, false);
            assert.equal(comet2.ZF, false);
        });
        test("zero flag", () => {
            const comet2 = new Comet2();
            // 0xFFFF(-1) + 0x0001 = 0x0000より
            // ZFフラグが立つ
            comet2.lad(GR.GR1, GR.GR0, 0xFFFF);
            comet2.lad(GR.GR2, GR.GR0, 0x0001);
            comet2.adda(GR.GR1, GR.GR2);

            assert.equal(comet2.GR1, 0x0000);
            assert.equal(comet2.OF, false);
            assert.equal(comet2.SF, false);
            assert.equal(comet2.ZF, true);
        });
    });

    suite("ADDL", () => {
        test("normal", () => {
            const comet2 = new Comet2();
            comet2.lad(GR.GR1, GR.GR0, 0x0002);
            comet2.lad(GR.GR2, GR.GR0, 0x0003);
            comet2.addl(GR.GR1, GR.GR2);

            assert.equal(comet2.GR1, 0x0005);
            assert.equal(comet2.OF, false);
            assert.equal(comet2.SF, false);
            assert.equal(comet2.ZF, false);
        });
        test("over 65535", () => {
            const comet2 = new Comet2();
            // 0x8000 + 0x8000 = 0x0000より
            // OFフラグが立つ
            comet2.lad(GR.GR1, GR.GR0, 0x8000);
            comet2.lad(GR.GR2, GR.GR0, 0x8000);
            comet2.addl(GR.GR1, GR.GR2);

            assert.equal(comet2.GR1, 0x0000);
            assert.equal(comet2.OF, true);
            assert.equal(comet2.SF, false);
            assert.equal(comet2.ZF, true);
        });
    });


    suite("SUBA", () => {
        test("normal", () => {
            const comet2 = new Comet2();
            comet2.lad(GR.GR1, GR.GR0, 0x0003);
            comet2.lad(GR.GR2, GR.GR0, 0x0002);
            comet2.suba(GR.GR1, GR.GR2);

            assert.equal(comet2.GR1, 0x0001);
            assert.equal(comet2.OF, false);
            assert.equal(comet2.SF, false);
            assert.equal(comet2.ZF, false);
        });
        test("over 32767", () => {
            const comet2 = new Comet2();
            // 0x4000 - 0xC000 = 0x8000 (-32768)より
            // OFフラグが立つ
            comet2.lad(GR.GR1, GR.GR0, 0x4000);
            comet2.lad(GR.GR2, GR.GR0, 0xC000);
            comet2.suba(GR.GR1, GR.GR2);

            assert.equal(comet2.GR1, 0x8000);
            assert.equal(comet2.OF, true);
            assert.equal(comet2.SF, true);
            assert.equal(comet2.ZF, false);
        });
        test("over -32768", () => {
            const comet2 = new Comet2();
            // 0x8000(-32768) - 0x0001 = 0x7FFF (32767)より
            // OFフラグが立つ
            comet2.lad(GR.GR1, GR.GR0, 0x8000);
            comet2.lad(GR.GR2, GR.GR0, 0x0001);
            comet2.suba(GR.GR1, GR.GR2);

            assert.equal(comet2.GR1, 0x7FFF);
            assert.equal(comet2.OF, true);
            assert.equal(comet2.SF, false);
            assert.equal(comet2.ZF, false);
        });
        test("zero flag", () => {
            const comet2 = new Comet2();
            // 0xFFFF(-1) - 0xFFFF(-1) = 0x0000より
            // ZFフラグが立つ
            comet2.lad(GR.GR1, GR.GR0, 0xFFFF);
            comet2.lad(GR.GR2, GR.GR0, 0xFFFF);
            comet2.suba(GR.GR1, GR.GR2);

            assert.equal(comet2.GR1, 0x0000);
            assert.equal(comet2.OF, false);
            assert.equal(comet2.SF, false);
            assert.equal(comet2.ZF, true);
        });
    });

    suite("SUBL", () => {
        test("normal", () => {
            const comet2 = new Comet2();
            comet2.lad(GR.GR1, GR.GR0, 0x0002);
            comet2.lad(GR.GR2, GR.GR0, 0x0003);
            comet2.subl(GR.GR1, GR.GR2);

            assert.equal(comet2.GR1, 0xFFFF);
            assert.equal(comet2.OF, false);
            assert.equal(comet2.SF, true);
            assert.equal(comet2.ZF, false);
        });
        test("logical", () => {
            const comet2 = new Comet2();
            comet2.lad(GR.GR1, GR.GR0, 0x8000);
            comet2.lad(GR.GR2, GR.GR0, 0x0001);
            comet2.subl(GR.GR1, GR.GR2);

            assert.equal(comet2.GR1, 0x7FFF);
            assert.equal(comet2.OF, false);
            assert.equal(comet2.SF, false);
            assert.equal(comet2.ZF, false);
        });
    });

    suite("AND", () => {
        test("pattern 1", () => {
            const comet2 = new Comet2();
            comet2.lad(GR.GR1, GR.GR0, 0b1010);
            comet2.lad(GR.GR2, GR.GR0, 0b0101);
            comet2.and(GR.GR1, GR.GR2);

            assert.equal(comet2.GR1, 0b0000);
            assert.equal(comet2.OF, false);
            assert.equal(comet2.SF, false);
            assert.equal(comet2.ZF, true);
        });
        test("pattern 2", () => {
            const comet2 = new Comet2();
            comet2.lad(GR.GR1, GR.GR0, 0b1010000000000000);
            comet2.lad(GR.GR2, GR.GR0, 0b1010111111111111);
            comet2.and(GR.GR1, GR.GR2);

            assert.equal(comet2.GR1, 0b1010000000000000);
            assert.equal(comet2.OF, false);
            assert.equal(comet2.SF, true);
            assert.equal(comet2.ZF, false);
        });
    });


    suite("OR", () => {
        test("pattern 1", () => {
            const comet2 = new Comet2();
            comet2.lad(GR.GR1, GR.GR0, 0b0000);
            comet2.lad(GR.GR2, GR.GR0, 0b0000);
            comet2.or(GR.GR1, GR.GR2);

            assert.equal(comet2.GR1, 0b0000);
            assert.equal(comet2.OF, false);
            assert.equal(comet2.SF, false);
            assert.equal(comet2.ZF, true);
        });
        test("pattern 2", () => {
            const comet2 = new Comet2();
            comet2.lad(GR.GR1, GR.GR0, 0b1010000000000000);
            comet2.lad(GR.GR2, GR.GR0, 0b0101000000000000);
            comet2.or(GR.GR1, GR.GR2);

            assert.equal(comet2.GR1, 0b1111000000000000);
            assert.equal(comet2.OF, false);
            assert.equal(comet2.SF, true);
            assert.equal(comet2.ZF, false);
        });
    });
});
