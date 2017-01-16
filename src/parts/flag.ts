'use strict'

/**
 * Flag
 */
export class Flag {
    private _name: string;
    public get name(): string {
        return this._name;
    }


    private _value: boolean;
    public get value(): boolean {
        return this._value;
    }


    constructor(name: string) {
        this._name = name;

    }

    public raise() {
        this._value = true;
    }

    public putdown() {
        this._value = false;
    }
}