"use strict";

import * as assert from "assert";
import { Comet2 } from "../src/comet2/comet2";
import { Output } from "../src/comet2/io";
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

const createOutput = (lines: Array<string>) => (s: string) => {
    lines.push(s);
};

function binaryTest(sourcePath: string, expectedPath: string, option?: Comet2Option) {
    test("test: " + sourcePath, () => {
        const actualLines: Array<string> = [];
        const output: Output = createOutput(actualLines);

        const comet2 = new Comet2(option, undefined, output);
        comet2.start(sourcePath);

        const expectedLines = readLines(expectedPath);

        assert.deepEqual(actualLines, expectedLines);
    });
}

suite("binary test", () => {
    suite("not use GR8", () => {
        const fileNames = (n: number) => {
            // 0埋めする
            // 1  -> "01"
            // 12 -> "12"
            const nn = _.padStart(n.toString(), 2, "0");
            return [`./test/testdata/normal_${nn}.com`, `./test/testdata/normal_${nn}.expected.txt`]
        }

        const cases = [1, 2, 4, 5, 6, 7, 11];
        const option: Comet2Option = {
            useGR8AsSP: false
        };

        for (const n of cases) {
            const [sourcePath, expectedPath] = fileNames(n);
            binaryTest(sourcePath, expectedPath, option);
        }
    });
});
