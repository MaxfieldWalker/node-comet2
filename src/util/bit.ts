"use strict";

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

export type Binary = 0 | 1;

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


export interface ShiftResult {
    ans: number;
    lastExpelledBit: Binary;
}

function shift(method: (a: number, b: number) => number, isLogical: boolean, a: number, b: number): number {
    const r = method(a, b) & 0xFFFF;
    // 算術シフトの場合は符号ビットを付け加える
    const ans = isLogical ? r : (a & 0x8000) | r;
    return ans;
}

export interface ShiftFunc {
    (a: number, b: number): ShiftResult;
}

export function sla(a: number, b: number): ShiftResult {
    const lshift = (a: number, b: number) => a << b;
    const ans = shift(lshift, false, a, b);
    return {
        ans: ans,
        lastExpelledBit: getBit(a, 16 - b)
    };
}

export function sll(a: number, b: number): ShiftResult {
    const lshift = (a: number, b: number) => a << b;
    const ans = shift(lshift, true, a, b);
    return {
        ans: ans,
        lastExpelledBit: getBit(a, 16 - b + 1)
    };
}

export function sra(a: number, b: number): ShiftResult {
    const rshift = (a: number, b: number) => a >> b;
    const ans = shift(rshift, false, a, b);
    return {
        ans: ans,
        lastExpelledBit: b < 16 ? getBit(a, b) : getMSB(a)
    };
}

export function srl(a: number, b: number): ShiftResult {
    const rshift = (a: number, b: number) => a >> b;
    const ans = shift(rshift, true, a, b);
    return {
        ans: ans,
        lastExpelledBit: getBit(a, b)
    };
}
