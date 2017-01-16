'use strict'

import { Register16bit } from '../parts/register16bit';
import { Flag } from '../parts/flag';
import { Stack } from '../parts/stack';
import { Memory } from '../parts/memory';
import { ALU } from './alu';

/**
 * Comet2
 */
export class Comet2 {

    private _GR0: Register16bit;
    public get GR0(): Register16bit {
        return this._GR0;
    }

    private _GR1: Register16bit;
    public get GR1(): Register16bit {
        return this._GR1;
    }

    private _GR2: Register16bit;
    public get GR2(): Register16bit {
        return this._GR2;
    }

    private _GR3: Register16bit;
    public get GR3(): Register16bit {
        return this._GR3;
    }

    private _GR4: Register16bit;
    public get GR4(): Register16bit {
        return this._GR4;
    }

    private _GR5: Register16bit;
    public get GR5(): Register16bit {
        return this._GR5;
    }

    private _GR6: Register16bit;
    public get GR6(): Register16bit {
        return this._GR6;
    }

    private _GR7: Register16bit;
    public get GR7(): Register16bit {
        return this._GR7;
    }

    private _OF: Flag;
    public get OF(): Flag {
        return this._OF;
    }

    private _SF: Flag;
    public get SF(): Flag {
        return this._SF;
    }

    private _ZF: Flag;
    public get ZF(): Flag {
        return this._ZF;
    }

    public get SP() {
        return this._stack.SP;
    }

    private _stack: Stack;
    private _memory: Memory;
    private _alu: ALU;

    constructor() {
        this._GR0 = new Register16bit("GR0", false, 0);
        this._GR1 = new Register16bit("GR1", true, 0);
        this._GR2 = new Register16bit("GR2", true, 0);
        this._GR3 = new Register16bit("GR3", true, 0);
        this._GR4 = new Register16bit("GR4", true, 0);
        this._GR5 = new Register16bit("GR5", true, 0);
        this._GR6 = new Register16bit("GR6", true, 0);
        this._GR7 = new Register16bit("GR7", true, 0);

        this._OF = new Flag("OF");
        this._SF = new Flag("SF");
        this._ZF = new Flag("ZF");

        this._memory = new Memory();
        this._stack = new Stack(this._memory);
        this._alu = new ALU();
    }

    public processInstuction(instruction: string) {
    }

    /**
     * LAD命令
     */
    public lad(r1: GR, r2: GR, adr: number) {
        let reg1 = this.grToReg(r1);
        let reg2 = this.grToReg(r2);

        let v2 = this.effectiveAddress(reg2, adr);
        reg1.value = v2;
    }

    /**
     * ADDA命令
     */
    public adda(r1: GR, r2: GR, adr: number) {
        let reg1 = this.grToReg(r1);
        let reg2 = this.grToReg(r2);

        let v2 = this.effectiveAddressContent(reg2, adr);
        this._alu.inputA.setValue(reg1.value);
        this._alu.inputB.setValue(v2);

        // ALUから結果を取り出してレジスタに入れる
        reg1.value = this._alu.output.value;
    }

    /**
     * LD命令
     */
    public ld(r1: GR, r2: GR, adr?: number) {
        let reg1 = this.grToReg(r1);
        let reg2 = this.grToReg(r2);

        // たぶんADDA命令のようにこの条件分岐は不要
        // adrの?も不要
        if (adr == undefined) {
            reg1.value = reg2.value;
        } else {
            reg1.value = this.effectiveAddressContent(reg2, adr);
        }

        // LD命令はOFを0にする
        this._OF.putdown();
    }

    /**
     * 実効アドレスを求める
     */
    private effectiveAddress(reg: Register16bit, adr: number) {
        // GR0は指標レジスタとして使えないので0とする
        let base = reg.name == "GR0" ? 0 : reg.value;
        let index = base + adr;
        return index;
    }

    /**
     * 実効アドレスの内容を返す
     */
    private effectiveAddressContent(reg: Register16bit, adr: number) {
        return this._memory.getMemroyValue(this.effectiveAddress(reg, adr));
    }

    private grToReg(r: GR): Register16bit {
        if (r == GR.GR0) return this.GR0;
        if (r == GR.GR1) return this.GR1;
        if (r == GR.GR2) return this.GR2;
        if (r == GR.GR3) return this.GR3;
        if (r == GR.GR4) return this.GR4;
        if (r == GR.GR5) return this.GR5;
        if (r == GR.GR6) return this.GR6;
        if (r == GR.GR7) return this.GR7;
    }
}

export enum GR {
    GR0,
    GR1,
    GR2,
    GR3,
    GR4,
    GR5,
    GR6,
    GR7
}