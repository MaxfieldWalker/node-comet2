"use strict";

export type Binary = 0 | 1;

/**
 * 最上位ビット(16ビット目)を求めます
 * @param n a number
 */
export function getMSB(n: number): Binary {
    return getBit(n, 16);
}

/**
 * 符号付き整数に変換する
 * @param n a number
 */
export function toSigned(n: number): number {
    return getMSB(n) == 0 ? n : -0x10000 + n;
}


/**
 * 指定されたビット位置のビットを求めます
 * @param n a number
 * @param bit bit location
 */
export function getBit(n: number, bit: number): Binary {
    if (bit < 1) return 0;

    const r = (n >> (bit - 1)) & 1;
    if (r == 0 || r == 1) {
        return r;
    }

    throw new Error();
}
