'use strict';

const {
    GroveLCDRGB
} = require('../../');

const {
    loop
} = require('../helpers/loop');

{
    const lcd = new GroveLCDRGB();

    const tids = {
        tid0: null
    };

    function done() {
        clearTimeout(tids.tid0);

        lcd.setRGB(0x00, 0x00, 0x00);
        lcd.off();
    }
    process.once('SIGINT', done);
    process.once('SIGTERM', done);

    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.setText('Grove LCD RGB\ntest');
    lcd.setRGB(0, 128, 64);

    loop(tids, 255, 10, c => lcd.setRGB(c, 0xff - c, 0)).then(done);
}
