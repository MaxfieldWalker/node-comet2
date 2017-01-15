import { Outlet } from './outlet';

/**
 * ALU
 */
class ALU {
    private _outletInputA: Outlet<number>;
    private _outletInputB: Outlet<number>;
    private _outletOutput: Outlet<number>;
    private _outletMode: Outlet<ALUMode>;

    private _aluMode: ALUMode;

    constructor() {
        this._outletInputA = new Outlet<number>();
        this._outletInputB = new Outlet<number>();
        this._outletOutput = new Outlet<number>();
        this._outletMode = new Outlet<ALUMode>();
    }

    /**
     * TODO: InputAとInputBに値が流れてくるたびにRx風に処理するようにする
     */
    // public getOutput() :number{
    //     if(this._aluMode == ALUMode.ADD) return this._connectorInputA.getValue() + this._connectorInputB.getValue();
    //     if(this._aluMode == ALUMode.SUB) return this._connectorInputA.getValue() - this._connectorInputB.getValue();
    //     if(this._aluMode == ALUMode.AND) return this._connectorInputA.getValue() & this._connectorInputB.getValue();
    //     if(this._aluMode == ALUMode.OR) return this._connectorInputA.getValue() | this._connectorInputB.getValue();
    //     if(this._aluMode == ALUMode.XOR) return this._connectorInputA.getValue() ^ this._connectorInputB.getValue();
    // }
}

enum ALUMode {
    ADD,
    SUB,
    AND,
    OR,
    XOR
}