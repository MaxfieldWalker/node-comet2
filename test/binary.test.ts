"use strict";

import * as assert from "assert";
import { Comet2 } from "../src/comet2/comet2";
import { Output } from "../src/comet2/io";
import { Comet2Option } from "../src/comet2/option";
import { read } from "../src/io/reader";

function readLines(path: string): Array<string> {
    const buf = read(path);
    // 末尾の改行を取り除いて一行ずつに分ける
    const lines = buf.toString().replace(/(\r\n|\r|\n)+$/, "").split(/\r\n|\r|\n/);
    return lines;
}

const createOutput = (lines: Array<string>) => (s: string) => {
    lines.push(s);
};

function binaryTest(sourcePath: string, expectedPath: string) {
    const option: Comet2Option = {
        useGR8AsSP: true
    };

    const actualLines: Array<string> = [];
    const output: Output = createOutput(actualLines);

    const comet2 = new Comet2(option, undefined, output);
    comet2.start(sourcePath);

    const expectedLines = readLines(expectedPath);

    assert.deepEqual(actualLines, expectedLines);
}

suite("binary test", () => {
    test("test", () => {
        binaryTest("./test/testdata/normal_01.com", "./test/testdata/normal_01.expected.txt");
    });
});
