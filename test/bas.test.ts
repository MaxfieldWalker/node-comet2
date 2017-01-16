import * as assert from 'assert';

import { DataBas } from '../src/parts/databas';
import { Outlet } from '../src/parts/outlet';

suite('Bas Tests', () => {
    test('value changed', () => {
        let bas1 = new DataBas();
        let bas2 = new DataBas();

        let outlet1 = new Outlet<number>();
        let outlet2 = new Outlet<number>();
        let outlet3 = new Outlet<number>();
        bas1.connecterA.connectWith(outlet1);
        bas1.connecterB.connectWith(outlet2);

        bas2.connecterA.connectWith(outlet3);
        bas2.connecterB.connectWith(outlet2);

        // どこから値を入れても値が伝達されるか
        outlet1.setValue(3);
        assert.equal(outlet1.value, 3);
        assert.equal(outlet2.value, 3);
        assert.equal(outlet3.value, 3);

        outlet2.setValue(5);
        assert.equal(outlet1.value, 5);
        assert.equal(outlet2.value, 5);
        assert.equal(outlet3.value, 5);

        outlet3.setValue(7);
        assert.equal(outlet1.value, 7);
        assert.equal(outlet2.value, 7);
        assert.equal(outlet3.value, 7);
    });
});
