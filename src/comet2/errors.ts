"use strict";

import * as _ from "lodash";

export enum RuntimeErrorCategory {
    Error,
    Warning
}

export interface RuntimeErrorMessage {
    code: number;
    category: RuntimeErrorCategory;
    message: string;
}

export interface RuntimeError {
    message: string;
    code: number;
    category: RuntimeErrorCategory;
}

export function createError(error: RuntimeErrorMessage, ...args: Array<string>): RuntimeError {
    const message = arguments.length > 1
        ? formatMessage(error.message, args)
        : error.message;

    return {
        message: message,
        code: error.code,
        category: error.category
    };
}

// e.g. "Duplicate label '{0}'." -> "Duplicate label 'L1'."
export function formatMessage(s: string, args: { [index: number]: string }): string {
    const format = s.replace(/{(\d+)}/g, (match, index) => args[index].toString());

    return format;
}

export function strHex(n: number, length: number) {
    return "0x" + _.padStart(n.toString(16).toUpperCase(), length, "0");
}

export const Errors = {
    Invalid_memory_access_0_: {
        code: 0,
        category: RuntimeErrorCategory.Error,
        message: "不正なメモリアクセスです ({0})。",
    },
    Invalid_instruction: {
        code: 1,
        category: RuntimeErrorCategory.Error,
        message: "不正な命令です。 ({0})。",
    }
};
