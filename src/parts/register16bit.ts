"use strict"

/**
 * Register16bit
 */
export class Register16bit {

    /**
     * レジスタ名
     */
    private _name: string;
    public get name(): string {
        return this._name;
    }

    /**
     * レジスタの値
     */
    private _value: number;
    public get value(): number {
        return this._value;
    }
    public set value(value: number) {
        this._value = value;
    }


    private _isIndexRegister: boolean;
    public get isIndexRegister(): boolean {
        return this._isIndexRegister;
    }


    constructor(name: string, isIndexRegister: boolean, value?: number) {
        this._name = name;
        this._isIndexRegister = isIndexRegister;
        if (value !== undefined) {
            this._value = value;
        }
    }
}
