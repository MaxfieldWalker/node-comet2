'use strict';

import { Memory } from '../../src/parts/memory';
import * as assert from 'assert';

suite('Memory test', () => {
    test('set and get value', () => {
        let memory = new Memory();
        memory.setMemoryValue(3, 0);
        let value = memory.getMemroyValue(0);

        assert.equal(value, 3);
    });
});
