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
        // TODO: LAD命令で値を読み込む
        comet2.ld(GR.GR1, GR.GR2);

        let result = comet2.GR1.value;
        // assert.equal(result, 3);
    });

    test('ADDA', () => {

    });
});
