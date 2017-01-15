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

let bas1 = new DataBas();
let bas2 = new DataBas();
let outlet1 = new Outlet<number>();
let outlet2 = new Outlet<number>();
let outlet3 = new Outlet<number>();
bas1.connecterA.connectWith(outlet1);
bas1.connecterB.connectWith(outlet2);

bas2.connecterA.connectWith(outlet3);
bas2.connecterB.connectWith(outlet2);

outlet1.setValue(3);
console.log(outlet1.getValue());
console.log(outlet2.getValue());
console.log(outlet3.getValue());



