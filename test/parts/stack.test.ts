'use strict';

import { Memory } from '../../src/parts/memory';
import { Stack } from '../../src/parts/stack';
import * as assert from 'assert';

suite('Stack test', () => {
    test('stack', () => {
        let stack = new Stack(new Memory());
        stack.push(5);
        let result = stack.pop();

        assert.equal(result, 5);
    });
});
