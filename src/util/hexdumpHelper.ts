'use strict';

var hexdump = require('hexy');

export class HexdumpHelper {
    public static dump(buf: Buffer): string {
        // 文字列を16進数化
        return buf.toString('hex', 0, buf.length);
    }
}