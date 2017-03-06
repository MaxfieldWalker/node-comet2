"use strict";

import * as Immutable from "immutable";

namespace MemoryConst {
    export const MinIndex = 0;
    export const MaxIndex = 65535;
}


/**
 * Memory (16 bits x 65536)
 */
export class Memory {
    private _memory: Array<number>;

    constructor(private _offset = 0) {
        this._memory = new Array(MemoryConst.MaxIndex - MemoryConst.MinIndex + 1);

        // 0埋め
        for (let i = 0; i < this._memory.length; i++) {
            this._memory[i] = 0;
        }
    }

    public load(memory: Array<number>) {
        if (memory.length > MemoryConst.MaxIndex - MemoryConst.MinIndex + 1) throw new Error();

        for (let i = 0; i < memory.length; i++) {
            this._memory[i] = memory[i];
        }
    }

    /**
     * インデックスを指定してメモリの値を取得する
     */
    public getValue(index: number, offset?: number): number {
        const ri = this.resolveIndex(index, offset);
        if (!this.isInMemoryArrayRange(ri)) {
            throw new Error("aa");
        }

        return this._memory[ri];
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
    public setMemoryValue(value: number, index: number, offset?: number) {
        const ri = this.resolveIndex(index, offset);

        if (!this.isInMemoryArrayRange(ri)) {
            throw new Error("aa");
        }

        this._memory[ri] = value;
    }

    setMemoryValues(values: Array<number>, startIndex: number) {
        values.forEach((x, i) => this.setMemoryValue(x, startIndex + i));
    }


    private isInMemoryArrayRange(index: number): boolean {
        return !(index < MemoryConst.MinIndex || index > MemoryConst.MaxIndex);
    }

    private resolveIndex(index: number, offset = this._offset) {
        return (offset + index) & 0xFFFF;
    }
}
