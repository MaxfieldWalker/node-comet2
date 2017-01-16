'use strict';

import { ALU, ALUMode } from '../../src/comet2/alu';
import * as assert from 'assert';

suite('ALU test', () => {
    test('add', () => {
        let alu = new ALU();

        // 3 + 5 = 8
        alu.mode.setValue(ALUMode.ADD);
        alu.inputA.setValue(3);
        alu.inputB.setValue(5);

        let result = alu.output.value;
        assert.equal(result, 8);
    });

    test('sub', () => {
        let alu = new ALU();

        // 3 - 5 = -2
        alu.mode.setValue(ALUMode.SUB);
        alu.inputA.setValue(3);
        alu.inputB.setValue(5);

        let result = alu.output.value;
        assert.equal(result, -2);
    });

    test('and', () => {
        let alu = new ALU();

        // 0x1010 and 0x1100 = 0x1000
        alu.mode.setValue(ALUMode.AND);
        alu.inputA.setValue(0x1010);
        alu.inputB.setValue(0x1100);

        let result = alu.output.value;
        assert.equal(result, 0x1000);
    });

    test('or', () => {
        let alu = new ALU();

        // 0x1010 or 0x0110 = 0x1110
        alu.mode.setValue(ALUMode.OR);
        alu.inputA.setValue(0x1010);
        alu.inputB.setValue(0x0110);

        let result = alu.output.value;
        assert.equal(result, 0x1110);
    });

    test('xor', () => {
        let alu = new ALU();

        // 0x1010 xor 0x1001 = 0x0011
        alu.mode.setValue(ALUMode.XOR);
        alu.inputA.setValue(0x1010);
        alu.inputB.setValue(0x1001);

        let result = alu.output.value;
        assert.equal(result, 0x0011);
    });
})