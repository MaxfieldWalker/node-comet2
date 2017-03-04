"use strict";

import { Binary, getBit, getMSB } from "../util/bit";

export const add = (a: number, b: number) => a + b;
export const sub = (a: number, b: number) => a - b;
export const and = (a: number, b: number) => a & b;
export const or = (a: number, b: number) => a | b;
export const xor = (a: number, b: number) => a ^ b;


export interface ShiftResult {
    ans: number;
    lastExpelledBit: Binary;
}

export interface ShiftFunc {
    (a: number, b: number): ShiftResult;
}

function shift(method: (a: number, b: number) => number, isLogical: boolean, a: number, b: number): number {
    const r = method(a, b) & 0xFFFF;
    // 算術シフトの場合は符号ビットを付け加える
    const ans = isLogical ? r : (a & 0x8000) | r;
    return ans;
}

export const sla: ShiftFunc = (a: number, b: number): ShiftResult => {
    const lshift = (a: number, b: number) => a << b;
    const ans = shift(lshift, false, a, b);
    return {
        ans: ans,
        lastExpelledBit: getBit(a, 16 - b)
    };
}

export const sll: ShiftFunc = (a: number, b: number): ShiftResult => {
    const lshift = (a: number, b: number) => a << b;
    const ans = shift(lshift, true, a, b);
    return {
        ans: ans,
        lastExpelledBit: getBit(a, 16 - b + 1)
    };
}

export const sra: ShiftFunc = (a: number, b: number): ShiftResult => {
    const rshift = (a: number, b: number) => a >> b;
    const ans = shift(rshift, false, a, b);
    return {
        ans: ans,
        lastExpelledBit: b < 16 ? getBit(a, b) : getMSB(a)
    };
}

export const srl: ShiftFunc = (a: number, b: number): ShiftResult => {
    const rshift = (a: number, b: number) => a >> b;
    const ans = shift(rshift, true, a, b);
    return {
        ans: ans,
        lastExpelledBit: getBit(a, b)
    };
}
