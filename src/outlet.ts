import { Bas16bit } from './Bas16bits';

/**
 * Outlet
 * コネクタと接続される。値の発生源
 */
export class Outlet<T> {
    private _bases: Array<Bas16bit<T>>;

    constructor() {
        this._bases = new Array();
    }

    /**
     * 値をセットする
    */
    public setValue(value: T) {
        this._bases.forEach(bas => {
            bas.value = value;
        });
    }

    public getValue(): T {
        if (this._bases.length == 0) return null;

        // バスのどれも同じ値なので1つ目のバスの値を返す
        return this._bases[0].value;
    }

    public addBas(bas: Bas16bit<T>) {
        this._bases.push(bas);
        bas.onValueChanged(value => {
            console.log("Value: " + value);
        });
    }

    public unsetBas(bas: Bas16bit<T>) {
        let index = this._bases.indexOf(bas);
        this._bases.splice(index, 1);
    }
}