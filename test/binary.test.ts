"use strict";

import * as assert from "assert";
import { Comet2 } from "../src/comet2/comet2";
import { Input, Output } from "../src/comet2/io";
import { Comet2Option } from "../src/comet2/option";
import { read } from "../src/io/reader";
import * as _ from "lodash";
import * as Immutable from "immutable";

function readLines(path: string): Array<string> {
    const buf = read(path);
    // 末尾の改行を取り除いて一行ずつに分ける
    const lines = buf.toString().replace(/(\r\n|\r|\n)+$/, "").split(/\r\n|\r|\n/);
    return lines;
}

const fileNames = (n: number) => {
    // 0埋めする
    // 1  -> "01"
    // 12 -> "12"
    const nn = _.padStart(n.toString(), 2, "0");
    return [`./test/testdata/normal_${nn}.com`, `./test/testdata/normal_${nn}.expected.txt`]
}

const createOutput = (lines: Array<string>) => (s: string) => {
    lines.push(s);
};

function binaryTest(sourcePath: string, expectedPath: string, option?: Comet2Option, input?: Input) {
    test("test: " + sourcePath, () => {
        const actualLines: Array<string> = [];
        const output: Output = createOutput(actualLines);

        const comet2 = new Comet2(option, input, output);
        comet2.start(sourcePath);

        const expectedLines = readLines(expectedPath);

        assert.deepEqual(actualLines, expectedLines);
    });
}

function binaryTests(cases: Array<number>, option?: Comet2Option) {
    for (const n of cases) {
        const [sourcePath, expectedPath] = fileNames(n);
        binaryTest(sourcePath, expectedPath, option);
    }
}

suite("binary test", () => {
    suite("use GR8", () => {
        const cases = [3, 8, 9, 12, 13];
        const option: Comet2Option = {
            useGR8AsSP: true
        };

        binaryTests(cases, option);
    });

    suite("not use GR8", () => {
        const cases = [1, 2, 4, 5, 6, 7, 11];
        const option: Comet2Option = {
            useGR8AsSP: false
        };

        binaryTests(cases, option);
    });

    // normal_10.comは最大公約数を求めるプログラムで
    // 2つの数値の入力を受け付けるので別のテストに分けている
    suite("IN", () => {
        const [sourcePath, expectedPath] = fileNames(10);
        const option: Comet2Option = {
            useGR8AsSP: true
        };

        // 36と48を入力すると
        // 最大公約数は12になる
        let i = 0;
        const input: Input = () => {
            i++;

            if (i == 1) return "36";
            if (i == 2) return "48";

            throw new Error();
        }

        binaryTest(sourcePath, expectedPath, option, input);
    });
});
