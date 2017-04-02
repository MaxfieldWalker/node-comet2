"use strict";

import { Memory } from "./memory";
import { Register16bit } from "./register16bit";
import { Errors, createError } from "../comet2/errors";

const defaultSPValue = 0xFFFF;

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
        if (newSp < 0) {
            throw createError(Errors.Stackoverflow);
        }
        this._memory.setMemoryValue(value, newSp);
    }

    public pop(): number {
        const v = this.getActiveValue();
        if (this.SP < defaultSPValue) this.incrementSP();
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
        this._sp.value = defaultSPValue;
    }
}
