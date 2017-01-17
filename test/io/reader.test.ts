'use strict';

import { Reader } from '../../src/io/reader';

suite('Reader test', () => {
    test('read', () => {
        let buf = Reader.read('./src/app.ts');
    })
});
