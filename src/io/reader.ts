"use strict";

import * as fs from "fs";

export function read(path: string): Buffer {
    const buf = fs.readFileSync(path);
    return buf;
}
