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

function shift(method: (a: number, b: number) => number, isLogical: boolean, a: number, b: number): number {
    const r = method(a, b) & 0xFFFF;
    // 算術シフトの場合は符号ビットを付け加える
    return isLogical ? r : (a & 0x8000) | r;
}

export function sla(a: number, b: number): number {
    const lshift = (a: number, b: number) => a << b;
    return shift(lshift, false, a, b);
}

export function sll(a: number, b: number): number {
    const lshift = (a: number, b: number) => a << b;
    return shift(lshift, true, a, b);
}

export function sra(a: number, b: number): number {
    const rshift = (a: number, b: number) => a >> b;
    return shift(rshift, false, a, b);
}

export function srl(a: number, b: number): number {
    const rshift = (a: number, b: number) => a >> b;
    return shift(rshift, true, a, b);
}
