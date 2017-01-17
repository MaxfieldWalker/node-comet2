'use strict';

import { HexdumpHelper } from '../../src/util/hexdumpHelper';
import * as assert from 'assert';

suite('HexdumpHelper test', () => {
    test('dump', () => {
        let buf = new Buffer("abc");
        let dump = HexdumpHelper.dump(buf);
        assert.equal(dump, "616263");
    })
});
