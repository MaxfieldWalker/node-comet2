"use strict";

import { ArgumentType, InstructionInfo, instructionsInfo, InstructionType } from "@maxfield/node-casl2-comet2-core-common";
import { strHex } from "../comet2/errors";

export function getInstructionInfo(instCode: number): InstructionInfo {
    const inst = map.get(instCode);
    if (inst === undefined) {
        return {
            instructionName: `INVALID (${strHex(instCode, 2)})`,
            argumentType: ArgumentType.Unknown,
            code: -1,
            type: InstructionType.Unknown,
            documentation: "不正な命令です。"
        };
    }

    return inst;
}

function createMap(info: Array<InstructionInfo>): Map<number, InstructionInfo> {
    const map = new Map<number, InstructionInfo>();

    // アセンブラ命令は除く
    const withoutAssemblerInstruction = info.filter(x => x.type !== InstructionType.Assembler);
    for (const inst of withoutAssemblerInstruction) {
        map.set(inst.code, inst);
    }

    return map;
}

const map = createMap(instructionsInfo);
