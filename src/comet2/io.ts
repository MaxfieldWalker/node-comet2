"use strict";

import * as rl from "readline";
const readlineSync = require("readline-sync");


export interface Input {
    (): string;
}

export interface Output {
    (s: string): void;
}

export const stdin: Input = () => {
    const line = readlineSync.prompt() as string;
    return line;
};

export const stdout: Output = (s: string) => {
    process.stdout.write(s + "\r\n");
};
