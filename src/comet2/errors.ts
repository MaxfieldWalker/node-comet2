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

export class RuntimeError implements Error {
    public name = "Runtime Error";

    constructor(public message: string, public code: number, public category: RuntimeErrorCategory) {

    }

    toString() {
        const strCode = _.padStart(this.code.toString(), 2, "0");
        return `[${this.name}(${strCode})] ${this.message}`;
    }
}

export function createError(error: RuntimeErrorMessage, ...args: Array<string>): RuntimeError {
    const message = arguments.length > 1
        ? formatMessage(error.message, args)
        : error.message;

    return new RuntimeError(message, error.code, error.category);
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
        message: "不正なメモリアクセス('{0}')です。",
    },
    Invalid_instruction_0_: {
        code: 1,
        category: RuntimeErrorCategory.Error,
        message: "不正な命令('{0}')です。",
    },
    Invalid_GR_0_: {
        code: 2,
        category: RuntimeErrorCategory.Error,
        message: "不正なGR('{0}')です。"
    },
    Encode_failure_0_: {
        code: 3,
        category: RuntimeErrorCategory.Error,
        message: "JIS X 0201でエンコードできません ('{0}')。"
    },
    Decode_failure_0_: {
        code: 4,
        category: RuntimeErrorCategory.Error,
        message: "JIS X 0201でデコードできません ('{0}')。"
    },
    Stackoverflow: {
        code: 5,
        category: RuntimeErrorCategory.Error,
        message: "スタックオーバーフローが発生しました。"
    }
};
