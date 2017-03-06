"use strict";

import { Memory } from "./memory";
import { Register16bit } from "./register16bit";

export class Stack {
    private _sp: Register16bit;

    constructor(private _memory: Memory) {
        this._sp = new Register16bit("SP", false);
        this.reset();
    }

    public get _SP() {
        return this._sp;
    }

    public get SP() {
        return this._sp.value;
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
        const newSp = this.SP + 1;
        this._sp.value = newSp;

        return newSp;
    }

    public decrementSP() {
        const newSp = this.SP - 1;
        this._sp.value = newSp;

        return newSp;
    }

    reset() {
        // 初期のSPの位置
        this._sp.value = 0xffff;
    }
}
