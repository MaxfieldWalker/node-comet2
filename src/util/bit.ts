"use strict";

/**
 * 最上位ビット(16ビット目)を求めます
 * @param n a number
 */
export function getMSB(n: number): number {
    const r = n >> (16 - 1);
    return r & 1;
}
