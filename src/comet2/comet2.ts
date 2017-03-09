"use strict"

import { Register16bit } from "../parts/register16bit";
import { Flag } from "../parts/flag";
import { Stack } from "../parts/stack";
import { Memory } from "../parts/memory";
import { Comet2Option } from "./option";
import { dumpTo2ByteArray } from "../util/hexdumpHelper";
import { getMSB, toSigned } from "../util/bit";
import { add, sub, and, or, xor, sla, sll, sra, srl, ShiftFunc } from "./calc";
import { jisx0201, GR } from "@maxfield/node-casl2-comet2-core-common";
import { stdin, stdout, Input, Output } from "./io";
import { getInstructionInfo, ArgumentType } from "./instructions";

const defaultComet2Option: Comet2Option = {
    useGR8AsSP: false
};

// .comファイルの先頭16バイト(8語)は開始番地の格納に使用するため
// プログラム本体は17バイト目以降にあるので
// 8語だけオフセットを指定している
const offset = 8;


/**
 * Comet2
 */
export class Comet2 {

    private _GR0: Register16bit;
    public get GR0(): number {
        return this._GR0.value;
    }

    private _GR1: Register16bit;
    public get GR1(): number {
        return this._GR1.value;
    }

    private _GR2: Register16bit;
    public get GR2(): number {
        return this._GR2.value;
    }

    private _GR3: Register16bit;
    public get GR3(): number {
        return this._GR3.value;
    }

    private _GR4: Register16bit;
    public get GR4(): number {
        return this._GR4.value;
    }

    private _GR5: Register16bit;
    public get GR5(): number {
        return this._GR5.value;
    }

    private _GR6: Register16bit;
    public get GR6(): number {
        return this._GR6.value;
    }

    private _GR7: Register16bit;
    public get GR7(): number {
        return this._GR7.value;
    }

    private get _GR8(): Register16bit {
        return this._stack._SP;
    }
    public get GR8(): number {
        return this._GR8.value;
    }

    private _OF: Flag;
    public get OF(): boolean {
        return this._OF.value;
    }

    private _SF: Flag;
    public get SF(): boolean {
        return this._SF.value;
    }

    private _ZF: Flag;
    public get ZF(): boolean {
        return this._ZF.value;
    }

    private _stack: Stack;
    get stack(): Stack {
        return this._stack;
    }

    private _memory: Memory;
    get memory(): Memory {
        return this._memory;
    }

    private _PR: Register16bit;
    public get PR(): number {
        return this._PR.value;
    }

    public get SP(): number {
        return this._stack.SP;
    }

    public get grs() {
        return {
            gr0: this.GR0,
            gr1: this.GR1,
            gr2: this.GR2,
            gr3: this.GR3,
            gr4: this.GR4,
            gr5: this.GR5,
            gr6: this.GR6,
            gr7: this.GR7,
            gr8: this.GR8
        };
    }

    public get flags() {
        return {
            of: this.OF,
            sf: this.SF,
            zf: this.ZF
        };
    }

    /**
     * サブルーチン呼び出しの深さを表す
     * CALL命令でインクリメントされ，RET命令でデクリメントされる
     */
    private _depthCount: number;

    private _step: number;

    constructor(private _comet2Option: Comet2Option = defaultComet2Option, private _input: Input = stdin, private _output: Output = stdout) {
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
        if (n == 8) return GR.GR8_SP;

        throw new Error();
    }

    init(inputPath: string) {
        this.resetState();

        // メモリにプログラムを乗せる
        const dump = dumpTo2ByteArray(inputPath);
        this._memory.load(dump, offset);

        // .comファイルの最初の2バイト(1語)にプログラム開始番地が格納されている
        this._PR.value = dump[0];
    }

    public get running(): boolean {
        return this._depthCount > 0;
    }

    private isValidGR = (rn: number): boolean => {
        const min = 0;
        const max = this._comet2Option.useGR8AsSP ? 8 : 7;
        return rn >= min && rn <= max;
    }

    private parseBinary() {
        const pr = this.PR;
        // PRの位置にある命令を取得
        const v = this._memory.getValue(pr);
        // 上二桁が命令である
        const inst = (v & 0xFF00) >> 8;
        // r1は3桁目にある
        const rn1 = (v & 0x00F0) >> 4;
        // r2は4桁目にある
        const rn2 = v & 0x000F;

        const address = this._memory.getValue(pr + 1);
        const address2 = this._memory.getValue(pr + 2);

        return { inst, rn1, rn2, address, address2 };
    }

    getState(): Comet2State {
        const { inst, rn1, rn2, address, address2 } = this.parseBinary();

        const r1 = this.numberToGR(rn1);
        const r2 = this.numberToGR(rn2);

        if (!this.isValidGR(rn1)) throw new Error("Invalid GR");
        if (!this.isValidGR(rn2)) throw new Error("Invalid GR");

        const gr1 = this.grToReg(r1);
        const gr2 = this.grToReg(r2);

        const instInfo = getInstructionInfo(inst);
        const { instructionName, argumentType } = instInfo;
        const args: Array<number | string> = [];
        switch (argumentType) {
            case ArgumentType.none:
                break;
            case ArgumentType.r1_adr_r2:
                args.push(gr1.name, address, gr2.name);
                break;
            case ArgumentType.r1_r2:
                args.push(gr1.name, gr2.name);
                break;
            case ArgumentType.adr_r2:
                args.push(address, gr2.name);
                break;
            case ArgumentType.r:
                args.push(gr1.name);
                break;
            case ArgumentType.adr_adr:
                args.push(address, address2);
                break;
            default:
                throw new Error();
        }

        return {
            PR: this.PR,
            // 次に実行する命令
            nextInstruction: {
                name: instructionName,
                args: args
            },
            // ステップ数
            step: this._step,
            SP: this.SP,
            FR: {
                OF: this.OF,
                SF: this.SF,
                ZF: this.ZF
            },
            GR: {
                GR0: this.GR0, GR1: this.GR1, GR2: this.GR2, GR3: this.GR3,
                GR4: this.GR4, GR5: this.GR5, GR6: this.GR6, GR7: this.GR7
            }
        };
    }


    public run(): boolean {
        if (!this.running) return true;

        const { inst, rn1, rn2, address, address2 } = this.parseBinary();

        const r1 = this.numberToGR(rn1);
        const r2 = this.numberToGR(rn2);

        if (!this.isValidGR(rn1)) throw new Error("Invalid GR");
        if (!this.isValidGR(rn2)) throw new Error("Invalid GR");

        if (inst == 0x00) this.nop();

        if (inst == 0x10) this.ld(r1, r2, address);
        if (inst == 0x14) this.ld(r1, r2);

        if (inst == 0x11) this.st(r1, address, r2);
        if (inst == 0x12) this.lad(r1, address, r2);

        if (inst == 0x20) this.adda(r1, r2, address);
        if (inst == 0x24) this.adda(r1, r2);
        if (inst == 0x22) this.addl(r1, r2, address);
        if (inst == 0x26) this.addl(r1, r2);
        if (inst == 0x21) this.suba(r1, r2, address);
        if (inst == 0x25) this.suba(r1, r2);
        if (inst == 0x23) this.subl(r1, r2, address);
        if (inst == 0x27) this.subl(r1, r2);
        if (inst == 0x30) this.and(r1, r2, address);
        if (inst == 0x34) this.and(r1, r2);
        if (inst == 0x31) this.or(r1, r2, address);
        if (inst == 0x35) this.or(r1, r2);
        if (inst == 0x32) this.xor(r1, r2, address);
        if (inst == 0x36) this.xor(r1, r2);
        if (inst == 0x40) this.cpa(r1, r2, address);
        if (inst == 0x44) this.cpa(r1, r2);
        if (inst == 0x41) this.cpl(r1, r2, address);
        if (inst == 0x45) this.cpl(r1, r2);

        if (inst == 0x50) this.sla(r1, address, r2);
        if (inst == 0x51) this.sra(r1, address, r2);
        if (inst == 0x52) this.sll(r1, address, r2);
        if (inst == 0x53) this.srl(r1, address, r2);

        if (inst == 0x61) this.jmi(address, r2);
        if (inst == 0x62) this.jnz(address, r2);
        if (inst == 0x63) this.jze(address, r2);
        if (inst == 0x64) this.jump(address, r2);
        if (inst == 0x65) this.jpl(address, r2);
        if (inst == 0x66) this.jov(address, r2);

        if (inst == 0x70) this.push(address, r2);
        if (inst == 0x71) this.pop(r1);

        if (inst == 0x80) this.call(address, r2);
        if (inst == 0x81) this.ret();

        if (inst == 0x90) this.in(address, address2);
        if (inst == 0x91) this.out(address, address2);

        if (inst == 0xA0) this.rpush();
        if (inst == 0xA1) this.rpop();

        if (inst == 0xF0) this.svc(r2, address);

        // TODO: いずれの命令にも当てはまらなかった場合の処理をする

        this._step++;

        return !this.running;
    }

    private updatePR(adr?: number) {
        adr === undefined ? this.onePlusPR() : this.twoPlusPR();
    }

    private plusPR(n: number) {
        this._PR.value = this._PR.value + n;
    }

    private onePlusPR = () => this.plusPR(1);
    private twoPlusPR = () => this.plusPR(2);
    private threePlusPR = () => this.plusPR(3);

    /**
     * NOP命令
     */
    nop() {
        // 何もしない
        this.onePlusPR();
    }

    /**
     * LD命令
     */
    public ld(r1: GR, r2: GR, adr?: number) {
        const reg1 = this.grToReg(r1);
        const v = adr === undefined
            ? this.grToReg(r2).value
            : this.effectiveAddressContent(adr, r2);

        reg1.value = v;

        // LD命令はOFを0にする
        this.setFR(
            false,
            getMSB(v) == 1,
            v == 0
        );

        this.updatePR(adr);
    }

    /**
     * ST命令
     */
    st(r1: GR, adr: number, r2?: GR) {
        const reg1 = this.grToReg(r1);

        const effectiveAdr = this.effectiveAddress(adr, r2);
        this._memory.setMemoryValue(reg1.value, effectiveAdr);

        this.twoPlusPR();
    }

    /**
     * LAD命令
     */
    public lad(r1: GR, adr: number, r2?: GR) {
        const reg1 = this.grToReg(r1);

        const v2 = this.effectiveAddress(adr, r2);
        reg1.value = v2;

        this.twoPlusPR();
    }


    adda = (r1: GR, r2: GR, adr?: number) => this.operation(add, false, r1, r2, adr);
    addl = (r1: GR, r2: GR, adr?: number) => this.operation(add, true, r1, r2, adr);

    suba = (r1: GR, r2: GR, adr?: number) => this.operation(sub, false, r1, r2, adr);
    subl = (r1: GR, r2: GR, adr?: number) => this.operation(sub, true, r1, r2, adr);

    and = (r1: GR, r2: GR, adr?: number) => this.logicalOperation(and, r1, r2, adr);
    or = (r1: GR, r2: GR, adr?: number) => this.logicalOperation(or, r1, r2, adr);
    xor = (r1: GR, r2: GR, adr?: number) => this.logicalOperation(xor, r1, r2, adr);

    cpa = (r1: GR, r2: GR, adr?: number) => this.compareOperation(false, r1, r2, adr);
    cpl = (r1: GR, r2: GR, adr?: number) => this.compareOperation(true, r1, r2, adr);

    sla = (r1: GR, adr: number, r2?: GR) => this.shiftOperation(sla, r1, adr, r2);
    sra = (r1: GR, adr: number, r2?: GR) => this.shiftOperation(sra, r1, adr, r2);
    sll = (r1: GR, adr: number, r2?: GR) => this.shiftOperation(sll, r1, adr, r2);
    srl = (r1: GR, adr: number, r2?: GR) => this.shiftOperation(srl, r1, adr, r2);


    /**
     * JPL命令
     */
    public jpl(adr: number, r2?: GR) {
        const branchCondition = !this.SF && !this.ZF;
        this.branchOperation(branchCondition, adr, r2);
    }

    /**
     * JMI命令
     */
    public jmi(adr: number, r2?: GR) {
        const branchCondition = this.SF;
        this.branchOperation(branchCondition, adr, r2);
    }

    /**
     * JNZ命令
     */
    public jnz(adr: number, r2?: GR) {
        const branchCondition = !this.ZF;
        this.branchOperation(branchCondition, adr, r2);
    }

    /**
     * JZE命令
     */
    public jze(adr: number, r2?: GR) {
        const branchCondition = this.ZF;
        this.branchOperation(branchCondition, adr, r2);
    }

    /**
     * JOV命令
     */
    public jov(adr: number, r2?: GR) {
        const branchCondition = this.OF;
        this.branchOperation(branchCondition, adr, r2);
    }

    /**
     * JUMP命令
     */
    public jump(adr: number, r2?: GR) {
        const branchCondition = true;
        this.branchOperation(branchCondition, adr, r2);
    }

    /**
     * PUSH命令
     */
    public push(adr: number, r2?: GR) {
        const v2 = this.effectiveAddress(adr, r2);
        this._stack.push(v2);

        this.twoPlusPR();
    }

    /**
     * POP命令
     */
    public pop(r: GR) {
        this.grToReg(r).value = this._stack.pop();

        this.onePlusPR();
    }

    /**
     * CALL命令
     */
    public call(adr: number, r2?: GR) {
        this._depthCount++;

        // CALL命令の次の命令に復帰できるように
        // 先にPRを進めておく
        this.twoPlusPR();

        this._stack.push(this.PR);
        const v2 = this.effectiveAddress(adr, r2);
        this._PR.value = v2;
    }

    /**
     * RET命令
     */
    public ret() {
        this._depthCount--;

        this._PR.value = this._stack.pop();
    }

    /**
     * SVC命令
     */
    public svc(adr: number, r2?: GR) {
        // 用途が無いので何もしない
        this.twoPlusPR();
    }

    in(adr1: number, adr2: number, input?: Input): string {
        // 入力を受け付ける
        const line = input ? input() : this._input();

        // 最大256文字受け付ける
        const length = Math.min(line.length, 256);
        const sub = line.substr(0, length);
        // TODO: エラー処理をする
        const charCodes = jisx0201.convertToCharCodes(sub);

        // 入力された文字列を格納する
        this._memory.setMemoryValues(charCodes, adr1);
        // 入力された文字列長を格納する
        this._memory.setMemoryValue(length, adr2);

        this.threePlusPR();

        return sub;
    }

    out(adr1: number, adr2: number): string {
        const length = this.effectiveAddressContent(adr2);
        // 上位8ビットは無視される仕様なので無視している
        const values = this._memory.getValues(adr1, length).map(x => x & 0x00FF);
        // TODO: エラー処理をする
        try {
            const str = jisx0201.convertToString(values);
            // 文字列を出力する
            this._output(str);

            this.threePlusPR();

            return str;
        } catch (error) {
            throw new Error();
        }
    }

    rpush() {
        this.push(0, GR.GR1);
        this.push(0, GR.GR2);
        this.push(0, GR.GR3);
        this.push(0, GR.GR4);
        this.push(0, GR.GR5);
        this.push(0, GR.GR6);
        this.push(0, GR.GR7);

        if (this._comet2Option.useGR8AsSP) {
            this.push(0, GR.GR8_SP);
        }

        this.onePlusPR();
    }

    rpop() {
        if (this._comet2Option.useGR8AsSP) {
            this.pop(GR.GR8_SP);
        }

        this.pop(GR.GR7);
        this.pop(GR.GR6);
        this.pop(GR.GR5);
        this.pop(GR.GR4);
        this.pop(GR.GR3);
        this.pop(GR.GR2);
        this.pop(GR.GR1);

        this.onePlusPR();
    }

    /**
     * 実効アドレスを求める
     */
    private effectiveAddress(adr: number, r2?: GR) {
        // GR0は指標レジスタとして使えないので0とする
        const add = r2 !== undefined
            ? r2 == GR.GR0 ? 0 : this.grToReg(r2).value
            : 0;

        const index = (adr + add) & 0xFFFF;
        return index;
    }

    /**
     * 実効アドレスの内容を返す
     */
    private effectiveAddressContent(adr: number, r2?: GR) {
        const index = this.effectiveAddress(adr, r2);

        return this._memory.getValue(index);
    }

    private calc(method: (a: number, b: number) => number, r1: GR, r2: GR, adr?: number) {
        const v1 = this.grToReg(r1).value;
        const v2 = adr === undefined
            ? this.grToReg(r2).value
            : this.effectiveAddressContent(adr, r2);

        const ans = method(v1, v2);
        const r = ans & 0xFFFF;

        return { v1, v2, ans, r };
    }

    private compareOperation(isLogical: boolean, r1: GR, r2: GR, adr?: number) {
        const compare = (a: number, b: number) => isLogical ? a - b : toSigned(a) - toSigned(b);
        const { ans } = this.calc(compare, r1, r2, adr);

        // フラグを設定する
        this.setFR(
            false,
            ans < 0,
            ans == 0
        );

        this.updatePR(adr);
    }

    private logicalOperation(method: (a: number, b: number) => number, r1: GR, r2: GR, adr?: number) {
        const { r } = this.calc(method, r1, r2, adr);
        this.grToReg(r1).value = r;

        // フラグを設定する
        this.setFR(
            false,
            getMSB(r) == 1,
            r == 0
        );

        this.updatePR(adr);
    }

    private operation(method: (a: number, b: number) => number, isLogical: boolean, r1: GR, r2: GR, adr?: number) {
        const { v1, ans, r } = this.calc(method, r1, r2, adr);
        this.grToReg(r1).value = r;

        const overflow = isLogical
            ? ans.toString(2).length > 16
            : Math.abs(toSigned(r) - toSigned(v1)) > 32768;

        // フラグを設定する
        this.setFR(
            overflow,
            getMSB(r) == 1,
            r == 0
        );

        this.updatePR(adr);
    }

    private shiftOperation(method: ShiftFunc, r1: GR, adr: number, r2?: GR) {
        const reg1 = this.grToReg(r1);

        const v1 = reg1.value;
        const v2 = this.effectiveAddress(adr, r2);
        const { ans, lastExpelledBit } = method(v1, v2);
        const r = ans & 0xFFFF;

        reg1.value = r;

        // フラグを設定する
        this.setFR(
            lastExpelledBit == 1,
            getMSB(r) == 1,
            r == 0);

        this.twoPlusPR();
    }

    private branchOperation(branchCondition: boolean, adr: number, r2?: GR) {
        if (branchCondition) {
            const v2 = this.effectiveAddress(adr, r2);
            this._PR.value = v2;
        } else {
            this.twoPlusPR();
        }
    }

    private setFR(ofCond: boolean, sfCond: boolean, zfCond: boolean) {
        ofCond ? this._OF.raise() : this._OF.putdown();
        sfCond ? this._SF.raise() : this._SF.putdown();
        zfCond ? this._ZF.raise() : this._ZF.putdown();
    }

    private grToReg(r: GR): Register16bit {
        if (r == GR.GR0) return this._GR0;
        if (r == GR.GR1) return this._GR1;
        if (r == GR.GR2) return this._GR2;
        if (r == GR.GR3) return this._GR3;
        if (r == GR.GR4) return this._GR4;
        if (r == GR.GR5) return this._GR5;
        if (r == GR.GR6) return this._GR6;
        if (r == GR.GR7) return this._GR7;
        if (r == GR.GR8_SP) return this._GR8;

        throw new Error();
    }

    setOF(v: boolean) {
        this._OF.set(v);
    }

    setSF(v: boolean) {
        this._SF.set(v);
    }

    setZF(v: boolean) {
        this._ZF.set(v);
    }

    getStackActiveValue() {
        return this._stack.getActiveValue();
    }

    /**
     * COMET2を初期状態にします
     */
    resetState() {
        // depthCountが0になったらプログラム終了とする
        this._depthCount = 1;
        this._step = 0;

        this._GR0.reset();
        this._GR1.reset();
        this._GR2.reset();
        this._GR3.reset();
        this._GR4.reset();
        this._GR5.reset();
        this._GR6.reset();
        this._GR7.reset();
        this._GR8.reset();

        this._OF.reset();
        this._SF.reset();
        this._ZF.reset();

        this._stack.reset();
        this._memory.reset();
        this._PR.reset();
    }
}

export interface Comet2State {
    PR: number;
    // 次に実行する命令
    nextInstruction: {
        name: string;
        args: Array<string | number>;
    };
    // ステップ数
    step: number;
    SP: number;
    FR: {
        OF: boolean;
        SF: boolean;
        ZF: boolean;
    };
    GR: {
        GR0: number; GR1: number; GR2: number; GR3: number;
        GR4: number; GR5: number; GR6: number; GR7: number;
        [key: string]: number;
    }
}
