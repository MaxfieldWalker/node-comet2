'use strict';

import { Register16bit } from './register16bit';


let register = new Register16bit("GR0", false);
console.log(register.name);
register.value = 3;
console.log(register.value);
register.value = 10;
console.log(register.value);
