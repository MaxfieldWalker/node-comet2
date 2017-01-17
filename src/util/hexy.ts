'use strict';

// hexyを使わないならこのソースは不要

var hexdump = require('hexy');

export class HexdumpHelper{
    public static dump(){
        let format ={
            numbering: "none",
            annotate: "none",
            format: "twos"
        };

        let buf = new Buffer("abcdefghijklmnopqrstuvwxyz");
        
        console.log(hexdump.hexy(buf, format));
    }
}