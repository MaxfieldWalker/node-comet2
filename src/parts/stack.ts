"use strict";

import { Memory } from "./memory";
import { Outlet } from "./outlet";

export class Stack {
    private _memory: Memory;
    private _sp: Outlet<number>;

    constructor(memory: Memory) {
        this._memory = memory;
        this._sp = new Outlet<number>();

        // 初期のSPの位置
        this._sp.setValue(0xffff);
    }

    public get SP() {
        return this._sp.value;
    }

    public push(value: number) {
        const newSp = this.decrementSP();
        this._memory.setMemoryValue(value, newSp);
    }

    public pop(): number {
        const oldSp = this._sp.value;
        const newSp = this.incrementSP();
        return this._memory.getMemroyValue(oldSp);
    }

    /**
     * SPの指す値を返します
     */
    public getActiveValue() {
        return this._memory.getMemroyValue(this.SP);
    }

    public incrementSP() {
        const newSp = this._sp.value + 1;
        this._sp.setValue(newSp);

        return newSp;
    }

    public decrementSP() {
        const newSp = this._sp.value - 1;
        this._sp.setValue(newSp);

        return newSp;
    }
}
