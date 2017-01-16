import { Bas16bit } from './Bas16bits';
import { ValueChangedEventArgs } from './valueChangedEventArgs';

/**
 * Outlet
 * コネクタと接続される。値の発生源
 */
export class Outlet<T> {
    private _bases: Array<[Bas16bit<T>, (args: ValueChangedEventArgs<T>) => void]>;

    constructor() {
        this._bases = new Array();
    }

    /**
     * 値をセットする
    */
    public setValue(value: T) {
        this._bases.forEach(tuple => {
            tuple[0].value = value;
        });
    }

    public getValue(): T {
        if (this._bases.length == 0) return null;

        // バスのどれも同じ値なので1つ目のバスの値を返す
        return this._bases[0][0].value;
    }

    public addBas(bas: Bas16bit<T>) {
        let handler = (args: ValueChangedEventArgs<T>) => {
            // 自分自身でなく変更元でもないものに変更を伝える
            this._bases.filter(x => x[0] != bas).filter(x => x[0] != args.source).forEach(x => {
                if (x[0].value != args.value) {
                    x[0].value = args.value;
                }
            });
        };
        bas.onValueChanged.subscribe(handler);
        this._bases.push([bas, handler]);
    }

    public removeBas(bas: Bas16bit<T>) {
        let elementToRemove = this._bases.filter(x => x[0] == bas)[0];
        let index = this._bases.indexOf(elementToRemove);
        this._bases.splice(index, 1);
        bas.onValueChanged.unsubscribe(elementToRemove[1]);
    }
}