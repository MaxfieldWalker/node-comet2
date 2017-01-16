import { Outlet } from '../parts/outlet';

/**
 * ALU
 */
export class ALU {
    private _outletInputA: Outlet<number>;
    private _outletInputB: Outlet<number>;
    private _outletOutput: Outlet<number>;
    private _outletMode: Outlet<ALUMode>;

    constructor() {
        this._outletInputA = new Outlet<number>();
        this._outletInputB = new Outlet<number>();
        this._outletOutput = new Outlet<number>();
        this._outletMode = new Outlet<ALUMode>();

        this._outletMode.setValue(ALUMode.ADD);

        // 入力ABまたはモードが変化したらOutputの値を計算する
        this._outletInputA.valueChanged.subscribe(_ => this.updateOutput());
        this._outletInputB.valueChanged.subscribe(_ => this.updateOutput());
        this._outletMode.valueChanged.subscribe(_ => this.updateOutput());
    }


    public get inputA() {
        return this._outletInputA;
    }

    public get inputB() {
        return this._outletInputB;
    }

    public get output() {
        return this._outletOutput;
    }

    public get mode() {
        return this._outletMode;
    }

    private updateOutput(){
        let output = this.calcOutput();
        this._outletOutput.setValue(output);
    }

    private calcOutput() {
        let a = this._outletInputA.value;
        let b = this._outletInputB.value;
        let mode = this._outletMode.value;

        if (mode == ALUMode.ADD) return a + b;
        if (mode == ALUMode.SUB) return a - b;
        if (mode == ALUMode.AND) return a & b;
        if (mode == ALUMode.OR)  return a | b;
        if (mode == ALUMode.XOR) return a ^ b;
    }
}

export enum ALUMode {
    ADD,
    SUB,
    AND,
    OR,
    XOR,
}