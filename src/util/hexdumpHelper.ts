"use strict";

import { read } from "../io/reader";

/**
 * 文字列を16進数化
 */
export function hexDump(buf: Buffer): string {
    return buf.toString("hex", 0, buf.length);
}

export function dumpTo2ByteArray(path: string): Array<number> {
    const buf = read(path);
    const dump = hexDump(buf);

    // 16進数にダンプしたものはCOMET2の一語は16ビット(2バイト)なので
    // 長さが必ず4の倍数になる
    if (dump.length % 4 != 0) {
        throw new Error("Invalid binary.");
    }

    const memory = splitTo2ByteArray(dump);

    return memory;
}

export function splitTo2ByteArray(hexStr: string) {
    const memory: Array<number> = [];

    // 4桁ごと(2バイト)に区切って数値に変換
    for (let i = 0; i < hexStr.length / 4; i++) {
        const start = 4 * i;
        const end = start + 4;
        const slice = hexStr.slice(start, end);
        // 16進数文字列を数値に変換
        memory.push(parseInt(slice, 16));
    }

    return memory;
}
