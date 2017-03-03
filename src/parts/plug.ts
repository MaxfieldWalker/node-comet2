"use strict";

import { Bas16bit } from "./bas16bit";
import { Outlet } from "./outlet";

/**
 * Connector<T>
 */
export class Plug<T> {
    private _bas: Bas16bit<T>;
    // 接続されたアウトレット
    private _otherOutlet: Outlet<T> | undefined;

    // TODO: 今はバスをコンストラクタに取っているが
    //       要するにコネクタがどこから値を得るかを知れればよい。
    //       値の取得元をインターフェース化する
    constructor(bas?: Bas16bit<T>) {
        if (bas) {
            this._bas = bas;
        }
    }

    // 他のコネクタと接続する

    public connectWith(outlet: Outlet<T>) {
        this._otherOutlet = outlet;
        outlet.addBas(this._bas);
    }

    /**
     * アウトレットとの接続を解除する
     */
    public disconnect() {
        if (this._otherOutlet) {
            this._otherOutlet.removeBas(this._bas);
            this._otherOutlet = undefined;
        }
    }
}