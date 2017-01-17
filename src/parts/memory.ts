
namespace MemoryConst {
    export const MinIndex = 0;
    export const MaxIndex = 65535;
}


/**
 * Memory (16 bits x 65536)
 */
export class Memory {
    private _memory: Array<number>;

    constructor() {
        this._memory = new Array(MemoryConst.MaxIndex - MemoryConst.MinIndex + 1);
    }

    public load(memory: Array<number>) {
        for (var i = 0; i < memory.length; i++) {
            let value = memory[i];
            this.setMemoryValue(value, i);
        }
    }

    /**
     * インデックスを指定してメモリの値を取得する
     */
    public getMemroyValue(index: number): number {
        if (!this.isInMemoryArrayRange(index)) {
            throw new Error("aa");
        }

        return this._memory[index];
    }

    /**
     * インデックスを指定してメモリに値をセットする
     */
    public setMemoryValue(value: number, index: number) {
        if (!this.isInMemoryArrayRange(index)) {
            throw new Error("aa");
        }

        this._memory[index] = value;
    }


    private isInMemoryArrayRange(index: number): boolean {
        return !(index < MemoryConst.MinIndex || index > MemoryConst.MaxIndex)
    }
}