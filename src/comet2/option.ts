"use strict";

export interface Comet2Option {
    /**
     * GR8をSPとして使用する
     */
    useGR8AsSP?: boolean;

    /**
     * 自己書き換えを許可する
     */
    allowSelfModifying?: boolean;
}


export const defaultComet2Option: Comet2Option = {
    useGR8AsSP: false,
    allowSelfModifying: false,
};
