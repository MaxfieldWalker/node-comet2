"use strict";

import { Bas16bit } from "./bas16bit";

export class ValueChangedEventArgs<T>{
    private _value: T;
    private _source: Bas16bit<T>;

    /**
     * @param value 新しい値
     * @param source 変更元のバス
     */
    constructor(value: T, source: Bas16bit<T>) {
        this._value = value;
        this._source = source;
    }


    public get value() {
        return this._value;
    }

    public get source() {
        return this._source;
    }
}
