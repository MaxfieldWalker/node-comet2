import { Bas16bit } from './bas16bit';
import { ValueChangedEventArgs } from './valueChangedEventArgs';
import { EventEmitter } from '../common/eventEmitter';

/**
 * Outlet
 * コネクタと接続される。値の発生源
 */
export class Outlet<T> {
    private _bases: Array<[Bas16bit<T>, (args: ValueChangedEventArgs<T>) => void]>;
    private _value: T;
    private _emitter: EventEmitter<T>;

    constructor() {
        this._bases = new Array();
        this._emitter = new EventEmitter();
    }

    /**
     * 値をセットする
    */
    public setValue(value: T) {
        this.updateValue(value);

        this._bases.forEach(tuple => {
            tuple[0].value = value;
        });
    }

    public get value(): T {
        return this._value;
    }

    private updateValue(value: T) {
        if (this._value != value) {
            this._value = value;
            this._emitter.fire(value);
        }
    }

    public get valueChanged() {
        return this._emitter;
    }

    public addBas(bas: Bas16bit<T>) {
        let handler = (args: ValueChangedEventArgs<T>) => {
            this.updateValue(args.value);

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