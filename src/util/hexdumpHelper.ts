"use strict";

/**
 * 文字列を16進数化
 */
export function hexDump(buf: Buffer): string {
    return buf.toString("hex", 0, buf.length);
}
