"use strict";

/**
 * 最上位ビット(16ビット目)を求めます
 * @param n a number
 */
export function getMSB(n: number): number {
    const r = n >> (16 - 1);
    return r & 1;
}

/**
 * 符号付き整数に変換する
 * @param n a number
 */
export function toSigned(n: number): number {
    return getMSB(n) == 0 ? n : -0x10000 + n;
}
