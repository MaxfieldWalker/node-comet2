"use strict";

import { ArgumentType, InstructionInfo, instructionsInfo, InstructionType } from "@maxfield/node-casl2-comet2-core-common";

export function getInstructionInfo(instCode: number): InstructionInfo {
    const inst = map.get(instCode);
    if (inst === undefined) throw new Error();

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
