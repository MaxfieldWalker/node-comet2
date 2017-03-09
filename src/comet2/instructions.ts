"use strict";

export enum ArgumentType {
    none,
    r1_adr_r2,
    r1_r2,
    adr_r2,
    r,
    adr_adr
}

export interface InstructionInfo {
    instructionName: string;
    argumentType: ArgumentType;
}

export function getInstructionInfo(instCode: number): InstructionInfo {
    const inst = map.get(instCode);
    if (inst === undefined) throw new Error();

    return inst;
}

const map = new Map<number, InstructionInfo>([
    [0x00, { instructionName: "NOP", argumentType: ArgumentType.none }],
    [0x10, { instructionName: "LD", argumentType: ArgumentType.r1_adr_r2 }],
    [0x14, { instructionName: "LD", argumentType: ArgumentType.r1_r2 }],
    [0x11, { instructionName: "ST", argumentType: ArgumentType.r1_adr_r2 }],
    [0x12, { instructionName: "LAD", argumentType: ArgumentType.r1_adr_r2 }],
    [0x20, { instructionName: "ADDA", argumentType: ArgumentType.r1_adr_r2 }],
    [0x24, { instructionName: "ADDA", argumentType: ArgumentType.r1_r2 }],
    [0x22, { instructionName: "ADDL", argumentType: ArgumentType.r1_adr_r2 }],
    [0x26, { instructionName: "ADDL", argumentType: ArgumentType.r1_r2 }],
    [0x21, { instructionName: "SUBA", argumentType: ArgumentType.r1_adr_r2 }],
    [0x25, { instructionName: "SUBA", argumentType: ArgumentType.r1_r2 }],
    [0x23, { instructionName: "SUBL", argumentType: ArgumentType.r1_adr_r2 }],
    [0x27, { instructionName: "SUBL", argumentType: ArgumentType.r1_r2 }],
    [0x30, { instructionName: "AND", argumentType: ArgumentType.r1_adr_r2 }],
    [0x34, { instructionName: "AND", argumentType: ArgumentType.r1_r2 }],
    [0x31, { instructionName: "OR", argumentType: ArgumentType.r1_adr_r2 }],
    [0x35, { instructionName: "OR", argumentType: ArgumentType.r1_r2 }],
    [0x32, { instructionName: "XOR", argumentType: ArgumentType.r1_adr_r2 }],
    [0x36, { instructionName: "XOR", argumentType: ArgumentType.r1_r2 }],
    [0x40, { instructionName: "CPA", argumentType: ArgumentType.r1_adr_r2 }],
    [0x44, { instructionName: "CPA", argumentType: ArgumentType.r1_r2 }],
    [0x41, { instructionName: "CPL", argumentType: ArgumentType.r1_adr_r2 }],
    [0x45, { instructionName: "CPL", argumentType: ArgumentType.r1_r2 }],
    [0x51, { instructionName: "SRA", argumentType: ArgumentType.r1_adr_r2 }],
    [0x50, { instructionName: "SLA", argumentType: ArgumentType.r1_adr_r2 }],
    [0x52, { instructionName: "SLL", argumentType: ArgumentType.r1_adr_r2 }],
    [0x53, { instructionName: "SRL", argumentType: ArgumentType.r1_adr_r2 }],
    [0x61, { instructionName: "JMI", argumentType: ArgumentType.adr_r2 }],
    [0x62, { instructionName: "JNZ", argumentType: ArgumentType.adr_r2 }],
    [0x63, { instructionName: "JZE", argumentType: ArgumentType.adr_r2 }],
    [0x64, { instructionName: "JUMP", argumentType: ArgumentType.adr_r2 }],
    [0x65, { instructionName: "JPL", argumentType: ArgumentType.adr_r2 }],
    [0x66, { instructionName: "JOV", argumentType: ArgumentType.adr_r2 }],
    [0x70, { instructionName: "PUSH", argumentType: ArgumentType.adr_r2 }],
    [0x71, { instructionName: "POP", argumentType: ArgumentType.r }],
    [0x80, { instructionName: "CALL", argumentType: ArgumentType.adr_r2 }],
    [0x81, { instructionName: "RET", argumentType: ArgumentType.none }],
    [0x90, { instructionName: "IN", argumentType: ArgumentType.adr_adr }],
    [0x91, { instructionName: "OUT", argumentType: ArgumentType.adr_adr }],
    [0xA0, { instructionName: "RPUSH", argumentType: ArgumentType.none }],
    [0xA1, { instructionName: "RPOP", argumentType: ArgumentType.none }],
    [0xF0, { instructionName: "SVC", argumentType: ArgumentType.adr_r2 }],
]);
