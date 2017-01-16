import { Plug } from './plug';
import { EventEmitter } from 'events';

/**
 * 16ビットバス
 */
export class Bas16bit<T> {
    private _value: T;
    private _connecterA : Plug<T>;
    private _connecterB : Plug<T>;

    private _emitter: vscode.EventEmitter<T>;

    public get onValueChanged(): vscode.Event<T>{
        return this._emitter.event;
    }

    // TODO: 接続先との通信用のインターフェースを渡す
    constructor() {
        this._connecterA = new Plug(this);
        this._connecterB = new Plug(this);
        this._emitter = new vscode.EventEmitter();
    }

    
    public get value() : T {
        return this._value;
    }
    
    
    public set value(v : T) {
        this._value = v;
        this._emitter.fire(v);
    }
    
    
    public get connecterA() : Plug<T> {
        return this._connecterA;
    }

    
    public get connecterB() : Plug<T> {
        return this._connecterB;
    }    
}

