'use strict';
import { ALU, ALUMode } from './comet2/alu';
let alu = new ALU();



alu.mode.setValue(ALUMode.ADD);
alu.inputA.setValue(3);
alu.inputB.setValue(5);

let result = alu.output.value;
console.log(result);


alu.mode.setValue(ALUMode.SUB);

result = alu.output.value;

console.log(result);
