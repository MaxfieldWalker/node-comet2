'use strict';

import { Register16bit } from './register16bit';
import { DataBas } from './databas';
import { Outlet } from './outlet';

let register = new Register16bit("GR0", false);
console.log(register.name);
register.value = 3;
console.log(register.value);
register.value = 10;
console.log(register.value);

console.log("\nOutlet Plug test\n");

let bas = new DataBas();
let outlet1 = new Outlet<number>();
let outlet2 = new Outlet<number>();
bas.connecterA.connectWith(outlet1);
bas.connecterB.connectWith(outlet2);

outlet1.setValue(3);
console.log(outlet2.getValue());

outlet1.setValue(5);
console.log(outlet2.getValue());

outlet2.setValue(10);
console.log(outlet1.getValue());

