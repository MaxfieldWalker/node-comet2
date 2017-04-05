"use strict";

import * as Immutable from "immutable";
import * as _ from "lodash";
import { strHex } from "../comet2/errors";

namespace MemoryConst {
    export const MinIndex = 0;
    export const MaxIndex = 65535;
}


/**
 * Memory (16 bits x 65536)
 */
export class Memory {
    private _memory: number[];

    constructor() {
        this._memory = new Array(MemoryConst.MaxIndex - MemoryConst.MinIndex + 1);

        this.reset();
    }

    public load(memory: number[], offset = 0) {
        if (memory.length - offset > MemoryConst.MaxIndex - MemoryConst.MinIndex + 1) throw new Error();

        for (let i = 0; i < memory.length; i++) {
            this._memory[i] = memory[offset + i];
        }
    }

    /**
     * インデックスを指定してメモリの値を取得する
     */
    public getValue(index: number): number {
        this.assertInMemoryRange(index);

        return this._memory[index];
    }

    getValues(startIndex: number, length: number) {
        if (length < 0) {
            throw new Error();
        }

        return Immutable.Range(startIndex, startIndex + length).toArray().map(x => this.getValue(x));
    }

    /**
     * インデックスを指定してメモリに値をセットする
     */
    public setMemoryValue(value: number, index: number) {
        this.assertInMemoryRange(index);

        this._memory[index] = value;
    }

    setMemoryValues(values: number[], startIndex: number) {
        values.forEach((x, i) => this.setMemoryValue(x, startIndex + i));
    }


    private assertInMemoryRange(index: number): void {
        const valid = !(index < MemoryConst.MinIndex || index > MemoryConst.MaxIndex);
        if (!valid) {
            throw new Error(`Illegal memory access. Tried to access to ${strHex(index, 4)}.`);
        }
    }

    reset() {
        // 0埋め
        for (let i = 0; i < this._memory.length; i++) {
            this._memory[i] = 0;
        }
    }
}
