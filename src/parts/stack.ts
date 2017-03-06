"use strict";

import { Memory } from "./memory";

export class Stack {
    private _memory: Memory;
    private _sp: number;

    constructor(memory: Memory) {
        this._memory = memory;
        this.reset();
    }

    public get SP() {
        return this._sp;
    }

    public push(value: number) {
        const newSp = this.decrementSP();
        this._memory.setMemoryValue(value, newSp);
    }

    public pop(): number {
        const v = this.getActiveValue();
        const newSp = this.incrementSP();
        return v;
    }

    /**
     * SPの指す値を返します
     */
    public getActiveValue() {
        return this.getValue(0);
    }

    public getValue(offset: number) {
        return this._memory.getValue(offset + this.SP);
    }

    public incrementSP() {
        const newSp = this._sp + 1;
        this._sp = newSp;

        return newSp;
    }

    public decrementSP() {
        const newSp = this._sp - 1;
        this._sp = newSp;

        return newSp;
    }

    reset() {
        // 初期のSPの位置
        this._sp = 0xffff;
    }
}
