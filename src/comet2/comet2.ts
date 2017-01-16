'use strict'

import { Register16bit } from '../parts/register16bit';
import { Flag } from '../parts/flag';

/**
 * Comet2
 */
class Comet2 {

    private _GR0: Register16bit;
    public get GR0(): Register16bit {
        return this._GR0;
    }

    private _GR1: Register16bit;
    public get GR1(): Register16bit {
        return this._GR1;
    }

    private _GR2: Register16bit;
    public get GR2(): Register16bit {
        return this._GR2;
    }

    private _GR3: Register16bit;
    public get GR3(): Register16bit {
        return this._GR3;
    }

    private _GR4: Register16bit;
    public get GR4(): Register16bit {
        return this._GR4;
    }

    private _GR5: Register16bit;
    public get GR5(): Register16bit {
        return this._GR5;
    }

    private _GR6: Register16bit;
    public get GR6(): Register16bit {
        return this._GR6;
    }

    private _GR7: Register16bit;
    public get GR7(): Register16bit {
        return this._GR7;
    }

    private _OF: Flag;
    public get OF(): Flag {
        return this._OF;
    }

    private _SF: Flag;
    public get SF(): Flag {
        return this._SF;
    }

    private _ZF: Flag;
    public get ZF(): Flag {
        return this._ZF;
    }

    constructor() {
        this._GR0 = new Register16bit("GR0", false, 0);
        this._GR1 = new Register16bit("GR1", true, 0);
        this._GR2 = new Register16bit("GR2", true, 0);
        this._GR3 = new Register16bit("GR3", true, 0);
        this._GR4 = new Register16bit("GR4", true, 0);
        this._GR5 = new Register16bit("GR5", true, 0);
        this._GR6 = new Register16bit("GR6", true, 0);
        this._GR7 = new Register16bit("GR7", true, 0);

        this._OF = new Flag("OF");
        this._SF = new Flag("SF");
        this._ZF = new Flag("ZF");
    }
}