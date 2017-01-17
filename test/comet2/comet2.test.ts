'use strict';

import { Comet2, GR } from '../../src/comet2/comet2';
import * as assert from 'assert';

suite('Comet2 test', () => {
    test('LAD', () => {
        let comet2 = new Comet2();
        comet2.lad(GR.GR1, GR.GR0, 0x0003);

        let result = comet2.GR1.value;
        assert.equal(result, 0x0003);
    });

    test('LD', () => {
        let comet2 = new Comet2();
        comet2.lad(GR.GR2, GR.GR0, 0x0003);
        comet2.ld(GR.GR1, GR.GR2);

        let result = comet2.GR1.value;
        assert.equal(result, 0x0003);
    });

    test('ADDA', () => {
        let comet2 = new Comet2();
        comet2.lad(GR.GR1, GR.GR0, 0x0002);
        comet2.lad(GR.GR2, GR.GR0, 0x0003);
        comet2.adda(GR.GR1, GR.GR2, 0);

        let result = comet2.GR1.value;
        assert.equal(result, 0x0005);

        // TODO: 32767を超えるテストをする(OFフラグが立っているかもチェック)
        // TODO: -32768を超えるテストをする
    });

    test('SUBA', () => {
        let comet2 = new Comet2();
        comet2.lad(GR.GR1, GR.GR0, 0x0003);
        comet2.lad(GR.GR2, GR.GR0, 0x0002);
        comet2.suba(GR.GR1, GR.GR2, 0);

        let result = comet2.GR1.value;
        assert.equal(result, 0x0001);

        // TODO: 32767を超えるテストをする(OFフラグが立っているかもチェック)
        // TODO: -32768を超えるテストをする
    });
});