"use strict";

// hexyを使わないならこのソースは不要

const hexdump = require("hexy");

export class HexdumpHelper{
    public static dump(){
        const format = {
            numbering: "none",
            annotate: "none",
            format: "twos"
        };

        const buf = new Buffer("abcdefghijklmnopqrstuvwxyz");

        console.log(hexdump.hexy(buf, format));
    }
}