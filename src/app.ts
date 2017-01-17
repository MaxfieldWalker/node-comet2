'use strict';
import { ALU, ALUMode } from './comet2/alu';
import { Comet2, GR } from './comet2/comet2';
import { HexdumpHelper } from './util/hexdumpHelper';
import { Reader } from './io/reader';

let alu = new ALU();

let buf = Reader.read('./test/testdata/temp.com');
console.log(buf.toString());

let dump = HexdumpHelper.dump(buf);
console.log("dumped: " + dump);

let length = dump.length;
console.log("buf length: " + length);

// 16進数にダンプしたものはCOMET2の一語は16ビットなので
// 長さが必ず4の倍数になる
if (length % 4 != 0) {
    console.log("error");
}

let memory: Array<number> = [];
// 4桁ごとに区切って数値に変換
for (var i = 0; i < length / 4; i++) {
    let start = 4 * i;
    let end = start + 4;
    let slice = dump.slice(start, end);
    // 16進数文字列を数値に変換
    memory.push(parseInt(slice, 16));
}

let comet2 = new Comet2(memory);
comet2.run();

console.log(comet2.GR1.value);
