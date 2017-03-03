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
        return this._sp;
    }

    public push(value: number) {
        const newSp = this._sp.value - 1;
        this._sp.setValue(newSp);
        this._memory.setMemoryValue(value, newSp);
    }

    public pop(): number {
        const oldSp = this._sp.value;
        const newSp = oldSp + 1;
        this._sp.setValue(newSp);
        return this._memory.getMemroyValue(oldSp);
    }
}
