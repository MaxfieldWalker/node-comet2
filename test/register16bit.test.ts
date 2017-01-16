import * as assert from 'assert';
import { Register16bit } from '../src/parts/register16bit';

suite('Register16bit Tests', () => {
    test('name', () => {
        let register = new Register16bit("GR0", false);

        assert.equal(register.name, "GR0");
    });

    test('set value', () => {
        let register = new Register16bit("GR0", false);

        register.value = 3;
        assert.equal(register.value, 3);
        register.value = 10;
        assert.equal(register.value, 10);
    });
});
