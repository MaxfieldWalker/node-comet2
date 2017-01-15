import { DataBas } from '../src/databas';
import { Outlet } from '../src/outlet';

let bas1 = new DataBas();
let bas2 = new DataBas();
let outlet1 = new Outlet<number>();
let outlet2 = new Outlet<number>();
let outlet3 = new Outlet<number>();
bas1.connecterA.connectWith(outlet1);
bas1.connecterB.connectWith(outlet2);

outlet1.setValue(3);
console.log(outlet2.getValue());

outlet1.setValue(5);
console.log(outlet2.getValue());

outlet2.setValue(10);
console.log(outlet1.getValue());
