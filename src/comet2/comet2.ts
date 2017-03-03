"use strict"

import { Register16bit } from "../parts/register16bit";
import { Flag } from "../parts/flag";
import { Stack } from "../parts/stack";
import { Memory } from "../parts/memory";
import { ALU, ALUMode } from "./alu";
import { Comet2Option } from "./option";
import { dumpTo2ByteArray } from "../util/hexdumpHelper";

const defaultComet2Option: Comet2Option = {
    useGR8AsSP: false
};

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

    private _stack: Stack;
    private _memory: Memory;
    private _alu: ALU;
    private _PR: Register16bit;


    constructor(private _comet2Option: Comet2Option = defaultComet2Option) {
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

        this._stack = new Stack(this._memory);
        this._alu = new ALU();

        // PRの最初の値は0
        this._PR = new Register16bit("PR", false, 0);
    }

    private numberToGR(n: number): GR {
        if (n == 0) return GR.GR0;
        if (n == 1) return GR.GR1;
        if (n == 2) return GR.GR2;
        if (n == 3) return GR.GR3;
        if (n == 4) return GR.GR4;
        if (n == 5) return GR.GR5;
        if (n == 6) return GR.GR6;
        if (n == 7) return GR.GR7;

        throw new Error();
    }

    public run(inputPath: string) {
        const memory = dumpTo2ByteArray(inputPath);
        this._memory = new Memory();
        if (memory) {
            // メモリにプログラムを載せる
            this._memory.load(memory);
        }

        const pr = this._PR.value;
        // TODO: .comファイルの先頭にラベル名を含めないならoffsetは不要
        const offset = 8;
        // PRの位置にある命令を取得
        const v = this._memory.getMemroyValue(pr + offset);
        // 上二桁が命令である
        const inst = (v & 0xFF00) >> 8;
        // r1は3桁目にある
        const r1 = this.numberToGR((v & 0x00F0) >> 4);
        // r2は4桁目にある
        const r2 = this.numberToGR(v & 0x000F);
        const address = this._memory.getMemroyValue(pr + 1 + offset);

        // NOP命令
        if (inst == 0x00) {

        }

        // LD命令(アドレス有り)
        if (inst == 0x10) {

        }
        // LD命令(アドレス無し)
        if (inst == 0x14) {

        }

        // ST命令
        if (inst == 0x11) {

        }

        // LAD命令
        if (inst == 0x12) {
            this.lad(r1, r2, address);

            const newPR = pr + 2;
            this._PR.value = newPR;
        }


        // ADDA命令(アドレス無し)
        if (inst == 0x24) {
            this.adda(r1, r2);
            const newPR = pr + 1
            this._PR.value = newPR;
        }
        // ADDA命令(アドレス有り)
        if (inst == 0x20) {
            this.adda(r1, r2, address);
            const newPR = pr + 2;
            this._PR.value = newPR;
        }

        // ADDL命令(アドレス無し)
        if (inst == 0x26) {

        }
        // ADDL命令(アドレス有り)
        if (inst == 0x22) {

        }

        // SUBA命令(アドレス無し)
        if (inst == 0x25) {

        }
        // SUBA命令(アドレス有り)
        if (inst == 0x21) {

        }

        // SUBL命令(アドレス無し)
        if (inst == 0x27) {

        }
        // SUBL命令(アドレス有り)
        if (inst == 0x23) {

        }

        // AND命令(アドレス無し)
        if (inst == 0x34) {

        }
        // AND命令(アドレス有り)
        if (inst == 0x30) {

        }

        // OR命令(アドレス無し)
        if (inst == 0x35) {

        }
        // OR命令(アドレス有り)
        if (inst == 0x31) {

        }

        // XOR命令(アドレス無し)
        if (inst == 0x36) {

        }
        // XOR命令(アドレス有り)
        if (inst == 0x32) {

        }

        // CPA命令(アドレス無し)
        if (inst == 0x44) {

        }
        // CPA命令(アドレス有り)
        if (inst == 0x40) {

        }

        // CPL命令(アドレス無し)
        if (inst == 0x45) {

        }
        // SUBA命令(アドレス有り)
        if (inst == 0x41) {

        }

        if (inst != 0x81) {
            // TODO: 終了条件を本番用にする
            // this.run();
        }
    }

    /**
     * LAD命令
     */
    public lad(r1: GR, r2: GR, adr: number) {
        const reg1 = this.grToReg(r1);
        const reg2 = this.grToReg(r2);

        const v2 = this.effectiveAddress(reg2, adr);
        reg1.value = v2;
    }

    /**
     * ADDA命令
     */
    public adda(r1: GR, r2: GR, adr?: number) {
        const reg1 = this.grToReg(r1);
        const reg2 = this.grToReg(r2);

        this._alu.inputA.setValue(reg1.value);
        const v2 = this.effectiveAddressContent(reg2, adr);
        this._alu.inputB.setValue(v2);

        this._alu.mode.setValue(ALUMode.ADD);
        // ALUから結果を取り出してレジスタに入れる
        reg1.value = this._alu.output.value;
    }

    /**
     * SUBA命令
     */
    public suba(r1: GR, r2: GR, adr?: number) {
        const reg1 = this.grToReg(r1);
        const reg2 = this.grToReg(r2);

        this._alu.inputA.setValue(reg1.value);
        const v2 = this.effectiveAddressContent(reg2, adr);
        this._alu.inputB.setValue(v2);

        this._alu.mode.setValue(ALUMode.SUB);
        // ALUから結果を取り出してレジスタに入れる
        reg1.value = this._alu.output.value;
    }

    /**
     * LD命令
     */
    public ld(r1: GR, r2: GR, adr?: number) {
        const reg1 = this.grToReg(r1);
        const reg2 = this.grToReg(r2);

        reg1.value = this.effectiveAddressContent(reg2, adr);

        // LD命令はOFを0にする
        this._OF.putdown();
    }

    /**
     * 実効アドレスを求める
     */
    private effectiveAddress(reg: Register16bit, adr: number) {
        // GR0は指標レジスタとして使えないので0とする
        const base = reg.name == "GR0" ? 0 : reg.value;
        const index = base + adr;
        return index;
    }

    /**
     * 実効アドレスの内容を返す
     */
    private effectiveAddressContent(reg: Register16bit, adr?: number) {
        if (adr == undefined) {
            return reg.value;
        } else {
            return this._memory.getMemroyValue(this.effectiveAddress(reg, adr));
        }
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

        throw new Error();
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
