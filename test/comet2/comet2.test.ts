"use strict";

import { Comet2, GR } from "../../src/comet2/comet2";
import * as assert from "assert";

function prepareOperation(v1: number, v2: number, comet2: Comet2, method: (r1: GR, r2: GR, adr?: number) => void) {
    setValue(GR.GR1, v1, GR.GR2, v2, comet2, method);

    method.bind(comet2)(GR.GR1, GR.GR2);
}

function prepareShiftOperation(v1: number, v2: number, comet2: Comet2, method: (r1: GR, adr: number, r2?: GR) => void) {
    setValue(GR.GR1, v1, GR.GR2, v2, comet2, method);

    method.bind(comet2)(GR.GR1, 0x0000, GR.GR2);
}

function setValue(r1: GR, v1: number, r2: GR, v2: number, comet2: Comet2, method: (r1: GR, r2: GR, adr?: number) => void) {
    comet2.lad(r1, GR.GR0, v1);
    comet2.lad(r2, GR.GR0, v2);
}

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

        assert.equal(comet2.memory.getValue(0x0100), 0x0002);

        comet2.lad(GR.GR3, GR.GR0, 0x0003);
        comet2.st(GR.GR3, 0x0200, GR.GR2);

        assert.equal(comet2.memory.getValue(0x0202), 0x0003);
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
            prepareOperation(0x0002, 0x0003, comet2, comet2.adda);

            assert.equal(comet2.GR1, 0x0005);
            assert.equal(comet2.OF, false);
            assert.equal(comet2.SF, false);
            assert.equal(comet2.ZF, false);
        });
        test("over 32767", () => {
            const comet2 = new Comet2();
            // 0x4000 + 0x4000 = 0x8000 (-32768)より
            // OFフラグが立つ
            prepareOperation(0x4000, 0x4000, comet2, comet2.adda);

            assert.equal(comet2.GR1, 0x8000);
            assert.equal(comet2.OF, true);
            assert.equal(comet2.SF, true);
            assert.equal(comet2.ZF, false);
        });
        test("over -32768", () => {
            const comet2 = new Comet2();
            // 0x8000(-32768) + 0xFFFF(-1) = 0x7FFF (32767)より
            // OFフラグが立つ
            prepareOperation(0x8000, 0xFFFF, comet2, comet2.adda);

            assert.equal(comet2.GR1, 0x7FFF);
            assert.equal(comet2.OF, true);
            assert.equal(comet2.SF, false);
            assert.equal(comet2.ZF, false);
        });
        test("zero flag", () => {
            const comet2 = new Comet2();
            // 0xFFFF(-1) + 0x0001 = 0x0000より
            // ZFフラグが立つ
            prepareOperation(0xFFFF, 0x0001, comet2, comet2.adda);

            assert.equal(comet2.GR1, 0x0000);
            assert.equal(comet2.OF, false);
            assert.equal(comet2.SF, false);
            assert.equal(comet2.ZF, true);
        });
    });

    suite("ADDL", () => {
        test("normal", () => {
            const comet2 = new Comet2();
            prepareOperation(0x0002, 0x0003, comet2, comet2.addl);

            assert.equal(comet2.GR1, 0x0005);
            assert.equal(comet2.OF, false);
            assert.equal(comet2.SF, false);
            assert.equal(comet2.ZF, false);
        });
        test("over 65535", () => {
            const comet2 = new Comet2();
            // 0x8000 + 0x8000 = 0x0000より
            // OFフラグが立つ
            prepareOperation(0x8000, 0x8000, comet2, comet2.addl);

            assert.equal(comet2.GR1, 0x0000);
            assert.equal(comet2.OF, true);
            assert.equal(comet2.SF, false);
            assert.equal(comet2.ZF, true);
        });
    });


    suite("SUBA", () => {
        test("normal", () => {
            const comet2 = new Comet2();
            prepareOperation(0x0003, 0x0002, comet2, comet2.suba);

            assert.equal(comet2.GR1, 0x0001);
            assert.equal(comet2.OF, false);
            assert.equal(comet2.SF, false);
            assert.equal(comet2.ZF, false);
        });
        test("over 32767", () => {
            const comet2 = new Comet2();
            // 0x4000 - 0xC000 = 0x8000 (-32768)より
            // OFフラグが立つ
            prepareOperation(0x4000, 0xC000, comet2, comet2.suba);

            assert.equal(comet2.GR1, 0x8000);
            assert.equal(comet2.OF, true);
            assert.equal(comet2.SF, true);
            assert.equal(comet2.ZF, false);
        });
        test("over -32768", () => {
            const comet2 = new Comet2();
            // 0x8000(-32768) - 0x0001 = 0x7FFF (32767)より
            // OFフラグが立つ
            prepareOperation(0x8000, 0x0001, comet2, comet2.suba);

            assert.equal(comet2.GR1, 0x7FFF);
            assert.equal(comet2.OF, true);
            assert.equal(comet2.SF, false);
            assert.equal(comet2.ZF, false);
        });
        test("zero flag", () => {
            const comet2 = new Comet2();
            // 0xFFFF(-1) - 0xFFFF(-1) = 0x0000より
            // ZFフラグが立つ
            prepareOperation(0xFFFF, 0xFFFF, comet2, comet2.suba);

            assert.equal(comet2.GR1, 0x0000);
            assert.equal(comet2.OF, false);
            assert.equal(comet2.SF, false);
            assert.equal(comet2.ZF, true);
        });
    });

    suite("SUBL", () => {
        test("normal", () => {
            const comet2 = new Comet2();
            prepareOperation(0x0002, 0x0003, comet2, comet2.subl);

            assert.equal(comet2.GR1, 0xFFFF);
            assert.equal(comet2.OF, false);
            assert.equal(comet2.SF, true);
            assert.equal(comet2.ZF, false);
        });
        test("logical", () => {
            const comet2 = new Comet2();
            prepareOperation(0x8000, 0x0001, comet2, comet2.subl);

            assert.equal(comet2.GR1, 0x7FFF);
            assert.equal(comet2.OF, false);
            assert.equal(comet2.SF, false);
            assert.equal(comet2.ZF, false);
        });
    });

    suite("AND", () => {
        test("normal", () => {
            const comet2 = new Comet2();
            prepareOperation(0x0011, 0x0101, comet2, comet2.and);

            assert.equal(comet2.GR1, 0b0001);
            assert.equal(comet2.OF, false);
            assert.equal(comet2.SF, false);
            assert.equal(comet2.ZF, false);
        });
        test("sign flag", () => {
            const comet2 = new Comet2();
            prepareOperation(0b1010000000000000, 0b1010111111111111, comet2, comet2.and);

            assert.equal(comet2.GR1, 0b1010000000000000);
            assert.equal(comet2.OF, false);
            assert.equal(comet2.SF, true);
            assert.equal(comet2.ZF, false);
        });
        test("zero flag", () => {
            const comet2 = new Comet2();
            prepareOperation(0b1100, 0b0011, comet2, comet2.and);

            assert.equal(comet2.GR1, 0b0000);
            assert.equal(comet2.OF, false);
            assert.equal(comet2.SF, false);
            assert.equal(comet2.ZF, true);
        });
    });


    suite("OR", () => {
        test("normal", () => {
            const comet2 = new Comet2();
            prepareOperation(0b0011, 0b0101, comet2, comet2.or);

            assert.equal(comet2.GR1, 0b0111);
            assert.equal(comet2.OF, false);
            assert.equal(comet2.SF, false);
            assert.equal(comet2.ZF, false);
        });
    });

    suite("XOR", () => {
        test("normal", () => {
            const comet2 = new Comet2();
            prepareOperation(0b0011, 0b0101, comet2, comet2.xor);

            assert.equal(comet2.GR1, 0b0110);
            assert.equal(comet2.OF, false);
            assert.equal(comet2.SF, false);
            assert.equal(comet2.ZF, false);
        });
    });

    suite("CPA", () => {
        test("pattern 1", () => {
            const comet2 = new Comet2();
            prepareOperation(0x0002, 0x0001, comet2, comet2.cpa);

            assert.equal(comet2.OF, false);
            assert.equal(comet2.SF, false);
            assert.equal(comet2.ZF, false);
        });

        test("pattern 2", () => {
            const comet2 = new Comet2();
            prepareOperation(0x0002, 0x0002, comet2, comet2.cpa);

            assert.equal(comet2.OF, false);
            assert.equal(comet2.SF, false);
            assert.equal(comet2.ZF, true);
        });

        test("pattern 3", () => {
            const comet2 = new Comet2();
            prepareOperation(0x0001, 0x0002, comet2, comet2.cpa);

            assert.equal(comet2.OF, false);
            assert.equal(comet2.SF, true);
            assert.equal(comet2.ZF, false);
        });
    });

    suite("CPL", () => {
        test("logical", () => {
            const comet2 = new Comet2();
            prepareOperation(0x8000, 0x7FFF, comet2, comet2.cpl);

            assert.equal(comet2.OF, false);
            assert.equal(comet2.SF, false);
            assert.equal(comet2.ZF, false);
        });
    });

    suite("SLA", () => {
        test("normal", () => {
            const comet2 = new Comet2();
            prepareShiftOperation(0x8001, 0x0001, comet2, comet2.sla);

            assert.equal(comet2.GR1, 0x8002);
            assert.equal(comet2.OF, false);
            assert.equal(comet2.SF, true);
            assert.equal(comet2.ZF, false);
        });
    });

    suite("SRA", () => {
        test("normal", () => {
            const comet2 = new Comet2();
            prepareShiftOperation(0x8002, 0x0001, comet2, comet2.sra);

            assert.equal(comet2.GR1, 0xC001);
            assert.equal(comet2.OF, false);
            assert.equal(comet2.SF, true);
            assert.equal(comet2.ZF, false);
        });

        test("overflow flag", () => {
            const comet2 = new Comet2();
            prepareShiftOperation(0b0010, 0x0002, comet2, comet2.sra);

            assert.equal(comet2.GR1, 0x0000);
            assert.equal(comet2.OF, true);
            assert.equal(comet2.SF, false);
            assert.equal(comet2.ZF, true);
        });
    });

    suite("SLL", () => {
        test("normal", () => {
            const comet2 = new Comet2();
            prepareShiftOperation(0x8001, 0x0001, comet2, comet2.sll);

            assert.equal(comet2.GR1, 0x0002);
            assert.equal(comet2.OF, true);
            assert.equal(comet2.SF, false);
            assert.equal(comet2.ZF, false);
        });
    });


    suite("SRL", () => {
        test("normal", () => {
            const comet2 = new Comet2();
            prepareShiftOperation(0x8002, 0x0001, comet2, comet2.srl);

            assert.equal(comet2.GR1, 0x4001);
            assert.equal(comet2.OF, false);
            assert.equal(comet2.SF, false);
            assert.equal(comet2.ZF, false);
        });
    });

    suite("JPL", () => {
        test("branch", () => {
            const comet2 = new Comet2();
            comet2.setSF(false);
            comet2.setZF(false);
            comet2.jpl(0x0100);
            assert.equal(comet2.PR, 0x0100);
        });

        test("not branch", () => {
            const comet2 = new Comet2();
            comet2.setSF(true);
            comet2.setZF(false);
            comet2.jpl(0x0100);
            assert.equal(comet2.PR, 0x0002);
        });
    });

    suite("JMI", () => {
        test("branch", () => {
            const comet2 = new Comet2();
            comet2.setSF(true);
            comet2.jmi(0x0100);
            assert.equal(comet2.PR, 0x0100);
        });

        test("not branch", () => {
            const comet2 = new Comet2();
            comet2.setSF(false);
            comet2.jmi(0x0100);
            assert.equal(comet2.PR, 0x0002);
        });
    });

    suite("JNZ", () => {
        test("branch", () => {
            const comet2 = new Comet2();
            comet2.setZF(false);
            comet2.jnz(0x0100);
            assert.equal(comet2.PR, 0x0100);
        });

        test("not branch", () => {
            const comet2 = new Comet2();
            comet2.setZF(true);
            comet2.jnz(0x0100);
            assert.equal(comet2.PR, 0x0002);
        });
    });

    suite("JZE", () => {
        test("branch", () => {
            const comet2 = new Comet2();
            comet2.setZF(true);
            comet2.jze(0x0100);
            assert.equal(comet2.PR, 0x0100);
        });

        test("not branch", () => {
            const comet2 = new Comet2();
            comet2.setZF(false);
            comet2.jze(0x0100);
            assert.equal(comet2.PR, 0x0002);
        });
    });

    suite("JOV", () => {
        test("branch", () => {
            const comet2 = new Comet2();
            comet2.setOF(true);
            comet2.jov(0x0100);
            assert.equal(comet2.PR, 0x0100);
        });

        test("not branch", () => {
            const comet2 = new Comet2();
            comet2.setOF(false);
            comet2.jov(0x0100);
            assert.equal(comet2.PR, 0x0002);
        });
    });

    suite("JUMP", () => {
        test("branch", () => {
            const comet2 = new Comet2();
            comet2.setOF(false);
            comet2.setSF(false);
            comet2.setZF(false);
            comet2.jump(0x0100);
            assert.equal(comet2.PR, 0x0100);
        });
    });

    suite("PUSH", () => {
        test("normal", () => {
            const comet2 = new Comet2();
            const oldSP = comet2.SP;
            comet2.push(0x0100);

            const newSP = comet2.SP;
            assert.equal(newSP, oldSP - 1);
            assert.equal(comet2.getStackActiveValue(), 0x0100);
        });
    });

    suite("POP", () => {
        test("normal", () => {
            const comet2 = new Comet2();
            comet2.push(0x0100);
            const oldSP = comet2.SP;

            comet2.pop(GR.GR1);

            const newSP = comet2.SP;
            assert.equal(newSP, oldSP + 1);
            assert.equal(comet2.GR1, 0x0100);
        });
    });

    suite("CALL", () => {
        test("normal", () => {
            const comet2 = new Comet2();
            const oldSP = comet2.SP;
            const oldPR = comet2.PR;
            comet2.call(0x0100);

            assert.equal(comet2.SP, oldSP - 1);
            assert.equal(comet2.getStackActiveValue(), oldPR);
            assert.equal(comet2.PR, 0x0100);
        });
    });

    suite("RET", () => {
        test("normal", () => {
            const comet2 = new Comet2();
            const oldPR = comet2.PR;
            comet2.call(0x0100);
            const oldSP = comet2.SP;
            const oldStackActiveValue = comet2.getStackActiveValue();
            comet2.ret();

            assert.equal(comet2.SP, oldSP + 1);
            assert.equal(comet2.PR, oldStackActiveValue);
        });
    });

    test("SVC", () => {
        const comet2 = new Comet2();
        const { gr0, gr1, gr2, gr3, gr4, gr5, gr6, gr7, gr8 } = comet2.grs;
        const { of, sf, zf } = comet2.flags;
        const pr = comet2.PR;

        comet2.svc(0x0100);

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

    test("IN", () => {
        const comet2 = new Comet2();
        comet2.in(0x0100, 0x0200, () => "ABCDE");

        const charCodes = comet2.memory.getValues(0x0100, 5);
        const length = comet2.memory.getValue(0x0200);

        assert.deepEqual(charCodes, [0x0041, 0x0042, 0x0043, 0x0044, 0x0045]);
        assert.equal(length, 5);
    });

    test("OUT", () => {
        const comet2 = new Comet2();
        // OUT命令は上位8ビットを無視する
        comet2.memory.setMemoryValues([0x1141, 0x2242, 0x3343, 0x4444, 0x5545], 0x0100);
        comet2.memory.setMemoryValue(0x0005, 0x0200);
        const out = comet2.out(0x0100, 0x0200);

        assert.equal(out, "ABCDE");
    });

    test("RPUSH", () => {
        const comet2 = new Comet2();
        comet2.lad(GR.GR1, GR.GR0, 0x01);
        comet2.lad(GR.GR2, GR.GR0, 0x02);
        comet2.lad(GR.GR3, GR.GR0, 0x03);
        comet2.lad(GR.GR4, GR.GR0, 0x04);
        comet2.lad(GR.GR5, GR.GR0, 0x05);
        comet2.lad(GR.GR6, GR.GR0, 0x06);
        comet2.lad(GR.GR7, GR.GR0, 0x07);
        comet2.lad(GR.GR8_SP, GR.GR0, 0xA000);

        comet2.rpush();

        assert.equal(comet2.stack.getValue(0), 0xA000);
        assert.equal(comet2.stack.getValue(1), 0x07);
        assert.equal(comet2.stack.getValue(2), 0x06);
        assert.equal(comet2.stack.getValue(3), 0x05);
        assert.equal(comet2.stack.getValue(4), 0x04);
        assert.equal(comet2.stack.getValue(5), 0x03);
        assert.equal(comet2.stack.getValue(6), 0x02);
        assert.equal(comet2.stack.getValue(7), 0x01);
    });

    test("RPOP", () => {
        const comet2 = new Comet2();
        comet2.stack.push(0x01);
        comet2.stack.push(0x02);
        comet2.stack.push(0x03);
        comet2.stack.push(0x04);
        comet2.stack.push(0x05);
        comet2.stack.push(0x06);
        comet2.stack.push(0x07);
        comet2.stack.push(0x08);

        comet2.rpop();

        assert.equal(comet2.GR8, 0x08);
        assert.equal(comet2.GR7, 0x07);
        assert.equal(comet2.GR6, 0x06);
        assert.equal(comet2.GR5, 0x05);
        assert.equal(comet2.GR4, 0x04);
        assert.equal(comet2.GR3, 0x03);
        assert.equal(comet2.GR2, 0x02);
        assert.equal(comet2.GR1, 0x01);
    });
});
