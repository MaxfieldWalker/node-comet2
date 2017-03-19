"use strict";

import * as assert from "assert";
import { Comet2, DebugInfo, Comet2State } from "../../src/comet2/comet2";
import { Comet2Option } from "../../src/comet2/option";
import { Errors, createError, RuntimeError } from "../../src/comet2/errors";

// 例外が発生することをテストする
function testError(path: string, expectedError: RuntimeError, option: Comet2Option, debugInfo: DebugInfo) {
    const comet2 = new Comet2(option);

    comet2.init(path, debugInfo);

    while (true) {
        try {
            const end = comet2.stepInto();
            if (end) {
                // 例外が発生せず正常終了したのでエラー
                throw new Error();
            }
        } catch (error) {
            assert.deepEqual(error, expectedError);
            break;
        }
    }
}

// 例外が発生しないことをテストする
function testNotError(path: string, option: Comet2Option, debugInfo: DebugInfo) {
    const comet2 = new Comet2(option);

    comet2.init(path, debugInfo);

    while (true) {
        try {
            const end = comet2.stepInto();
            if (end) {
                return;
            }
        } catch (error) {
            // 例外が発生したのでエラー
            throw new Error();
        }
    }
}

suite("exception", () => {
    suite("invalid memory access", () => {
        const binaryPath = "./test/testdata/exception/invalidMemoryAccess.com";
        const debugInfo: DebugInfo = {
            dsRanges: [{ start: 9, end: 265 }]
        };

        test("don't allow self modifying", () => {
            const option: Comet2Option = {
                allowSelfModifying: false
            }

            testError(binaryPath,
                createError(Errors.Invalid_memory_access_0_, "0x0109"), option, debugInfo);
        });

        test("allow self modifying", () => {
            const option: Comet2Option = {
                allowSelfModifying: true
            }

            testNotError(binaryPath, option, debugInfo);
        });
    });
});
